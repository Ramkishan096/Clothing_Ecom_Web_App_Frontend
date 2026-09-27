import { useNavigate } from "react-router-dom";
import { UserCircle, ShoppingBag, LogOut, ShoppingCart } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectCustomer, clearCustomer } from "../../redux/slices/authSlice";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ProfileDropdown.module.css";

const ProfileDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const customer = useAppSelector(selectCustomer);

  const getUserName = () => {
    if (!customer) return "Account";
    const fullName =
      `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
    return fullName || customer.mobile || "Account";
  };

  const getUserInitials = () => {
    if (!customer) return "U";
    const first = customer.firstName?.charAt(0) || "";
    const last = customer.lastName?.charAt(0) || "";
    return (
      (first + last).toUpperCase() ||
      customer.mobile?.toString().slice(-2) ||
      "U"
    );
  };

  const handleNavigation = (path) => {
    onClose?.();
    navigate(path);
  };

  const handleLogout = async () => {
    // ✅ Browser's built-in confirm dialog
    const isConfirmed = window.confirm("Are you sure you want to logout?");

    // ❌ If user clicks Cancel, stop logout
    if (!isConfirmed) {
      return;
    }

    try {
      await logout();
      dispatch(clearCustomer());
      onClose?.();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { icon: UserCircle, label: "My Profile", path: "/profile" },
    { icon: ShoppingBag, label: "My Orders", path: "/my-order" },
    { icon: ShoppingCart, label: "My Carts", path:"/cart"}
  ];

  return (
    <div className={styles.dropdown}>
      {/* User Info */}
      <div className={styles.dropdownHeader}>
        <div className={styles.avatar}>{getUserInitials()}</div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{getUserName()}</p>
          {/* <p className={styles.userRole}>{customer?.role || "Customer"}</p> */}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Menu Items */}
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            className={styles.dropdownItem}
            onClick={() => handleNavigation(item.path)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}

      <div className={styles.divider} />

      {/* Logout */}
      <button
        className={`${styles.dropdownItem} ${styles.logoutItem}`}
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
