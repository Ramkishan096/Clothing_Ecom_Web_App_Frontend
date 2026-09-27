import { Shield, Truck, Award, Clock, Heart, Star } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  const features = [
    { icon: Shield, title: 'Premium Quality', description: 'We use only the finest materials for our products' },
    { icon: Truck, title: 'Fast Shipping', description: 'Free express shipping on orders over $100' },
    { icon: Award, title: 'Best in Class', description: 'Award-winning designs and craftsmanship' },
    { icon: Clock, title: '24/7 Support', description: 'Dedicated customer service team' },
  ];

 

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>About BLACK STUDIO</h1>
          <p>STYLE THAT SPEAKS</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Our Story */}
        <div className={styles.storySection}>
          <div className={styles.storyContent}>
            <h2>Our Story</h2>
            <p>Founded in 2020, BLACK STUDIO emerged from a passion for creating timeless fashion that speaks to the modern man. What started as a small boutique has grown into a premium lifestyle brand, celebrated for its minimalist aesthetic and uncompromising quality.</p>
            <p>We believe that clothing is more than just fabric - it's an expression of personality. Our designs blend contemporary trends with classic silhouettes, creating pieces that are both stylish and enduring.</p>
            <p>Today, BLACK STUDIO is recognized as a leading name in men's and boys' fashion, with a commitment to sustainability, ethical production, and customer satisfaction at our core.</p>
          </div>
          <div className={styles.storyImage}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="Our Studio" />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className={styles.missionVision}>
          <div className={styles.mission}>
            <h3>Our Mission</h3>
            <p>To empower individuals through exceptional fashion that combines comfort, style, and quality, while maintaining sustainable and ethical practices.</p>
          </div>
          <div className={styles.vision}>
            <h3>Our Vision</h3>
            <p>To become India's most trusted fashion brand, recognized globally for innovative designs and unparalleled customer experience.</p>
          </div>
        </div>

        {/* Features */}
        <div className={styles.featuresSection}>
          <h2>Why Choose Us</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>   
      </div>
    </div>
  );
};

export default About;