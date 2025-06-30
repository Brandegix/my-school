import React from 'react';
import { Search, Bell, User, Menu, X, Zap } from 'lucide-react';
import styles from './NavBar.module.css';

const NavBar = ({ scrolled, isMenuOpen, toggleMenu }) => {
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarBrand}>
          <div className={styles.navbarLogoWrap}>
            <Zap className={styles.navbarLogoIcon} />
          </div>
          <span className={styles.navbarTitle}>Learnify</span>
        </div>

        <div className={styles.navbarMenuDesktop}>
          <div className={styles.navbarLinks}>
            <a href="/" className={styles.navbarLink}>Home</a>
            <a href="/" className={styles.navbarLink}>About Us</a>
            <a href="/" className={styles.navbarLink}>Pricing</a>
            <a href="/contact" className={styles.navbarLink}>Contact Us</a>
          </div>
        </div>

        <div className={styles.navbarActionsDesktop}>
          <button type="button" className={styles.navbarActionButtonIcon} aria-label="Search">
            <Search />
          </button>
          <button type="button" className={styles.navbarActionButtonIcon} aria-label="Notifications">
            <Bell />
          </button>
          <button className={styles.navbarSigninButton}>Sign In</button>
          <button className={styles.navbarStartLearningButton}>Start Learning</button>
        </div>

        <div className={styles.navbarMobileToggle}>
          <button
            onClick={toggleMenu}
            type="button"
            className={styles.navbarMobileButton}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.srOnly}>
              {isMenuOpen ? 'Close main menu' : 'Open main menu'}
            </span>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`} id="mobile-menu">
        <div className={styles.mobileMenuContent}>
          <a href="#" className={styles.mobileMenuLink}>Courses</a>
          <a href="#" className={styles.mobileMenuLink}>Mentors</a>
          <a href="#" className={styles.mobileMenuLink}>Community</a>
          <a href="#" className={styles.mobileMenuLink}>Pricing</a>
          <a href="#" className={styles.mobileMenuLink}>Blog</a>
          <a href="#" className={styles.mobileMenuLink}>Sign In</a>
          <a href="#" className={styles.mobileMenuLink}>Start Learning</a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;