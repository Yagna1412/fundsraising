import React, { useState } from "react";
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../services/backendApi";

const Navbar = () => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const landingPath = token ? (role === "ADMIN" ? "/admin" : "/dashboard") : "/";

  const closeMenu = () => {
    setMenuOpen(false);
    setShowContact(false);
  };

  const handleLogout = () => {
    clearAuthSession();
    closeMenu();
    navigate("/loginSignup");
  };

  const navLinkClass = "rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-teal-50";

  return (
    <nav className="relative z-[100] bg-teal-700 text-white shadow-lg">
      <div className="mx-auto flex min-h-16 w-full max-w-[1720px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="shrink-0 text-xl font-bold sm:text-2xl"
          onClick={() => {
            closeMenu();
            navigate(landingPath);
          }}
        >
          MyFundraiser
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {!token && <Link to="/" className={navLinkClass}>Home</Link>}
          <div
            className="relative"
            onMouseEnter={() => setShowContact(true)}
            onMouseLeave={() => setShowContact(false)}
          >
            <button
              type="button"
              onClick={() => setShowContact((visible) => !visible)}
              className={`${navLinkClass} inline-flex items-center gap-1`}
            >
              Contact <ChevronDown size={15} />
            </button>
            {showContact && <ContactCard />}
          </div>
          {!token ? (
            <Link to="/loginSignup" className={navLinkClass}>Login / Signup</Link>
          ) : (
            <>
              <Link to="/campaigns" className={navLinkClass}>Explore Campaigns</Link>
              {role === "USER" && <Link to="/dashboard" className={navLinkClass}>User Dashboard</Link>}
              {role === "ADMIN" && <Link to="/admin" className={navLinkClass}>Admin Dashboard</Link>}
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-950"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/15 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {!token && <Link to="/" onClick={closeMenu} className={navLinkClass}>Home</Link>}
            <button
              type="button"
              onClick={() => setShowContact((visible) => !visible)}
              className={`${navLinkClass} flex w-full items-center justify-between text-left`}
            >
              Contact <ChevronDown size={15} />
            </button>
            {showContact && <ContactCard mobile />}
            {!token ? (
              <Link to="/loginSignup" onClick={closeMenu} className={navLinkClass}>Login / Signup</Link>
            ) : (
              <>
                <Link to="/campaigns" onClick={closeMenu} className={navLinkClass}>Explore Campaigns</Link>
                {role === "USER" && <Link to="/dashboard" onClick={closeMenu} className={navLinkClass}>User Dashboard</Link>}
                {role === "ADMIN" && <Link to="/admin" onClick={closeMenu} className={navLinkClass}>Admin Dashboard</Link>}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-teal-900 px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const ContactCard = ({ mobile = false }) => (
  <div
    className={
      mobile
        ? "mb-2 rounded-lg bg-white p-4 text-slate-700 shadow"
        : "absolute left-0 top-full z-50 mt-1 w-60 rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-xl"
    }
  >
    <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Phone size={15} /> Phone</p>
    <p className="mb-3 mt-1 text-sm">123-456-7890</p>
    <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Mail size={15} /> Email</p>
    <p className="mb-3 mt-1 break-all text-sm">support@myfundraiser.com</p>
    <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><MapPin size={15} /> Address</p>
    <p className="mt-1 text-sm">Hyderabad, India</p>
  </div>
);

export default Navbar;
