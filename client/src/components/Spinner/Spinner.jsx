import styles from './Spinner.module.css';

const Spinner = ({ 
  size = 'medium', 
  color = 'primary', 
  fullPage = false,
  text = '',
  overlay = false,
  variant = 'circle' // 'circle' | 'dots' | 'pulse'
}) => {
  const sizeMap = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const colorMap = {
    primary: styles.primary,
    white: styles.white,
    blue: styles.blue,
    gradient: styles.gradient,
  };

  const getSpinnerContent = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`${styles.dotsLoader} ${sizeMap[size]}`}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={`${styles.pulseLoader} ${sizeMap[size]}`}>
            <div className={styles.pulse}></div>
          </div>
        );
      default:
        return (
          <div className={`${styles.spinner} ${sizeMap[size]} ${colorMap[color]}`}>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
          </div>
        );
    }
  };

  if (fullPage) {
    return (
      <div className={styles.fullPageContainer}>
        <div className={styles.fullPageContent}>
          {getSpinnerContent()}
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          {getSpinnerContent()}
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {getSpinnerContent()}
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Spinner;