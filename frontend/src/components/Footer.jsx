import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>Learnify</h3>
            <ul className={styles.footerLinkList}>
              <li><a href="#" className={styles.footerLink}>About Us</a></li>
              <li><a href="#" className={styles.footerLink}>Careers</a></li>
              <li><a href="#" className={styles.footerLink}>Press</a></li>
              <li><a href="#" className={styles.footerLink}>Partnerships</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>Courses</h3>
            <ul className={styles.footerLinkList}>
              <li><a href="#" className={styles.footerLink}>AI & ML</a></li>
              <li><a href="#" className={styles.footerLink}>Web Development</a></li>
              <li><a href="#" className={styles.footerLink}>Data Science</a></li>
              <li><a href="#" className={styles.footerLink}>Cybersecurity</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>Support</h3>
            <ul className={styles.footerLinkList}>
              <li><a href="#" className={styles.footerLink}>FAQ</a></li>
              <li><a href="#" className={styles.footerLink}>Help Center</a></li>
              <li><a href="#" className={styles.footerLink}>Terms of Service</a></li>
              <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className={`${styles.footerSection} ${styles.socialSection}`}>
            <h3 className={styles.footerSectionTitle}>Connect</h3>
            <div className={styles.footerSocialLinks}>
              <a 
                href="#" 
                className={styles.footerSocialIcon} 
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path 
                    fillRule="evenodd" 
                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.353c-.597 0-.647.287-.647.749v1.251h2l-.248 2h-1.752v6h-3v-6h-2v-2h2v-1.299c0-1.668.977-2.701 2.766-2.701h1.234v2z" 
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              
              <a 
                href="#" 
                className={styles.footerSocialIcon} 
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.791-1.574 2.164-2.722-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.322 0-6.002 2.68-6.002 6 0 .464.053.918.156 1.353-4.98-2.5-9.37-5.285-12.3-.96.516.828 1.25 1.764 2.13 2.723-1.048.287-2.031.393-3.085.393-.827 0-1.62-.115-2.382-.345 1.025 3.228 3.99 5.592 7.502 6.2-.878.61-1.874.969-2.891.969-.199 0-.393-.01-1.166-.092.833 2.693 4.195 4.657 7.892 4.657 9.497 0 14.63-7.857 14.63-14.63 0-.222-.005-.443-.015-.664.993-.717 1.85-1.603 2.541-2.613z"/>
                </svg>
              </a>
              
              <a 
                href="#" 
                className={styles.footerSocialIcon} 
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.842 7 2.355v6.88z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottomText}>
          &copy; {new Date().getFullYear()} Learnify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;