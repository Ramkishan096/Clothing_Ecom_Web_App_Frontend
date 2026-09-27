import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShoppingBag, Truck, RefreshCw} from 'lucide-react';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      icon: ShoppingBag,
      title: 'Orders & Products',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Simply browse our products, select your preferred size and color, add items to your cart, and proceed to checkout. You can place an order without creating an account, but we recommend creating one for a faster checkout experience.'
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'Yes, you can modify or cancel your order within 1 hour of placing it. Contact our customer support team immediately with your order number, and we will assist you.'
        },
        {
          q: 'How do I know if a product is in stock?',
          a: 'Product availability is clearly mentioned on each product page. If a product is out of stock, you will see an "Out of Stock" label. You can also sign up for restock notifications.'
        },
        {
          q: 'What if I receive a damaged or wrong product?',
          a: 'We have a 7-day return policy for damaged or wrong products. Please contact our support team with photos of the product and your order number, and we will arrange a replacement or refund.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      questions: [
        {
          q: 'What are the shipping charges?',
          a: 'We offer FREE shipping on all orders above $100. For orders below $100, shipping charges are calculated based on your location and delivery speed.'
        },
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery takes 3-5 business days. Express delivery (1-2 business days) is available for an additional charge. Delivery times may vary depending on your location.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to over 50 countries worldwide. International shipping charges and delivery times vary by destination. You can check the shipping cost at checkout.'
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this tracking number on our website or the courier partner\'s website to track your order.'
        }
      ]
    },
    {
      icon: RefreshCw,
      title: 'Returns & Exchanges',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy. Items must be unused, unwashed, and in their original packaging with all tags attached. Returns are processed within 3-5 business days.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Log into your account, go to "My Orders", select the order and items you wish to return, and follow the return instructions. You can also contact our support team for assistance.'
        },
        {
          q: 'Do you offer free returns?',
          a: 'Yes, we offer free returns for all orders within India. For international returns, customers are responsible for return shipping charges unless the product is defective.'
        },
        {
          q: 'How long does a refund take?',
          a: 'Once we receive and inspect your return, refunds are processed within 3-5 business days. The refund will be credited to your original payment method.'
        }
      ]
    },
    
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <HelpCircle size={48} />
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to the most common questions about our products, services, and policies.</p>
        </div>
      </div>

      <div className={styles.container}>
      

        {/* FAQ Categories */}
        {faqCategories.map((category, catIndex) => {
          const Icon = category.icon;
          return (
            <div key={catIndex} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <Icon size={24} />
                </div>
                <h2>{category.title}</h2>
              </div>
              
              <div className={styles.questionsList}>
                {category.questions.map((item, qIndex) => {
                  const globalIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div 
                      key={qIndex} 
                      className={`${styles.questionItem} ${isOpen ? styles.open : ''}`}
                    >
                      <button 
                        className={styles.questionButton}
                        onClick={() => toggleQuestion(globalIndex)}
                      >
                        <span className={styles.questionText}>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp size={20} className={styles.icon} />
                        ) : (
                          <ChevronDown size={20} className={styles.icon} />
                        )}
                      </button>
                      {isOpen && (
                        <div className={styles.answer}>
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Still Need Help */}
        {/* <div className={styles.helpSection}>
          <h2>Still Need Help?</h2>
          <p>Our customer support team is here to assist you. Contact us through any of the channels below.</p>
          <div className={styles.helpButtons}>
            <button className={styles.chatBtn}>
              <User size={18} />
              Live Chat
            </button>
            <button className={styles.emailBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Support
            </button>
            <button className={styles.phoneBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Us
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default FAQ;