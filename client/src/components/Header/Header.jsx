import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, User } from "lucide-react";
import { useAppSelector } from "../../redux/hooks";
import {
  selectIsAuthenticated,
  selectCustomer,
} from "../../redux/slices/authSlice";
import styles from "./Header.module.css";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "../../pages/Profile/ProfileDropdown";

const Header = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const customer = useAppSelector(selectCustomer);
  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getUserInitials = () => {
    console.log("customer.....",customer)
    if (!customer) return "U";
    const first = customer.firstName?.charAt(0) || "";
    const last = customer.lastName?.charAt(0) || "";
    return (
      (first + last).toUpperCase() ||
      customer.mobile?.toString().slice(-2) ||
      "U"
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);
  // console.log("custormer:",customer)

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          {/* Left - Logo */}
          <div className={styles.logo}>
            <Link to="/">
              <h1>
                BLACK<span>STUDIO</span>
              </h1>
              <p>STYLE THAT SPEAKS</p>
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className={styles.nav}>
            <Link to="/">Home</Link>
            <Link to="/category">Categories</Link>
            {/* <Link to="/search?isNewArrival=true">New Arrivals</Link> */}
            <Link to="/search?isPopular=true">Popular Products</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* Right - Icons */}
          <div className={styles.icons}>
            <button
              onClick={() => navigate("/search")}
              className={styles.iconBtn}
            >
              <Search size={20} />
            </button>

            <button
              onClick={() => navigate("/cart")}
              className={styles.cartBtn}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </button>

            {/* Account Button */}
            <div className={styles.accountWrapper} ref={dropdownRef}>
              {isAuthenticated && customer ? (
                <>
                  <button
                    className={`${styles.iconBtn} ${styles.accountBtn}`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Account menu"
                  >
                    <div className={styles.userAvatar}>{getUserInitials()}</div>
                  </button>

                  {/* Profile Dropdown */}
                  {isUserMenuOpen && (
                    <div className={styles.dropdownWrapper}>
                      <ProfileDropdown
                        onClose={() => setIsUserMenuOpen(false)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <button
                  className={`${styles.iconBtn} ${styles.accountBtn}`}
                  onClick={onLoginClick}
                  aria-label="Login"
                >
                  <User size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
