import React, { useState, useEffect } from 'react';
import { Play, Star, Users, BookOpen, Award, ArrowRight, Menu, X, Search, Bell, User, ChevronDown, Globe, Zap, Target, TrendingUp } from 'lucide-react';
import NavBar from "./NavBar";
import Footer from "./Footer";
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Fatima Zahra",
      role: "Aspiring Developer",
      company: "Casablanca Tech",
      content: "This platform opened up a whole new world for me! The learning paths made complex topics feel accessible, helping me kickstart my journey in tech.",
      avatar: "FZ",
      rating: 5
    },
    {
      name: "Youssef El Amrani",
      role: "Data Enthusiast",
      company: "Rabat Innovations",
      content: "The practical coding challenges and hands-on projects were exactly what I needed. I truly feel confident applying my new data science skills now.",
      avatar: "YE",
      rating: 5
    },
    {
      name: "Amina Bouazza",
      role: "UI/UX Designer",
      company: "Marrakech Creatives",
      content: "Beyond the courses, the community and mentorship here are incredible. It's like having a supportive family guiding you every step of the way.",
      avatar: "AB",
      rating: 5
    }
  ];

  const courses = [
    {
      title: "Mastering AI & Machine Learning",
      instructor: "Dr. Alex Kumar",
      students: "12,547",
      rating: 4.9,
      price: "1,999 MAD", // Adjusted price for Morocco
      duration: "16 weeks",
      level: "Advanced",
      image: "🤖",
      gradientClass: "gradient-purple-pink"
    },
    {
      title: "Full Stack Web Development Immersion",
      instructor: "Jessica Martinez",
      students: "8,943",
      rating: 4.8,
      price: "1,499 MAD", // Adjusted price for Morocco
      duration: "12 weeks",
      level: "Intermediate",
      image: "💻",
      gradientClass: "gradient-blue-cyan"
    },
    {
      title: "Practical Data Science Bootcamp",
      instructor: "Michael Thompson",
      students: "15,621",
      rating: 4.9,
      price: "1,799 MAD", // Adjusted price for Morocco
      duration: "14 weeks",
      level: "Beginner",
      image: "📊",
      gradientClass: "gradient-green-teal"
    }
  ];

  const stats = [
    { icon: Users, value: "2M+", label: "Active Learners" },
    { icon: BookOpen, value: "10K+", label: "Expert Courses" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: Globe, value: "180+", label: "Countries" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="home-container">
      {/* Global Styles */}
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

           body {
             margin: 0;
             font-family: 'Inter', sans-serif;
             color: white;
             overflow-x: hidden;
             background: linear-gradient(135deg, var(--color-slate-900) 0%, var(--color-purple-900) 50%, var(--color-slate-900) 100%);
           }

           .home-container {
             min-height: 100vh;
             position: relative;
             z-index: 1;
             overflow: hidden;
           }

           /* Animated Background Elements */
           .background-elements {
             position: fixed;
             inset: 0;
             overflow: hidden;
             pointer-events: none;
             z-index: 0;
           }

           .background-element {
             position: absolute;
             width: 320px;
             height: 320px;
             border-radius: 50%;
             mix-blend-mode: multiply;
             filter: blur(48px); /* Tailwind blur-xl is 24px, 48px is stronger */
             opacity: 0.7;
             animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
           }

           .background-element:nth-child(1) {
             top: -160px; /* -top-40 */
             right: -160px; /* -right-40 */
             background-color: var(--color-purple-500);
           }

           .background-element:nth-child(2) {
             bottom: -160px; /* -bottom-40 */
             left: -160px; /* -left-40 */
             background-color: var(--color-pink-500);
             animation-delay: 2s;
           }

           .background-element:nth-child(3) {
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             background-color: var(--color-blue-500);
             opacity: 0.5;
             animation-delay: 4s;
           }

           @keyframes pulse {
             0%, 100% { transform: scale(1); }
             50% { transform: scale(1.1); }
           }

           /* Navigation */
           .navbar {
             position: fixed;
             width: 100%;
             z-index: 50;
             transition: all 0.3s ease-in-out;
             background-color: transparent;
           }

           .navbar.scrolled {
             background-color: rgba(15, 23, 42, 0.95); /* slate-900/95 */
             backdrop-filter: blur(12px);
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

           /* Hero Section */
           .hero-section {
             position: relative;
             padding-top: 8rem; /* pt-32 */
             padding-bottom: 5rem; /* pb-20 */
             padding-left: 1rem; /* px-4 */
             padding-right: 1rem; /* px-4 */
           }
           @media (min-width: 640px) {
             .hero-section {
               padding-left: 1.5rem;
               padding-right: 1.5rem;
             }
           }
           @media (min-width: 1024px) {
             .hero-section {
               padding-left: 2rem;
               padding-right: 2rem;
             }
           }

           .hero-content {
             max-width: 1280px; /* max-w-7xl */
             margin: 0 auto; /* mx-auto */
             text-align: center;
           }

           .hero-badge {
             display: inline-flex;
             align-items: center;
             padding: 8px 16px; /* px-4 py-2 */
             border-radius: 9999px; /* rounded-full */
             background-color: rgba(168, 85, 247, 0.2); /* purple-500/20 */
             border: 1px solid rgba(168, 85, 247, 0.3); /* purple-500/30 */
             margin-bottom: 32px; /* mb-8 */
             animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
             font-size: 0.875rem; /* text-sm */
             font-weight: 500;
           }
           .hero-badge svg {
             width: 16px;
             height: 16px;
             margin-right: 8px; /* mr-2 */
           }

           .hero-title {
             font-size: 3rem; /* text-4xl */
             line-height: 1.25; /* leading-tight */
             font-weight: 700;
             margin-bottom: 24px; /* mb-6 */
           }
           @media (min-width: 768px) {
             .hero-title {
               font-size: 4rem; /* md:text-6xl */
             }
           }
           @media (min-width: 1024px) {
             .hero-title {
               font-size: 4.5rem; /* lg:text-7xl (using smaller for better fit) */
             }
           }

           .hero-title-gradient-white {
             background-image: linear-gradient(to right, white, var(--color-purple-200), var(--color-pink-200));
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
             color: transparent;
           }

           .hero-title-gradient-colored {
             background-image: linear-gradient(to right, var(--color-purple-400), var(--color-pink-400), var(--color-cyan-400));
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
             color: transparent;
           }

           .hero-description {
             font-size: 1.25rem; /* text-xl */
             line-height: 1.6; /* leading-relaxed */
             color: var(--color-gray-300);
             margin-bottom: 40px; /* mb-10 */
             max-width: 768px; /* max-w-3xl */
             margin-left: auto;
             margin-right: auto;
           }
           @media (min-width: 768px) {
             .hero-description {
               font-size: 1.5rem; /* md:text-2xl */
             }
           }

           .hero-actions {
             display: flex;
             flex-direction: column;
             gap: 16px; /* gap-4 */
             justify-content: center;
             align-items: center;
             margin-bottom: 64px; /* mb-16 */
           }
           @media (min-width: 640px) {
             .hero-actions {
               flex-direction: row; /* sm:flex-row */
             }
           }

           .hero-button {
             padding: 16px 32px; /* px-8 py-4 */
             border-radius: 12px; /* rounded-xl */
             font-weight: 600;
             font-size: 1.125rem; /* text-lg */
             border: none;
             cursor: pointer;
             transition: all 0.3s ease, transform 0.3s ease;
             color: white;
             text-decoration: none; /* For link-like buttons */
           }

           .hero-button-primary {
             background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
             box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); /* shadow-lg */
           }
           .hero-button-primary:hover {
             background-image: linear-gradient(to right, var(--color-purple-600), var(--color-pink-600));
             transform: scale(1.05);
             box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.25), 0 4px 6px -2px rgba(168, 85, 247, 0.15); /* hover:shadow-purple-500/25 */
           }
           .hero-button-primary .arrow-icon {
             display: inline-block;
             margin-left: 8px;
             transition: transform 0.2s ease;
           }
           .hero-button-primary:hover .arrow-icon {
             transform: translateX(4px);
           }

           .hero-button-secondary {
             display: flex;
             align-items: center;
             background: none;
             border: 1px solid var(--color-gray-600);
           }
           .hero-button-secondary:hover {
             border-color: var(--color-purple-500);
             transform: scale(1.05);
           }
           .hero-button-secondary svg {
             width: 20px;
             height: 20px;
             margin-right: 8px;
           }

           .hero-stats-grid {
             display: grid;
             grid-template-columns: repeat(2, 1fr); /* grid-cols-2 */
             gap: 32px; /* gap-8 */
             max-width: 896px; /* max-w-4xl */
             margin-left: auto;
             margin-right: auto;
           }
           @media (min-width: 768px) {
             .hero-stats-grid {
               grid-template-columns: repeat(4, 1fr); /* md:grid-cols-4 */
             }
           }

           .hero-stat-item {
             text-align: center;
           }
           .hero-stat-icon-wrap {
             display: inline-flex;
             align-items: center;
             justify-content: center;
             width: 64px;
             height: 64px;
             background-image: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2)); /* from-purple-500/20 to-pink-500/20 */
             border-radius: 12px; /* rounded-xl */
             margin-bottom: 16px; /* mb-4 */
             transition: transform 0.3s ease;
           }
           .hero-stat-item:hover .hero-stat-icon-wrap {
             transform: scale(1.1);
           }
           .hero-stat-icon-wrap svg {
             width: 32px;
             height: 32px;
             color: var(--color-purple-400);
           }
           .hero-stat-value {
             font-size: 1.875rem; /* text-3xl */
             font-weight: 700;
             margin-bottom: 4px; /* mb-1 */
           }
           .hero-stat-label {
             color: var(--color-gray-400);
           }

           /* Featured Courses */
           .courses-section {
             padding-top: 5rem; /* py-20 */
             padding-bottom: 5rem; /* py-20 */
             padding-left: 1rem; /* px-4 */
             padding-right: 1rem; /* px-4 */
           }
           @media (min-width: 640px) {
             .courses-section {
               padding-left: 1.5rem;
               padding-right: 1.5rem;
             }
           }
           @media (min-width: 1024px) {
             .courses-section {
               padding-left: 2rem;
               padding-right: 2rem;
             }
           }

           .section-header {
             text-align: center;
             margin-bottom: 64px; /* mb-16 */
           }
           .section-title {
             font-size: 2.5rem; /* text-3xl */
             font-weight: 700;
             margin-bottom: 16px; /* mb-4 */
           }
           @media (min-width: 768px) {
             .section-title {
               font-size: 3rem; /* md:text-5xl */
             }
           }
           .section-title-gradient {
             background-image: linear-gradient(to right, var(--color-purple-400), var(--color-pink-400));
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
             color: transparent;
           }
           .section-description {
             font-size: 1.25rem; /* text-xl */
             color: var(--color-gray-300);
             max-width: 672px; /* max-w-2xl */
             margin-left: auto;
             margin-right: auto;
           }

           .courses-grid {
             max-width: 1280px; /* max-w-7xl */
             margin: 0 auto;
             display: grid;
             gap: 32px; /* gap-8 */
           }
           @media (min-width: 768px) {
             .courses-grid {
               grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
             }
           }
           @media (min-width: 1024px) {
             .courses-grid {
               grid-template-columns: repeat(3, 1fr); /* lg:grid-cols-3 */
             }
           }

           .course-card {
             position: relative;
             background-color: rgba(31, 41, 55, 0.5); /* slate-800/50 */
             backdrop-filter: blur(4px);
             border-radius: 1rem; /* rounded-2xl */
             overflow: hidden;
             transition: all 0.3s ease;
             border: 1px solid rgba(255,255,255,0.05); /* Subtle border for depth */
           }
           .course-card:hover {
             transform: scale(1.05);
             box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04), 0 0 0 1px rgba(168, 85, 247, 0.1); /* hover:shadow-2xl hover:shadow-purple-500/10 */
           }

           .course-card-gradient-overlay {
             position: absolute;
             inset: 0;
             opacity: 0;
             transition: opacity 0.3s ease;
           }
           .course-card:hover .course-card-gradient-overlay {
             opacity: 0.1;
           }
           /* Specific gradients for course cards */
           .gradient-purple-pink { background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500)); }
           .gradient-blue-cyan { background-image: linear-gradient(to right, var(--color-blue-500), var(--color-cyan-500)); }
           .gradient-green-teal { background-image: linear-gradient(to right, var(--color-green-500), var(--color-teal-500)); }


           .course-card-content {
             padding: 1.5rem; /* p-6 */
             position: relative;
             z-index: 10;
           }

           .course-card-top-row {
             display: flex;
             align-items: center;
             justify-content: space-between;
             margin-bottom: 1rem; /* mb-4 */
           }
           .course-card-image {
             font-size: 2.5rem; /* text-4xl */
           }
           .course-card-level-badge {
             padding: 4px 12px; /* px-3 py-1 */
             background-color: rgba(168, 85, 247, 0.2); /* purple-500/20 */
             color: var(--color-purple-300);
             border-radius: 9999px; /* rounded-full */
             font-size: 0.875rem; /* text-sm */
             font-weight: 500;
           }

           .course-card-title {
             font-size: 1.25rem; /* text-xl */
             font-weight: 700;
             margin-bottom: 8px; /* mb-2 */
             transition: color 0.2s ease;
           }
           .course-card:hover .course-card-title {
             color: var(--color-purple-300);
           }

           .course-card-instructor {
             color: var(--color-gray-400);
             margin-bottom: 16px; /* mb-4 */
           }

           .course-card-meta {
             display: flex;
             align-items: center;
             justify-content: space-between;
             font-size: 0.875rem; /* text-sm */
             color: var(--color-gray-300);
             margin-bottom: 16px; /* mb-4 */
           }
           .course-card-meta-item {
             display: flex;
             align-items: center;
           }
           .course-card-meta-item svg {
             width: 16px;
             height: 16px;
             margin-right: 4px;
           }
           .course-card-meta-item .star-icon {
             color: var(--color-yellow-400);
           }

           .course-card-bottom-row {
             display: flex;
             align-items: center;
             justify-content: space-between;
           }
           .course-card-price {
             font-size: 1.5rem; /* text-2xl */
             font-weight: 700;
             color: var(--color-purple-400);
           }
           .course-card-duration {
             color: var(--color-gray-400);
             margin-left: 8px; /* ml-2 */
           }
           .course-card-enroll-button {
             background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
             padding: 8px 16px; /* px-4 py-2 */
             border-radius: 8px; /* rounded-lg */
             font-weight: 600;
             color: white;
             border: none;
             cursor: pointer;
             transition: all 0.2s ease, transform 0.2s ease;
           }
           .course-card-enroll-button:hover {
             background-image: linear-gradient(to right, var(--color-purple-600), var(--color-pink-600));
             transform: scale(1.05);
           }

           /* Testimonials Section */
           .testimonials-section {
             padding-top: 5rem; /* py-20 */
             padding-bottom: 5rem; /* py-20 */
             padding-left: 1rem; /* px-4 */
             padding-right: 1rem; /* px-4 */
           }
           @media (min-width: 640px) {
             .testimonials-section {
               padding-left: 1.5rem;
               padding-right: 1.5rem;
             }
           }
           @media (min-width: 1024px) {
             .testimonials-section {
               padding-left: 2rem;
               padding-right: 2rem;
             }
           }
           .testimonials-content {
             max-width: 896px; /* max-w-4xl */
             margin-left: auto;
             margin-right: auto;
             text-align: center;
           }
           .testimonials-title-container {
             margin-bottom: 64px; /* mb-16 */
           }
           .testimonial-card-wrapper {
             position: relative;
           }
           .testimonial-card {
             background-color: rgba(31, 41, 55, 0.5); /* slate-800/50 */
             backdrop-filter: blur(4px);
             border-radius: 1rem; /* rounded-2xl */
             padding: 2rem; /* p-8 */
           }
           @media (min-width: 768px) {
             .testimonial-card {
               padding: 3rem; /* md:p-12 */
             }
           }
           .testimonial-rating {
             display: flex;
             justify-content: center;
             margin-bottom: 24px; /* mb-6 */
           }
           .testimonial-rating svg {
             width: 24px;
             height: 24px;
             color: var(--color-yellow-400);
             fill: currentColor;
           }
           .testimonial-quote {
             font-size: 1.25rem; /* text-xl */
             font-weight: 500;
             margin-bottom: 32px; /* mb-8 */
             line-height: 1.6; /* leading-relaxed */
           }
           @media (min-width: 768px) {
             .testimonial-quote {
               font-size: 1.5rem; /* md:text-2xl */
             }
           }

           .testimonial-author {
             display: flex;
             align-items: center;
             justify-content: center;
           }
           .testimonial-avatar {
             width: 48px;
             height: 48px;
             background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
             border-radius: 50%;
             display: flex;
             align-items: center;
             justify-content: center;
             color: white;
             font-weight: 700;
             margin-right: 16px; /* mr-4 */
           }
           .testimonial-details {
             text-align: left;
           }
           .testimonial-name {
             font-weight: 600;
           }
           .testimonial-role-company {
             color: var(--color-gray-400);
           }

           .testimonial-dots {
             display: flex;
             justify-content: center;
             margin-top: 32px; /* mt-8 */
             gap: 8px; /* space-x-2 */
           }
           .testimonial-dot {
             width: 12px;
             height: 12px;
             border-radius: 50%;
             transition: all 0.3s ease;
             background-color: var(--color-gray-600);
             border: none; /* Ensure no default button border */
             cursor: pointer;
             padding: 0; /* Remove default button padding */
           }
           .testimonial-dot.active {
             background-color: var(--color-purple-500);
           }

           /* CTA Section */
           .cta-section {
             padding-top: 5rem; /* py-20 */
             padding-bottom: 5rem; /* py-20 */
             padding-left: 1rem; /* px-4 */
             padding-right: 1rem; /* px-4 */
           }
           @media (min-width: 640px) {
             .cta-section {
               padding-left: 1.5rem;
               padding-right: 1.5rem;
             }
           }
           @media (min-width: 1024px) {
             .cta-section {
               padding-left: 2rem;
               padding-right: 2rem;
             }
           }
           .cta-content {
             max-width: 896px; /* max-w-4xl */
             margin-left: auto;
             margin-right: auto;
             text-align: center;
           }
           .cta-card {
             background-image: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2)); /* from-purple-500/20 to-pink-500/20 */
             border-radius: 1.5rem; /* rounded-3xl */
             padding: 2rem; /* p-8 */
             border: 1px solid rgba(168, 85, 247, 0.3); /* border-purple-500/30 */
           }
           @media (min-width: 768px) {
             .cta-card {
               padding: 4rem; /* md:p-16 */
             }
           }
           .cta-icon {
             width: 64px;
             height: 64px;
             margin-left: auto;
             margin-right: auto;
             margin-bottom: 24px; /* mb-6 */
             color: var(--color-purple-400);
           }
           .cta-title {
             font-size: 2.5rem; /* text-3xl */
             font-weight: 700;
             margin-bottom: 24px; /* mb-6 */
           }
           @media (min-width: 768px) {
             .cta-title {
               font-size: 3rem; /* md:text-5xl */
             }
           }
           .cta-title-gradient {
             background-image: linear-gradient(to right, var(--color-purple-400), var(--color-pink-400));
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
             color: transparent;
           }
           .cta-description {
             font-size: 1.25rem; /* text-xl */
             color: var(--color-gray-300);
             margin-bottom: 32px; /* mb-8 */
             max-width: 672px; /* max-w-2xl */
             margin-left: auto;
             margin-right: auto;
           }
           .cta-buttons {
             display: flex;
             flex-direction: column;
             gap: 16px; /* gap-4 */
             justify-content: center;
           }
           @media (min-width: 640px) {
             .cta-buttons {
               flex-direction: row; /* sm:flex-row */
             }
           }
           .cta-button {
             padding: 16px 32px; /* px-8 py-4 */
             border-radius: 12px; /* rounded-xl */
             font-weight: 600;
             font-size: 1.125rem; /* text-lg */
             border: none;
             cursor: pointer;
             transition: all 0.3s ease, transform 0.3s ease;
             color: white;
             text-decoration: none;
           }
           .cta-button-primary {
             background-image: linear-gradient(to right, var(--color-purple-500), var(--color-pink-500));
             box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); /* shadow-lg */
           }
           .cta-button-primary:hover {
             background-image: linear-gradient(to right, var(--color-purple-600), var(--color-pink-600));
             transform: scale(1.05);
             box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.25), 0 4px 6px -2px rgba(168, 85, 247, 0.15); /* hover:shadow-purple-500/25 */
           }
           .cta-button-secondary {
             background: none;
             border: 1px solid var(--color-gray-600);
           }
           .cta-button-secondary:hover {
             border-color: var(--color-purple-500);
             transform: scale(1.05);
           }

           /* Footer */
           .footer {
             background-color: var(--color-gray-900);
             padding: 3rem 1rem; /* py-12 px-4 */
             color: var(--color-gray-400);
             font-size: 0.875rem; /* text-sm */
             text-align: center;
           }
           @media (min-width: 640px) {
             .footer {
               padding: 4rem 1.5rem; /* sm:py-16 sm:px-6 */
             }
           }
           @media (min-width: 1024px) {
             .footer {
               padding: 5rem 2rem; /* lg:py-20 lg:px-8 */
             }
           }

           .footer-content {
             max-width: 1280px; /* max-w-7xl */
             margin: 0 auto; /* mx-auto */
           }

           .footer-grid {
             display: grid;
             gap: 2rem; /* gap-8 */
             text-align: center;
             margin-bottom: 3rem; /* mb-12 */
           }
           @media (min-width: 768px) {
             .footer-grid {
               grid-template-columns: repeat(4, 1fr); /* md:grid-cols-4 */
               text-align: left;
             }
           }

           .footer-section-title {
             font-weight: 600;
             color: white;
             margin-bottom: 1rem; /* mb-4 */
             font-size: 1rem; /* text-base */
           }

           .footer-link-list {
             list-style: none;
             padding: 0;
             margin: 0;
             display: flex;
             flex-direction: column;
             gap: 0.75rem; /* space-y-3 */
           }
           .footer-link {
             color: var(--color-gray-400);
             text-decoration: none;
             transition: color 0.2s ease;
           }
           .footer-link:hover {
             color: var(--color-purple-300);
           }

           .footer-social-links {
             display: flex;
             justify-content: center;
             gap: 1rem; /* space-x-4 */
             margin-top: 1rem; /* mt-4 */
           }
           @media (min-width: 768px) {
             .footer-social-links {
               justify-content: flex-start;
             }
           }

           .footer-social-icon {
             color: var(--color-gray-400);
             transition: color 0.2s ease, transform 0.2s ease;
           }
           .footer-social-icon:hover {
             color: white;
             transform: scale(1.1);
           }
           .footer-social-icon svg {
             width: 24px;
             height: 24px;
           }

           .footer-bottom-text {
             margin-top: 3rem; /* mt-12 */
             padding-top: 2rem; /* pt-8 */
             border-top: 1px solid var(--color-gray-700);
             color: var(--color-gray-500);
             font-size: 0.75rem; /* text-xs */
           }

        `}
      </style>

      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="background-element"></div>
        <div className="background-element"></div>
        <div className="background-element"></div>
      </div>

      {/* Navigation */}
     
      <NavBar />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            <TrendingUp /> Your Future Starts Now
          </span>
          <h1 className="hero-title">
            Unlock Your <span className="hero-title-gradient-white">Potential with</span>{' '}
            <span className="hero-title-gradient-colored">Cutting-Edge Tech Skills</span>
          </h1>
          <p className="hero-description">
            Dive into immersive, learning experiences designed to get you job-ready in today's fastest-growing industries. From coding to data science, your career transformation begins here.
          </p>
          <div className="hero-actions">
            <a href="#" className="hero-button hero-button-primary">
              Explore Courses <ArrowRight className="arrow-icon" />
            </a>
            <a href="#" className="hero-button hero-button-secondary">
              <Play /> How it Works
            </a>
          </div>

          <div className="hero-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat-item">
                <div className="hero-stat-icon-wrap">
                  <stat.icon />
                </div>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Featured Courses Section */}
      <section className="courses-section">
        <div className="section-header">
          <h2 className="section-title">
            Our <span className="section-title-gradient">Top-Rated Courses</span>
          </h2>
          <p className="section-description">
            Handpicked by industry experts, these courses offer the most in-demand skills to elevate your career.
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className={`course-card-gradient-overlay ${course.gradientClass}`}></div>
              <div className="course-card-content">
                <div className="course-card-top-row">
                  <span className="course-card-image">{course.image}</span>
                  <span className="course-card-level-badge">{course.level}</span>
                </div>
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-instructor">Taught by {course.instructor}</p>
                <div className="course-card-meta">
                  <div className="course-card-meta-item">
                    <Users /> {course.students} Students
                  </div>
                  <div className="course-card-meta-item">
                    <Star className="star-icon" fill="currentColor" /> {course.rating} Rating
                  </div>
                </div>
                <div className="course-card-bottom-row">
                  <span className="course-card-price">{course.price}</span>
                  <span className="course-card-duration">{course.duration}</span>
                  <button className="course-card-enroll-button">Enroll Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-content">
          <div className="testimonials-title-container">
            <h2 className="section-title">
              Hear From Our <span className="section-title-gradient">Happy Learners</span>
            </h2>
            <p className="section-description">
              Real stories from real people who transformed their careers with Learnify.
            </p>
          </div>

          <div className="testimonial-card-wrapper">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card"
                style={{ display: index === activeTestimonial ? 'block' : 'none' }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-details">
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-role-company">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-card">
            <Target className="cta-icon" />
            <h2 className="cta-title">
              Ready to <span className="cta-title-gradient">Build Your Future?</span>
            </h2>
            <p className="cta-description">
              Join thousands of ambitious learners who are already taking control of their career paths.
              Don't just learn, thrive!
            </p>
            <div className="cta-buttons">
              <a href="#" className="cta-button cta-button-primary">
                Get Started for Free
              </a>
              <a href="#" className="cta-button cta-button-secondary">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
     
    </div>
  );
};

export default HomePage;