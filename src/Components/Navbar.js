import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

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

      <div className="flex space-x-8 text-lg relative" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        <Link to="/" className="hover:text-gray-300" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>

       
        <div
          className="relative"
          onMouseEnter={() => setShowContact(true)}
          onMouseLeave={() => setShowContact(false)}
          style={{ position: 'relative' }}
        >
          <span className="cursor-pointer hover:text-gray-300">Contact</span>

          {showContact && (
            <div className="absolute top-8 left-0 bg-white text-black p-4 rounded-lg shadow-xl w-52 z-50 border" style={{ position: 'absolute', top: '30px', left: 0, backgroundColor: 'white', color: 'black', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', width: '200px', zIndex: 100, border: '1px solid #e5e7eb' }}>
              <p className="font-semibold" style={{ margin: '0 0 5px 0', fontWeight: 600 }}>📞 Phone</p>
              <p className="mb-2 text-sm" style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4b5563' }}>123-456-7890</p>

              <p className="font-semibold" style={{ margin: '0 0 5px 0', fontWeight: 600 }}>📧 Email</p>
              <p className="mb-2 text-sm" style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4b5563' }}>support@myfundraiser.com</p>

              <p className="font-semibold" style={{ margin: '0 0 5px 0', fontWeight: 600 }}>📍 Address</p>
              <p className="text-sm" style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>Hyderabad, India</p>
            </div>
          )}
        </div>

       
        {!token ? (
          <Link to="/loginSignup" className="hover:text-gray-300" style={{ textDecoration: 'none', color: 'white' }}>
            Login / Signup
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/dashboard" className="hover:text-gray-300" style={{ textDecoration: 'none', color: 'white' }}>User Dashboard</Link>
            <Link to="/admin" className="hover:text-gray-300 ml-2" style={{ textDecoration: 'none', color: 'white' }}>Admin Dashboard</Link>

            <button 
              onClick={handleLogout} 
              className="bg-teal-900 hover:bg-teal-950 text-white px-4 py-2 rounded-lg font-semibold transition" 
              style={{ background: '#0e5c59', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
