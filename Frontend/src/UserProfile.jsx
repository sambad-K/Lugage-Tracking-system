import React, { useState, useEffect, useRef } from "react";

const UserProfile = ({ email, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", closeDropdown);
    } else {
      document.removeEventListener("click", closeDropdown);
    }

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [isOpen]);

  const avatarStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    display: isOpen ? "none" : "flex",
  };

  const dropdownStyle = {
    display: isOpen ? "block" : "none",
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "220px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "center",
    zIndex: "1000",
    height: "140px",
  };

  const emailStyle = {
    margin: "10px 0",
    fontSize: "14px",
    color: "#333",
  };

  const buttonStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
    transform: "scale(1.05)",
  };

  const miniAvatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0 auto",
  };

  return (
    <div>
      <div style={avatarStyle} onClick={toggleDropdown}>
        {email.charAt(0).toUpperCase()}
      </div>
      <div style={dropdownStyle} ref={dropdownRef}>
        <div style={miniAvatarStyle} onClick={toggleDropdown}>
          {email.charAt(0).toUpperCase()}
        </div>
        <p style={emailStyle}>{email}</p>
        <button
          style={buttonStyle}
          onMouseEnter={(e) =>
            Object.assign(e.target.style, buttonStyle, buttonHoverStyle)
          }
          onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
