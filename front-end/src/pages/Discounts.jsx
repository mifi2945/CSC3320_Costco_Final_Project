import React, { useState, useEffect } from 'react';
import '../components/ItemCard.jsx';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

export default function Discounts() {
    const [allItems, setAllItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [displayCount, setDisplayCount] = useState(20);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchItems = (query = '') => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (query.trim()) {
      params.append('item', query);
    }

    console.log('Fetching with query:', query); // Debug log

    fetch(`http://localhost:8080/discount`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data); // Debug log
        setAllItems(data);
        setDisplayedItems(data.slice(0, 20));
        setDisplayCount(20);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
        setError('Failed to load items. Please try again.');
        setLoading(false);
      });
  };

  const addToCart = (item) => {
    fetch(`http://localhost:8080/user/add_to_cart?itemId=${item._id.oid}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
        window.dispatchEvent(new Event('cart:updated'));
        console.log('Item added to cart:', item.Title);
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
      });
  };

  const loadMore = () => {
    const newCount = displayCount + 20;
    setDisplayedItems(allItems.slice(0, newCount));
    setDisplayCount(newCount);
  };

  useEffect(() => {
      fetchItems();
    }, []);

  return (
    <div className="cartPage">
            <TopBar />
            <h2>Discounted Items</h2>

            <div className="productGrid">
                        {displayedItems.map((item, index) => (
                          <ItemCard
                            key={`${item._id?.timestamp}-${index}`}
                            category={item.Category}
                            title={item.Title}
                            description={item['Product Description']}
                            features={item.Feature}
                            price={item.Price}
                            discount={item.Discount}
                            rating={item.Rating}
                            onAddToCart={() => addToCart(item)}
                          />
                        ))}
            </div>
            {!loading && !error && displayedItems.length < allItems.length && (
                <div className="loadMoreContainer">
                  <button className="loadMoreBtn" onClick={loadMore}>
                    Load More ({allItems.length - displayedItems.length} remaining)
                  </button>
                </div>
            )}
    </div>
  );
    
}