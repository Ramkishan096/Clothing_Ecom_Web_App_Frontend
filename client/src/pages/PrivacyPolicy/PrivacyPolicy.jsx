import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.policyWrapper}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: January 15, 2025</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Black Studio. We value your privacy and are committed to
            protecting your personal data. This privacy policy explains how we
            collect, use, and safeguard your information when you visit our
            website or use our services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <h3>Personal Data</h3>
          <p>
            We may collect personal identification information including but not
            limited to:
          </p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name</li>
            <li>Payment information</li>
          </ul>

          <h3>Usage Data</h3>
          <p>We automatically collect information about how you interact with our services:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages you visit</li>
            <li>Time and date of your visit</li>
            <li>Device information</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>Black Studio uses your data for the following purposes:</p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To notify you about changes to our services</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our services</li>
            <li>To monitor the usage of our services</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Legal Basis for Processing</h2>
          <p>
            We process your personal data based on the following legal grounds:
          </p>
          <ul>
            <li>Your consent</li>
            <li>Performance of a contract</li>
            <li>Legal obligations</li>
            <li>Legitimate interests</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Data Retention</h2>
          <p>
            We will retain your personal data only for as long as necessary for
            the purposes set out in this Privacy Policy. We will retain and use
            your data to the extent necessary to comply with our legal
            obligations, resolve disputes, and enforce our legal agreements and
            policies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Data Security</h2>
          <p>
            The security of your data is important to us. We implement
            appropriate technical and organizational measures to protect your
            personal data against unauthorized access, alteration, disclosure,
            or destruction. However, no method of transmission over the internet
            or electronic storage is 100% secure.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity
            on our website and hold certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent. However, if you do not accept cookies, you may not be able to
            use some portions of our service.
          </p>
          <p>Types of cookies we use:</p>
          <ul>
            <li>Essential cookies</li>
            <li>Performance cookies</li>
            <li>Functionality cookies</li>
            <li>Targeting cookies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate
            our services, provide services on our behalf, or assist us in
            analyzing how our services are used. These third parties have access
            to your personal data only to perform these tasks on our behalf and
            are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Your Data Protection Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access, update, or delete your personal data</li>
            <li>Rectify inaccurate or incomplete data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at the email
            address provided below.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We
            do not knowingly collect personally identifiable information from
            children under 13. If you are a parent or guardian and you are aware
            that your child has provided us with personal data, please contact
            us.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className={styles.contactInfo}>
            <p>
              <strong>Email:</strong> privacy@blackstudio.com
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>Address:</strong> 123 Creative Avenue, Design District,
              New York, NY 10001
            </p>
          </div>
        </section>

        <div className={styles.footer}>
          <p>&copy; 2025 Black Studio. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;