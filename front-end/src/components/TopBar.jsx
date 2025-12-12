import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TopBar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = () => {
      const username = localStorage.getItem('username') || '';
      const url = username
        ? `http://localhost:8080/user/cart_items?username=${encodeURIComponent(username)}`
        : `http://localhost:8080/user/cart_items`;

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch cart items');
          return res.json();
        })
        .then((items) => {
          const count = Array.isArray(items)
            ? items.reduce((sum, ci) => sum + (ci.quantity || 0), 0)
            : 0;
          setCartCount(count);
        })
        .catch((err) => console.error('TopBar cart count error:', err));
    };

    fetchCartCount();
    const handler = () => fetchCartCount();
    window.addEventListener('cart:updated', handler);
    return () => window.removeEventListener('cart:updated', handler);
  }, []);

  return (
    <div className="topBar">
      <Link to='/home'>
        <img src="/assets/costco.png" alt="Costco Logo" className="costcoLogo" />
      </Link>
      <div className="topBarIcons">
        <Link to="/discounts" className="discountsIcon">Discounts</Link>
        <Link to="/cart" className="cartIcon">
          <img src="/assets/shoppingcart.png" alt="Shopping Cart" />
          {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
        </Link>
        <Link to="/profile" className="profileIcon">
          <img src="/assets/profile.png" alt="Profile" />
        </Link>
      </div>
    </div>
  );
}
