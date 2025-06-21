import React, { useState, useEffect } from 'react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    ticketNumber: '',
    phoneNumber: '',
    airport: '',
    moreDetails: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5001/posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  const handleEditClick = (post) => {
    setEditingPost(post.poster._id);
    setFormData({
      fullName: post.poster.fullName,
      email: post.poster.email,
      ticketNumber: post.poster.ticketNumber,
      phoneNumber: post.poster.phoneNumber,
      airport: post.poster.airport,
      moreDetails: post.poster.moreDetails,
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/posts/${editingPost}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const updatedPost = await response.json();
      setPosts(posts.map(post => post.poster._id === editingPost ? { ...post, poster: updatedPost } : post));
      setEditingPost(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletePostId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5001/posts/${deletePostId}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter(post => post.poster._id !== deletePostId));
      setShowConfirmDelete(false);
      setDeletePostId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeletePostId(null);
  };

  const closeModal = () => {
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(post => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      post.poster.fullName.toLowerCase().includes(searchTermLower) ||
      post.poster.email.toLowerCase().includes(searchTermLower) ||
      post.poster.ticketNumber.toLowerCase().includes(searchTermLower) ||
      post.poster.phoneNumber.toLowerCase().includes(searchTermLower) ||
      post.poster.airport.toLowerCase().includes(searchTermLower) ||
      post.poster.moreDetails.toLowerCase().includes(searchTermLower) ||
      (post.person && post.person.fullName.toLowerCase().includes(searchTermLower)) ||
      (post.person && post.person.ticketNumber.toLowerCase().includes(searchTermLower)) ||
      (post.person && post.person.ltpNumber.toLowerCase().includes(searchTermLower)) ||
      (post.person && post.person.email.toLowerCase().includes(searchTermLower)) ||
      (post.person && post.person.phoneNumber.toLowerCase().includes(searchTermLower)) ||
      (post.person && post.person.airline.toLowerCase().includes(searchTermLower)) ||
      (post.person && new Date(post.person.date).toLocaleDateString().toLowerCase().includes(searchTermLower))
    );
  });

  const postBoxStyle = {
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
      <h2>Posts</h2>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        style={searchBarStyle}
      />
      {filteredPosts.map((post) => (
        <div key={post.poster._id} style={postBoxStyle}>
          <>
            <div>
              <h3>Poster</h3>
              <p>Full Name: {post.poster.fullName}</p>
              <p>Email: {post.poster.email}</p>
              <p>Ticket Number: {post.poster.ticketNumber}</p>
              <p>Phone Number: {post.poster.phoneNumber}</p>
              <p>Airport: {post.poster.airport}</p>
              <p>More Details: {post.poster.moreDetails}</p>
            </div>
            <div>
              <h3>Person</h3>
              {post.person ? (
                <>
                  <p>Full Name: {post.person.fullName}</p>
                  <p>Ticket Number: {post.person.ticketNumber}</p>
                  <p>LTP Number: {post.person.ltpNumber}</p>
                  <p>Email: {post.person.email}</p>
                  <p>Phone Number: {post.person.phoneNumber}</p>
                  <p>Airline: {post.person.airline}</p>
                  <p>Date: {new Date(post.person.date).toLocaleDateString()}</p>
                </>
              ) : (
                <p>No matching person found.</p>
              )}
            </div>
            <button style={editButtonStyle} onClick={() => handleEditClick(post)}>Edit</button>
            <button style={deleteButtonStyle} onClick={() => handleDeleteClick(post.poster._id)}>Delete</button>
          </>
        </div>
      ))}

{editingPost && (
        <>
          <div style={overlayStyle} onClick={closeModal} />
          <div style={modalStyle}>
            <h3>Edit Post</h3>
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
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEditChange}
                placeholder="Email"
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
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleEditChange}
                placeholder="Phone Number"
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
                type="text"
                name="moreDetails"
                value={formData.moreDetails}
                onChange={handleEditChange}
                placeholder="More Details"
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
            <p>Are you sure you want to delete this post?</p>
            <div style={modalButtonContainerStyle}>
              <button style={deleteButtonStyle} onClick={confirmDelete}>Yes</button>
              <button style={editButtonStyle} onClick={cancelDelete}>No</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Posts;
