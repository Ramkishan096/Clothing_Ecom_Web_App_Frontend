// import styles from "./Header.module.css";

// const Header = () => {
//   return (
//     <header className={styles.header}>
//       <div className={styles.logo}>
//         <h1>Admin Panel</h1>
//       </div>
//       <div className={styles.headerRight}>
//         {/* <div className={styles.notification}>🔔</div> */}
//         <div className={styles.userInfo}>
//           <span>Admin</span>
//           <img 
//             src="https://via.placeholder.com/40" 
//             alt="Admin" 
//             className={styles.avatar}
//           />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;









// src/pages/AdminDashboard/components/Header/Header.jsx
import styles from "./Header.module.css";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/adminlogin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Admin Panel</h1>
      </div>
      <div className={styles.headerRight}>
        <button 
          className={styles.logoutBtn}
          onClick={() => setShowLogoutConfirm(true)}
          title="Logout"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
        <div className={styles.userInfo}>
          <span>Admin</span>
          <div className={styles.avatar}>
            <FiUser size={20} />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>👋</div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;