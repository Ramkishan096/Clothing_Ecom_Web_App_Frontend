import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Check,
  X,
  ShoppingCart,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectCustomer, clearCustomer } from "../../redux/slices/authSlice";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Profile.module.css";
import api from "../../api/axios";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const customer = useAppSelector(selectCustomer);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
  });

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

  const getUserName = () => {
    if (!customer) return "Account";
    const fullName =
      `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
    return fullName || customer.mobile || "Account";
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);

      const response = await api.post("/auth/profile/update", {
        first_name: editData.firstName,
        last_name: editData.lastName,
        email: editData.email,
      });

      if (response.data.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (!isConfirmed) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      dispatch(clearCustomer());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      icon: ShoppingBag,
      label: "My Orders",
      onClick: () => navigate("/my-order"),
      badge: "View all",
    },
    {
      icon: ShoppingCart,
      label: "My Carts",
      onClick: () => navigate("/cart"),
      badge: "Go to cart",
    },
  ];

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.profileHeaderContent}>
            <div className={styles.profileAvatarWrapper}>
              <div className={styles.profileAvatar}>{getUserInitials()}</div>
            </div>
            <div className={styles.profileInfo}>
              {!isEditing ? (
                <>
                  <div className={styles.profileNameWrapper}>
                    <h1 className={styles.profileName}>{getUserName()}</h1>
                    <button
                      className={styles.editButton}
                      onClick={handleEditToggle}
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  {/* <p className={styles.profileRole}>
                    {customer?.role || "Customer"}
                  </p> */}
                  <div className={styles.profileDetails}>
                    {customer?.mobile && (
                      <span className={styles.profileDetail}>
                        <Phone size={14} />
                        {customer.mobile}
                      </span>
                    )}
                    {customer?.email && (
                      <span className={styles.profileDetail}>
                        <Mail size={14} />
                        {customer.email}
                      </span>
                    )}
                    {customer?.createdAt && (
                      <span className={styles.profileDetail}>
                        <Calendar size={14} />
                        Joined{" "}
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.editForm}>
                  <h1 className={styles.editTitle}>Edit Profile</h1>
                  <div className={styles.editFormGroup}>
                    <div className={styles.editField}>
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleInputChange}
                        className={styles.editInput}
                        placeholder="First Name"
                      />
                    </div>
                    <div className={styles.editField}>
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleInputChange}
                        className={styles.editInput}
                        placeholder="Last Name"
                      />
                    </div>
                    <div className={styles.editField}>
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className={styles.editInput}
                        placeholder="Email"
                      />
                    </div>
                    <div className={styles.editActions}>
                      <button
                        className={styles.saveButton}
                        onClick={handleProfileUpdate}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          "Saving..."
                        ) : (
                          <>
                            <Check size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.menuSection}>
          <h2 className={styles.menuTitle}>Account Settings</h2>
          <div className={styles.menuList}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={styles.menuItem}
                  onClick={item.onClick}
                >
                  <div className={styles.menuItemLeft}>
                    <Icon size={20} className={styles.menuIcon} />
                    <span className={styles.menuLabel}>{item.label}</span>
                  </div>
                  <div className={styles.menuItemRight}>
                    <span className={styles.menuBadge}>{item.badge}</span>
                    <ChevronRight size={16} className={styles.menuArrow} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={20} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>

        <div className={styles.versionInfo}>
          <p>Black Studio v1.0.0</p>
          <p>© 2026 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
