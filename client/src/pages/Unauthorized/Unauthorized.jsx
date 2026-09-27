import { Link } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <Link to="/" className={styles.homeLink}>
          Go Back Home
        </Link>
      </div>
    </div>
    
  );
};

export default Unauthorized;