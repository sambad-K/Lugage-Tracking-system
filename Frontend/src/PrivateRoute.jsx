import React, { useEffect } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  const lastActivity = localStorage.getItem('lastActivity');
  const navigate = useNavigate();

  useEffect(() => {
    const checkInactivity = () => {
      if (token && lastActivity) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastActivity;

        
        if (elapsedTime >= 1800000) {
          localStorage.removeItem('token');
          localStorage.removeItem('lastActivity');
          navigate('/Login'); 
        }
      }
    };

   
    checkInactivity();

    
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now());
    };

    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [token, lastActivity, navigate]);

  
  if (!token) {
    return <Navigate to="/Login" />;
  }

  
  return <Outlet />;
};

export default PrivateRoute;
