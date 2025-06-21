import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/Admin_panel');
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(''); 

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        setShowOtpPopup(true); 
        startCountdown(); 
      } else {
        const result = await response.json();
        setErrorMessage(result.message); 
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Error during login'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;

  
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setOtp(newOtp);
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    const otpValue = otp.join('');

    setErrorMessage(''); 

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, otp: otpValue }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token); 
        localStorage.setItem('email', email); 
        navigate('/Admin_panel'); 
      } else {
        const result = await response.json();
        setErrorMessage(result.message); 
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setErrorMessage('Error during OTP verification'); 
    }
  };

  const startCountdown = () => {
    setCountdown(30); 
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownInterval);
          setShowOtpPopup(false);
          setErrorMessage('OTP expired. Please try logging in again.');
          return 0;
        }
      });
    }, 1000);
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    backgroundColor: '#f0f0f0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minWidth: '850px',
  };

  const formStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease',
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#007bff',
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.5)',
    transform: 'scale(1.02)',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px 15px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.3s ease',
    marginTop: '20px', 
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  };

  const errorStyle = {
    color: '#ff4d4f',
    fontSize: '14px',
    marginTop: '10px',
  };

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 1000,
    width: '400px', 
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const spinnerStyle = {
    border: '16px solid #f3f3f3',
    borderRadius: '50%',
    borderTop: '16px solid #007bff',
    width: '120px',
    height: '120px',
    animation: 'spin 2s linear infinite',
  };

  const otpInputStyle = {
    width: '50px',
    height: '50px',
    fontSize: '24px',
    textAlign: 'center',
    margin: '0 5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <style>{keyframes}</style>
        <div style={spinnerStyle}></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Log In As Admin</h3>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputStyle, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputStyle, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonStyle, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Log In
          </button>
          {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
        </form>

        {showOtpPopup && (
          <>
            <div style={overlayStyle}></div>
            <div style={popupStyle}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Enter OTP</h3>
              <form onSubmit={handleOtpSubmit}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      style={otpInputStyle}
                    />
                  ))}
                </div>
                <p style={{ marginBottom: '20px', color: '#333' }}>Expires at: {countdown} seconds</p>
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, buttonStyle, buttonHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                >
                  Verify OTP
                </button>
                {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  return <Navigate to="/Admin_panel" />;
};

export default Login;
