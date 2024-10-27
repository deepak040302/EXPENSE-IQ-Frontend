// Logout.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Adjust the path to where your AuthProvider is located

const LogOut = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Call the logout function from AuthContext to clear auth state
        logout();
        
        // Redirect to the login page
        navigate('/login');
    }, [logout, navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default LogOut;
