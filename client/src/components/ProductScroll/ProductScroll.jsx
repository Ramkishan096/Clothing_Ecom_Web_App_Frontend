import styles from "./ProductScroll.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProductScroll = ({ title, products = [], seeAllLink }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        {seeAllLink && (
          <button
            className={styles.seeAllBtn}
            onClick={() => navigate(seeAllLink)}
          >
            See All
          </button>
        )}
      </div>

      <div className={styles.productGrid}>
        {products.map((product, index) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductScroll;
