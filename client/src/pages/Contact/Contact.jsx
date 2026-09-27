import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MapPin, title: 'Visit Us', details: '123 Fashion Street, Mumbai - 400001, India' },
    { icon: Phone, title: 'Call Us', details: '+91 98765 43210', action: 'Call Now' },
    { icon: Mail, title: 'Email Us', details: 'support@blackstudio.com', action: 'Send Email' },
    { icon: Clock, title: 'Working Hours', details: 'Mon - Sat: 10:00 AM - 8:00 PM' },
  ];

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className={styles.container}>
        {/* Contact Info Cards */}
        <div className={styles.infoGrid}>
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <Icon size={24} />
                </div>
                <h3>{info.title}</h3>
                <p>{info.details}</p>
                {info.action && (
                  <button className={styles.infoBtn}>{info.action}</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form & Map */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Message *</label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                <Send size={18} />
                Send Message
              </button>
              
              {submitted && (
                <div className={styles.successMsg}>
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
          
          <div className={styles.mapContainer}>
            <h2>Find Us Here</h2>
            <div className={styles.map}>
              <iframe
                title="Store Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.093679849015!2d72.83117631484123!3d19.075787755651545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9a4d5b5c5b5%3A0x3b5c5b5c5b5c5b5c!2sMumbai!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            
            <div className={styles.socialLinks}>
              <h3>Connect With Us</h3>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}>
                  <MessageCircle size={20} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Contact;