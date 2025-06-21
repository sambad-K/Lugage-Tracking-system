import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Trace from "./Trace";
import Report from "./Report";
import About from "./About";
import AdminPanel from "./Admin_panel";
import PrivateRoute from "./PrivateRoute";
import Bot from "./Bot";
import RoboticIcon from "./RoboticIcon";
import FoundReports from "./FoundReports";
import Posts from "./Posts";
import Success from "./Successes";
import Users from "./Users";
import PostClaimed from "./PostClaimed";
import Stats from "./Stats";

const App = () => {
  const [showBot, setShowBot] = useState(() => {
    const savedShowBot = sessionStorage.getItem("showBot");
    return savedShowBot ? JSON.parse(savedShowBot) : false;
  });
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey, I am your assistant to help you. Ask any query!",
    },
  ]);

  const openBot = () => {
    setShowBot(true);
    sessionStorage.setItem("showBot", JSON.stringify(true));
  };
  const closeBot = () => {
    setShowBot(false);
    sessionStorage.setItem("showBot", JSON.stringify(false));
  };

  return (
    <Router>
      <Navbar />
      <FadeInRoute>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Trace" element={<Trace />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/About" element={<About />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Admin_panel/*" element={<PrivateRoute />}>
            <Route path="" element={<AdminPanel />}>
              <Route path="found-reports" element={<FoundReports />} />
              <Route path="posts" element={<Posts />} />
              <Route path="successes" element={<Success />} />
              <Route path="users" element={<Users />} />
              <Route path="post-claimed" element={<PostClaimed />} />
              <Route path="stats" element={<Stats />} />
            </Route>
          </Route>
        </Routes>
      </FadeInRoute>
      <div
        className="bot-icon"
        onClick={openBot}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          animation: "move 1s infinite alternate",
        }}
      >
        <RoboticIcon />
      </div>
      {showBot && (
        <Bot messages={messages} setMessages={setMessages} onClose={closeBot} />
      )}
    </Router>
  );
};

const FadeInRoute = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const handleFadeIn = () => {
      const pageElement = document.getElementById("page");
      if (pageElement) {
        if (!location.pathname.startsWith("/Admin_panel")) {
          pageElement.classList.add("fade-in");
          const timer = setTimeout(() => {
            pageElement.classList.remove("fade-in");
          }, 1000);

          return () => clearTimeout(timer);
        }
      }
    };

    handleFadeIn();
  }, [location]);

  return <div id="page">{children}</div>;
};

export default App;

const styles = `
@keyframes move {
  0% { transform: translateY(0); }
  100% { transform: translateY(-15px); }
}

.bot-icon {
  animation: move 0.3s infinite alternate;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
