import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Loginsignup from "./Components/loginsignup";

import FundCategories from "./Components/FundCategories";
import CreateFundraiser from "./Components/CreateFundraiser";
import UserDashboard from "./Components/UserDashboard";

import CategoryDetails from "./Components/CategoryDetails";
import Campaigns from "./Components/Campaigns";
import CampaignDetails from "./Components/CampaignDetails";
import Donate from "./Components/Donate";
import Footer from "./Components/Footer";
import AdminDashboard from "./Components/AdminDashboard";
import ChatBot from "./Components/ChatBot";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/loginSignup" replace />;
  }

  if (role && currentRole !== role && currentRole !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const PublicHomeRoute = () => {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");

  if (token) {
    return <Navigate to={currentRole === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }

  return <Home />;
};

const Unauthorized = () => (
  <div style={{ textAlign: "center", padding: "100px" }}>
    <h1>❌ Access Denied</h1>
    <p>You do not have permission.</p>
  </div>
);

function AppShell() {
  const { pathname } = useLocation();
  const isAdminWorkspace = pathname.startsWith("/admin");

  return (
    <>
      <Navbar />

      <div
        className={isAdminWorkspace ? "min-h-screen w-full bg-slate-50" : "min-h-[70vh] w-full bg-[#F4F5F7]"}
      >
        <Routes>
          <Route path="/" element={<PublicHomeRoute />} />
          <Route path="/loginSignup" element={<Loginsignup />} />

          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaigns/:id"
            element={
              <ProtectedRoute>
                <CampaignDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fund-categories"
            element={
              <ProtectedRoute role="USER">
                <FundCategories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category/:name"
            element={
              <ProtectedRoute role="USER">
                <CategoryDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donate/:id"
            element={
              <ProtectedRoute role="USER">
                <Donate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-fundraiser"
            element={
              <ProtectedRoute role="USER">
                <CreateFundraiser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>

      {!isAdminWorkspace && <ChatBot />}
      {!isAdminWorkspace && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
