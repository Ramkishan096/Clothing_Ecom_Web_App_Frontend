import { Send } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About Section */}
          <div className={styles.section}>
            <h3>About Us</h3>
            <p>
              BLACK STUDIO is a premium fashion destination for men and boys.
              Discover stylish clothing designed for comfort, confidence, and
              everyday wear.
            </p>

            <div className={styles.social}>
              <a href="#" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>

              {/* <a href="#" aria-label="Twitter">
                <FaTwitter size={18} />
              </a> */}

              <a href="#" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>

              <a href="#" aria-label="YouTube">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              {/* <li>
                <a href="/track-order">Track Order</a>
              </li>               */}
              
              <li>
                <a href="/faq">FAQs</a>
              </li>
              <li>
                <a href="/returns">Returns Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>
              © {new Date().getFullYear()} BLACK STUDIO. All Rights Reserved.  <a href="/privacy">Privacy Policy</a>
            </p>
              
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
