import React from 'react';
import homeImage from './Hombag.png';

const Home = () => {
  return (
    <div
      className="container"
      style={{
        backgroundColor: 'white',
        textAlign: 'center',
        padding: '20px',
        fontFamily: "'Raleway', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        animation: 'fadeIn 1s ease-in-out',
      }}
    >
      <div
        className='Logo'
        style={{
          marginBottom: '20px',
          position: 'relative',
          animation: 'bounceIn 1s ease-out',
        }}
      >
        <h1
          className='main'
          style={{
            fontSize: '70px',
            color: '#007bff',
            fontFamily: "'Knewave', cursive",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            animation: 'slideInLeft 1s ease-out',
            transition: 'transform 0.3s ease-out, color 0.3s ease-out',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.color = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.color = '#007bff';
          }}
        >
          L T S
        </h1>
        <strong>
          <p
            style={{
              fontSize: '24px',
              color: '#0056b3',
              animation: 'fadeIn 1.2s ease-out',
              transition: 'color 0.3s ease-out',
            }}
            onMouseEnter={(e) => e.target.style.color = '#003e7e'}
            onMouseLeave={(e) => e.target.style.color = '#0056b3'}
          >
            Luggage Tracking System
          </p>
          <p
            className='Animate'
            style={{
              fontSize: '18px',
              animation: 'fadeIn 1.5s ease-out',
              transition: 'color 0.3s ease-out',
            }}
            onMouseEnter={(e) => e.target.style.color = '#003e7e'}
            onMouseLeave={(e) => e.target.style.color = '#333'}
          >
            Find Your Luggage With Ease
          </p>
        </strong>
      </div>
      <div
        className="homepage"
        style={{
          margin: '20px 0',
          position: 'relative',
          animation: 'zoomIn 2s ease-out',
        }}
      >
        <img
          src={homeImage}
          alt="homeImage"
          style={{
            width: '100%',
            maxWidth: '600px',
            transition: 'transform 0.3s ease-out',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <div>
        <h3
          className='contact'
          style={{
            fontSize: '24px',
            color: '#007bff',
            margin: '40px 0 10px',
            animation: 'fadeInUp 2.5s ease-out',
            transition: 'color 0.3s ease-out',
          }}
          onMouseEnter={(e) => e.target.style.color = '#003e7e'}
          onMouseLeave={(e) => e.target.style.color = '#007bff'}
        >
          Contact Us
        </h3>
        <div
          className="contact"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#333',
            animation: 'fadeIn 2.8s ease-out',
            transition: 'color 0.3s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('p').style.color = '#007bff';
            e.currentTarget.querySelector('svg').style.stroke = '#007bff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('p').style.color = '#333';
            e.currentTarget.querySelector('svg').style.stroke = '#000000';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
            <path d="M3.77762 11.9424C2.8296 10.2893 2.37185 8.93948 2.09584 7.57121C1.68762 5.54758 2.62181 3.57081 4.16938 2.30947C4.82345 1.77638 5.57323 1.95852 5.96 2.6524L6.83318 4.21891C7.52529 5.46057 7.87134 6.08139 7.8027 6.73959C7.73407 7.39779 7.26737 7.93386 6.33397 9.00601L3.77762 11.9424ZM3.77762 11.9424C5.69651 15.2883 8.70784 18.3013 12.0576 20.2224M12.0576 20.2224C13.7107 21.1704 15.0605 21.6282 16.4288 21.9042C18.4524 22.3124 20.4292 21.3782 21.6905 19.8306C22.2236 19.1766 22.0415 18.4268 21.3476 18.04L19.7811 17.1668C18.5394 16.4747 17.9186 16.1287 17.2604 16.1973C16.6022 16.2659 16.0661 16.7326 14.994 17.666L12.0576 20.2224Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg> 
          <p style={{ marginLeft: '10px', transition: 'color 0.3s ease-out' }}>+977 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
