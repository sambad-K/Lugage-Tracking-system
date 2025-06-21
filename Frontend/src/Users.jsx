import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    ticketNumber: '',
    ltpNumber: '',
    phoneNumber: '',
    email: '',
    airline: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/distributed');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      fullName: user.fullName,
      ticketNumber: user.ticketNumber,
      ltpNumber: user.ltpNumber,
      phoneNumber: user.phoneNumber,
      email: user.email,
      airline: user.airline,
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/distributed/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const updatedUser = await response.json();
      setUsers(users.map(user => user._id === editingUser ? updatedUser : user));
      setEditingUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5001/distributed/${deleteUserId}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user._id !== deleteUserId));
      setShowConfirmDelete(false);
      setDeleteUserId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteUserId(null);
  };

  const closeModal = () => {
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(searchTermLower) ||
      user.ticketNumber.toLowerCase().includes(searchTermLower) ||
      user.ltpNumber.toLowerCase().includes(searchTermLower) ||
      user.phoneNumber.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.airline.toLowerCase().includes(searchTermLower) ||
      new Date(user.date).toLocaleDateString().toLowerCase().includes(searchTermLower)
    );
  });

  const userBoxStyle = {
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
      <h1><b>Passengers</b></h1>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        style={searchBarStyle}
      />
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div key={user._id} style={userBoxStyle}>
            <>
              <div>
                {/* <h3>User</h3> */}
                <p><b>{user.fullName}</b></p>
                <p>Ticket Number: {user.ticketNumber}</p>
                <p>LTP Number: {user.ltpNumber}</p>
                <p>Phone Number: {user.phoneNumber}</p>
                <p>Email: {user.email}</p>
                <p>Airline: {user.airline}</p>
                <p>Date: {new Date(user.date).toLocaleDateString()}</p>
              </div>
              <button style={editButtonStyle} onClick={() => handleEditClick(user)}>Edit</button>
              <button style={deleteButtonStyle} onClick={() => handleDeleteClick(user._id)}>Delete</button>
            </>
          </div>
        ))
      ) : (
        <p>No user records found.</p>
      )}

      {editingUser && (
        <>
          <div style={overlayStyle} onClick={closeModal} />
          <div style={modalStyle}>
            <h3>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleEditChange}
                placeholder="Full Name"
                style={formControlStyle}
              />
              <input
                type="text"
                name="ticketNumber"
                value={formData.ticketNumber}
                onChange={handleEditChange}
                placeholder="Ticket Number"
                style={formControlStyle}
              />
              <input
                type="text"
                name="ltpNumber"
                value={formData.ltpNumber}
                onChange={handleEditChange}
                placeholder="LTP Number"
                style={formControlStyle}
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleEditChange}
                placeholder="Phone Number"
                style={formControlStyle}
              />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  style={formControlStyle}
                />
                <input
                  type="text"
                  name="airline"
                  value={formData.airline}
                  onChange={handleEditChange}
                  placeholder="Airline"
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
              <p>Are you sure you want to delete this user record?</p>
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

export default Users;
