import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/user/cart_items?username=' + localStorage.getItem('username'))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load cart items');
                }
                return response.json();
            })
            .then(data => setCartItems(data))
            .catch(err => console.error('Error fetching cart items:', err));
    }, []);

    // Combine items by title and count quantities
    const getCartSummary = () => {
        return cartItems.map(cartItem => ({
            title: cartItem.product.Title,
            price: cartItem.product.Price || 0,
            discount: cartItem.product.Discount || 0,
            quantity: cartItem.quantity
        }));
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
                    <button className="orderButton">Place Order</button>
                </div>
            )}
        </div>
    );
}