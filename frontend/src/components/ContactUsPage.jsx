import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import NavBar from './NavBar';
import Footer from './Footer';
import styles from './ContactUsPage.module.css';

const ContactUsPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.backgroundElement}></div>
        <div className={styles.backgroundElement}></div>
        <div className={styles.backgroundElement}></div>
      </div>

      <NavBar scrolled={scrolled} />

      <div className={styles.mainContentWrapper}>
        <main className={styles.contactSection}>
          <header className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleGradient}>Get In Touch</span>
            </h1>
            <p className={styles.pageDescription}>
              We'd love to hear from you! Whether you have a question about courses, feedback, or
              just want to say hello, our team is ready to help.
            </p>
          </header>

          <div className={styles.gridLayout}>
            {/* Contact Information Card */}
            <div className={styles.infoCard}>
              <div>
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <Mail className={styles.icon} />
                  </div>
                  <div className={styles.infoDetails}>
                    <strong>Email Us</strong>
                    <span>oaboussafi@gmail.com</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <Phone className={styles.icon} />
                  </div>
                  <div className={styles.infoDetails}>
                    <strong>Call Us</strong>
                    <span>+212 6 59 16 30 62</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <MapPin className={styles.icon} />
                  </div>
                  <div className={styles.infoDetails}>
                    <strong>Visit Us</strong>
                    <span>123 Learnify maarif, Casablanca, Morocco</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className={styles.formCard}>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="ex :oumaima ab" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="ex :oumaima@example.com" 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    placeholder=" About courses..." 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Type your message here..." 
                    required
                  ></textarea>
                </div>
                <button type="submit" className={styles.submitButton}>
                  Send Message <Send />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUsPage;