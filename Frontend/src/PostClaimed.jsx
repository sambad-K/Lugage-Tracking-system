import React, { useState, useEffect } from 'react';

const PostClaimed = () => {
  const [claims, setClaims] = useState([]);
  const [editingClaim, setEditingClaim] = useState(null);
  const [formData, setFormData] = useState({
    claimantName: '',
    claimantEmail: '',
    claimantPhone: '',
    posterName: '',
    posterEmail: '',
    posterPhone: '',
    ticketNumber: '',
    ltpNumber: '',
    airport: '',
    uploadedAt: '',
    moreDetails: '',
    image: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:5001/postclaims');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClaims(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClaims();
  }, []);

  const handleEditClick = (claim) => {
    setEditingClaim(claim._id);
    setFormData({
      claimantName: claim.claimantName,
      claimantEmail: claim.claimantEmail,
      claimantPhone: claim.claimantPhone,
      posterName: claim.posterName,
      posterEmail: claim.posterEmail,
      posterPhone: claim.posterPhone,
      ticketNumber: claim.ticketNumber,
      ltpNumber: claim.ltpNumber,
      airport: claim.airport,
      uploadedAt: claim.uploadedAt,
      moreDetails: claim.moreDetails,
      image: claim.image,
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/postclaims/${editingClaim}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const updatedClaim = await response.json();
      setClaims(claims.map(claim => claim._id === editingClaim ? updatedClaim : claim));
      setEditingClaim(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/postclaims/${id}`, {
        method: 'DELETE',
      });
      setClaims(claims.filter(claim => claim._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setEditingClaim(null);
  };

  const filteredClaims = claims.filter(claim => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      claim.claimantName.toLowerCase().includes(searchTermLower) ||
      claim.claimantEmail.toLowerCase().includes(searchTermLower) ||
      claim.claimantPhone.toLowerCase().includes(searchTermLower) ||
      claim.posterName.toLowerCase().includes(searchTermLower) ||
      claim.posterEmail.toLowerCase().includes(searchTermLower) ||
      claim.posterPhone.toLowerCase().includes(searchTermLower) ||
      claim.ticketNumber.toLowerCase().includes(searchTermLower) ||
      claim.ltpNumber.toLowerCase().includes(searchTermLower) ||
      claim.airport.toLowerCase().includes(searchTermLower) ||
      new Date(claim.uploadedAt).toLocaleDateString().toLowerCase().includes(searchTermLower) ||
      claim.moreDetails.toLowerCase().includes(searchTermLower)
    );
  });

  const claimBoxStyle = {
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
      <h2>Post Claimed</h2>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        style={searchBarStyle}
      />
      {filteredClaims.length > 0 ? (
        filteredClaims.map((claim) => (
          <div key={claim._id} style={claimBoxStyle}>
            <>
              <div>
                <h3>Claim</h3>
                <p>Claimant Name: {claim.claimantName}</p>
                <p>Claimant Email: {claim.claimantEmail}</p>
                <p>Claimant Phone: {claim.claimantPhone}</p>
                <p>Poster Name: {claim.posterName}</p>
                <p>Poster Email: {claim.posterEmail}</p>
                <p>Poster Phone: {claim.posterPhone}</p>
                <p>Ticket Number: {claim.ticketNumber}</p>
                <p>LTP Number: {claim.ltpNumber}</p>
                <p>Airport: {claim.airport}</p>
                <p>Uploaded At: {new Date(claim.uploadedAt).toLocaleDateString()}</p>
                <p>More Details: {claim.moreDetails}</p>
               
              </div>
              <button style={editButtonStyle} onClick={() => handleEditClick(claim)}>Edit</button>
              <button style={deleteButtonStyle} onClick={() => handleDelete(claim._id)}>Delete</button>
            </>
          </div>
        ))
      ) : (
        <p>No post claim records found.</p>
      )}

      {editingClaim && (
        <>
          <div style={overlayStyle} onClick={closeModal} />
          <div style={modalStyle}>
            <h3>Edit Claim</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="claimantName"
                value={formData.claimantName}
                onChange={handleEditChange}
                placeholder="Claimant Name"
                style={formControlStyle}
              />
                            <input
                type="email"
                name="claimantEmail"
                value={formData.claimantEmail}
                onChange={handleEditChange}
                placeholder="Claimant Email"
                style={formControlStyle}
              />
              <input
                type="text"
                name="claimantPhone"
                value={formData.claimantPhone}
                onChange={handleEditChange}
                placeholder="Claimant Phone"
                style={formControlStyle}
              />
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
              <input
                type="text"
                name="posterPhone"
                value={formData.posterPhone}
                onChange={handleEditChange}
                placeholder="Poster Phone"
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
                name="airport"
                value={formData.airport}
                onChange={handleEditChange}
                placeholder="Airport"
                style={formControlStyle}
              />
              <input
                type="date"
                name="uploadedAt"
                value={formData.uploadedAt}
                onChange={handleEditChange}
                placeholder="Uploaded At"
                style={formControlStyle}
              />
              <textarea
                name="moreDetails"
                value={formData.moreDetails}
                onChange={handleEditChange}
                placeholder="More Details"
                style={formControlStyle}
              />
              {/* <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleEditChange}
                placeholder="Image URL"
                style={formControlStyle}
              /> */}
              <div style={modalButtonContainerStyle}>
                <button type="submit" style={editButtonStyle}>Save</button>
                <button type="button" onClick={closeModal} style={deleteButtonStyle}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default PostClaimed;
