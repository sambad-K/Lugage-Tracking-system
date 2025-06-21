const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const detectIntent = require("./dialogflow");
const handleComplaintQuery = require("./complaintHandler");
const handlePostQuery = require("./postAsk");
const {
  extractTicketNumber,
  extractLtpNumber,
  extractFullName,
  isLostLuggageQuery,
  isCheckLuggagePostedQuery,
  checkLuggagePosted,
  checkPostByFullName,
  checkLostReport,
  isGeneralQuery,
  extractNameFromPostQuery,
  extractFullNameForPostQuery,
  isPostQueryByFullName,
  isPostQueryVariations,
  isLostReportQueryVariations,
} = require("./trainingConversations");

const os = require("os"); // Operating system-related utility methods
const process = require("process"); // Provides information about the current process

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    genid: (req) => req.headers["x-session-id"] || uuidv4(),
    store: new MemoryStore({ checkPeriod: 86400000 }), // MemoryStore for session storage
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false,
      httpOnly: false,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = uuidv4();
  }
  req.session.touch();
  next();
});

// Performance metrics
let requestCount = 0;
let errorCount = 0;

app.post("/webhook", async (req, res) => {
  const start = Date.now(); // Start benchmark logging
  requestCount++; // Increment request count

  const message = req.body.message.toLowerCase();
  const sessionId = req.sessionID;

  try {
    const complaintResponse = await handleComplaintQuery(message, sessionId);
    if (complaintResponse !== null) {
      const duration = Date.now() - start; // Calculate response time
      console.log(`Complaint query handled in ${duration}ms`); // Log response time
      res.json({ reply: complaintResponse });
      return;
    }

    const postResponse = await handlePostQuery(message, sessionId);
    if (postResponse !== null) {
      const duration = Date.now() - start; // Calculate response time
      console.log(`Post query handled in ${duration}ms`); // Log response time
      res.json({ reply: postResponse });
      return;
    }

    const ltpNumber = extractLtpNumber(message);
    if (ltpNumber) req.session.ltpNumber = ltpNumber;

    const fullName = extractFullName(message);
    const lostReportQuery = isLostReportQueryVariations(message);

    console.log("Session ID:", sessionId);
    console.log("Extracted LTP number:", ltpNumber);
    console.log("Extracted full name:", fullName);
    console.log("Extracted lost report query:", lostReportQuery);
    console.log("Session LTP number:", req.session.ltpNumber);

    if (lostReportQuery) {
      const { fullName, ltpNumber } = lostReportQuery;
      console.log(
        `Lost report query identified. Full name: ${fullName}, LTP number: ${ltpNumber}`
      );
      if (fullName && ltpNumber) {
        try {
          const reportResponse = await checkLostReport(fullName, ltpNumber);
          const duration = Date.now() - start; // Calculate response time
          console.log(`Lost report query handled in ${duration}ms`); // Log response time
          res.json({ reply: reportResponse });
          return;
        } catch (error) {
          console.error("Error querying reportlost collection:", error);
          errorCount++; // Increment error count
          res.json({
            reply: "Error querying the database. Please try again later.",
          });
          return;
        }
      } else {
        res.json({
          reply: "Cannot proceed, retry by entering name and LTP number.",
        });
        return;
      }
    }

    const result = await detectIntent(message, sessionId);

    console.log("Dialogflow response:", result);

    const response = handleResponse(result, message);
    const duration = Date.now() - start; // Calculate response time
    console.log(`General query handled in ${duration}ms`); // Log response time
    res.json({ reply: response });

    // Log CPU and memory usage
    console.log(`CPU Usage: ${process.cpuUsage().system / 1024}ms`);
    console.log(`Memory Usage: ${process.memoryUsage().rss / 1024 / 1024}MB`);
  } catch (error) {
    errorCount++; // Increment error count
    console.error("Error handling request:", error);
    res.status(500).json({ reply: "An error occurred. Please try again later." });
  }
});

// Start server and log performance metrics every minute
app.listen(port, () => {
  console.log(`Chatbot server running at http://localhost:${port}`);
  setInterval(() => {
    console.log(`Request Count: ${requestCount}`);
    console.log(`Error Count: ${errorCount}`);
    console.log(`CPU Load: ${os.loadavg()[0]}`);
    console.log(`Free Memory: ${os.freemem() / 1024 / 1024}MB`);
    console.log(`Total Memory: ${os.totalmem() / 1024 / 1024}MB`);
  }, 60000); // Log metrics every minute
});

// Function to handle response based on Dialogflow result
function handleResponse(result, message) {
  if (
    result.fulfillmentText === "No, there is no post found under your name."
  ) {
    if (
      message.toLowerCase().includes("report") ||
      message.toLowerCase().includes("lost")
    ) {
      return "You can only check report status with your name and LTP number. Please enter that and retry.";
    } else {
      return result.fulfillmentText;
    }
  } else {
    return (
      result.fulfillmentText ||
      "I couldn't find an answer to your question. Can you please be more precise?"
    );
  }
}
