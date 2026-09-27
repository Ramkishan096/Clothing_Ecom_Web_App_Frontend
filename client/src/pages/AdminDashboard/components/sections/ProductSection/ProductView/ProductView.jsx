// ProductView/ProductView.jsx
import styles from "./ProductView.module.css";
import { UPLOADS_URL } from "../../../../../../config";
import { FaTimes } from "react-icons/fa";

const ProductView = ({ product, onClose }) => {
  const getStatusText = (stockQuantity) => {
    if (stockQuantity === 0) return "Out of Stock";
    if (stockQuantity < 10) return "Low Stock";
    return "In Stock";
  };

  const getStatusClass = (stockQuantity) => {
    if (stockQuantity === 0) return styles.outOfStock;
    if (stockQuantity < 10) return styles.lowStock;
    return styles.inStock;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Product Details</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.imageContainer}>
            {product.coverImage ? (
              <img 
                src={`${UPLOADS_URL}${product.coverImage}`|| product.coverImage} 
                alt={product.name}
                className={styles.productImage}      
              />
            ) : (
              <div className={styles.noImage}>No Image Available</div>
            )}
          </div>

          <div className={styles.detailsContainer}>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productBrand}>{product.brand}</p>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Category</span>
                <span className={styles.value}>{product.category}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.label}>Price</span>
                <span className={styles.value}>₹{product.price?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.label}>Discount</span>
                <span className={styles.value}>{product.discount || 0}%</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.label}>Final Price</span>
                <span className={styles.value}>₹{(product.finalPrice || product.price || 0).toFixed(2)}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.label}>Stock</span>
                <span className={styles.value}>
                  {product.stockQuantity || product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0}
                </span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.label}>Status</span>
                <span className={`${styles.status} ${getStatusClass(product.stockQuantity || 0)}`}>
                  {getStatusText(product.stockQuantity || 0)}
                </span>
              </div>
            </div>


            {/* Add after the stock/status section */}
{/* Package Details */}
{(product.package_weight_in_kg || product.package_dimension) && (
  <div className={styles.packageDetails}>
    <h4>Package Details</h4>
    <div className={styles.detailGrid}>
      {product.package_weight_in_kg && (
        <div className={styles.detailItem}>
          <span className={styles.label}>Weight</span>
          <span className={styles.value}>{product.package_weight_in_kg} kg</span>
        </div>
      )}
      {product.package_dimension && (
        <div className={styles.detailItem}>
          <span className={styles.label}>Dimensions</span>
          <span className={styles.value}>
            {product.package_dimension.length} × {product.package_dimension.breadth} × {product.package_dimension.height} cm
          </span>
        </div>
      )}
    </div>
  </div>
)}

            {product.description && (
              <div className={styles.description}>
                <h4>Description</h4>
                <p>{product.description}</p>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.sizes}>
                <h4>Available Sizes</h4>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((size, index) => (
                    <div key={index} className={styles.sizeItem}>
                      <span className={styles.sizeLabel}>{size.size}</span>
                      <span className={styles.sizeStock}>Stock: {size.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;