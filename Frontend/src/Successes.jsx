import React, { useState, useEffect } from 'react';

const Successes = () => {
  const [successes, setSuccesses] = useState([]);
  const [editingSuccess, setEditingSuccess] = useState(null);
  const [formData, setFormData] = useState({
    posterName: '',
    posterEmail: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteSuccessId, setDeleteSuccessId] = useState(null);

  useEffect(() => {
    const fetchSuccesses = async () => {
      try {
        const response = await fetch('http://localhost:5001/successes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuccesses(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSuccesses();
  }, []);

  const handleEditClick = (success) => {
    setEditingSuccess(success._id);
    setFormData({
      posterName: success.posterName,
      posterEmail: success.posterEmail,
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/successes/${editingSuccess}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const updatedSuccess = await response.json();
      setSuccesses(successes.map(success => success._id === editingSuccess ? updatedSuccess : success));
      setEditingSuccess(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteSuccessId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5001/successes/${deleteSuccessId}`, {
        method: 'DELETE',
      });
      setSuccesses(successes.filter(success => success._id !== deleteSuccessId));
      setShowConfirmDelete(false);
      setDeleteSuccessId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteSuccessId(null);
  };

  const closeModal = () => {
    setEditingSuccess(null);
  };

  const filteredSuccesses = successes.filter(success => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      success.passenger.fullName.toLowerCase().includes(searchTermLower) ||
      success.passenger.ticketNumber.toLowerCase().includes(searchTermLower) ||
      success.passenger.ltpNumber.toLowerCase().includes(searchTermLower) ||
      success.passenger.phoneNumber.toLowerCase().includes(searchTermLower) ||
      success.passenger.email.toLowerCase().includes(searchTermLower) ||
      success.passenger.airline.toLowerCase().includes(searchTermLower) ||
      success.posterName.toLowerCase().includes(searchTermLower) ||
      success.posterEmail.toLowerCase().includes(searchTermLower) ||
      new Date(success.date).toLocaleDateString().toLowerCase().includes(searchTermLower)
    );
  });

  const successBoxStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: '100%',
  };

  const buttonStyle = {
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
    color: 'white',
  };

  const noButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50', 
    color: 'white',
  };

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: 'calc(50% + 105px)', 
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
    width: '400px', 
    textAlign: 'center',
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

  const formControlStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box', 
  };

  const modalButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  };

  const searchBarStyle = {
    marginBottom: '20px',
    padding: '10px',
    width: '100%',
    maxWidth: '400px', 
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    transition: 'all 0.3s ease-in-out', 
  };

  const searchBarFocusStyle = {
    borderColor: '#007BFF',
    boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
  };

  const handleSearchFocus = (e) => {
    e.target.style.borderColor = searchBarFocusStyle.borderColor;
    e.target.style.boxShadow = searchBarFocusStyle.boxShadow;
  };

  const handleSearchBlur = (e) => {
    e.target.style.borderColor = searchBarStyle.borderColor;
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Successes</h2>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        style={searchBarStyle}
      />
      {filteredSuccesses.length > 0 ? (
        filteredSuccesses.map((success) => (
          <div key={success._id} style={successBoxStyle}>
            <>
              <div>
                <h3>Passenger</h3>
                <p>Full Name: {success.passenger.fullName}</p>
                <p>Ticket Number: {success.passenger.ticketNumber}</p>
                <p>LTP Number: {success.passenger.ltpNumber}</p>
                <p>Phone Number: {success.passenger.phoneNumber}</p>
                <p>Email: {success.passenger.email}</p>
                <p>Airline: {success.passenger.airline}</p>
              </div>
              <div>
                <h3>Poster</h3>
                <p>Poster Name: {success.posterName}</p>
                <p>Poster Email: {success.posterEmail}</p>
                <p>Date: {new Date(success.date).toLocaleDateString()}</p>
              </div>
              <button style={editButtonStyle} onClick={() => handleEditClick(success)}>Edit</button>
              <button style={deleteButtonStyle} onClick={() => handleDeleteClick(success._id)}>Delete</button>
            </>
          </div>
        ))
      ) : (
        <p>No success records found.</p>
      )}

      {editingSuccess && (
        <>
          <div style={overlayStyle} onClick={closeModal} />
          <div style={modalStyle}>
            <h3>Edit Success</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="posterName"
                value={formData.posterName}
                onChange={handleEditChange}
                placeholder="Poster Name"
                style={formControlStyle}
              />
              <input
                type="email"
                name="posterEmail"
                value={formData.posterEmail}
                onChange={handleEditChange}
                placeholder="Poster Email"
                style={formControlStyle}
              />
              <div style={modalButtonContainerStyle}>
              <button type="submit" style={editButtonStyle}>Save</button>
                <button type="button" onClick={closeModal} style={deleteButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}

      {showConfirmDelete && (
        <>
          <div style={overlayStyle} onClick={cancelDelete} />
          <div style={modalStyle}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this success record?</p>
            <div>
              <button style={deleteButtonStyle} onClick={confirmDelete}>Yes</button>
              <button style={noButtonStyle} onClick={cancelDelete}>No</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Successes;
