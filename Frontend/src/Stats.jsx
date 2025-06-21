import React, { useState, useEffect } from "react";
import Morestats from "./Morestats";
import ConfirmationPopup from "./ConfirmationPopup";

const Stats = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [sendingReply, setSendingReply] = useState(false);
  const [sentComplaintId, setSentComplaintId] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [stats, setStats] = useState({
    distributeds: 0,
    reportLost: 0,
    reportFound: 0,
    complaintsCount: 0,
    successes: 0,
    postClaims: 0,
  });

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [complaintIdToDelete, setComplaintIdToDelete] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:5001/distributeds/count"),
          fetch("http://localhost:5001/reportlost/count"),
          fetch("http://localhost:5001/reportfound/count"),
          fetch("http://localhost:5001/complaints/count"),
          fetch("http://localhost:5001/successes/count"),
          fetch("http://localhost:5001/postclaims/count"),
        ]);

        const [
          distributedsCount,
          reportLostCount,
          reportFoundCount,
          complaintsCount,
          successesCount,
          postClaimsCount,
        ] = await Promise.all(responses.map((response) => response.json()));

        setStats({
          distributeds: distributedsCount.total,
          reportLost: reportLostCount.total,
          reportFound: reportFoundCount.total,
          complaintsCount: complaintsCount.total,
          successes: successesCount.total,
          postClaims: postClaimsCount.total,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5001/complaints");
      const data = await response.json();
      const sortedComplaints = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComplaints(sortedComplaints);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReplies = async (complaintId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/complaints/${complaintId}/replies`
      );
      const data = await response.json();
      setReplies((prevReplies) => ({ ...prevReplies, [complaintId]: data }));
    } catch (err) {
      console.log(err);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5001/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        console.log("Failed to update complaint status");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComplaint = async (complaintId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/complaints/${complaintId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setComplaints((prevComplaints) =>
          prevComplaints.filter((complaint) => complaint._id !== complaintId)
        );
      } else {
        console.log("Failed to delete complaint");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteClick = (e, complaintId) => {
    e.stopPropagation();
    setComplaintIdToDelete(complaintId);
    setShowConfirmationPopup(true);
  };

  const handleConfirmDelete = () => {
    deleteComplaint(complaintIdToDelete);
    setShowConfirmationPopup(false);
    setComplaintIdToDelete(null);
    setShowPopup(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationPopup(false);
    setComplaintIdToDelete(null);
  };

  const handleButtonClick = () => {
    fetchComplaints();
    setShowPopup(true);
  };

  const closeModal = () => {
    setShowPopup(false);
  };

  const handleEmailClick = async (complaintId) => {
    const clickedComplaint = complaints.find(
      (complaint) => complaint._id === complaintId
    );
    if (clickedComplaint && clickedComplaint.status !== "read") {
      await updateComplaintStatus(complaintId, "read");
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, status: "read" }
            : complaint
        )
      );
    }

    setActiveComplaint((prevActiveComplaint) =>
      prevActiveComplaint && prevActiveComplaint._id === complaintId
        ? null
        : clickedComplaint
    );
    if (clickedComplaint && clickedComplaint._id !== activeComplaint?._id) {
      fetchReplies(complaintId);
    }
  };

  const handleReplyChange = (e, complaintId) => {
    setReplyText({ ...replyText, [complaintId]: e.target.value });
  };

  const handleReplySubmit = async (e, complaintId, email) => {
    e.preventDefault();
    const reply = replyText[complaintId];
    const formalReply = `Dear Customer,\n\nWe are sorry for your inconvenience. ${reply}\n\nRegards,\nLTS`;

    setSendingReply(true);
    setSendError(null);
    setSentComplaintId(complaintId);

    try {
      const response = await fetch("http://localhost:5001/complaints/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintId, email, reply: formalReply }),
      });
      if (response.ok) {
        setSendingReply(false);
        setReplyText({ ...replyText, [complaintId]: "" });
        fetchReplies(complaintId);
        setTimeout(() => {
          setSentComplaintId(null);
        }, 500);
      } else {
        const errorResponse = await response.json();
        console.error("Failed to send reply:", errorResponse.message);
        setSentComplaintId(null);
        setSendError("Failed to send reply. Please try again.");
        alert("Failed to send reply");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setSentComplaintId(null);
      setSendError(
        "Failed to send reply. Please check your connection and try again."
      );
    } finally {
      setSendingReply(false);
    }
  };

  const handleKeyPress = (e, complaintId, email) => {
    if (e.key === "Enter") {
      handleReplySubmit(e, complaintId, email);
    }
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
    margin: "0 auto",
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "calc(50% + 100px)",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    zIndex: 1001,
    width: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: showConfirmationPopup ? 2000 : 1000,
  };

  const complaintCardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "left",
    position: "relative",
    transition: "box-shadow 0.3s ease",
  };

  const complaintCardHoverStyle = {
    ...complaintCardStyle,
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const blueDotStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "blue",
  };

  const dateStyle = {
    fontSize: "12px",
    color: "#999",
    whiteSpace: "nowrap",
  };

  const complaintTitleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const complaintDetailStyle = {
    marginBottom: "10px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  };

  const replyDetailStyle = {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#e9ecef",
    textAlign: "left",
    position: "relative",
  };

  const inputStyle = {
    padding: "10px",
    width: "calc(100% - 22px)",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  };

  const replyButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  };

  const sendingButtonStyle = {
    ...replyButtonStyle,
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  };

  const sentButtonStyle = {
    ...replyButtonStyle,
    backgroundColor: "#17a2b8",
    cursor: "default",
  };

  const deleteButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const [hoveredStatId, setHoveredStatId] = useState(null);

  const statsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    position: "relative",
    zIndex: 1,
  };

  const statsBoxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition:
      "transform 0.3s ease, backgroundColor 0.3s ease, box-shadow 0.3s ease",
    width: "200px",
    margin: "10px",
  };

  const statsBoxHoverStyle = {
    ...statsBoxStyle,
    transform: "scale(1.1)",
    backgroundColor: "#f0f0f0",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const statsTitleStyle = {
    fontWeight: "bold",
    fontSize: "18px",
    marginTop: "10px",
  };

  const statsValueStyle = {
    fontSize: "24px",
    color: "#4CAF50",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  };

  const [activeComplaint, setActiveComplaint] = useState(null);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2 style={titleStyle}>Statistics</h2>
      <div style={statsContainerStyle}>
        <div
          style={hoveredStatId === 1 ? statsBoxHoverStyle : statsBoxStyle}
          onMouseEnter={() => setHoveredStatId(1)}
          onMouseLeave={() => setHoveredStatId(null)}
        >
          <div style={statsValueStyle}>{stats.distributeds}</div>
          <div style={statsTitleStyle}>Total Data</div>
        </div>
        <div
          style={hoveredStatId === 2 ? statsBoxHoverStyle : statsBoxStyle}
          onMouseEnter={() => setHoveredStatId(2)}
          onMouseLeave={() => setHoveredStatId(null)}
        >
          <div style={statsValueStyle}>{stats.reportLost}</div>
          <div style={statsTitleStyle}>Pending Reports</div>
        </div>
        <div
          style={hoveredStatId === 3 ? statsBoxHoverStyle : statsBoxStyle}
          onMouseEnter={() => setHoveredStatId(3)}
          onMouseLeave={() => setHoveredStatId(null)}
        >
          <div style={statsValueStyle}>{stats.reportFound}</div>
          <div style={statsTitleStyle}>Active Posts</div>
        </div>
        <div
          style={hoveredStatId === 4 ? statsBoxHoverStyle : statsBoxStyle}
          onMouseEnter={() => setHoveredStatId(4)}
          onMouseLeave={() => setHoveredStatId(null)}
        >
          <div style={statsValueStyle}>{stats.complaintsCount}</div>
          <div style={statsTitleStyle}>Complaints</div>
        </div>
        <div
          style={hoveredStatId === 5 ? statsBoxHoverStyle : statsBoxStyle}
          onMouseEnter={() => setHoveredStatId(5)}
          onMouseLeave={() => setHoveredStatId(null)}
        >
          <div style={statsValueStyle}>{stats.successes}</div>
          <div style={statsTitleStyle}>Successes</div>
        </div>
        <div
          style={hoveredStatId === 6 ? statsBoxHoverStyle : statsBoxStyle}
          onMouseEnter={() => setHoveredStatId(6)}
          onMouseLeave={() => setHoveredStatId(null)}
        >
          <div style={statsValueStyle}>{stats.postClaims}</div>
          <div style={statsTitleStyle}>Post Claims</div>
        </div>
      </div>
      <button
        style={{
          transition: "transform 0.2s ease-in-out",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleButtonClick}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.3)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        View Complaints
      </button>

      {showPopup && (
        <>
          <div style={overlayStyle} onClick={closeModal}></div>
          <div
            style={{ ...modalStyle, left: "calc(50% + 100px)", zIndex: 1001 }}
          >
            <h2>Complaints</h2>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  style={
                    hoveredStatId === complaint._id
                      ? complaintCardHoverStyle
                      : complaintCardStyle
                  }
                  onMouseEnter={() => setHoveredStatId(complaint._id)}
                  onMouseLeave={() => setHoveredStatId(null)}
                  onClick={(e) => {
                    if (
                      e.target.tagName !== "INPUT" &&
                      e.target.tagName !== "BUTTON"
                    ) {
                      handleEmailClick(complaint._id);
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={complaintTitleStyle}>Complaint</p>
                      <p style={complaintDetailStyle}>
                        <strong>Email:</strong> {complaint.email}
                      </p>
                      {complaint.status !== "read" && (
                        <div style={blueDotStyle}></div>
                      )}
                    </div>
                    <div>
                      <p style={dateStyle}>
                        {new Date(complaint.createdAt).getFullYear()}/
                        {String(
                          new Date(complaint.createdAt).getMonth() + 1
                        ).padStart(2, "0")}
                        /
                        {String(
                          new Date(complaint.createdAt).getDate()
                        ).padStart(2, "0")}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {String(
                          new Date(complaint.createdAt).getHours()
                        ).padStart(2, "0")}
                        :
                        {String(
                          new Date(complaint.createdAt).getMinutes()
                        ).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  {activeComplaint && activeComplaint._id === complaint._id && (
                    <>
                      <p style={complaintDetailStyle}>
                        <strong>Complaint:</strong> {complaint.complaint}
                      </p>
                      {replies[complaint._id]
                        ?.slice()
                        .reverse()
                        .map((reply) => (
                          <div key={reply._id} style={replyDetailStyle}>
                            <p>
                              <strong>Reply:</strong>{" "}
                              {reply.reply
                                .replace(
                                  "Dear Customer,\n\nWe are sorry for your inconvenience. ",
                                  ""
                                )
                                .replace("\n\nRegards,\nLTS", "")}
                            </p>
                            <p style={dateStyle}>
                              {new Date(reply.createdAt).getFullYear()}/
                              {String(
                                new Date(reply.createdAt).getMonth() + 1
                              ).padStart(2, "0")}
                              /
                              {String(
                                new Date(reply.createdAt).getDate()
                              ).padStart(2, "0")}
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              {String(
                                new Date(reply.createdAt).getHours()
                              ).padStart(2, "0")}
                              :
                              {String(
                                new Date(reply.createdAt).getMinutes()
                              ).padStart(2, "0")}
                            </p>
                          </div>
                        ))}
                      <form
                        onSubmit={(e) =>
                          handleReplySubmit(e, complaint._id, complaint.email)
                        }
                      >
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText[complaint._id] || ""}
                          onChange={(e) => handleReplyChange(e, complaint._id)}
                          onKeyPress={(e) =>
                            handleKeyPress(e, complaint._id, complaint.email)
                          }
                          style={inputStyle}
                          disabled={
                            sendingReply && sentComplaintId === complaint._id
                          }
                          required
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            type="submit"
                            style={
                              sendingReply && sentComplaintId === complaint._id
                                ? sendingButtonStyle
                                : sentComplaintId === complaint._id
                                ? sentButtonStyle
                                : replyButtonStyle
                            }
                            disabled={
                              sendingReply && sentComplaintId === complaint._id
                            }
                          >
                            {sendingReply && sentComplaintId === complaint._id
                              ? "Sending..."
                              : sentComplaintId === complaint._id
                              ? "Sent"
                              : "Reply"}
                          </button>
                        </div>
                      </form>
                      {sendError && <p style={{ color: "red" }}>{sendError}</p>}
                      <button
                        style={deleteButtonStyle}
                        onClick={(e) => handleDeleteClick(e, complaint._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No complaints found.</p>
            )}
            <button
              onClick={closeModal}
              style={buttonStyle}
              disabled={sendingReply}
            >
              Close
            </button>
          </div>
        </>
      )}

      {showConfirmationPopup && (
        <div style={overlayStyle}>
          <ConfirmationPopup
            message="Are you sure you want to delete this complaint?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      )}

      <Morestats />
    </div>
  );
};

export default Stats;
