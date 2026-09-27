import  { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaBox, 
  FaRupeeSign,
  FaClock,
  FaSync,
  FaPhone,
  FaCalendarAlt,
  FaUser,
  FaTruck,
  FaTag,
  FaCreditCard
} from 'react-icons/fa';
import styles from "./DashboardSection.module.css";
import api from '../../../../../api/axios';

const DashboardSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        '/admin/stats',       
      );
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Placed': '#FF9800',
      'Processing': '#2196F3',
      'Shipped': '#4CAF50',
      'Delivered': '#2E7D32',
      'Cancelled': '#F44336',
      'Returned': '#FF5722'
    };
    return colors[status] || '#9E9E9E';
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    return status === 'Paid' ? '#4CAF50' : '#FF9800';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaClock className={styles.errorIcon} />
        <p>{error}</p>
        <button onClick={fetchDashboardStats}>Retry</button>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, recentOrders, recentUsers } = stats;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your store overview</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchDashboardStats}>
          <FaSync className={styles.refreshIcon} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#E8EAF6', color: '#5C6BC0' }}>
            <FaUsers />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Users</p>
            <h2 className={styles.statValue}>{overview.totalUsers}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#FFF3E0', color: '#FF9800' }}>
            <FaShoppingCart />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Orders</p>
            <h2 className={styles.statValue}>{overview.totalOrders}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#E8F5E9', color: '#43A047' }}>
            <FaBox />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Products</p>
            <h2 className={styles.statValue}>{overview.totalProducts}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#F3E5F5', color: '#8E24AA' }}>
            <FaRupeeSign />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Revenue</p>
            <h2 className={styles.statValue}>{formatCurrency(overview.totalRevenue)}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#FFEBEE', color: '#E53935' }}>
            <FaClock />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Pending Orders</p>
            <h2 className={styles.statValue}>{overview.pendingOrders}</h2>
          </div>
        </div>
      </div>

      {/* Recent Orders - Card Layout */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <FaTruck className={styles.sectionIcon} /> Recent Orders
          </h2>
        </div>
        
        {/* Desktop Table View */}
        <div className={styles.desktopView}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className={styles.orderId}>{order.order_id}</td>
                    <td>
                      <div className={styles.customerName}>
                        {order.shippingAddress?.first_name} {order.shippingAddress?.last_name}
                      </div>
                    </td>
                    <td className={styles.mobile}>
                      <FaPhone className={styles.iconSmall} />
                      {order.shippingAddress?.phone || order.guest_mobile_no || 'N/A'}
                    </td>
                    <td className={styles.amount}>
                      {formatCurrency(order.final_payable_amount)}
                    </td>
                    <td>
                      <span 
                        className={styles.badge}
                        style={{ background: getPaymentStatusColor(order.payment_status) }}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td>
                      <span 
                        className={styles.badge}
                        style={{ background: getStatusColor(order.order_status) }}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className={styles.date}>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className={styles.mobileView}>
          {recentOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderCardHeader}>
                <span className={styles.orderId}>{order.order_id}</span>
                <span 
                  className={styles.orderStatusBadge}
                  style={{ background: getStatusColor(order.order_status) }}
                >
                  {order.order_status}
                </span>
              </div>
              <div className={styles.orderCardBody}>
                <div className={styles.orderCardRow}>
                  <FaUser className={styles.iconSmall} />
                  <span>{order.shippingAddress?.first_name} {order.shippingAddress?.last_name}</span>
                </div>
                <div className={styles.orderCardRow}>
                  <FaPhone className={styles.iconSmall} />
                  <span>{order.shippingAddress?.phone || order.guest_mobile_no || 'N/A'}</span>
                </div>
                <div className={styles.orderCardRow}>
                  <FaRupeeSign className={styles.iconSmall} />
                  <span className={styles.amountText}>{formatCurrency(order.final_payable_amount)}</span>
                </div>
                <div className={styles.orderCardRow}>
                  <FaCreditCard className={styles.iconSmall} />
                  <span 
                    className={styles.paymentBadge}
                    style={{ background: getPaymentStatusColor(order.payment_status) }}
                  >
                    {order.payment_status}
                  </span>
                </div>
                <div className={styles.orderCardRow}>
                  <FaCalendarAlt className={styles.iconSmall} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users - Card Layout */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <FaUser className={styles.sectionIcon} /> Recent Users
          </h2>
        </div>
        
        {/* Desktop Grid View */}
        <div className={styles.desktopView}>
          <div className={styles.userGrid}>
            {recentUsers.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div className={styles.userDetail}>
                    <FaPhone className={styles.iconSmall} /> {user.mobile || 'No mobile'}
                  </div>
                  <div className={styles.userDate}>
                    <FaCalendarAlt className={styles.iconSmall} /> Joined: {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className={styles.mobileView}>
          {recentUsers.map((user) => (
            <div key={user._id} className={styles.userCardMobile}>
              <div className={styles.userAvatarMobile}>
                {user.firstName?.charAt(0) || 'U'}
              </div>
              <div className={styles.userInfoMobile}>
                <div className={styles.userNameMobile}>
                  {user.firstName} {user.lastName}
                </div>
                <div className={styles.userDetailMobile}>
                  <FaPhone className={styles.iconSmall} /> {user.mobile || 'No mobile'}
                </div>
                <div className={styles.userDateMobile}>
                  <FaCalendarAlt className={styles.iconSmall} /> {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;