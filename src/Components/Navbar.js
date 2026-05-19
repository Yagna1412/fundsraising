import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginSignup");
  };

  return (
    <nav className="bg-teal-700 text-white px-6 py-4 flex justify-between items-center shadow-lg relative">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        MyFundraiser
      </h1>

      <div className="flex space-x-8 text-lg relative">

        <Link to="/" className="hover:text-gray-300">Home</Link>

       
        <div
          className="relative"
          onMouseEnter={() => setShowContact(true)}
          onMouseLeave={() => setShowContact(false)}
        >
          <span className="cursor-pointer hover:text-gray-300">Contact</span>

          {showContact && (
            <div className="absolute top-8 left-0 bg-white text-black p-4 rounded-lg shadow-xl w-52 z-50 border">
              <p className="font-semibold">📞 Phone</p>
              <p className="mb-2 text-sm">123-456-7890</p>

              <p className="font-semibold">📧 Email</p>
              <p className="mb-2 text-sm">support@myfundraiser.com</p>

              <p className="font-semibold">📍 Address</p>
              <p className="text-sm">Hyderabad, India</p>
            </div>
          )}
        </div>

       
        {!token ? (
          <Link to="/loginSignup" className="hover:text-gray-300">
            Login / Signup
          </Link>
        ) : (
          <>
            {role === "ADMIN" ? (
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
            ) : (
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            )}

            <button onClick={handleLogout} className="hover:text-red-300 font-semibold">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
