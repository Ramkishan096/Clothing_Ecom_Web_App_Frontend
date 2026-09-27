import { useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.css';


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        <div className={styles.errorCode}>
          <span>4</span>
          <span className={styles.zero}>0</span>
          <span>4</span>
        </div>
        
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button onClick={() => navigate('/')} className={styles.homeBtn}>
            <Home size={18} />
            Back to Home
          </button>
          <button onClick={() => navigate('/products')} className={styles.shopBtn}>
            <ShoppingBag size={18} />
            Continue Shopping
          </button>
        </div>
        
        <div className={styles.suggestions}>
          <h3>You might be looking for:</h3>
          <div className={styles.suggestionLinks}>
            <button onClick={() => navigate('/products?category=T-Shirts')}>T-Shirts</button>
            <button onClick={() => navigate('/products?category=Jeans')}>Jeans</button>
            <button onClick={() => navigate('/products?category=Jackets')}>Jackets</button>
            <button onClick={() => navigate('/products?category=Hoodies')}>Hoodies</button>
          </div>
        </div>
        
        <div className={styles.illustration}>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#222222" strokeWidth="2" fill="none"/>
            <path d="M70 70 L130 130 M130 70 L70 130" stroke="#222222" strokeWidth="2"/>
            <circle cx="100" cy="100" r="40" stroke="#333333" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;