import React from 'react';
import { Users, BookOpen, Award, Globe, Star, HeartHandshake, Target } from 'lucide-react';
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Navbar } from 'react-bootstrap';

const team = [
  { name: 'Oumaima Aboussafi', role: 'Founder & CEO', desc: 'Visionary leader passionate about accessible education.' },
  { name: 'Youssef El Amrani', role: 'Lead Data Scientist', desc: 'Turning data into actionable insights for learners.' },
  { name: 'Amina Bouazza', role: 'UI/UX Designer', desc: 'Designs intuitive, beautiful learning experiences.' },
  { name: 'Fatima Zahra', role: 'Community Manager', desc: 'Building a supportive and vibrant learning community.' },
];

const stats = [
  { icon: Users, value: '2M+', label: 'Active Learners' },
  { icon: BookOpen, value: '10K+', label: 'Expert Courses' },
  { icon: Award, value: '95%', label: 'Success Rate' },
  { icon: Globe, value: '180+', label: 'Countries' },
];

const AboutUsPage = () => {
  return (
    
    <div className="min-h-screen text-white overflow-x-hidden relative font-sans" style={{background: 'linear-gradient(135deg, #0f172a 0%, rgb(23, 0, 40) 50%, #0f172a 100%)'}}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-400 rounded-full opacity-20 blur-2xl animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <NavBar scrolled={false} />
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 shadow-lg animate-fade-in">
          <Star className="text-yellow-400 w-5 h-5" />
          <span className="uppercase tracking-wider text-sm font-semibold text-purple-200">Discover Learnify</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
          About <span className="text-white">Learnify</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-fade-in">
          Learnify is Morocco's leading online learning platform, empowering learners worldwide with practical, job-ready tech skills and a vibrant, supportive community.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center bg-white/10 rounded-xl px-8 py-6 min-w-[150px] shadow-lg hover:scale-105 transition-transform">
              <stat.icon className="w-8 h-8 mb-2 text-purple-400" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Story */}
      <section className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 relative z-10">
        <div className="bg-white/10 rounded-2xl p-8 shadow-lg flex flex-col justify-center hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold mb-2 text-purple-300 flex items-center gap-2"><Target className="inline w-6 h-6" /> Our Mission</h2>
          <p className="text-gray-200">To make high-quality, practical education accessible to everyone, everywhere. We believe in learning by doing, community support, and empowering every learner to achieve their dreams.</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-8 shadow-lg flex flex-col justify-center hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold mb-2 text-pink-300 flex items-center gap-2"><HeartHandshake className="inline w-6 h-6" /> Our Story</h2>
          <p className="text-gray-200">Founded in Casablanca, Learnify began as a small team of passionate educators and technologists. Today, we serve millions globally, but our heart remains in helping each learner succeed.</p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">Our Core Values</h2>
          <ul className="list-disc list-inside text-gray-200 space-y-2 pl-4">
            <li>Accessibility for all learners</li>
            <li>Continuous innovation in teaching</li>
            <li>Community-driven support and mentorship</li>
            <li>Integrity, transparency, and lifelong learning</li>
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <h2 className="text-2xl font-bold mb-8 text-center text-purple-200">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl font-bold mb-2">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="font-semibold text-lg mb-1">{member.name}</div>
              <div className="text-purple-300 mb-2">{member.role}</div>
              <div className="text-gray-300 text-sm">{member.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center relative z-10">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl p-10 shadow-xl hover:scale-105 transition-transform">
          <h2 className="text-3xl font-extrabold mb-4 text-white">Ready to join the Learnify community?</h2>
          <p className="text-lg text-white/90 mb-6">Start your journey with us and unlock your full potential. Whether you’re a beginner or a pro, there’s a place for you at Learnify.</p>
          <a href="/" className="inline-block bg-white text-purple-700 font-bold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition">Get Started</a>
        </div>
      </section>
       <Footer />
    </div>
    
  );

};

export default AboutUsPage;
