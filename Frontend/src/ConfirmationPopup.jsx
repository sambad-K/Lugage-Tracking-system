import React from 'react';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 2001, 
    textAlign: 'center',
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
  };

  return (
    <div style={popupStyle}>
      <p>{message}</p>
      <button style={confirmButtonStyle} onClick={onConfirm}>
        Confirm
      </button>
      <button style={cancelButtonStyle} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default ConfirmationPopup;
