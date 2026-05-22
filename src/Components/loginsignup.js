import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User } from "lucide-react";
import platformApi from "../services/platformApi";

const API_URL = "http://localhost:8081/user";
const ICON_SIZE = "18";

const DEMO_CREDENTIALS = {
  USER: {
    label: "User",
    email: "user@myfundraiser.com",
    password: "MyFundraiser#User2026",
    redirect: "/dashboard",
  },
  ADMIN: {
    label: "Admin",
    email: "admin@myfundraiser.com",
    password: "MyFundraiser#Admin2026",
    redirect: "/admin",
  },
};

const MailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FormInput = ({ iconSvg, type, name, placeholder, value, onChange, error, autoComplete }) => (
  <div className="relative mb-3">
    <div className="absolute left-3 top-1/2 -translate-y-1/2">{iconSvg}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100 ${
        error ? "border-red-400 bg-red-50" : "border-slate-200"
      }`}
    />
    {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
  </div>
);

const FeedbackToast = ({ text, type, onClose }) => {
  if (!text) return null;
  const success = type === "success";
  return (
    <div
      role="status"
      className={`fixed right-4 top-4 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg ${
        success ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"
      }`}
    >
      <div className="flex justify-between gap-2">
        <p className="font-medium">{text}</p>
        <button type="button" onClick={onClose} className="opacity-50 hover:opacity-100" aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
};

const Loginsignup = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setLoginOpen] = useState(true);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [rememberMe, setRememberMe] = useState(true);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});

  const activeAccount = DEMO_CREDENTIALS[selectedRole];

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fillCredentials = (role) => {
    const account = DEMO_CREDENTIALS[role];
    setSelectedRole(role);
    setLoginForm({ email: account.email, password: account.password });
  };

  const validateLogin = () => {
    const next = {};
    if (!loginForm.email.trim()) next.email = "Email is required";
    if (!loginForm.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateRegister = () => {
    const next = {};
    if (!registerForm.name.trim()) next.name = "Name is required";
    if (!registerForm.email.trim()) next.email = "Email is required";
    if (!registerForm.password || registerForm.password.length < 8) next.password = "Min 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const completeLogin = (demoAccount) => {
    localStorage.setItem("token", `demo-${demoAccount.label.toLowerCase()}`);
    localStorage.setItem("email", loginForm.email);
    localStorage.setItem("role", selectedRole);
    localStorage.setItem("user", JSON.stringify({ name: demoAccount.label, email: loginForm.email, role: selectedRole }));
    if (rememberMe) localStorage.setItem("rememberedRole", selectedRole);
    platformApi.logSecurityEvent({ type: "Login", user: loginForm.email, status: "Success" }).catch(() => {});
    setFeedback({ text: `${demoAccount.label} login successful.`, type: "success" });
    setTimeout(() => navigate(demoAccount.redirect), 600);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) {
      setFeedback({ text: "Please fix the highlighted fields.", type: "error" });
      return;
    }

    const demoAccount = DEMO_CREDENTIALS[selectedRole];
    if (loginForm.email === demoAccount.email && loginForm.password === demoAccount.password) {
      completeLogin(demoAccount);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: loginForm.email,
        password: loginForm.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", loginForm.email);
      localStorage.setItem("role", "USER");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data;
      setFeedback({ text: message || "Invalid credentials", type: "error" });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    try {
      await axios.post(`${API_URL}/register`, registerForm);
      setFeedback({ text: "Registration successful.", type: "success" });
      setRegisterOpen(false);
      setLoginOpen(true);
    } catch (err) {
      setFeedback({
        text: err.response?.data?.message || "Registration failed",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedRole");
    if (remembered && DEMO_CREDENTIALS[remembered]) {
      setSelectedRole(remembered);
      setLoginForm({
        email: DEMO_CREDENTIALS[remembered].email,
        password: DEMO_CREDENTIALS[remembered].password,
      });
    }
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-slate-100 px-4 py-8">
      <FeedbackToast text={feedback?.text} type={feedback?.type} onClose={() => setFeedback(null)} />

      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[300px_1fr]">
        {/* Brand panel — compact pattern, no large photo */}
        <aside
          className="relative hidden flex-col justify-between overflow-hidden bg-teal-900 p-6 text-white lg:flex"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 45%),
              radial-gradient(circle at 80% 70%, rgba(45,212,191,0.15) 0%, transparent 40%),
              linear-gradient(160deg, #0f766e 0%, #134e4a 55%, #0f172a 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 12px)`,
            }}
          />
          <div className="relative">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <ShieldCheck size={20} className="text-teal-100" />
            </div>
            <h1 className="text-xl font-bold leading-snug">MyFundraiser</h1>
            <p className="mt-2 text-sm leading-relaxed text-teal-100/90">
              Sign in to manage campaigns, track donations, and run your workspace.
            </p>
          </div>
          <ul className="relative space-y-2 text-xs text-teal-100/80">
            <li>· Secure local demo accounts</li>
            <li>· User → Dashboard · Admin → Console</li>
          </ul>
        </aside>

        {/* Form */}
        <section className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2 lg:hidden">
            <ShieldCheck size={18} className="text-teal-700" />
            <span className="text-sm font-bold text-slate-900">MyFundraiser</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">{isLoginOpen ? "Sign in" : "Create account"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLoginOpen ? "Choose role and enter credentials." : "Register as a new user."}
          </p>

          {isLoginOpen && (
            <form className="mt-5" onSubmit={handleLoginSubmit} autoComplete="off">
              <div className="mb-3 flex gap-1 rounded-lg bg-slate-100 p-1">
                {Object.entries(DEMO_CREDENTIALS).map(([role, account]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition ${
                      selectedRole === role ? "bg-teal-800 text-white" : "text-slate-600"
                    }`}
                  >
                    {role === "ADMIN" ? <ShieldCheck size={14} /> : <User size={14} />}
                    {account.label}
                  </button>
                ))}
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {Object.entries(DEMO_CREDENTIALS).map(([role, account]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => fillCredentials(role)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-teal-400 hover:text-teal-800"
                  >
                    Fill {account.label} demo
                  </button>
                ))}
              </div>

              <p className="mb-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                Opens <span className="font-mono text-slate-700">{activeAccount.redirect}</span> · Chrome password warnings are from old demo leaks, not this app.
              </p>

              <FormInput
                iconSvg={MailIcon}
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="username"
                value={loginForm.email}
                onChange={(e) => handleChange(e, "login")}
                error={errors.email}
              />
              <FormInput
                iconSvg={LockIcon}
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => handleChange(e, "login")}
                error={errors.password}
              />

              <label className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700"
                />
                Remember role
              </label>

              <button type="submit" className="w-full rounded-lg bg-teal-800 py-2.5 text-sm font-bold text-white hover:bg-teal-900">
                Login as {activeAccount.label}
              </button>

              <p className="mt-4 text-center text-sm text-slate-600">
                No account?
                <button
                  type="button"
                  className="ml-1 font-bold text-teal-700 hover:underline"
                  onClick={() => {
                    setLoginOpen(false);
                    setRegisterOpen(true);
                    setErrors({});
                  }}
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {isRegisterOpen && (
            <form className="mt-5" onSubmit={handleRegisterSubmit}>
              <FormInput iconSvg={UserIcon} type="text" name="name" placeholder="Full name" value={registerForm.name} onChange={(e) => handleChange(e, "register")} error={errors.name} />
              <FormInput iconSvg={MailIcon} type="email" name="email" placeholder="Email" value={registerForm.email} onChange={(e) => handleChange(e, "register")} error={errors.email} />
              <FormInput iconSvg={UserIcon} type="tel" name="phone" placeholder="Phone (optional)" value={registerForm.phone} onChange={(e) => handleChange(e, "register")} error={errors.phone} />
              <FormInput iconSvg={LockIcon} type="password" name="password" placeholder="Password (8+ chars)" value={registerForm.password} onChange={(e) => handleChange(e, "register")} error={errors.password} />

              <button type="submit" className="w-full rounded-lg bg-teal-800 py-2.5 text-sm font-bold text-white hover:bg-teal-900">
                Create account
              </button>

              <p className="mt-4 text-center text-sm text-slate-600">
                Have an account?
                <button
                  type="button"
                  className="ml-1 font-bold text-teal-700 hover:underline"
                  onClick={() => {
                    setRegisterOpen(false);
                    setLoginOpen(true);
                    setErrors({});
                  }}
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Loginsignup;
