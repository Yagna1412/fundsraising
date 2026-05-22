import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Loginsignup from "./Components/loginsignup";

import FundCategories from "./Components/FundCategories";
import CreateFundraiser from "./Components/CreateFundraiser";
import UserDashboard from "./Components/UserDashboard";

import CategoryDetails from "./Components/CategoryDetails";
import Campaigns from "./Components/Campaigns";
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

const Unauthorized = () => (
<div style={{ textAlign: "center", padding: "100px" }}>
<h1>❌ Access Denied</h1>
<p>You do not have permission.</p>
</div>
);

function App() {
return (
<Router>

<Navbar />

<div
style={{
minHeight: "70vh",
background: "#F4F5F7"
}}
>

<Routes>

<Route path="/" element={<Home />} />

<Route
path="/loginSignup"
element={<Loginsignup />}
/>

<Route
path="/campaigns"
element={
<ProtectedRoute>
<Campaigns />
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

<Route
path="/unauthorized"
element={<Unauthorized />}
/>

</Routes>

</div>

<ChatBot />

<Footer />

</Router>
);
}

export default App;
