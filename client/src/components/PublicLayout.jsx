// import { Outlet } from "react-router-dom";
// import Header from "./Header/Header";
// import Footer from "./Footer/Footer";
// import BottomNavigation from "./BottomNavigation/BottomNavigation";

// const PublicLayout = () => {
//   return (
//     <>
//       <Header />
//       <Outlet />
//       <Footer />
//       <BottomNavigation />
//     </>
//   );
// };

// export default PublicLayout;




import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import BottomNavigation from "./BottomNavigation/BottomNavigation";
import { LoginModal } from "../LoginModal";

const PublicLayout = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <Header onLoginClick={() => setShowLoginModal(true)} />

      <Outlet />

      <Footer />

      <BottomNavigation
        onLoginClick={() => setShowLoginModal(true)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default PublicLayout;