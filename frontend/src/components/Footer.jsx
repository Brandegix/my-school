import React from 'react';

const Footer = () => {
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
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <h3 className="footer-section-title">Learnify</h3>
              <ul className="footer-link-list">
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Press</a></li>
                <li><a href="#" className="footer-link">Partnerships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-section-title">Courses</h3>
              <ul className="footer-link-list">
                <li><a href="#" className="footer-link">AI & ML</a></li>
                <li><a href="#" className="footer-link">Web Development</a></li>
                <li><a href="#" className="footer-link">Data Science</a></li>
                <li><a href="#" className="footer-link">Cybersecurity</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-section-title">Support</h3>
              <ul className="footer-link-list">
                <li><a href="#" className="footer-link">FAQ</a></li>
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-section-title">Connect</h3>
              <div className="footer-social-links">
                {/* Facebook Icon */}
                <a href="#" className="footer-social-icon" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.353c-.597 0-.647.287-.647.749v1.251h2l-.248 2h-1.752v6h-3v-6h-2v-2h2v-1.299c0-1.668.977-2.701 2.766-2.701h1.234v2z" clipRule="evenodd"/></svg></a>
                {/* Twitter Icon */}
                <a href="#" className="footer-social-icon" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.791-1.574 2.164-2.722-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.322 0-6.002 2.68-6.002 6 0 .464.053.918.156 1.353-4.98-2.5-9.37-5.285-12.3-.96.516.828 1.25 1.764 2.13 2.723-1.048.287-2.031.393-3.085.393-.827 0-1.62-.115-2.382-.345 1.025 3.228 3.99 5.592 7.502 6.2-.878.61-1.874.969-2.891.969-.199 0-.393-.01-1.166-.092.833 2.693 4.195 4.657 7.892 4.657 9.497 0 14.63-7.857 14.63-14.63 0-.222-.005-.443-.015-.664.993-.717 1.85-1.603 2.541-2.613z"/></svg></a>
                {/* LinkedIn Icon */}
                <a href="#" className="footer-social-icon" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.842 7 2.355v6.88z"/></svg></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-text">
            &copy; {new Date().getFullYear()} Learnify. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
