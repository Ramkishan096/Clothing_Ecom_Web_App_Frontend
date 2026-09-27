import styles from "./Sidebar.module.css";
import { 
  FiLayout, 
  FiBox, 
  FiShoppingCart, 
  FiSettings,
  FiUser
} from "react-icons/fi";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiLayout size={22} /> },
    { id: "products", label: "Products", icon: <FiBox size={22} /> },
    { id: "orders", label: "Orders", icon: <FiShoppingCart size={22} /> },
    { id: "users",label:"User",icon: <FiUser size={22}/>}
    // { id: "settings", label: "Settings", icon: <FiSettings size={22} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${
              activeSection === item.id ? styles.active : ""
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            {activeSection === item.id && <span className={styles.activeIndicator}></span>}
          </div>
        ))}
      </nav> 
    </aside>
  );

};

export default Sidebar;

