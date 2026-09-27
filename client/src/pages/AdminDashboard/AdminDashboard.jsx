import styles from "./AdminDashboard.module.css";
import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ContentArea from "./components/ContentArea/ContentArea";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className={styles.adminDashboard}>
      <Header />
      <div className={styles.mainContainer}>
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        <ContentArea activeSection={activeSection} />
      </div>
    </div>
  );
};

export default AdminDashboard;