import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';
import Discounts from './pages/Discounts.jsx';

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
        <Route path="/cart" element={<Cart />} />
        <Route path ="/profile" element={<Profile />} />
        <Route path ="/discounts" element={<Discounts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;