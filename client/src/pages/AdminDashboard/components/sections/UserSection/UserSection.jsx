import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaUser, 
  FaUsers, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUserCheck,
  FaUserSlash,
  FaUserClock,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUserPlus,
  FaSpinner,
  FaTimes,
  FaSave,
  FaUserCircle,
  FaInfoCircle,
  FaSync,
  FaMapMarkerAlt,
  FaShoppingBag
} from 'react-icons/fa';
import styles from "./UserSection.module.css";
import api from '../../../../../api/axios';

const UserSection = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', reason: '' });
  const [updating, setUpdating] = useState(false);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch users with pagination and filters
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { page, limit, search, role, status, sortBy, sortOrder } = filters;
      const response = await api.get(
        `/admin/users?page=${page}&limit=${limit}&search=${search}&role=${role}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`  
      );
      
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 500),
    []
  );

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await api.get('/admin/users/stats');
      setUserStats(response.data.data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  // Fetch users and stats on component mount and filter change
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [fetchUsers]);

  // Fetch single user details
  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.data);
      setShowUserModal(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      alert('Failed to fetch user details');
    }
  };

  // Update user status
  const updateUserStatus = async (userId) => {
    try {
      setUpdating(true);
      await api.post(
        `/admin/users/${userId}`,
        {
          status: statusUpdate.status,
          reason: statusUpdate.reason
        }        
      );
      
      await fetchUsers();
      await fetchUserStats();
      
      setShowStatusModal(false);
      setStatusUpdate({ status: '', reason: '' });
      alert('User status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setUpdating(true);
      await api.delete(`/admin/users/${userId}`);
      
      await fetchUsers();
      await fetchUserStats();
      
      setShowDeleteModal(false);
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUpdating(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'active': '#4CAF50',
      'inactive': '#FF9800',
      'suspended': '#F44336'
    };
    return colors[status] || '#9E9E9E';
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      'admin': '#E53935',
      'buyer': '#5C6BC0',
      'vendor': '#43A047'
    };
    return colors[role] || '#9E9E9E';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FaUserCheck />;
      case 'inactive': return <FaUserClock />;
      case 'suspended': return <FaUserSlash />;
      default: return <FaUser />;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.userSection}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <FaUsers className={styles.titleIcon} /> User Management
          </h1>
          <p className={styles.subtitle}>Manage all users of your platform</p>
        </div>
        <button className={styles.refreshBtn} onClick={() => { fetchUsers(); fetchUserStats(); }}>
          <FaSync className={styles.refreshIcon} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: '#E8EAF6', color: '#5C6BC0' }}>
              <FaUsers />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Users</p>
              <h2 className={styles.statValue}>{userStats.overview.total}</h2>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: '#E8F5E9', color: '#43A047' }}>
              <FaUserCheck />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Active</p>
              <h2 className={styles.statValue}>{userStats.overview.active}</h2>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: '#FFF3E0', color: '#FF9800' }}>
              <FaUserClock />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Inactive</p>
              <h2 className={styles.statValue}>{userStats.overview.inactive}</h2>
            </div>
          </div>
           <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: '#FFEBEE', color: '#E53935' }}>
              <FaUserSlash />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Suspended</p>
              <h2 className={styles.statValue}>{userStats.overview.suspended}</h2>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: '#F3E5F5', color: '#8E24AA' }}>
              <FaUserPlus />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>New This Week</p>
              <h2 className={styles.statValue}>{userStats.newUsers.thisWeek}</h2>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className={styles.filterSection}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button 
              className={styles.clearBtn}
              onClick={() => {
                setSearchTerm('');
                setFilters({ ...filters, search: '', page: 1 });
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className={styles.filterWrapper}>
          <div className={styles.filterGroup}>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="firstName">Sort by Name</option>
            </select>
          </div>

          <button
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
            className={styles.sortBtn}
            title={filters.sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {filters.sortOrder === 'desc' ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
      </div>

      {/* User Table - Desktop */}
      {error ? (
        <div className={styles.errorContainer}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <p>{error}</p>
          <button onClick={fetchUsers} className={styles.retryBtn}>Retry</button>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className={styles.desktopView}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.emptyState}>
                        <FaUsers className={styles.emptyIcon} />
                        <p>No users found</p>
                        <span>Try adjusting your filters</span>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {user.firstName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className={styles.userName}>
                                {user.firstName} {user.lastName}
                              </div>
                              {/* <div className={styles.userId}>{user.userId}</div> */}
                            </div>
                          </div>
                        </td>
                        <td className={styles.mobile}>
                          <FaPhone className={styles.iconSmall} />
                          {user.mobile || 'N/A'}
                        </td>
                        <td>
                          <span 
                            className={styles.statusBadge}
                            style={{ background: getStatusColor(user.status || 'active') }}
                          >
                            {getStatusIcon(user.status || 'active')}
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className={styles.date}>
                          <FaCalendarAlt className={styles.iconSmall} />
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => fetchUserDetails(user.userId)}
                              className={styles.actionBtn}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowStatusModal(true);
                                setStatusUpdate({ status: '', reason: '' });
                              }}
                              className={styles.actionBtn}
                              title="Update Status"
                            >
                              <FaEdit />
                            </button>
                            {/* <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              title="Delete User"
                            >
                              <FaTrash />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View - Cards */}
          <div className={styles.mobileView}>
            {users.length === 0 ? (
              <div className={styles.emptyStateCard}>
                <FaUsers className={styles.emptyIcon} />
                <p>No users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user._id} className={styles.userCard}>
                  <div className={styles.userCardHeader}>
                    <div className={styles.userCardAvatar}>
                      {user.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className={styles.userCardInfo}>
                      <div className={styles.userCardName}>
                        {user.firstName} {user.lastName}
                      </div>
                      {/* <div className={styles.userCardId}>{user.userId}</div> */}
                    </div>
                    <span 
                      className={styles.statusBadgeSmall}
                      style={{ background: getStatusColor(user.status || 'active') }}
                    >
                      {user.status || 'active'}
                    </span>
                  </div>
                  
                  <div className={styles.userCardBody}>
                    <div className={styles.userCardRow}>
                      <FaPhone className={styles.iconSmall} />
                      <span>{user.mobile || 'N/A'}</span>
                    </div>
                    <div className={styles.userCardRow}>
                      <FaCalendarAlt className={styles.iconSmall} />
                      <span>Joined: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.userCardActions}>
                    <button
                      onClick={() => fetchUserDetails(user.userId)}
                      className={styles.cardActionBtn}
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowStatusModal(true);
                        setStatusUpdate({ status: '', reason: '' });
                      }}
                      className={styles.cardActionBtn}
                    >
                      <FaEdit /> Status
                    </button>
                    {/* <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className={`${styles.cardActionBtn} ${styles.cardDeleteBtn}`}
                    >
                      <FaTrash /> Delete
                    </button> */}
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
                disabled={!pagination.hasPrev}
                className={styles.pageBtn}
              >
                <FaChevronLeft />
              </button>
              <span className={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className={styles.pageBtn}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <FaUserCircle className={styles.modalIcon} /> User Details
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowUserModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.userProfile}>
                <div className={styles.profileAvatar}>
                  {selectedUser.user.firstName?.charAt(0) || 'U'}
                </div>
                <div className={styles.profileInfo}>
                  <h3>{selectedUser.user.firstName} {selectedUser.user.lastName}</h3>
                  <p className={styles.profileId}>{selectedUser.user.userId}</p>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <FaEnvelope className={styles.detailIcon} />
                  <div>
                    <label>Email</label>
                    <p>{selectedUser.user.email || 'N/A'}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaPhone className={styles.detailIcon} />
                  <div>
                    <label>Mobile</label>
                    <p>{selectedUser.user.mobile || 'N/A'}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaUser className={styles.detailIcon} />
                  <div>
                    <label>Role</label>
                    <p>
                      <span 
                        className={styles.roleBadge}
                        style={{ background: getRoleColor(selectedUser.user.role) }}
                      >
                        {selectedUser.user.role || 'buyer'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaCheckCircle className={styles.detailIcon} />
                  <div>
                    <label>Status</label>
                    <p>
                      <span 
                        className={styles.statusBadge}
                        style={{ background: getStatusColor(selectedUser.user.status || 'active') }}
                      >
                        {selectedUser.user.status || 'active'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaCalendarAlt className={styles.detailIcon} />
                  <div>
                    <label>Joined</label>
                    <p>{formatDateTime(selectedUser.user.createdAt)}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaInfoCircle className={styles.detailIcon} />
                  <div>
                    <label>Verified</label>
                    <p>{selectedUser.user.isVerified ? '✅ Yes' : '❌ No'}</p>
                  </div>
                </div>
              </div>

              {selectedUser.orders.total > 0 && (
                <div className={styles.orderSummary}>
                  <h4><FaShoppingBag className={styles.iconSmall} /> Order Summary</h4>
                  <div className={styles.orderStats}>
                    <div className={styles.orderStat}>
                      <span>Total Orders</span>
                      <strong>{selectedUser.orders.total}</strong>
                    </div>
                    <div className={styles.orderStat}>
                      <span>Total Spent</span>
                      <strong>₹{selectedUser.orders.totalSpent}</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.user.addresses && selectedUser.user.addresses.length > 0 && (
                <div className={styles.addressSection}>
                  <h4><FaMapMarkerAlt className={styles.iconSmall} /> Addresses</h4>
                  {selectedUser.user.addresses.map((addr, index) => (
                    <div key={index} className={styles.addressCard}>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.pin_code}</p>
                      {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowStatusModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <FaEdit className={styles.modalIcon} /> Update Status
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowStatusModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.statusForm}>
                <div className={styles.formGroup}>
                  <label>User</label>
                  <p className={styles.formUser}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Reason (Optional)</label>
                  <textarea
                    value={statusUpdate.reason}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, reason: e.target.value })}
                    className={styles.formTextarea}
                    placeholder="Enter reason for status change..."
                    rows="3"
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateUserStatus(selectedUser.userId)}
                    disabled={!statusUpdate.status || updating}
                    className={styles.submitBtn}
                  >
                    {updating ? <FaSpinner className={styles.spinner} /> : <FaSave />}
                    {updating ? ' Updating...' : ' Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <FaTrash className={styles.modalIcon} style={{ color: '#F44336' }} /> Delete User
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowDeleteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.deleteConfirmation}>
                <FaExclamationTriangle className={styles.deleteWarningIcon} />
                <h3>Are you sure you want to delete this user?</h3>
                <p>This action cannot be undone. All user data will be permanently removed.</p>
                <div className={styles.deleteUserInfo}>
                  <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                  <p><strong>User ID:</strong> {selectedUser.userId}</p>
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(selectedUser.userId)}
                    disabled={updating}
                    className={styles.deleteBtn}
                  >
                    {updating ? <FaSpinner className={styles.spinner} /> : <FaTrash />}
                    {updating ? ' Deleting...' : ' Delete User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSection;