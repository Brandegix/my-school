import React, { useState, useEffect } from 'react';
import { Play, Star, Users, BookOpen, Award, ArrowRight, Menu, X, Search, Bell, User, ChevronDown, Globe, Zap, Target, TrendingUp } from 'lucide-react';
import NavBar from "./NavBar";
import Footer from "./Footer";
import styles from './Home.module.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
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
      price: "1,999 MAD",
      duration: "16 weeks",
      level: "Advanced",
      image: "",
      gradientClass: "gradientPurplePink"
    },
    {
      title: "Full Stack Web Development Immersion",
      instructor: "Jessica Martinez",
      students: "8,943",
      rating: 4.8,
      price: "1,499 MAD",
      duration: "12 weeks",
      level: "Intermediate",
      image: "",
      gradientClass: "gradientBlueCyan"
    },
    {
      title: "Practical Data Science Bootcamp",
      instructor: "Michael Thompson",
      students: "15,621",
      rating: 4.9,
      price: "1,799 MAD",
      duration: "14 weeks",
      level: "Beginner",
      image: "",
      gradientClass: "gradientGreenTeal"
    }
  ];

  const stats = [
    { icon: Users, value: "2M+", label: "Active Learners" },
    { icon: BookOpen, value: "10K+", label: "Expert Courses" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: Globe, value: "180+", label: "Countries" }
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.backgroundElement}></div>
        <div className={styles.backgroundElement}></div>
        <div className={styles.backgroundElement}></div>
      </div>

      {/* Navigation */}
      <NavBar scrolled={scrolled} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <TrendingUp /> Your Future Starts Now
          </span>
          <h1 className={styles.heroTitle}>
            Unlock Your <span className={styles.heroTitleGradientWhite}>Potential with</span>{' '}
            <span className={styles.heroTitleGradientColored}> Tech Skills</span>
          </h1>
          <p className={styles.heroDescription}>
            Dive into learning experiences designed to get you job-ready in today's fastest-growing industries. From coding to data science, your career transformation begins here.
          </p>
          <div className={styles.heroActions}>
            <a href="/AuthPage" className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
              Explore Courses <ArrowRight className={styles.arrowIcon} />
            </a>
            <a href="#" className={`${styles.heroButton} ${styles.heroButtonSecondary}`}>
              <Play /> How it Works
            </a>
          </div>

          <div className={styles.heroStatsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.heroStatItem}>
                <div className={styles.heroStatIconWrap}>
                  <stat.icon />
                </div>
                <div className={styles.heroStatValue}>{stat.value}</div>
                <div className={styles.heroStatLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className={styles.coursesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Our <span className={styles.sectionTitleGradient}>Top-Rated Courses</span>
          </h2>
          <p className={styles.sectionDescription}>
            Handpicked by industry experts, these courses offer the most in-demand skills to elevate your career.
          </p>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((course, index) => (
            <div key={index} className={styles.courseCard}>
              <div className={`${styles.courseCardGradientOverlay} ${styles[course.gradientClass]}`}></div>
              <div className={styles.courseCardContent}>
                <div className={styles.courseCardTopRow}>
                  <span className={styles.courseCardImage}>{course.image}</span>
                  <span className={styles.courseCardLevelBadge}>{course.level}</span>
                </div>
                <h3 className={styles.courseCardTitle}>{course.title}</h3>
                <p className={styles.courseCardInstructor}>Taught by {course.instructor}</p>
                <div className={styles.courseCardMeta}>
                  <div className={styles.courseCardMetaItem}>
                    <Users /> {course.students} Students
                  </div>
                  <div className={styles.courseCardMetaItem}>
                    <Star className={styles.starIcon} fill="currentColor" /> {course.rating} Rating
                  </div>
                </div>
                <div className={styles.courseCardBottomRow}>
                  <span className={styles.courseCardPrice}>{course.price}</span>
                  <span className={styles.courseCardDuration}>{course.duration}</span>
                  <button className={styles.courseCardEnrollButton}>Enroll Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContent}>
          <div className={styles.testimonialsTitleContainer}>
            <h2 className={styles.sectionTitle}>
              Hear From Our <span className={styles.sectionTitleGradient}>Happy Learners</span>
            </h2>
            <p className={styles.sectionDescription}>
              Real stories from real people who transformed their careers with Learnify.
            </p>
          </div>

          <div className={styles.testimonialCardWrapper}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={styles.testimonialCard}
                style={{ display: index === activeTestimonial ? 'block' : 'none' }}
              >
                <div className={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} fill="currentColor" />
                  ))}
                </div>
                <p className={styles.testimonialQuote}>"{testimonial.content}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{testimonial.avatar}</div>
                  <div className={styles.testimonialDetails}>
                    <div className={styles.testimonialName}>{testimonial.name}</div>
                    <div className={styles.testimonialRoleCompany}>{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.testimonialDot} ${index === activeTestimonial ? styles.active : ''}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaCard}>
            <Target className={styles.ctaIcon} />
            <h2 className={styles.ctaTitle}>
              Ready to <span className={styles.ctaTitleGradient}>Build Your Future?</span>
            </h2>
            <p className={styles.ctaDescription}>
              Join thousands of ambitious learners who are already taking control of their career paths.
              Don't just learn, thrive!
            </p>
            <div className={styles.ctaButtons}>
              <a href="/AuthPage" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
                Get Started for Free
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