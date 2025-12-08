import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Send username and password as query parameters
    const params = new URLSearchParams({
      username: username,
      password: password
    });
    
    fetch(`http://localhost:8080/login?${params}`)
      .then(response => response.json())
      .then(data => {
        console.log('Login successful:', data);
        // Handle successful login here
      })
      .catch(error => {
        console.error('Login error:', error);
        // Handle error here
      });
  };

  return (
    <div className="loginContainer">
      <h2 className = "loginTitle">Login</h2>
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
  );
}

export default App;