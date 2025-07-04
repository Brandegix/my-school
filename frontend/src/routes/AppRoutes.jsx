import { Routes, Route } from "react-router-dom";
import Home from "../components/home"; // Corrected component name to follow convention
import ContactUsPage from "../components/ContactUsPage"; // Import the ContactUsPage component
import TailwindTest from '../components/TailwindTest';
import AuthPage  from '../components/AuthPage';
import UserProfiles from '../components/UserProfiles.jsx';
import AdminCourseManagement from '../components/AdminCourseManagement.jsx';
import AboutUsPage from "../components/AboutUsPage"; // Import AboutUsPage component



const AppRoutes = () => {
  return (
    <Routes>
      {/* Route for the Home page */}
      <Route path="/" element={<Home />} />
 <Route path="/TailwindTest" element={<TailwindTest />} />
      {/* New route for the Contact Us page */}
      <Route path="/contact" element={<ContactUsPage />} />
       <Route path="/AuthPage" element={<AuthPage />} />
              <Route path="/UserProfiles" element={<UserProfiles />} />
               <Route path="/AdminCourseManagement" element={<AdminCourseManagement />} />
               <Route path="/about" element={<AboutUsPage />} />

    </Routes>
  );
};

export default AppRoutes;