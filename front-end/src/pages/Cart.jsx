import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Combine items by title and count quantities
    const getCartSummary = () => {
        const summary = {};
        cartItems.forEach(item => {
            if (summary[item.Title]) {
                summary[item.Title].quantity += 1;
            } else {
                summary[item.Title] = {
                    title: item.Title,
                    price: item.Price || 0,
                    discount: item.Discount || 0,
                    quantity: 1
                };
            }
        });
        return Object.values(summary);
    };

    // Calculate total
    const calculateTotal = () => {
        return getCartSummary().reduce((total, item) => {
            return total + ((item.price - item.discount) * item.quantity);
        }, 0);
    };

    return (
        <div className="cartPage">
            <Link to='/home'>
                <img src="/assets/costco.png" alt="Costco Logo" className="costcoLogoSmall" />
            </Link>
            <h2>Your Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    <table className="cartTable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCartSummary().map((item, index) => (
                                <tr key={index}>
                                    <td>{item.title}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${((item.price - item.discount) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                </div>
            )}
        </div>
    );
}