import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react'; // New icons for contact
import NavBar from './NavBar'; // Adjust path if your NavBar is elsewhere
import Footer from './Footer'; // Adjust path if your Footer is elsewhere

const ContactUsPage = () => {
  const [scrolled, setScrolled] = useState(false); // State for NavBar scroll effect

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
    <div className="oumaimaStyle">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

          :root {
            --color-slate-900: #0f172a;
            --color-purple-900:rgb(23, 0, 40);
            --color-purple-500: #a855f7;
            --color-purple-400: #c084fc;
            --color-purple-300: #d8b4fe;
            --color-purple-200: #e9d5ff;
            --color-pink-500: #ec4899;
            --color-pink-400: #f472b6;
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

          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }

          body {
            font-family: 'Inter', sans-serif;
            color: white;
            background: linear-gradient(135deg, var(--color-slate-900) 0%, var(--color-purple-900) 50%, var(--color-slate-900) 100%);
          }

          .oumaimaStyle {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: center;
            width: 1270px;
            overflow: hidden;
          }

          /* Animated Background Elements */
          .contact-background-elements {
            position: fixed;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
          }

          .contact-background-element {
            position: absolute;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            mix-blend-mode: multiply;
            filter: blur(48px);
            opacity: 0.7;
            animation: contactPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* Renamed animation */
          }

          .contact-background-element:nth-child(1) {
            top: -160px;
            right: -160px;
            background-color: var(--color-purple-500);
          }

          .contact-background-element:nth-child(2) {
            bottom: -160px;
            left: -160px;
            background-color: var(--color-pink-500);
            animation-delay: 2s;
          }

          .contact-background-element:nth-child(3) {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--color-blue-500);
            opacity: 0.5;
            animation-delay: 4s;
          }

          @keyframes contactPulse { /* Renamed animation keyframe */
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          /* --- NAVBAR STYLES (Placeholder for external NavBar) --- */
          /* Your NavBar component should manage its own styling, but if it relies on a global class,
             ensure it's not conflicting. The 'navbar-container' here is just a placeholder. */
          .navbar-container {
            position: sticky;
            top: 0;
            width: 100%;
            z-index: 50;
            background-color: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(8px);
          }

          /* --- MAIN CONTENT WRAPPER --- */
          .contact-main-content-wrapper {
            flex: 1;
            position: relative;
            z-index: 10;
            padding-top: 64px; /* Adjust based on your NavBar's actual height */
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }

          /* --- FOOTER STYLES (Placeholder for external Footer) --- */
          /* Your Footer component should manage its own styling, but if it relies on a global class,
             ensure it's not conflicting. The 'footer-container' here is just a placeholder. */
          .footer-container {
            position: relative;
            z-index: 10;
            background-color: var(--color-slate-900);
            padding: 2rem 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* --- CONTACT US PAGE SPECIFIC STYLES --- */

          .contact-section {
            padding-top: 5rem;
            padding-bottom: 5rem;
            padding-left: 1rem;
            padding-right: 1rem;
            max-width: 1280px;
            width: 100%;
            box-sizing: border-box;
          }

          @media (min-width: 640px) {
            .contact-section {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
          }
          @media (min-width: 1024px) {
            .contact-section {
              padding-left: 2rem;
              padding-right: 2rem;
            }
          }

          .contact-header-content { /* Renamed from contact-header */
            text-align: center;
            margin-bottom: 4rem;
          }

          .contact-page-title { /* Renamed from contact-title */
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .contact-page-title-gradient { /* Renamed from contact-title-gradient */
            background-image: linear-gradient(to right, var(--color-purple-400), var(--color-pink-400));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }

          .contact-page-description { /* Renamed from contact-description */
            font-size: 1.25rem;
            color: var(--color-gray-300);
            max-width: 672px;
            margin-left: auto;
            margin-right: auto;
          }

          .contact-grid-layout { /* Renamed from contact-grid */
            display: grid;
            gap: 2rem;
          }

          @media (min-width: 1024px) {
            .contact-grid-layout {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          /* Contact Info Card */
          .contact-info-card {
            background-color: rgba(31, 41, 55, 0.5);
            backdrop-filter: blur(4px);
            border-radius: 1rem;
            padding: 2.5rem;
            border: 1px solid rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .contact-info-item { /* Renamed from info-item */
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          .contact-info-item:last-child {
            margin-bottom: 0;
          }

          .contact-info-icon-wrapper { /* Renamed from info-icon-wrapper */
            background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-right: 1rem;
          }
          .contact-info-icon { /* Renamed from info-icon */
            color: white;
            width: 24px;
            height: 24px;
          }

          .contact-info-details { /* Renamed from info-details */
            display: flex;
            flex-direction: column;
            color: var(--color-gray-300);
          }
          .contact-info-details strong {
            font-size: 1.125rem;
            font-weight: 600;
            color: white;
            margin-bottom: 0.25rem;
          }
          .contact-info-details span {
            font-size: 0.95rem;
          }

          /* Contact Form */
          .contact-form-card {
            background-color: rgba(31, 41, 55, 0.5);
            backdrop-filter: blur(4px);
            border-radius: 1rem;
            padding: 2.5rem;
            border: 1px solid rgba(255,255,255,0.05);
          }

          .contact-form-group { /* Renamed from form-group */
            margin-bottom: 1.5rem;
          }

          .contact-form-group label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-gray-300);
            margin-bottom: 0.5rem;
          }

          .contact-form-group input,
          .contact-form-group textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid var(--color-gray-600);
            background-color: var(--color-gray-800);
            color: white;
            font-size: 1rem;
            transition: all 0.2s ease;
          }

          .contact-form-group input:focus,
          .contact-form-group textarea:focus {
            outline: none;
            border-color: var(--color-purple-500);
            box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.5);
          }

          .contact-form-group textarea {
            min-height: 120px;
            resize: vertical;
          }

          .contact-submit-button { /* Renamed from submit-button */
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 1.125rem;
            color: white;
            background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
            border: none;
            cursor: pointer;
            transition: all 0.3s ease, transform 0.3s ease;
          }

          .contact-submit-button:hover {
            background-image: linear-gradient(to right, var(--color-purple-600), var(--color-pink-600));
            transform: scale(1.02);
            box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.25);
          }

          .contact-submit-button svg {
            margin-left: 0.5rem;
            width: 20px;
            height: 20px;
          }
        `}
      </style>

      <div className="contact-background-elements">
        <div className="contact-background-element"></div>
        <div className="contact-background-element"></div>
        <div className="contact-background-element"></div>
      </div>

      {/* NavBar and Footer are external components. Assume they handle their own internal styling
          or accept props for container classes if needed for consistency. */}
      <NavBar scrolled={scrolled} />

      <div className="contact-main-content-wrapper">
        <main className="contact-section">
          <header className="contact-header-content">
            <h1 className="contact-page-title">
              <span className="contact-page-title-gradient">Get In Touch</span>
            </h1>
            <p className="contact-page-description">
              We'd love to hear from you! Whether you have a question about courses, feedback, or
              just want to say hello, our team is ready to help.
            </p>
          </header>

          <div className="contact-grid-layout">
            {/* Contact Information Card */}
            <div className="contact-info-card">
              <div>
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrapper">
                    <Mail className="contact-info-icon" />
                  </div>
                  <div className="contact-info-details">
                    <strong>Email Us</strong>
                    <span>oaboussafi@gmail.com</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrapper">
                    <Phone className="contact-info-icon" />
                  </div>
                  <div className="contact-info-details">
                    <strong>Call Us</strong>
                    <span>+212 6 59 16 30 62</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon-wrapper">
                    <MapPin className="contact-info-icon" />
                  </div>
                  <div className="contact-info-details">
                    <strong>Visit Us</strong>
                    <span>123 Learnify maarif, Casablanca, Morocco</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className="contact-form-card">
              <form>
                <div className="contact-form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" placeholder="ex :oumaima ab" required />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" id="email" name="email" placeholder="ex :oumaima@example.com" required />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" placeholder=" About courses..." required />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" placeholder="Type your message here..." required></textarea>
                </div>
                <button type="submit" className="contact-submit-button">
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