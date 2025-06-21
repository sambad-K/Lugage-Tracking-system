import React, { useState } from 'react';
import './style.css';
import rimage from './raghabendra.jpg';
import samimage from './sambad.jpg';
import sanimage from './santu.jpg';
import lokimage from './lokendra.jpg'; 
const About = () => {
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  const developers = [
    {
      name: 'Raghabendra Chaudhary',
      role: 'Layout Design And Chatbot',
      image: rimage,
      details: 'Raghabendra is skilled in designing user interfaces, developing frontend layouts and integrating chatbots.',
    },
    {
      name: 'Sambad Khatiwada',
      role: 'Backend',
      image: samimage,
      details: 'Sambad specializes in backend development, ensuring smooth server-side operations and database , especially MonoDB',
    },
    {
      name: 'Santu Jhankri Magar',
      role: 'Backend',
      image: sanimage,
      details: 'Santu is proficient in backend technologies and database management.',
    },
    {
      name: 'Lokendra Joshi',
      role: 'Chatbot And Optimization',
      image: lokimage,
      details: 'Lokendra focuses on chatbot development and optimizing performance of the web application.',
    },
  ];

  const handleCardClick = (developer) => {
    setSelectedDeveloper(developer);
  };

  const handleClosePopup = () => {
    setSelectedDeveloper(null);
  };

  return (
    <div className="About" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="head">
        <h1 className="animated-title">About Us</h1>
        <p className="description animated-fadeIn">
          This web application is a minor project by four students studying computer engineering at Himalaya College of Engineering, <b>Santu Jhankri Magar</b>, <b>Raghabendra Chaudhary</b>, <b>Sambad Khatiwada</b>, and <b>Lokendra Joshi</b>.
        </p>
        <h1 className="animated-title">Developer Team</h1>
      </div>
      <div className="developers">
        {developers.map((developer) => (
          <div
            key={developer.name}
            className="developer_card animated-slideUp"
            onClick={() => handleCardClick(developer)}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out',
              margin: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="developer_photo">
              <img className="hancy_haru" src={developer.image} width="200" alt={developer.name} style={{ borderRadius: '8px' }} />
              <div className="role">
                <p>{developer.role}</p>
                <h3>{developer.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedDeveloper && (
        <div
          className="popup animated-popup"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            animation: 'popupAppear 0.3s ease-in-out',
            zIndex: 1000,
            maxWidth: '80%',
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleClosePopup}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            &times;
          </button>
          <img src={selectedDeveloper.image} alt={selectedDeveloper.name} style={{ borderRadius: '12px', marginBottom: '15px', width: '200px', height: '200px', objectFit: 'cover' }} />
          <h2 style={{ marginBottom: '10px', fontSize: '1.5em', textAlign: 'center' }}>{selectedDeveloper.name}</h2>
          <p style={{ marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>{selectedDeveloper.role}</p>
          <p style={{ textAlign: 'justify' }}>{selectedDeveloper.details}</p>
        </div>
      )}
      {selectedDeveloper && (
        <div
          className="popup-overlay animated-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.3s ease-in-out',
            zIndex: 999,
          }}
          onClick={handleClosePopup}
        ></div>
      )}
      <style jsx>{`
        @keyframes popupAppear {
          from {
            transform: translate(-50%, -40%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
