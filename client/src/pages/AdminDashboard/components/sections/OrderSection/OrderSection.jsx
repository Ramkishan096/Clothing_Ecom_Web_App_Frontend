import { useState, useEffect, useRef } from 'react';
import styles from "./OrderSection.module.css";
import OrderDetailsModal from './OrderDetailsModal';
import api from '../../../../../api/axios';
import { FaSearch, FaTimes, FaSync, FaBox, FaRupeeSign, FaCalendarAlt, FaTag } from 'react-icons/fa';

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState('');
  const searchInputRef = useRef(null);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    payment_method: '',
    payment_status: '',
    order_status: '',
    order_id: ''
  });

  // Fetch orders with filters using axios
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let queryString = `?page=${pagination.page}&limit=${pagination.limit}`;
      
      if (filters.payment_method) {
        queryString += `&payment_method=${filters.payment_method}`;
      }
      if (filters.payment_status) {
        queryString += `&payment_status=${filters.payment_status}`;
      }
      if (filters.order_status) {
        queryString += `&order_status=${filters.order_status}`;       
      }
      if (filters.order_id) {
        queryString += `&order_id=${filters.order_id}`;
      }

      const response = await api.get(`order/${queryString}`);
      
      if (response.data.success && response.data.data) {
        setOrders(response.data.data.orders || []);
        setPagination({
          ...pagination,
          total: response.data.data.total || 0,
          totalPages: response.data.data.totalPages || 0
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when filters or page changes
  useEffect(() => {
    fetchOrders();
  }, [filters, pagination.page]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      payment_method: '',
      payment_status: '',
      order_status: '',
      order_id: ''
    });
    setSearchOrderId('');
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle search by Order ID
  const handleSearchOrder = () => {
    if (searchOrderId.trim()) {
      setFilters(prev => ({
        ...prev,
        order_id: searchOrderId.trim()
      }));
      setPagination(prev => ({
        ...prev,
        page: 1
      }));
    }
  };

  // Handle Enter key press for search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchOrder();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchOrderId('');
    setFilters(prev => ({
      ...prev,
      order_id: ''
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusBadge = (status, type) => {
    const statusColors = {
      payment: {
        'Pending': '#ff9800',
        'Paid': '#4caf50',
        'Failed': '#f44336',
        'Refunded': '#9e9e9e'
      },
      order: {
        'Placed': '#2196f3',
        'Processing': '#ff9800',
        'Shipped': '#9c27b0',
        'Delivered': '#4caf50',
        'Cancelled': '#f44336'
      }
    };

    const colors = type === 'payment' ? statusColors.payment : statusColors.order;
    return colors[status] || '#757575';
  };

  // View Order Details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className={styles.orderSection}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>📦 Order Management</h2>
          <div className={styles.stats}>
            <span>Total Orders: {pagination.total}</span>
          </div>
        </div>
        <button 
          className={styles.refreshBtn} 
          onClick={() => fetchOrders()}
          disabled={loading}
        >
          <FaSync className={loading ? styles.spinning : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Section with Search */}
      <div className={styles.filtersContainer}>
        {/* Search by Order ID */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchInputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search by Order ID..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            {searchOrderId && (
              <button 
                className={styles.clearSearchBtn}
                onClick={clearSearch}
                type="button"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button 
            className={styles.searchBtn}
            onClick={handleSearchOrder}
            disabled={!searchOrderId.trim() || loading}
          >
            Search
          </button>
        </div>

        {/* Active Search Indicator */}
        {filters.order_id && (
          <div className={styles.searchActive}>
            <span>🔍 Searching for Order ID: <strong>{filters.order_id}</strong></span>
            <button onClick={clearSearch} className={styles.clearSearchActiveBtn}>
              <FaTimes /> Clear
            </button>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Payment Status</label>
            <select
              value={filters.payment_status}
              onChange={(e) => handleFilterChange('payment_status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Order Status</label>
            <select
              value={filters.order_status}
              onChange={(e) => handleFilterChange('order_status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button className={styles.clearBtn} onClick={clearFilters}>
            <FaTimes /> Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className={styles.errorClose}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      )}

      {/* Orders Table/Grid */}
      {!loading && !error && (
        <>
          {/* Desktop Table View */}
          <div className={styles.tableContainer}>
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Order Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.noOrders}>
                      {filters.order_id ? (
                        <div className={styles.noOrderFound}>
                          <p>❌ No order found with ID: <strong>{filters.order_id}</strong></p>
                          <p className={styles.hint}>Please check the Order ID and try again</p>
                          <button 
                            className={styles.clearSearchBtnInline}
                            onClick={clearSearch}
                          >
                            <FaTimes /> Clear Search
                          </button>
                        </div>
                      ) : (
                        'No orders found'
                      )}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className={styles.orderId}>{order.order_id || order._id?.slice(-6)}</span>
                        {filters.order_id && order.order_id === filters.order_id && (
                          <span className={styles.searchMatchBadge}>✓ Found</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.itemsInfo}>
                          <span>{order.items?.length || 0} items</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.amountInfo}>
                          <strong>₹{order.final_payable_amount?.toFixed(2) || '0.00'}</strong>
                        </div>
                      </td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{ 
                            backgroundColor: getStatusBadge(order.payment_status, 'payment'),
                            color: '#fff'
                          }}
                        >
                          {order.payment_status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{ 
                            backgroundColor: getStatusBadge(order.order_status, 'order'),
                            color: '#fff'
                          }}
                        >
                          {order.order_status || 'N/A'}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <button 
                          className={styles.viewBtn}
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className={styles.mobileCardContainer}>
            {orders.length === 0 ? (
              <div className={styles.noOrdersCard}>
                {filters.order_id ? (
                  <div className={styles.noOrderFound}>
                    <p>❌ No order found with ID: <strong>{filters.order_id}</strong></p>
                    <p className={styles.hint}>Please check the Order ID and try again</p>
                    <button 
                      className={styles.clearSearchBtnInline}
                      onClick={clearSearch}
                    >
                      <FaTimes /> Clear Search
                    </button>
                  </div>
                ) : (
                  'No orders found'
                )}
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderCardHeader}>
                    <div className={styles.orderCardId}>
                      <FaTag className={styles.cardIcon} />
                      <span className={styles.orderId}>{order.order_id || order._id?.slice(-6)}</span>
                      {filters.order_id && order.order_id === filters.order_id && (
                        <span className={styles.searchMatchBadge}>✓ Found</span>
                      )}
                    </div>
                    <div className={styles.orderCardStatus}>
                      <span 
                        className={styles.statusBadge}
                        style={{ 
                          backgroundColor: getStatusBadge(order.order_status, 'order'),
                          color: '#fff'
                        }}
                      >
                        {order.order_status || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.orderCardBody}>
                    <div className={styles.orderCardRow}>
                      <span className={styles.cardLabel}>Items:</span>
                      <span className={styles.cardValue}>{order.items?.length || 0} items</span>
                    </div>
                    <div className={styles.orderCardRow}>
                      <span className={styles.cardLabel}>Total Amount:</span>
                      <span className={styles.cardAmount}>₹{order.final_payable_amount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className={styles.orderCardRow}>
                      <span className={styles.cardLabel}>Payment:</span>
                      <span 
                        className={styles.statusBadge}
                        style={{ 
                          backgroundColor: getStatusBadge(order.payment_status, 'payment'),
                          color: '#fff'
                        }}
                      >
                        {order.payment_status || 'N/A'}
                      </span>
                    </div>
                    <div className={styles.orderCardRow}>
                      <span className={styles.cardLabel}>Date:</span>
                      <span className={styles.cardValue}>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className={styles.orderCardFooter}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleViewOrder(order)}
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={styles.pageBtn}
              >
                Previous
              </button>
              
              <span className={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* View Order Modal */}
      {showModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={handleCloseModal}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default OrderSection;