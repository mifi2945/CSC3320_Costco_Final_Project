import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    return (
        <div className="profilePage">
            <Link to='/home'>
                <img src="/assets/costco.png" alt="Costco Logo" className="costcoLogo" />
            </Link>
            <h2>User Profile</h2>
            <h4>Username: {username}</h4>
            {/* input field for new password */}
            <div className="formGroup">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
              />
            </div>
            <button className="updatePasswordButton">Update Password</button>
        </div>
    );
}