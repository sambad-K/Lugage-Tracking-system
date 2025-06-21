import React, { useState, useEffect } from 'react';
import Img from './laug.webp'; 
import './Trace.css'; 

const Trace = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [posters, setPosters] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimError, setClaimError] = useState(null);
  const [otpMessage, setOtpMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [claimData, setClaimData] = useState({});

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch('http://localhost:5001/trace');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posters:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  const handleClaimClick = (poster) => {
    setSelectedPoster(poster);
    setShowPopup(true);
    setClaimError(null); 
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPoster(null);
    setClaimError(null);
    setShowOtpPopup(false);
    setOtpMessage('');
    setOtp(new Array(6).fill(''));
  };

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value) || value === '') {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const claimData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5001/trace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...claimData,
          postId: selectedPoster._id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setClaimData(claimData);
        setShowOtpPopup(true);
        setShowPopup(false);
        setOtpMessage(result.message);
      } else {
        setClaimError(result.message);
      }
    } catch (error) {
      console.error('Error processing claim:', error);
      setClaimError('Error processing claim');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    try {
      const response = await fetch('http://localhost:5001/trace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...claimData,
          postId: selectedPoster._id,
          otp: otpValue,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setShowSuccessMessage(true);
        setOtpMessage('Claim submitted successfully. Please check your email.');
        setPosters(posters.filter(poster => poster._id !== selectedPoster._id));
        setShowOtpPopup(false);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000); 
      } else {
        setOtpMessage(result.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpMessage('Error verifying OTP');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosters = posters.filter(poster => {
    return (
      poster.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poster.moreDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poster.airport?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data. Please try again later.</p>;

  return (
    <>
      <div className='search'>
        <input 
          type="search" 
          placeholder='Search' 
          className='srh' 
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="trace">
        {filteredPosters.length === 0 ? (
          <p>No match found</p>
        ) : (
          filteredPosters.map((poster) => (
            <div key={poster._id} className="card">
              <div className="photos">
                <img src={`http://localhost:5001/${poster.image}`} alt="lost" className="poster-image" onError={(e) => { e.target.src = Img; }} />
              </div>
              <div className="details">
                <h3>{poster.fullName}</h3>
                <p className='act'>{poster.moreDetails}</p>
                <br></br>
                <p><strong>Airport:</strong> {poster.airport}</p>
                <p><strong>Uploaded At:</strong> {new Date(poster.uploadedAt).toLocaleString()}</p>
              </div>
              <div className="claim-button-container">
                <button className="claim-button" onClick={() => handleClaimClick(poster)}>
                  Claim
                </button>
              </div>
            </div>
          ))
        )}

        {showPopup && selectedPoster && (
          <>
            <div className="overlay" onClick={handleClosePopup}></div>
            <div className="popup animated-popup">
              <h2>Claim Details</h2>
              <form className="form" onSubmit={handleSubmitClaim}>
                <input type="text" name="claimantName" placeholder="Your Name" className="input" required />
                <input type="email" name="claimantEmail" placeholder="Your Email" className="input" required />
                <input type="tel" name="claimantPhone" placeholder="Your Phone" className="input" required />
                <input type="text" name="ticketNumber" placeholder="Ticket Number" className="input" required />
                <input type="text" name="ltpNumber" placeholder="LTP No" className="input" required />
                {claimError && <p className="error-message">{claimError}</p>}
                <div className="button-container">
                  <button type="submit" className="submit-button">Submit</button>
                  <button type="button" className="cancel-button" onClick={handleClosePopup}>Cancel</button>
                </div>
              </form>
            </div>
          </>
        )}

        {showOtpPopup && (
          <>
            <div className="overlay" onClick={handleClosePopup}></div>
            <div className="popup animated-popup">
              <h2>Enter OTP</h2>
              <p className="otp-message">{otpMessage}</p>
              <form className="form" onSubmit={handleVerifyOTP}>
                <div className="otp-input-container">
                  {otp.map((data, index) => {
                    return (
                      <input
                        key={index}
                        type="text"
                        name="otp"
                        maxLength="1"
                        id={`otp-input-${index}`}
                        className="otp-input"
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                      />
                    );
                  })}
                </div>
                {claimError && <p className="error-message">{claimError}</p>}
                <div className="button-container">
                  <button type="submit" className="submit-button">Verify OTP & Submit</button>
                  <button type="button" className="cancel-button" onClick={handleClosePopup}>Cancel</button>
                </div>
              </form>
            </div>
          </>
        )}

        {showSuccessMessage && (
          <div className="success-message">
            Claim submitted successfully. Please check your email.
          </div>
        )}
      </div>
    </>
  );
};

export default Trace;
