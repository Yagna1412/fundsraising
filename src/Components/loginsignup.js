import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const API_URL = "http://localhost:8081/user";
const ICON_SIZE = "20";

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
  <div className="relative mb-6">
    <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">{iconSvg}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full py-3 px-3 pl-10 rounded-lg placeholder-gray-400 border 
        ${error ? "border-red-500" : "border-gray-300"} `}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Loginsignup = () => {

  const navigate = useNavigate(); 
  const [isLoginOpen, setLoginOpen] = useState(true);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

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

  const saveUserSession = (email) => {
    localStorage.setItem("token", "user_token_" + Date.now());
    localStorage.setItem("email", email);
    localStorage.setItem("username", email);
    localStorage.setItem("role", "USER");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback({ text: "Validation failed.", type: "error" });
      return;
    }

    try {
      await axios.post(`${API_URL}/login`, { email: loginForm.email, password: loginForm.password });
      
      saveUserSession(loginForm.email);

      setFeedback({ text: `Login Successful! Welcome`, type: "success" });

      setTimeout(() => {
        navigate("/campaigns"); 
      }, 1500);

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

      saveUserSession(registerForm.email);

      setFeedback({
        text: "Registration Successful! Welcome.",
        type: "success"
      });

      setTimeout(() => {
        navigate("/campaigns");
      }, 1500);

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
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-100 p-4">
      {isLoginOpen && (
        <form onSubmit={handleLoginSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <h2 className="text-center mb-6 text-2xl font-bold text-[#007A8E]">Sign In</h2>

          <FormInput iconSvg={MailIcon} type="email" name="email" placeholder="Email"
            value={loginForm.email} onChange={(e) => handleChange(e, "login")} error={errors.email} />

          <FormInput iconSvg={LockIcon} type="password" name="password" placeholder="Password"
            value={loginForm.password} onChange={(e) => handleChange(e, "login")} error={errors.password} />

          <button className="w-full py-3 bg-[#007A8E] text-white rounded-lg hover:bg-[#005F6B] transition">Login</button>

          <p className="text-center mt-6 text-gray-600">
            Don’t have an account?
            <button type="button" className="text-[#007A8E] ml-1 underline"
              onClick={() => { setLoginOpen(false); setRegisterOpen(true); setErrors({}); }}>
              Register
            </button>
          </p>
        </form>
      )}
      {isRegisterOpen && (
        <form onSubmit={handleRegisterSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <h2 className="text-center mb-6 text-2xl font-bold text-[#007A8E]">Create Account</h2>

          <FormInput iconSvg={UserIcon} type="text" name="name" placeholder="Full Name"
            value={registerForm.name} onChange={(e) => handleChange(e, "register")} error={errors.name} />

          <FormInput iconSvg={MailIcon} type="email" name="email" placeholder="Email"
            value={registerForm.email} onChange={(e) => handleChange(e, "register")} error={errors.email} />

          <FormInput iconSvg={LockIcon} type="password" name="password" placeholder="Password"
            value={registerForm.password} onChange={(e) => handleChange(e, "register")} error={errors.password} />

          <button className="w-full py-3 bg-[#007A8E] text-white rounded-lg hover:bg-[#005F6B] transition">Register</button>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?
            <button type="button" className="text-[#007A8E] ml-1 underline"
              onClick={() => { setRegisterOpen(false); setLoginOpen(true); setErrors({}); }}>
              Login
            </button>
          </p>
        </form>
      )}

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
