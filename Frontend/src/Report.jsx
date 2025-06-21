import React, { useState } from "react";

const Report = () => {
  const [foundFormData, setFoundFormData] = useState({
    fullName: "",
    ticketNumber: "",
    phoneNumber: "",
    email: "",
    airport: "",
    image: null,
    moreDetails: "",
  });

  const [lostFormData, setLostFormData] = useState({
    fullName: "",
    ltpNumber: "",
    phoneNumber: "",
    email: "",
    airline: "",
  });

  const [showFoundReport, setShowFoundReport] = useState(true); 
  const [popupMessage, setPopupMessage] = useState({
    message: null,
    isError: false,
  }); 

  const showPopup = (message, isError = false) => {
    setPopupMessage({ message, isError });
    setTimeout(() => {
      setPopupMessage({ message: null, isError: false });
    }, 2000);
  };

  const handleChange = (e, form, setForm) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      const maxSize = 100 * 1024;

      if (file.size > maxSize) {
        showPopup(
          "File size exceeds 100KB. Please upload a smaller file.",
          true
        );
        return;
      }

      setForm((prevData) => ({ ...prevData, image: file }));
    } else {
      setForm((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateForm = (formData, action) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const ticketPattern = /^[A-Z]{3}\d{5}$/;
    const ltpPattern = /^\d{5}$/;

    if (action === "found") {
      const {
        fullName,
        ticketNumber,
        phoneNumber,
        email,
        airport,
        image,
        moreDetails,
      } = formData;
      if (
        !fullName ||
        !ticketNumber ||
        !phoneNumber ||
        !email ||
        !airport ||
        !image ||
        !moreDetails
      ) {
        showPopup("Every Field Should Be Filled.", true);
        return false;
      }
      if (!ticketPattern.test(ticketNumber)) {
        showPopup("Ticket Number should be in format. ", true);
        return false;
      }
      if (!emailPattern.test(email)) {
        showPopup("Email should be in proper format.", true);
        return false;
      }
      if (!phonePattern.test(phoneNumber)) {
        showPopup("Phone should be a 10 digit number .", true);
        return false;
      }
    } else {
      const { fullName, ltpNumber, phoneNumber, email, airline } = formData;
      if (!fullName || !ltpNumber || !phoneNumber || !email || !airline) {
        showPopup("Every Field Should Be Filled.", true);
        return false;
      }
      if (!ltpPattern.test(ltpNumber)) {
        showPopup("LTP Number should be 5 digit numbers.", true);
        return false;
      }
      if (!emailPattern.test(email)) {
        showPopup("Email should be in proper format.", true);
        return false;
      }
      if (!phonePattern.test(phoneNumber)) {
        showPopup("Phone should be a 10 digit number.", true);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e, formData, action) => {
    e.preventDefault();

    if (!validateForm(formData, action)) {
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });
    form.append("action", action);

    try {
      const response = await fetch("http://localhost:5001/report", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        const result = await response.json();
        showPopup(result.message);

        if (action === "found") {
          setFoundFormData({
            fullName: "",
            ticketNumber: "",
            phoneNumber: "",
            email: "",
            airport: "",
            image: null,
            moreDetails: "",
          });
        } else {
          setLostFormData({
            fullName: "",
            ltpNumber: "",
            phoneNumber: "",
            email: "",
            airline: "",
          });
        }
      } else {
        const error = await response.json();
        showPopup(error.message, true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showPopup("Failed to submit the form. Please try again later.", true);
    }
  };

  const fontStyle = {
    fontFamily: "'Raleway', sans-serif",
  };

  const reportStyle = {
    ...fontStyle,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    minWidth: "850px",
  };

  const sectionContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    margin: "0",
    gap: "20px",
  };

  const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    gap: "15px",
    backgroundColor: "white",
    borderRadius: "10px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 1s ease-in-out",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "95%",
    marginBottom: "10px",
    transition: "border 0.3s",
    fontSize: "14px",
  };

  const buttonStyle = {
    borderRadius: "25px",
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    fontWeight: "bold",
    width: "100%",
    fontSize: "16px",
    padding: "12px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.3s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
    transform: "scale(1.05)",
  };

  const activeNavbarButtonStyle = {
    backgroundColor: "#28a745",
    color: "white",
  };

  const inactiveNavbarButtonStyle = {
    backgroundColor: "white",
    color: "black",
  };

  const navbarContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "0 auto 15px auto",
    width: "",
    maxWidth: "600px",
    height: "40px",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const navbarButtonStyle = {
    padding: "8px 16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.3s, color 0.3s",
  };

  return (
    <div style={reportStyle}>
      {/* Navbar */}
      <div style={navbarContainerStyle}>
        <button
          type="button"
          onClick={() => setShowFoundReport(true)}
          style={{
            ...navbarButtonStyle,
            ...(showFoundReport
              ? activeNavbarButtonStyle
              : inactiveNavbarButtonStyle),
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#28a745";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            if (showFoundReport) {
              e.target.style.backgroundColor = "#28a745";
              e.target.style.color = "white";
            } else {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "black";
            }
          }}
        >
          Post Luggage
        </button>
        <button
          type="button"
          onClick={() => setShowFoundReport(false)}
          style={{
            ...navbarButtonStyle,
            ...(!showFoundReport
              ? activeNavbarButtonStyle
              : inactiveNavbarButtonStyle),
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#28a745";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            if (!showFoundReport) {
              e.target.style.backgroundColor = "#28a745";
              e.target.style.color = "white";
            } else {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "black";
            }
          }}
        >
          Report Lost
        </button>
      </div>

      {showFoundReport && (
        <div style={sectionContainerStyle}>
          <div style={sectionStyle}>
            <h1>Post Luggage</h1>
            <form
              onSubmit={(e) => handleSubmit(e, foundFormData, "found")}
              style={formStyle}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={foundFormData.fullName}
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
              />
              <input
                type="text"
                name="ticketNumber"
                placeholder="Ticket Number"
                required
                value={foundFormData.ticketNumber}
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                value={foundFormData.phoneNumber}
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
              />
              <select
                name="airport"
                required
                value={foundFormData.airport}
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Airport
                </option>
                <option value="TIA">TIA</option>
                <option value="Biratnagar Airport">Biratnagar Airport</option>
                <option value="Chitwan Airport">Chitwan Airport</option>
                <option value="Pokhara Airport">Pokhara Airport</option>
                <option value="Lukla Airport">Lukla Airport</option>
              </select>
              <input
                type="file"
                name="image"
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={foundFormData.email}
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
              />
              <input
                type="text"
                name="moreDetails"
                placeholder="More Details (eg: color, zip, logo or some specific feature. Be more precise)"
                value={foundFormData.moreDetails}
                onChange={(e) =>
                  handleChange(e, foundFormData, setFoundFormData)
                }
                style={inputStyle}
              />
              <button
                type="submit"
                style={{ ...buttonStyle, ...buttonHoverStyle }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0056b3")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {!showFoundReport && (
        <div style={sectionContainerStyle}>
          <div style={sectionStyle}>
            <h1>Report Lost</h1>
            <form
              onSubmit={(e) => handleSubmit(e, lostFormData, "lost")}
              style={formStyle}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={lostFormData.fullName}
                onChange={(e) => handleChange(e, lostFormData, setLostFormData)}
                style={inputStyle}
              />
              <input
                type="text"
                name="ltpNumber"
                placeholder="LTP Number"
                required
                value={lostFormData.ltpNumber}
                onChange={(e) => handleChange(e, lostFormData, setLostFormData)}
                style={inputStyle}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                value={lostFormData.phoneNumber}
                onChange={(e) => handleChange(e, lostFormData, setLostFormData)}
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={lostFormData.email}
                onChange={(e) => handleChange(e, lostFormData, setLostFormData)}
                style={inputStyle}
              />
              <select
                name="airline"
                required
                value={lostFormData.airline}
                onChange={(e) => handleChange(e, lostFormData, setLostFormData)}
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Airline
                </option>
                <option value="Buddha">Buddha</option>
                <option value="Yeti">Yeti</option>
                <option value="Shaurya">Shaurya</option>
                <option value="Quatar">Quatar</option>
                <option value="Shree">Shree</option>
              </select>
              <button
                type="submit"
                style={{ ...buttonStyle, ...buttonHoverStyle }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0056b3")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {popupMessage.message && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: popupMessage.isError ? "#f8d7da" : "#28a745",
            color: popupMessage.isError ? "#721c24" : "white",
            padding: "15px 25px",
            borderRadius: "30px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: "1000",
          }}
        >
          {popupMessage.message}
        </div>
      )}
    </div>
  );
};

export default Report;
