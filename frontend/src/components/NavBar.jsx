import React from 'react';
import { Search, Bell, User, Menu, X, Zap } from 'lucide-react';

const NavBar = ({ scrolled, isMenuOpen, toggleMenu }) => {
  return (
    <>
      <style>
        {`
           :root {
             --color-slate-900: #0f172a;
             --color-purple-900:rgb(23, 0, 40);
             --color-purple-500: #a855f7;
             --color-purple-400: #c084fc;
             --color-purple-300: #d8b4fe;
             --color-purple-200: #e9d5ff;
             --color-pink-500:rgb(0, 0, 0);
             --color-pink-400:rgb(255, 255, 255);
             --color-pink-200: #fbcfe8;
             --color-blue-500: #3b82f6;
             --color-blue-400: #60a5fa;
             --color-cyan-500: #06b6d4;
             --color-cyan-400: #22d3ee;
             --color-green-500: #22c55e;
             --color-green-400: #4ade80;
             --color-teal-500: #14b8a6;
             --color-teal-400: #2dd4bf;
             --color-gray-900: #111827;
             --color-gray-800: #1f2937;
             --color-gray-700: #374151;
             --color-gray-600: #4b5563;
             --color-gray-400: #9ca3af;
             --color-gray-300: #d1d5db;
             --color-gray-200: #e5e7eb;
             --color-yellow-400: #facc15;
           }

           /* Navigation */
           .navbar {
             position: fixed;
             width: 100%;
             z-index: 50;
             transition: all 0.3s ease-in-out;
             background-color: transparent; /* Default: transparent */
           }

           /* This class is applied when 'scrolled' prop is true */
           .navbar.scrolled {
             background-color: rgba(15, 23, 42, 0.95); /* slate-900/95 - Dark background */
             backdrop-filter: blur(12px); /* Blur effect */
             box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
           }

           .navbar-content {
             max-width: 1280px; /* max-w-7xl */
             margin: 0 auto; /* mx-auto */
             padding-left: 1rem; /* px-4 */
             padding-right: 1rem; /* px-4 */
             height: 64px; /* h-16 */
             display: flex;
             align-items: center;
             justify-content: space-between;
           }
           @media (min-width: 640px) { /* sm:px-6 */
             .navbar-content {
               padding-left: 1.5rem;
               padding-right: 1.5rem;
             }
           }
           @media (min-width: 1024px) { /* lg:px-8 */
             .navbar-content {
               padding-left: 2rem;
               padding-right: 2rem;
             }
           }

           .navbar-brand {
             display: flex;
             align-items: center;
             flex-shrink: 0;
           }

           .navbar-logo-wrap {
             width: 40px;
             height: 40px;
             background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
             border-radius: 8px; /* rounded-lg */
             display: flex;
             align-items: center;
             justify-content: center;
           }

           .navbar-logo-icon {
             width: 24px;
             height: 24px;
             color: white;
           }

           .navbar-title {
             margin-left: 12px;
             font-size: 20px;
             font-weight: 700;
             background-image: linear-gradient(to right, var(--color-purple-400), var(--color-pink-400));
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
             color: transparent;
           }

           .navbar-menu-desktop {
             display: none;
           }
           @media (min-width: 768px) { /* md:block */
             .navbar-menu-desktop {
               display: block;
             }
           }

           .navbar-links {
             margin-left: 40px;
             display: flex;
             align-items: baseline;
             gap: 32px; /* space-x-8 */
           }

           .navbar-link {
             color: var(--color-gray-300);
             transition: color 0.2s ease, transform 0.2s ease;
             text-decoration: none;
           }
           .navbar-link:hover {
             color: white;
             transform: scale(1.05);
           }

           .navbar-actions-desktop {
             display: none;
           }
           @media (min-width: 768px) { /* md:flex */
             .navbar-actions-desktop {
               display: flex;
               align-items: center;
               gap: 16px; /* space-x-4 */
             }
           }

           .navbar-action-button-icon {
             color: var(--color-gray-300);
             transition: color 0.2s ease;
             background: none;
             border: none;
             cursor: pointer;
             padding: 8px; /* Add some padding for better click area */
             border-radius: 50%; /* Make it rounded */
           }
           .navbar-action-button-icon:hover {
             color: white;
             background-color: rgba(255,255,255,0.1); /* Subtle hover background */
           }
           .navbar-action-button-icon svg {
             width: 20px;
             height: 20px;
           }

           .navbar-signin-button {
             color: var(--color-gray-300);
             padding: 8px 16px; /* px-4 py-2 */
             border-radius: 8px; /* rounded-lg */
             border: 1px solid var(--color-gray-600);
             background: none;
             transition: all 0.2s ease;
             cursor: pointer;
           }
           .navbar-signin-button:hover {
             border-color: var(--color-purple-500);
             color: white;
           }

           .navbar-start-learning-button {
             background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
             padding: 8px 24px; /* px-6 py-2 */
             border-radius: 8px; /* rounded-lg */
             font-weight: 600;
             color: white;
             border: none;
             cursor: pointer;
             transition: all 0.2s ease, transform 0.2s ease;
           }
           .navbar-start-learning-button:hover {
             background-image: linear-gradient(to right, var(--color-purple-600), var(--color-pink-600));
             transform: scale(1.05);
           }

           .navbar-mobile-toggle {
             display: block;
           }
           @media (min-width: 768px) { /* md:hidden */
             .navbar-mobile-toggle {
               display: none;
             }
           }

           .navbar-mobile-button {
             color: var(--color-gray-300);
             background: none;
             border: none;
             cursor: pointer;
           }
           .navbar-mobile-button:hover {
             color: white;
           }
           .navbar-mobile-button svg {
             width: 24px;
             height: 24px;
           }

           .mobile-menu {
             display: none;
           }
           .mobile-menu.open {
             display: block;
             background-color: rgba(15, 23, 42, 0.95); /* slate-900/95 */
             backdrop-filter: blur(12px);
             padding: 8px 0 12px; /* px-2 pt-2 pb-3 */
             width: 100%;
           }
           .mobile-menu-link {
             display: block;
             padding: 8px 12px; /* px-3 py-2 */
             color: var(--color-gray-300);
             text-decoration: none;
           }
           .mobile-menu-link:hover {
             color: white;
           }
        `}
      </style>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-logo-wrap">
              <Zap className="navbar-logo-icon" />
            </div>
            <span className="navbar-title">Learnify</span>
          </div>

          <div className="navbar-menu-desktop">
            <div className="navbar-links">
              <a href="/" className="navbar-link">Home </a>
              <a href="/" className="navbar-link">About Us</a>
              <a href="/" className="navbar-link">Pricing</a>
              <a href="/contact" className="navbar-link">Contact Us</a>
            </div>
          </div>

          <div className="navbar-actions-desktop">
            <button type="button" className="navbar-action-button-icon" aria-label="Search">
              <Search />
            </button>
            <button type="button" className="navbar-action-button-icon" aria-label="Notifications">
              <Bell />
            </button>
            <button className="navbar-signin-button">Sign In</button>
            <button className="navbar-start-learning-button">Start Learning</button>
          </div>

          <div className="navbar-mobile-toggle">
            <button
              onClick={toggleMenu}
              type="button"
              className="navbar-mobile-button"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="mobile-menu-link">Courses</a>
            <a href="#" className="mobile-menu-link">Mentors</a>
            <a href="#" className="mobile-menu-link">Community</a>
            <a href="#" className="mobile-menu-link">Pricing</a>
            <a href="#" className="mobile-menu-link">Blog</a>
            <a href="#" className="mobile-menu-link">Sign In</a>
            <a href="#" className="mobile-menu-link">Start Learning</a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
