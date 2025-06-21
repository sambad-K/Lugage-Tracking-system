const { connectToDatabase } = require("./database");
const Complaint = require("./complaintSchema");

let currentComplaintStep = null;
let currentComplaint = {};

const handleComplaintQuery = async (message, sessionId) => {
  console.log("Received message:", message);
  console.log("Current complaint step:", currentComplaintStep);

  if (currentComplaintStep === "awaitingEmailAndLtp") {
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    const ltpMatch = message.match(/\b\d{5}\b/);

    const email = emailMatch ? emailMatch[0] : null;
    const ltpNumber = ltpMatch ? ltpMatch[0] : null;

    if (email || ltpNumber) {
      currentComplaint.email = email;
      currentComplaint.ltpNumber = ltpNumber;

      console.log("Email:", email);
      console.log("LTP Number:", ltpNumber);

      if (email && ltpNumber) {
        const db = await connectToDatabase();
        console.log(
          `Querying database with email: ${email} and LTP Number: ${ltpNumber}`
        );
        const user = await db
          .collection("distributeds")
          .findOne({ email, ltpNumber });

        if (user) {
          console.log("User verified:", user);
          currentComplaintStep = "awaitingComplaint";
          return "Your email and LTP are verified. Please enter your complaint.";
        } else {
          console.log("Verification failed: No matching user found.");
          currentComplaintStep = null;
          return "Verification failed. Please enter valid email and LTP.";
        }
      } else {
        console.log("Invalid email or LTP number.");
        return "Please provide both valid email and LTP.";
      }
    } else {
      console.log("Invalid details provided.");
      currentComplaintStep = null;
      return null;
    }
  }

  if (currentComplaintStep === "awaitingComplaint") {
    currentComplaint.complaint = message;
    currentComplaint.status = "not read";
    console.log("Complaint:", message);

    try {
      const newComplaint = new Complaint(currentComplaint);
      await newComplaint.save();

      currentComplaintStep = null;
      currentComplaint = {};
      return "Your complaint has been submitted. We will look after it.";
    } catch (error) {
      console.error("Error submitting complaint:", error);
      return "There was an error submitting your complaint. Please try again later.";
    }
  }

  if (isLodgeComplaintQuery(message)) {
    currentComplaintStep = "awaitingEmailAndLtp";
    return "Please provide your email and LTP number for verification.";
  }

  const complaintMatch = isComplaintQuery(message);
  if (complaintMatch) {
    currentComplaintStep = "awaitingEmailAndLtp";
    return "Sure, what is your email and LTP?";
  }

  return null;
};

const isLodgeComplaintQuery = (message) => {
  const lodgeComplaintPattern =
    /i(?:\s+wanna|\s+want\s+to|)\s+lodge\s+a\s+complain/i;
  return lodgeComplaintPattern.test(message);
};

const isComplaintQuery = (message) => {
  const variations = [
    /grievances[\W\s]*/i,
    /compain[\W\s]*/i,
    /compalins[\W\s]*/i,
    /i want(?:\s+to)?(?:\s+file|\s+register|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i want(?:\s+to)?(?:\s+file|\s+register|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i need(?:\s+to)?(?:\s+file|\s+register|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i have(?:\s+a|\s+|)(?:complain|complains|complaint|complaints|problem|problems|grievance|grievances|concern|concerns|issue|issues)\s+(?:to\s+report|)[\W\s]*/i,
    /i need to(?:\s+report|)\s*(?:an\s+|a\s+|)(?:issue|issues|problem|problems|grievance|grievances|complain|complains|complaint|complaints)[\W\s]*/i,
    /how can i(?:\s+file|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /how do i(?:\s+file|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /can i(?:\s+file|\s+register|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i have(?:\s+a|\s+|)(?:problem|problems)(?:\s+to\s+report|)[\W\s]*/i,
    /i want(?:\s+to)?\s+report(?:\s+a\s+|)(?:problem|problems|issue|issues|grievance|grievances|complain|complains|complaint|complaints)[\W\s]*/i,
    /i need(?:\s+help|)\s+with(?:\s+a\s+|)(?:problem|problems|issue|issues|grievance|grievances|complain|complains|complaint|complaints)[\W\s]*/i,
    /i would like to(?:\s+file|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i have(?:\s+a|\s+|)(?:complain|complains|complaint|complaints|problem|problems|grievance|grievances|issue|issues)\s+to\s+report[\W\s]*/i,
    /i want to(?:\s+file|\s+register|\s+submit|\s+lodge|)\s+(?:a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i need(?:\s+to)?\s+raise(?:\s+a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i need(?:\s+to)?\s+log(?:\s+a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i have(?:\s+a|\s+|)(?:complain|complains|complaint|complaints|problem|problems|grievance|grievances|issue|issues)\s+to file[\W\s]*/i,
    /i need(?:\s+to)?\s+make(?:\s+a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i need(?:\s+to)?\s+submit(?:\s+a\s+|)(?:complain|complains|complaint|complaints|issue|issues|grievance|grievances|problem|problems)[\W\s]*/i,
    /i got(?:\s+a|\s+|)(?:complain|complains|complaint|complaints|problem|problems|grievance|grievances|concern|concerns|issue|issues)[\W\s]*/i,
    /complain[\W\s]*/i,
    /complains[\W\s]*/i,
    /complaint[\W\s]*/i,
    /complaints[\W\s]*/i,
    /issue[\W\s]*/i,
    /issues[\W\s]*/i,
    /problem[\W\s]*/i,
    /problems[\W\s]*/i,
    /i(?:\s+need|\s+want|\sgot)(?:\s+to)?(?:\s+file|\s+register|\s+submit|\s+lodge|log|report|raise|make|submit|)\s*(?:an\s+|a\s+|)(?:complain|complains|complaint|complaints|issue|issues|problem|problems|grievance|grievances|concern|concerns|compain|compains)[\W\s]*/i,
    /can\s*i(?:\s+file|\s+register|\s+submit|\s+lodge|log|report)\s*(?:an\s+|a\s+|)(?:complain|complains|complaint|complaints|issue|issues|problem|problems|grievance|grievances|concern|concerns|compain|compains)[\W\s]*/i,
    /how(?:\s+can|\s+do)\s*i(?:\s+file|\s+register|\s+submit|\s+lodge|log|report)\s*(?:an\s+|a\s+|)(?:complain|complains|complaint|complaints|issue|issues|problem|problems|grievance|grievances|concern|concerns|compain|compains)[\W\s]*/i,
    /i\s*(?:have|got)\s*(?:an?\s+|)(?:problem|problems|issue|issues|grievance|grievances|complain|complains|complaint|complaints|concern|concerns|compain|compains)\s*(?:to\s+(?:report|file)|)/i,
    /complain[\W\s]*/i,
    /complains[\W\s]*/i,
    /complaint[\W\s]*/i,
    /complaints[\W\s]*/i,
    /issue[\W\s]*/i,
    /issues[\W\s]*/i,
    /problem[\W\s]*/i,
    /problems[\W\s]*/i,
    /grievance[\W\s]*/i,
    /grievances[\W\s]*/i,
    /compain[\W\s]*/i,
    /compains[\W\s]*/i,
    /t wanna compains[\W\s]*/i,
    /i am having a problem[\W\s]*/i,
    /i am facing a problem[\W\s]*/i,
    /i have a problem[\W\s]*/i,
    /i want to report a problem[\W\s]*/i,
  ];

  for (const pattern of variations) {
    const match = message.match(pattern);
    if (match) {
      return true;
    }
  }
  return false;
};

module.exports = handleComplaintQuery;
