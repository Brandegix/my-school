import { Routes, Route } from "react-router-dom";
import Home from "../components/Home"; // Correct

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
