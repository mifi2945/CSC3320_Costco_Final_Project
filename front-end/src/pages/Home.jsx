import React, { useState, useEffect } from 'react';
import '../components/ItemCard.jsx';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';
import Cart from './Cart.jsx';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const fetchItems = (query = '') => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (query.trim()) {
      params.append('item', query);
    }

    console.log('Fetching with query:', query); // Debug log

    fetch(`http://localhost:8080/search?${params}`)
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
    console.log(item._id.oid);
    fetch(`http://localhost:8080/user/add_to_cart?itemId=${item._id.oid}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
        // Backend returns void, so just update local state
        setCartItems(prev => [...prev, item]);
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

  // Update available categories whenever items change
  useEffect(() => {
    const categories = [...new Set(allItems.map(item => item.Category))].filter(Boolean);
    setAvailableCategories(categories);
  }, [allItems]);

  const handleSearch = () => {
    fetchItems(searchQuery);
  };

  const applyFilters = () => {
    let promise = Promise.resolve();
    
    // Add selected categories
    selectedCategories.forEach(category => {
      promise = promise.then(() => 
        fetch(`http://localhost:8080/filters/categories/${encodeURIComponent(category)}`, { method: 'PUT' })
      );
    });
    
    // Apply price filters
    promise = promise
      .then(() => fetch(`http://localhost:8080/filters/lower/Price?bound=${priceMin}`, { method: 'PUT' }))
      .then(() => fetch(`http://localhost:8080/filters/upper/Price?bound=${priceMax}`, { method: 'PUT' }))
      .then(() => fetchItems(searchQuery))
      .catch(error => console.error('Error applying filters:', error));
  };

  const clearFilters = () => {
    fetch(`http://localhost:8080/filters/clear`, { method: 'DELETE' })
      .then(() => {
        setPriceMin(0);
        setPriceMax(1000);
        setDiscountMin(0);
        setDiscountMax(1000);
        setSelectedCategories([]);
        fetchItems(searchQuery);
      })
      .catch(error => console.error('Error clearing filters:', error));
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="homePage">
      <div className="homeContainer">
        <div className="topBar">
            <Link to='/home'>
                <img src="/assets/costco.png" alt="Costco Logo" className="costcoLogo" />
            </Link>
            <div className="topBarIcons">
                <Link to="/discounts" className="discountsIcon">Discounts</Link>
              <Link to="/cart" state={{ cartItems }} className="cartIcon">
                  <img src="/assets/shoppingcart.png" alt="Shopping Cart" />
                  {cartItems.length > 0 && <span className="cartBadge">{cartItems.length}</span>}
              </Link>            
              <Link to="/profile" className="profileIcon">
                  <img src="/assets/profile.png" alt="Profile" />
              </Link>            
            </div>
        </div>
        <h1>Welcome to Costco</h1>
        
        <div className="searchBarContainer">
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="searchInput"
          />
          <button className="searchButton" onClick={handleSearch}>Search</button>
          <button className="filterToggleBtn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="filtersPanel">
            <h3>Filters</h3>
            <div className="filterGroup">
              <label>Min Price:</label>
              <input 
                type="number" 
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="filterInput"
                placeholder="0"
              />
              <label>Max Price:</label>
              <input 
                type="number" 
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="filterInput"
                placeholder="1000"
              />
            </div>
            <div className="filterGroup">
              <label>Categories:</label>
              {availableCategories.map(category => (
                <div key={category} className="categoryCheckbox">
                  <input 
                    type="checkbox" 
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <label htmlFor={`cat-${category}`}>{category}</label>
                </div>
              ))}
            </div>
            <div className="filterButtons">
              <button className="applyFiltersBtn" onClick={applyFilters}>Apply</button>
              <button className="clearFiltersBtn" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        )}

        {loading && <p className="muted">Loading items...</p>}
        {error && <p className="errorMessage">{error}</p>}

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

        {!loading && !error && displayedItems.length === 0 && (
          <p className="muted">No items found. Try a different search.</p>
        )}

        {!loading && !error && displayedItems.length < allItems.length && (
          <div className="loadMoreContainer">
            <button className="loadMoreBtn" onClick={loadMore}>
              Load More ({allItems.length - displayedItems.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
