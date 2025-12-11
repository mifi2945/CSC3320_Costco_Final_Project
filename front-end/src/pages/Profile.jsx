import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    const updatePassword = () => {
        if (!oldPassword || !newPassword) {
            setError('Please fill in both fields');
            setSuccessMessage('');
            return;
        }

        const params = new URLSearchParams({
            old_password: oldPassword,
            new_password: newPassword
        });

        fetch(`http://localhost:8080/user/change_password?${params}`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
            if (data === true) {
                setError('');
                setSuccessMessage('Password updated successfully!');
                setOldPassword('');
                setNewPassword('');
            } else {
                setError('Failed to update password. Check your current password.');
                setSuccessMessage('');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setError('Error updating password');
            setSuccessMessage('');
        });
    };

    return (
        <div className="profilePage">
            <Link to='/home'>
                <img src="/assets/costco.png" alt="Costco Logo" className="costcoLogo" />
            </Link>
            <h2>User Profile</h2>
            <h4>Username: {username}</h4>
            {/* input field for new password */}
            <div className="formGroup">
              <label htmlFor="oldPassword">Current Password:</label>
              <input
                type="password"
                id="oldPassword"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {error && <p className="errorMessage">{error}</p>}
            <button className="updatePasswordButton" onClick={updatePassword}>Update Password</button>
            {successMessage && <p className="successMessage">{successMessage}</p>}
            <h2>Purchase Information</h2>
            <h4>Number of Orders: </h4>
            <h4>Total Spent: </h4>
            <button className="logoutButton" onClick={() => {
                localStorage.removeItem('username');
                window.location.href = '/login';
            }}>Logout</button>
        </div>
    );
}