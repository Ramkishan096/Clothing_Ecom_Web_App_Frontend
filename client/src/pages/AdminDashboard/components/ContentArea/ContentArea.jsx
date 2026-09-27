import DashboardSection from "../sections/DashboardSection/DashboardSection";
import OrderSection from "../sections/OrderSection/OrderSection";
import ProductSection from "../sections/ProductSection/ProductSection";
import SettingSection from "../sections/SettingSection/SettingSection";
import UserSection from "../sections/UserSection/UserSection";
import styles from "./ContentArea.module.css";


const ContentArea = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection/>;
      case "products":
        return <ProductSection/>;
      case "orders":
        return <OrderSection/>;
      case "users":
        return <UserSection/>
      case "settings":
        return <SettingSection/>;
      default:
        return <DashboardSection/>;
    }
  };

  return (
    <main className={styles.contentArea}>
      {renderSection()}
    </main>
  );
};

export default ContentArea;