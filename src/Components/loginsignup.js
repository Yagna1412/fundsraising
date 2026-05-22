import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const API_URL = "http://localhost:8081/user";
const ICON_SIZE = "20";
const DEMO_CREDENTIALS = {
  USER: {
    label: "User",
    email: "user@myfundraiser.com",
    password: "user123",
    redirect: "/dashboard",
  },
  ADMIN: {
    label: "Admin",
    email: "admin@myfundraiser.com",
    password: "admin123",
    redirect: "/admin",
  },
};

const MailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FormInput = ({ iconSvg, type, name, placeholder, value, onChange, error }) => (
  <div className="relative mb-5">
    <div className="absolute left-4 top-[22px] -translate-y-1/2">{iconSvg}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-2xl border bg-white px-4 py-3.5 pl-12 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-teal-500 hover:shadow-lg focus:border-teal-700 focus:ring-4 focus:ring-teal-100
        ${error ? "border-red-500 bg-red-50" : "border-slate-200"} `}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Loginsignup = () => {

  const navigate = useNavigate(); 
  const [isLoginOpen, setLoginOpen] = useState(true);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedRole, setSelectedRole] = useState("USER");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  
  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.email) newErrors.email = "Email is required.";
    if (loginForm.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerForm.name) newErrors.name = "Name is required.";
    if (!registerForm.email) newErrors.email = "Email is required.";
    if (registerForm.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    return newErrors;
  };

  const saveUserSession = (email, role = "USER", name = email.split("@")[0]) => {
    localStorage.setItem("token", `${role.toLowerCase()}_token_` + Date.now());
    localStorage.setItem("email", email);
    localStorage.setItem("username", name);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify({ name, email, role }));
  };

  const fillCredentials = (role) => {
    setSelectedRole(role);
    setLoginForm({
      email: DEMO_CREDENTIALS[role].email,
      password: DEMO_CREDENTIALS[role].password,
    });
    setErrors({});
    setFeedback(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback({ text: "Validation failed.", type: "error" });
      return;
    }

    const demoAccount = DEMO_CREDENTIALS[selectedRole];
    const isDemoLogin =
      loginForm.email.trim().toLowerCase() === demoAccount.email &&
      loginForm.password === demoAccount.password;

    if (isDemoLogin) {
      saveUserSession(loginForm.email, selectedRole, selectedRole === "ADMIN" ? "Admin" : "Demo User");
      setFeedback({ text: `${demoAccount.label} login successful. Redirecting...`, type: "success" });
      setTimeout(() => {
        navigate(demoAccount.redirect);
      }, 700);
      return;
    }

    try {
      await axios.post(`${API_URL}/login`, { email: loginForm.email, password: loginForm.password });
      
      saveUserSession(loginForm.email, selectedRole);

      setFeedback({ text: `${DEMO_CREDENTIALS[selectedRole].label} login successful. Redirecting...`, type: "success" });

      setTimeout(() => {
        navigate(DEMO_CREDENTIALS[selectedRole].redirect); 
      }, 700);

    } catch (error) {
      const msg = error.response?.data || "Invalid credentials";
      const message = typeof msg === 'string' ? msg : msg.error;

      if (message === "Invalid credentials") {
        setFeedback({ text: "Account not found or password is incorrect. Please register first.", type: "error" });
        setRegisterForm({
          name: "",
          email: loginForm.email,
          password: loginForm.password
        });

        setTimeout(() => {
          setLoginOpen(false);
          setRegisterOpen(true);
          setErrors({});
        }, 1200);
        return;
      }

      setFeedback({ text: message || "Invalid credentials", type: "error" });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${API_URL}`, { 
        name: registerForm.name,
        email: registerForm.email, 
        password: registerForm.password 
      });

      saveUserSession(registerForm.email, "USER", registerForm.name);

      setFeedback({
        text: "Registration Successful! Welcome.",
        type: "success"
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (error) {
      const errorMsg = error.response?.data;
      setFeedback({
        text: typeof errorMsg === 'string' ? errorMsg : "Registration Failed",
        type: "error"
      });
    }
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto grid min-h-[680px] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden bg-teal-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85"
            alt="Volunteers preparing donation boxes for people in need"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/95 via-teal-900/78 to-slate-950/88" />
          <div className="relative">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-teal-100 ring-1 ring-white/15">
              MyFundraiser secure access
            </p>
            <h1 className="max-w-lg text-5xl font-black leading-tight">
              Manage campaigns, donations, and impact from one place.
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-teal-50">
              Choose the correct role before signing in. Admin accounts open the operations dashboard, while user accounts open the personal fundraising dashboard.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4">
            {[
              ["38", "Active campaigns"],
              ["1.2K", "Donors"],
              ["24.8L", "Raised"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs font-semibold text-teal-100">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center lg:text-left">
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">
                {isLoginOpen ? "Welcome back" : "Create your account"}
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {isLoginOpen ? "Sign in to continue" : "Register as a fundraiser"}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {isLoginOpen ? "Select your role and use the matching credentials." : "New registrations are created as user accounts."}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl">
              {isLoginOpen && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5">
                    {Object.entries(DEMO_CREDENTIALS).map(([role, account]) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                          selectedRole === role
                            ? "bg-white text-teal-800 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {account.label}
                      </button>
                    ))}
                  </div>

                  <div className="mb-5 grid gap-3">
                    {Object.entries(DEMO_CREDENTIALS).map(([role, account]) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => fillCredentials(role)}
                        className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                          selectedRole === role ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-black text-slate-900">{account.label} credentials</p>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700 ring-1 ring-teal-100">
                            Use
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-500">Email: {account.email}</p>
                        <p className="text-xs font-semibold text-slate-500">Password: {account.password}</p>
                      </button>
                    ))}
                  </div>

                  <FormInput iconSvg={MailIcon} type="email" name="email" placeholder="Email"
                    value={loginForm.email} onChange={(e) => handleChange(e, "login")} error={errors.email} />

                  <FormInput iconSvg={LockIcon} type="password" name="password" placeholder="Password"
                    value={loginForm.password} onChange={(e) => handleChange(e, "login")} error={errors.password} />

                  <button className="w-full rounded-2xl bg-teal-700 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-xl">
                    Login as {DEMO_CREDENTIALS[selectedRole].label}
                  </button>

                  <p className="text-center mt-6 text-sm font-medium text-slate-600">
                    Don’t have an account?
                    <button type="button" className="text-[#007A8E] ml-1 font-black hover:underline"
                      onClick={() => { setLoginOpen(false); setRegisterOpen(true); setErrors({}); setFeedback(null); }}>
                      Register
                    </button>
                  </p>
                </form>
              )}

              {isRegisterOpen && (
                <form onSubmit={handleRegisterSubmit}>
                  <FormInput iconSvg={UserIcon} type="text" name="name" placeholder="Full Name"
                    value={registerForm.name} onChange={(e) => handleChange(e, "register")} error={errors.name} />

                  <FormInput iconSvg={MailIcon} type="email" name="email" placeholder="Email"
                    value={registerForm.email} onChange={(e) => handleChange(e, "register")} error={errors.email} />

                  <FormInput iconSvg={LockIcon} type="password" name="password" placeholder="Password"
                    value={registerForm.password} onChange={(e) => handleChange(e, "register")} error={errors.password} />

                  <button className="w-full rounded-2xl bg-teal-700 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-xl">
                    Create User Account
                  </button>

                  <p className="text-center mt-6 text-sm font-medium text-slate-600">
                    Already have an account?
                    <button type="button" className="text-[#007A8E] ml-1 font-black hover:underline"
                      onClick={() => { setRegisterOpen(false); setLoginOpen(true); setErrors({}); setFeedback(null); }}>
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      <FeedbackMessage text={feedback?.text} type={feedback?.type} />
    </div>
  );
};

const FeedbackMessage = ({ text, type }) => {
  if (!text) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-white text-black px-8 py-6 rounded-xl shadow-2xl border-2 z-50
        w-[350px] text-center">

      <h2 className={`text-2xl font-bold mb-3 ${type === "success" ? "text-green-600" : "text-red-600"}`}>
        {type === "success" ? "Success!" : "Action Failed"}
      </h2>

      <p className="text-lg text-gray-700">{text}</p>
    </div>
  );
};

export default Loginsignup;
