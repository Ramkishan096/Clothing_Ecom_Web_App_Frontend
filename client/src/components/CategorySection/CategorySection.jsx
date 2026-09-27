import { useNavigate } from 'react-router-dom';
import styles from './CategorySection.module.css';

const CategorySection = ({ categories }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.categorySection}>
      <h2 className={styles.title}>Shop By Category</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={styles.categoryCard}
            onClick={() => navigate(`/search?category=${category.name}`)}
          >
            <div 
              className={styles.categoryImage}
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div className={styles.overlay}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                {/* <p className={styles.productCount}>{category.count} Products</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;