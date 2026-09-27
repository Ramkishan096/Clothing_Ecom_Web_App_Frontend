// components/ProductCard/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { UPLOADS_URL } from "../../config";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Calculate discounted price
  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  // Handle navigation to product detail page using slug
  const handleCardClick = () => {
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    } else {
      navigate("/");
    }
  };

  // Get first image from images array or coverImage
  const getProductImage = () => {
    if (product.coverImage) {
      return `${UPLOADS_URL}${product.coverImage}`; 
    }
    if (product.images && product.images.length > 0) {
      return `${UPLOADS_URL}${product.images[0]}`;

      
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  // Get status badges
  const getBadges = () => {
    const badges = [];

    if (product.discount > 0) {
      badges.push(
        <span key="discount" className={styles.discountBadge}>
          -{product.discount}%
        </span>,
      );
    }

    // if (product.isNewArrival || product.isNew) {
    //   badges.push(
    //     <span key="new" className={styles.newBadge}>
    //       New
    //     </span>,
    //   );
    // }

    // if (product.isPopular) {
    //   badges.push(
    //     <span key="popular" className={styles.popularBadge}>
    //       🔥 Popular
    //     </span>
    //   );
    // }

    // if (product.isFeatured) {
    //   badges.push(
    //     <span key="featured" className={styles.featuredBadge}>
    //       ⭐ Featured
    //     </span>
    //   );
    // }

    return badges;
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={getProductImage()}
          alt={product.name}
          className={styles.image}
        />

        <div className={styles.badgeContainer}>{getBadges()}</div>

        {/* Stock Status */}
        {product.stockQuantity === 0 && (
          <div className={styles.outOfStockOverlay}>
            <span>Out of Stock</span>
          </div>
        )}

        {/* Rating */}
        {/* {product.rating > 0 && (
          <div className={styles.rating}>
            ⭐ {product.rating.toFixed(1)}
            {product.totalReviews > 0 && (
              <span className={styles.reviewCount}>
                ({product.totalReviews})
              </span>
            )}
          </div>
        )} */}
      </div>

      <div className={styles.info}>
        {/* <div className={styles.category}>{product.category}</div> */}
        <h3 className={styles.name}>{product.name}</h3>
        {/* <div className={styles.brand}>{product.brand}</div> */}

        <div className={styles.price}>
          <span className={styles.currentPrice}>
            ₹{discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className={styles.originalPrice}>
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* <div className={styles.sizeInfo}>
          {product.sizes && product.sizes.length > 0 && (
            <span className={styles.sizes}>
              Sizes: {product.sizes.map(s => s.size || s).join(', ')}
            </span>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;
