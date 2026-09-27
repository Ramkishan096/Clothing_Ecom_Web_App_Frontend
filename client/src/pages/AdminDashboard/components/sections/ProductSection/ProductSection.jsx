import styles from "./ProductSection.module.css";
import { useState, useEffect } from "react";
import ProductForm from "./ProductForm/ProductForm";
import ProductView from "./ProductView/ProductView";
import api from "../../../../../api/axios";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { UPLOADS_URL } from "../../../../../config";
import { useNavigate } from "react-router-dom";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
  // Fetch all products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/product?page=${page}&limit=10`);
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setTotalProducts(response.data.pagination.total);
        setCurrentPage(page);
      } else {
        alert("Failed to fetch products: " + (response.data.message || "Unknown error"));
        setError(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      alert("Error fetching products: " + (err.response?.data?.message || "Network error. Please try again."));
      setError(err.response?.data?.message || "Network error. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete product with confirmation
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/product/${id}`);
      
      if (response.data.success) {
        alert("Product deleted successfully!");
        fetchProducts(currentPage);
      } else {
        alert("Failed to delete product: " + (response.data.message || "Unknown error"));
        setError(response.data.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product: " + (err.response?.data?.message || "Network error. Please try again."));
      setError(err.response?.data?.message || "Network error. Please try again.");
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit product - open form with product data
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // View product - open view modal
  const handleView = (product) => {
    setViewingProduct(product);
    setShowView(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Close view
  const handleCloseView = () => {
    setShowView(false);
    setViewingProduct(null);
  };

  // Handle form submit (create/update)
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (editingProduct) {
        // Update existing product
        const response = await api.put(`/product/${editingProduct._id}`, formData);
        
        if (response.data.success) {
          alert("Product updated successfully!");
          handleCloseForm();
          fetchProducts(currentPage);
        } else {
          alert("Failed to update product: " + (response.data.message || "Unknown error"));
          setError(response.data.message || "Failed to update product");
        }
      } else {
        // Create new product
        response = await api.post("/product", formData);
        
        if (response.data.success) {
          alert("Product created successfully!");
          handleCloseForm();
          fetchProducts(1);
        } else {
          alert("Failed to create product: " + (response.data.message || "Unknown error"));
          setError(response.data.message || "Failed to create product");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Network error. Please try again.";
      alert("Error submitting form: " + errorMsg);
      setError(errorMsg);
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Get status badge class
  const getStatusClass = (stockQuantity) => {
    if (stockQuantity === 0) return styles.outOfStock;
    if (stockQuantity < 10) return styles.lowStock;
    return styles.inStock;
  };

  // Get status text
  const getStatusText = (stockQuantity) => {
    if (stockQuantity === 0) return "Out of Stock";
    if (stockQuantity < 10) return "Low Stock";
    return "In Stock";
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
    }
  };

  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <div>
          <h2>Products Management</h2>
          <p className={styles.subtitle}>
            Total Products: {totalProducts} | Page {currentPage} of {totalPages}
          </p>
        </div>
        <button 
          className={styles.addButton} 
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Loading State */}
      {/* {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
          <p>Loading...</p>
        </div>
      )} */}

      {/* Desktop Table View */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className={styles.productInfo}>
                      {product.coverImage && (
                        <img 
                          // src={product.coverImage} 
                           src={`${UPLOADS_URL}${product.coverImage}`|| product.coverImage}                       

                          alt={product.name}
                          className={styles.productImage}                        
                        />
                      )}
                      <div>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productBrand}>{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>₹{product.price?.toFixed(2) || '0.00'}</td>
                  <td>{product.discount || 0}%</td>
                  <td>₹{(product.finalPrice || product.price || 0).toFixed(2)}</td>
                  <td>{product.stockQuantity || product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(product.stockQuantity || 0)}`}>
                      {getStatusText(product.stockQuantity || 0)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.viewBtn}
                        onClick={() => handleView(product)}
                        disabled={loading}
                        title="View Product"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleEdit(product)}
                        disabled={loading}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={loading}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  {loading ? "Loading..." : "No products found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCardContainer}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.cardHeader}>
                <div className={styles.productInfo}>
                  {product.coverImage && (
                    <img 
                      // src={product.coverImage} 
                      src={`${UPLOADS_URL}${product.coverImage}`|| product.coverImage}                       
                      alt={product.name}
                      className={styles.productImage}
                      onClick={() => navigate("/product/"+product.slug)}                  
                    />
                  )}
                  <div>
                    <div className={styles.productName}>{product.name}</div>
                    <div className={styles.productBrand}>{product.brand}</div>
                  </div>
                </div>
                <span className={`${styles.status} ${getStatusClass(product.stockQuantity || 0)}`}>
                  {getStatusText(product.stockQuantity || 0)}
                </span>
              </div>
              
              <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span>₹{product.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Discount:</span>
                  <span>{product.discount || 0}%</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Final Price:</span>
                  <span>₹{(product.finalPrice || product.price || 0).toFixed(2)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Stock:</span>
                  <span>{product.stockQuantity || product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.viewBtn}
                  onClick={() => handleView(product)}
                  disabled={loading}
                >
                  <FaEye /> View
                </button>
                <button 
                  className={styles.editBtn}
                  onClick={() => handleEdit(product)}
                  disabled={loading}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(product._id, product.name)}
                  disabled={loading}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noData}>
            {loading ? "Loading..." : "No products found"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          loading={loading}
        />
      )}

      {/* Product View Modal */}
      {showView && viewingProduct && (
        <ProductView
          product={viewingProduct}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
};

export default ProductSection;