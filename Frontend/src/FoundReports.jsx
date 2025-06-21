import React, { useState, useEffect } from 'react';

const FoundReports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5001/found-reports');
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReports();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteReportId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5001/found-reports/${deleteReportId}`, {
        method: 'DELETE',
      });
      setReports(reports.filter(report => report._id !== deleteReportId));
      setShowConfirmDelete(false);
      setDeleteReportId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteReportId(null);
  };

  const filteredReports = reports.filter(report => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      report.fullName.toLowerCase().includes(searchTermLower) ||
      report.ticketNumber.toLowerCase().includes(searchTermLower) ||
      report.ltpNumber.toLowerCase().includes(searchTermLower) ||
      report.email.toLowerCase().includes(searchTermLower) ||
      report.phoneNumber.toLowerCase().includes(searchTermLower) ||
      report.airline.toLowerCase().includes(searchTermLower) ||
      new Date(report.date).toLocaleDateString().toLowerCase().includes(searchTermLower)
    );
  });

  const reportBoxStyle = {
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
    left: '50%',
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
      <h2>Pending Reports</h2>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        style={searchBarStyle}
      />
      {filteredReports.map((report) => (
        <div key={report._id} style={reportBoxStyle}>
          <h3>{report.fullName}</h3>
          <p>Ticket Number: {report.ticketNumber}</p>
          <p>LTP Number: {report.ltpNumber}</p>
          <p>Email: {report.email}</p>
          <p>Phone Number: {report.phoneNumber}</p>
          <p>Airline: {report.airline}</p>
          <p>Date: {new Date(report.date).toLocaleDateString()}</p>
          <button style={deleteButtonStyle} onClick={() => handleDeleteClick(report._id)}>Delete</button>
        </div>
      ))}

      {showConfirmDelete && (
        <>
          <div style={overlayStyle} onClick={cancelDelete} />
          <div style={modalStyle}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this report?</p>
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

export default FoundReports;
