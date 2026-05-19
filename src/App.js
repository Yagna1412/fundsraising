import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Loginsignup from "./Components/loginsignup";
import FundCategories from "./Components/Fund Categories";
import CreateFundraiser from "./Components/Create Fundraiser";
import UserDashboard from "./Components/User Dashboard";
import CategoryDetails from "./Components/CategoryDetails";
import Campaigns from "./Components/Campaigns";
import Donate from "./Components/Donate";
import Footer from "./Components/Footer";
import AdminDashboard from "./Components/AdminDashboard";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/loginSignup" replace />;

  if (role && role !== userRole)
    return <Navigate to="/unauthorized" replace />;

  return children;
};

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <h2 className="text-red-600 text-3xl font-bold mb-4">❌ Access Denied</h2>
    <p className="text-gray-600 text-lg">You do not have permission to view this page.</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />

      <div style={{ minHeight: "70vh", backgroundColor: "#f9f9f9" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loginSignup" element={<Loginsignup />} />

          <Route path="/campaigns" element={
            <ProtectedRoute>
               <Campaigns />
            </ProtectedRoute>
          } />

       
          <Route path="/fund-categories" element={
            <ProtectedRoute role="USER">
              <FundCategories />
            </ProtectedRoute>
          } />

          <Route path="/category/:name" element={
            <ProtectedRoute role="USER">
              <CategoryDetails />
            </ProtectedRoute>
          } />

          <Route path="/donate/:id" element={
            <ProtectedRoute role="USER">
              <Donate />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          } />

    
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/create-fundraiser" element={
            <ProtectedRoute role="ADMIN">
              <CreateFundraiser />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App