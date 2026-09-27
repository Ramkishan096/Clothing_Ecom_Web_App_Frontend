// ProductDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/slices/cartSlice";
import useProducts from "../../hooks/useProducts";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import styles from "./ProductDetails.module.css";
import { UPLOADS_URL } from "../../config";
import { getServiceAbility } from "../../services/shiprocketapi";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [pincode, setPincode] = useState("");
  const [serviceability, setServiceability] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");


  const { getProductBySlug, getRelatedProducts, getProductById } =
    useProducts();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      let productData = await getProductBySlug(slug);
      if (!productData) productData = await getProductById(slug);
      if (productData) {
        setProduct(productData);
        const related = await getRelatedProducts(productData._id, 10);
        setRelatedProducts(related || []);
        if (productData.sizes?.length > 0) {
          setSelectedSize(productData.sizes[0].size || productData.sizes[0]);
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to load product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("slug:",slug)

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const getProductImages = useCallback(() => {
    const images = [];
    if (product?.coverImage) images.push(product.coverImage);
    if (product?.images?.length) images.push(...product.images);
    return images.length
      ? images
      : ["https://via.placeholder.com/600x600?text=No+Image"];
  }, [product]);

  const getSizes = useCallback(() => {
    if (!product?.sizes?.length) return [];
    return product.sizes.map((s) => s.size || s);
  }, [product]);

  const getStock = useCallback(() => {
    if (product?.stockQuantity !== undefined) return product.stockQuantity;
    if (product?.sizes?.length) {
      return product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    }
    return 0;
  }, [product]);

  const handleAddToCart = () => {
    if (!isInStock) {
      alert("This product is out of stock!");
      return;
    }
    const cartItem = {
      id: product._id,
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      discount_rate: product.discount,
      selling_price: product.finalPrice,
      image: product.coverImage,
      quantity,
      size: selectedSize || "N/A",
      slug: product.slug,
      inStock: isInStock,
    };
    dispatch(addToCart(cartItem));
    const btn = document.querySelector(`.${styles.cartBtn}`);
    if (btn) {
      btn.textContent = "✓ Added!";
      btn.style.background = "#2ecc71";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.style.background = "";
      }, 2000);
    }
  };

  const handleCheckPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      alert("Please enter valid pincode");
      return setDeliveryError("Please enter a valid 6 digit pincode");
    }

    try {
      setCheckingPincode(true);

      const res = await getServiceAbility(product, pincode, "Prepaid");
      console.log("data:====================",res);
      if(res.success){
        setServiceability(res.data);  
        setDeliveryError("")      
      }else{
        setDeliveryError("Delivery not available for this pincode")
      }
    } catch (error) {
      console.error(error);
      setDeliveryError("Delivery not available for this pincode..")
      setServiceability(null);
    } finally {
      setCheckingPincode(false);
    }
  };

  console.log("serviceabiltiy in product detials page:", serviceability);

  // const handlePincodeChange = async (e) => {
  //   const value = e.target.value.replace(/\D/g, "");

  //   setPincode(value);

  //   if (value.length === 6) {
  //     try {
  //       const data = await getServiceAbility(product, value, "Prepaid");

  //       setServiceability(data);
  //     } catch (error) {
  //       console.error(error);
  //       setServiceability(null);
  //     }
  //   }
  // };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 300);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleImageChange = (direction) => {
    const images = getProductImages();
    setMainImageIndex((prev) => {
      if (direction === "next") return (prev + 1) % images.length;
      if (direction === "prev")
        return prev === 0 ? images.length - 1 : prev - 1;
      return prev;
    });
  };

  const handleThumbnailClick = (index) => setMainImageIndex(index);

  const handleTouchSlide = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const handleTouchEnd = (endEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        handleImageChange(diff > 0 ? "next" : "prev");
      }
      document.removeEventListener("touchend", handleTouchEnd);
    };
    document.addEventListener("touchend", handleTouchEnd);
  };

  const productImages = getProductImages();
  const sizes = getSizes();
  const stock = getStock();
  const isInStock = stock > 0;
  const discountAmount = product?.price
    ? (product.price * product.discount) / 100
    : 0;
  const currentImage = productImages[mainImageIndex] || productImages[0];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <h2>Product Not Found</h2>
        <p>{error || "The product you are looking for does not exist."}</p>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/products")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailsPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <span onClick={() => navigate("/")}>Home</span>
          <span>/</span>
          <span onClick={() => navigate("/search")}>Products</span>
          <span>/</span>
          <span className={styles.current}>{product.name}</span>
        </div>

        <div className={styles.productContainer}>
          <div className={styles.imageGallery}>
            <div className={styles.galleryWrapper}>
              {/* Thumbnails - Left Side */}
              <div className={styles.thumbnailList}>
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.thumbnailItem} ${idx === mainImageIndex ? styles.active : ""}`}
                    onClick={() => handleThumbnailClick(idx)}
                  >
                    <img
                      src={`${UPLOADS_URL}${img}`}
                      alt={`${product.name} ${idx + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className={styles.mainImageWrapper}>
                <div
                  className={styles.mainImageContainer}
                  onTouchStart={isMobile ? handleTouchSlide : undefined}
                >
                  <Zoom
                    zoomMargin={40}
                    overlayBgColorEnd="rgba(0, 0, 0, 0.85)"
                    transitionDuration={300}
                  >
                    <img
                      src={`${UPLOADS_URL}${currentImage}`}
                      alt={product.name}
                      className={styles.mainImage}
                      loading="lazy"
                    />
                  </Zoom>

                  {productImages.length > 1 && (
                    <>
                      <button
                        className={`${styles.navArrow} ${styles.navArrowLeft}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageChange("prev");
                        }}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        className={`${styles.navArrow} ${styles.navArrowRight}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageChange("next");
                        }}
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className={styles.imageCounter}>
                        {mainImageIndex + 1} / {productImages.length}
                      </div>
                    </>
                  )}

                  {product.discount > 0 && (
                    <span className={styles.discountBadge}>
                      -{product.discount}%
                    </span>
                  )}
                  {!isInStock && (
                    <div className={styles.outOfStockOverlay}>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <div className={styles.meta}>
              <span className={styles.category}>{product.category}</span>
              {product.brand && (
                <span className={styles.brand}>• {product.brand}</span>
              )}
            </div>

            <div className={styles.headerRow}>
              <h1 className={styles.name}>{product.name}</h1>
              <button className={styles.shareBtn} onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>
                ₹{product.finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className={styles.originalPrice}>
                    ₹{product.price.toFixed(2)}
                  </span>
                  <p className={styles.savings}>
                    You saved{" "}
                    <span className={styles.discountAmount}>
                      ₹{discountAmount.toFixed(2)}
                    </span>{" "}
                    on this order.
                  </p>
                </>
              )}
            </div>

            <div className={styles.stockStatus}>
              {isInStock ? (
                <span className={styles.inStock}>In Stock</span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
              {isInStock && stock < 10 && (
                <span className={styles.lowStock}>⚠️ Only {stock} left!</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {sizes.length > 0 && (
              <div className={styles.section}>
                {/* <div className={styles.sectionHeader}>
                  <h3>Select Size</h3>
                  <button className={styles.sizeGuide}>Size Guide</button>
                </div> */}
                <div className={styles.sizes}>
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ""}`}
                      onClick={() => setSelectedSize(size)}
                      disabled={!isInStock}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h3>Quantity</h3>
              <div className={styles.quantity}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isInStock || quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  disabled={!isInStock || quantity >= stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cartBtn}
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                className={styles.buyBtn}
                onClick={handleBuyNow}
                disabled={!isInStock}
              >
                Buy Now
              </button>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Truck size={18} />
                <span>Free Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <Shield size={18} />
                <span>Secure Payment</span>
              </div>
              {/* <div className={styles.trustItem}>
                <RotateCcw size={18} />
                <span>7-Day Returns</span>
              </div> */}
            </div>

            <div className={styles.pincodeSection}>
              <h3>Delivery Option</h3>

              <div className={styles.pincodeInputWrapper}>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter Pincode"
                  className={styles.pincodeInput}
                />

                <button
                  onClick={handleCheckPincode}
                  disabled={checkingPincode}
                  className={styles.checkBtn}
                >
                  {checkingPincode ? "Checking..." : "Check"}
                </button>
              </div>

              {serviceability && pincode ? (
                <p className={styles.available}>
                  ✓ Delivery available in {serviceability.expectedDeliveryDays}{" "}
                  days
                </p>
              ) : (
                <div></div>
              )}
               {/* Error */}
              {deliveryError && <p className={styles.unavailable}>{deliveryError}</p>}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className={styles.relatedProducts}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((related) => (
                <div
                  key={related._id}
                  className={styles.relatedCard}
                  onClick={() =>
                    navigate(`/product/${related.slug || related._id}`)
                  }
                >
                  <div className={styles.relatedImage}>
                    <img
                      // src={related.coverImage ||"https://via.placeholder.com/300x300?text=No+Image"
                      // }
                      src={`${UPLOADS_URL}${related.coverImage}`}                      
                      alt={related.name}
                      loading="lazy"
                    />
                    {related.discount > 0 && (
                      <span className={styles.relatedDiscount}>
                        -{related.discount}%
                      </span>
                    )}
                  </div>
                  <h3 className={styles.relatedName}>{related.name}</h3>
                  <p className={styles.relatedCategory}>{related.category}</p>
                  <div className={styles.relatedPrice}>
                    <span className={styles.relatedCurrent}>
                      ₹{(related.finalPrice || related.price).toFixed(2)}
                    </span>
                    {related.discount > 0 && (
                      <span className={styles.relatedOriginal}>
                        ₹{related.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
