import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { useAppSelector } from "../../redux/hooks";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import styles from "./BottomNavigation.module.css";

const BottomNavigation = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sirf authentication status check karo
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Navigation items - Account icon same rahega
  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/" 
    },
    { 
      icon: Grid, 
      label: "Categories", 
      path: "/category" 
    },
    { 
      icon: ShoppingCart, 
      label: "Cart", 
      path: "/cart", 
      badge: cartCount 
    },
    { 
      icon: User,  // ✅ Same User icon always
      label: "Account",  // ✅ Same label always
      path: isAuthenticated ? "/profile" : null,  // ✅ Login check
      isAccount: true,
    },
  ];

  const handleNavigation = (item) => {
    // 🔐 Account item - Check login state
    if (item.isAccount) {
      if (isAuthenticated) {
        // ✅ Logged in - Go to Profile
        navigate('/profile');
      } else {
        // ❌ Not logged in - Open login modal
        onLoginClick();
      }
      return;
    }

    // 🏠 Home scroll to top
    if (item.path === "/" && location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    // 🧭 Normal navigation
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.path ? location.pathname === item.path : false;

        return (
          <button
            key={item.label}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            onClick={() => handleNavigation(item)}
          >
            <Icon size={22} />
            <span>{item.label}</span>

            {item.badge > 0 && (
              <span className={styles.badge}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigation;