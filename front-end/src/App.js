import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link>
      </nav> */}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;