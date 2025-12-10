import './ItemCardStyles.css';

// ItemCard component props:
// category, price, discount, rating, title, features, description, onAddToCart

export default function ItemCard({ 
    category = 'Uncategorized', 
    price = 0, 
    discount = 0, 
    rating = 0, 
    title = 'Untitled', 
    features = '', 
    description = '',
    onAddToCart 
}) {
    const discountedPrice = price - discount;
    
    return (
        <article className="productCard">
            <div className="pill">{category}</div>
            
            <div className="itemHeader">
                <h3>{title}</h3>
                <div className="rating">
                    {'⭐'.repeat(Math.round(rating))}
                    <span className="ratingNum">({rating})</span>
                </div>
            </div>
            
            <p className="description">{description}</p>
            
            {features && (
                <div className="features">
                    <strong>Features:</strong>
                    <p className="muted">{features}</p>
                </div>
            )}
            
            <div className="priceSection">
                {discount > 0 ? (
                    <>
                        <span className="price">${discountedPrice.toFixed(2)}</span>
                        <span className="discountBadge">-${discount.toFixed(2)}</span>
                    </>
                ) : (
                    <span className="price">${price.toFixed(2)}</span>
                )}
            </div>
            
            <button 
                className="addBtn" 
                onClick={onAddToCart}
                disabled={!onAddToCart}
            >
                Add to Cart
            </button>
        </article>
    );
}