import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ChevronRight,
  ShoppingBag,
  Calendar,
  MapPin,
  IndianRupee,
  Eye,
  Filter,
  Search
} from "lucide-react";
import { useAppSelector } from "../../redux/hooks";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import { orderApi } from "../../api/orderApi";
import styles from "./MyOrders.module.css";
import { UPLOADS_URL } from "../../config";

const MyOrders = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Order status mapping
  const orderStatusMap = {
    pending: { label: "Pending", icon: Clock, color: "#f59e0b", bg: "#fef3c7" },
    confirmed: { label: "Confirmed", icon: CheckCircle, color: "#3b82f6", bg: "#eff6ff" },
    processing: { label: "Processing", icon: Package, color: "#8b5cf6", bg: "#f3e8ff" },
    shipped: { label: "Shipped", icon: Truck, color: "#06b6d4", bg: "#cffafe" },
    delivered: { label: "Delivered", icon: CheckCircle, color: "#22c55e", bg: "#dcfce7" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "#ef4444", bg: "#fef2f2" },
    returned: { label: "Returned", icon: XCircle, color: "#8b5cf6", bg: "#f3e8ff" },
  };

  // Fetch orders on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getBuyerOrders();
      console.log("Orders response:", response);
      
      if (response?.success && response?.data) {
        setOrders(response.data);
      } else if (response?.orders) {
        setOrders(response.orders);
      } else if (Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Get status config
  const getStatusConfig = (status) => {
    const statusKey = status?.toLowerCase() || "pending";
    return orderStatusMap[statusKey] || orderStatusMap.pending;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Filter orders
  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === selectedFilter
      );
    }

    // Filter by search term (order ID or product name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(term) ||
          order._id?.toLowerCase().includes(term) ||
          order.items?.some((item) =>
            item.product_name?.toLowerCase().includes(term)
          )
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Get filter counts
  const getFilterCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status?.toLowerCase() === status).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  // No orders state
  if (!loading && orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <ShoppingBag size={64} />
        </div>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start shopping now!</p>
        <button onClick={() => navigate("/")} className={styles.shopBtn}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.myOrdersPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Package size={24} className={styles.headerIcon} />
            <h1 className={styles.title}>My Orders</h1>
            <span className={styles.orderCount}>{orders.length} orders</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={styles.filterSection}>
          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${
                selectedFilter === "all" ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              All ({getFilterCount("all")})
            </button>
            <button
              className={`${styles.filterTab} ${
                selectedFilter === "pending" ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter("pending")}
            >
              <Clock size={14} />
              Pending ({getFilterCount("pending")})
            </button>
            <button
              className={`${styles.filterTab} ${
                selectedFilter === "confirmed" ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter("confirmed")}
            >
              <CheckCircle size={14} />
              Confirmed ({getFilterCount("confirmed")})
            </button>
            <button
              className={`${styles.filterTab} ${
                selectedFilter === "shipped" ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter("shipped")}
            >
              <Truck size={14} />
              Shipped ({getFilterCount("shipped")})
            </button>
            <button
              className={`${styles.filterTab} ${
                selectedFilter === "delivered" ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter("delivered")}
            >
              <CheckCircle size={14} />
              Delivered ({getFilterCount("delivered")})
            </button>
            <button
              className={`${styles.filterTab} ${
                selectedFilter === "cancelled" ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter("cancelled")}
            >
              <XCircle size={14} />
              Cancelled ({getFilterCount("cancelled")})
            </button>
          </div>

          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={fetchOrders} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className={styles.ordersList}>
          {filteredOrders.length === 0 ? (
            <div className={styles.noResults}>
              <p>No orders found matching your filters</p>
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setSearchTerm("");
                }}
                className={styles.clearFiltersBtn}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const totalItems = order.items?.reduce(
                (sum, item) => sum + (item.quantity || 1),
                0
              ) || 0;

              return (
                <div key={order._id || order.orderId} className={styles.orderCard}>
                  {/* Order Header */}
                  <div className={styles.orderHeader}>
                    <div className={styles.orderIdWrapper}>
                      <span className={styles.orderId}>
                        Order #{order.orderId || order._id?.slice(-8) || "N/A"}
                      </span>
                      <span className={styles.orderDate}>
                        <Calendar size={14} />
                        {formatDate(order.createdAt || order.created_at)}
                      </span>
                    </div>
                    <div
                      className={styles.orderStatus}
                      style={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                      }}
                    >
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className={styles.orderItems}>
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className={styles.orderItem}>
                        <div className={styles.orderItemImage}>
                          <img
                          src={`${UPLOADS_URL}${item.cover_image}`}                  
                            // src={item.cover_image || item.image || "/placeholder.png"}
                            alt={item.product_name}
                          />
                        </div>
                        <div className={styles.orderItemDetails}>
                          <p className={styles.orderItemName}>
                            {item.product_name}
                          </p>
                          <p className={styles.orderItemMeta}>
                            Qty: {item.quantity || 1} × ₹
                            {Number(item.selling_price || item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className={styles.orderItemPrice}>
                          ₹
                          {(
                            (item.selling_price || item.price) *
                            (item.quantity || 1)
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className={styles.moreItems}>
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className={styles.orderFooter}>
                    <div className={styles.orderTotal}>
                      <span className={styles.totalLabel}>Total Amount</span>
                      <span className={styles.totalAmount}>
                        ₹{Number(order.final_payable_amount || order.total).toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.orderActions}>
                      <button
                        className={styles.viewDetailsBtn}
                        onClick={() => navigate(`/order/${order._id || order.orderId}`)}
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        className={styles.trackBtn}
                        onClick={() => navigate(`/track-order/${order._id || order.orderId}`)}
                      >
                        <Truck size={16} />
                        Track
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;