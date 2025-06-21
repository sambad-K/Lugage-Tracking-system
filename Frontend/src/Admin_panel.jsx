import React, { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import FoundReports from "./FoundReports";
import Posts from "./Posts";
import Successes from "./Successes";
import Users from "./Users";
import PostClaimed from "./PostClaimed";

const SidebarItem = ({ text, to, active }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <li
      style={{
        padding: "20px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        borderRadius: "20px",
        listStyleType: "none",
        marginBottom: "10px",
        backgroundColor: active ? "rgba(170, 216, 255, 0.2)" : "transparent",
      }}
      onClick={handleClick}
    >
      <Link to={to} style={{ color: "inherit", textDecoration: "none" }}>
        {text}
      </Link>
    </li>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (location.pathname === "/Admin_panel") {
      navigate("/Admin_panel/stats");
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("email");
    navigate("/Login");
  };

  const panelStyle = {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f6",
    overflow: "hidden",
  };

  const sidebarStyle = {
    width: "210px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "20px",
    textAlign: "left",
    height: "100vh",
    overflowY: "auto",
    position: "fixed",
  };

  const contentStyle = {
    flexGrow: 1,
    padding: "20px",
    marginLeft: "230px",
    height: "100vh",
    overflow: "auto",
  };

  const profileContainerStyle = {
    padding: "10px 0",
    color: "white",
    textAlign: "center",
    wordWrap: "break-word",
    marginBottom: "20px",
  };

  const emailStyle = {
    fontSize: "14px",
    color: "white",
  };

  const buttonStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#007bff",
    backgroundColor: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.3s ease",
    marginTop: "10px",
  };

  return (
    <div style={panelStyle}>
      <div className="sidebar" style={sidebarStyle}>
        <div style={profileContainerStyle}>
          <p style={emailStyle}>{email}</p>
          <button style={buttonStyle} onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <ul>
          <SidebarItem
            text="Pending Reports"
            to="/Admin_panel/found-reports"
            active={location.pathname === "/Admin_panel/found-reports"}
          />
          <SidebarItem
            text="Posts"
            to="/Admin_panel/posts"
            active={location.pathname === "/Admin_panel/posts"}
          />
          <SidebarItem
            text="Success"
            to="/Admin_panel/successes"
            active={location.pathname === "/Admin_panel/successes"}
          />
          <SidebarItem
            text="Users"
            to="/Admin_panel/users"
            active={location.pathname === "/Admin_panel/users"}
          />
          <SidebarItem
            text="Post Claimed"
            to="/Admin_panel/post-claimed"
            active={location.pathname === "/Admin_panel/post-claimed"}
          />
          <SidebarItem
            text="Stats"
            to="/Admin_panel/stats"
            active={location.pathname === "/Admin_panel/stats"}
          />
        </ul>
      </div>
      <div className="content" style={contentStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
