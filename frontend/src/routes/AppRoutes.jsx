import { Routes, Route } from "react-router-dom";
import Home from "../components/home"; // Corrected component name to follow convention
import ContactUsPage from "../components/ContactUsPage"; // Import the ContactUsPage component

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route for the Home page */}
      <Route path="/" element={<Home />} />

      {/* New route for the Contact Us page */}
      <Route path="/contact" element={<ContactUsPage />} />
    </Routes>
  );
};

export default AppRoutes;