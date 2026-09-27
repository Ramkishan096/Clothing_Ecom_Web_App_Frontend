import { RefreshCw, Shield, Clock, CheckCircle, AlertCircle} from 'lucide-react';
import styles from './ReturnPolicy.module.css';

const ReturnPolicy = () => {
 
  return (
    <div className={styles.returnPolicyPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <RefreshCw size={48} />
          <h1>Return Policy</h1>
          <p>Our commitment to your satisfaction. Easy returns, guaranteed.</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Quick Info */}
        <div className={styles.quickInfo}>
          <div className={styles.infoCard}>
            <Clock size={24} />
            <h3>30 Days</h3>
            <p>Return Window</p>
          </div>
          <div className={styles.infoCard}>
            <Shield size={24} />
            <h3>Free Returns</h3>
            <p>Within India</p>
          </div>
          <div className={styles.infoCard}>
            <CheckCircle size={24} />
            <h3>100% Guarantee</h3>
            <p>Satisfaction</p>
          </div>
          <div className={styles.infoCard}>
            <RefreshCw size={24} />
            <h3>Easy Process</h3>
            <p>Hassle-Free</p>
          </div>
        </div>

        {/* Return Policy Details */}
        <div className={styles.policyContent}>
          <div className={styles.policySection}>
            <h2>Return Eligibility</h2>
            <div className={styles.eligibilityGrid}>
              <div className={styles.eligibilityItem}>
                <div className={styles.eligibilityIcon}>
                  <CheckCircle size={20} className={styles.green} />
                </div>
                <div>
                  <h4>Items in Original Condition</h4>
                  <p>Products must be unused, unwashed, and with all original tags and packaging intact.</p>
                </div>
              </div>
              <div className={styles.eligibilityItem}>
                <div className={styles.eligibilityIcon}>
                  <CheckCircle size={20} className={styles.green} />
                </div>
                <div>
                  <h4>Within 30 Days</h4>
                  <p>Return requests must be initiated within 30 days of delivery date.</p>
                </div>
              </div>
              <div className={styles.eligibilityItem}>
                <div className={styles.eligibilityIcon}>
                  <AlertCircle size={20} className={styles.orange} />
                </div>
                <div>
                  <h4>Non-Returnable Items</h4>
                  <p>Underwear, socks, swimwear, and personalized items cannot be returned for hygiene reasons.</p>
                </div>
              </div>
              <div className={styles.eligibilityItem}>
                <div className={styles.eligibilityIcon}>
                  <AlertCircle size={20} className={styles.orange} />
                </div>
                <div>
                  <h4>Final Sale Items</h4>
                  <p>Items marked as "Final Sale" or "Clearance" are not eligible for returns.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          {/* <div className={styles.policySection}>
            <h2>Return Process</h2>
            <div className={styles.processSteps}>
              {policySteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className={styles.stepItem}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepIcon}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.stepContent}>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}

          {/* Refund Policy */}
          <div className={styles.policySection}>
            <h2>Refund Policy</h2>
            <div className={styles.refundGrid}>
              <div className={styles.refundItem}>
                <h3>Refund Timeline</h3>
                <p>Refunds are processed within 3-5 business days after we receive and inspect your return.</p>
              </div>
              <div className={styles.refundItem}>
                <h3>Payment Method</h3>
                <p>Refunds are issued to your original payment method. For cash on delivery orders, refunds are processed via bank transfer.</p>
              </div>
              <div className={styles.refundItem}>
                <h3>Partial Refunds</h3>
                <p>Partial refunds may be issued for items that show signs of wear, are missing tags, or are returned after the 30-day window.</p>
              </div>
              <div className={styles.refundItem}>
                <h3>Exchange Option</h3>
                <p>Prefer an exchange instead of a refund? We offer free exchanges for size or color changes on eligible items.</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className={styles.notesSection}>
            <h2>Important Notes</h2>
            <div className={styles.notesList}>
              <div className={styles.noteItem}>
                <AlertCircle size={18} className={styles.noteIcon} />
                <p>Items must be returned in their original packaging with all tags attached.</p>
              </div>
              <div className={styles.noteItem}>
                <AlertCircle size={18} className={styles.noteIcon} />
                <p>Return shipping is free for all orders within India. For international returns, shipping costs are the customer's responsibility.</p>
              </div>
              <div className={styles.noteItem}>
                <AlertCircle size={18} className={styles.noteIcon} />
                <p>Please allow 7-10 business days for returns to be processed after delivery.</p>
              </div>
              <div className={styles.noteItem}>
                <AlertCircle size={18} className={styles.noteIcon} />
                <p>Keep your tracking number until your refund is processed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        {/* <div className={styles.supportSection}>
          <h2>Need Help With Returns?</h2>
          <p>Our customer support team is here to assist you with any questions about returns or exchanges.</p>
          <div className={styles.supportButtons}>
            <a href="tel:+919876543210" className={styles.supportBtn}>
              <Phone size={18} />
              Call Us
            </a>
            <a href="mailto:support@blackstudio.com" className={styles.supportBtn}>
              <Mail size={18} />
              Email Us
            </a>
            <button className={styles.supportBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Live Chat
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ReturnPolicy;