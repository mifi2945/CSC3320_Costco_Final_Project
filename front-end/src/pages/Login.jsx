import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Send username and password as query parameters
    const params = new URLSearchParams({
      username: username,
      password: password
    });
    
    fetch(`http://localhost:8080/login?${params}`, { method: 'PUT' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login response:', data);
        // Check if login was successful (backend returns true for success, false for failure)
        if (data === true) {
          localStorage.setItem('username', username);
          navigate('/home');
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        setError('Login failed. Please check your credentials and try again.');
      });
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
      <img src="/assets/costco.png" alt="Costco Logo" className="costcoLogo" />
      <h2 className = "loginTitle">Login</h2>
      {error && <div className="errorMessage">{error}</div>}
      <form className="loginForm" onSubmit={handleLogin}>
        <div className="formGroup">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
         <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="loginBtn">Login</button>      
      </form>
      </div>
    </div>
  );
}