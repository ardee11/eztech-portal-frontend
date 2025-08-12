import React, { useRef, useState } from "react";
import logo from "../../assets/ez-logo.png";
import bgImg from "../../assets/testbg.png";
import { useAuth } from "../../contexts/authContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
  
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
  
    try {
      await login(email, password);
      //localStorage.setItem("user", JSON.stringify(user));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center">
    <div className="absolute inset-0">
      <img
        src={bgImg}
        alt="Background"
        className="w-full h-full object-cover"
        style={{ filter: "blur(2px)" }}
      />
    </div>

    <div className="relative w-[700px] rounded-xl overflow-hidden bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.37)]">
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-xl">
          <img
            src={logo}
            alt="Logo"
            className="w-32 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          />
          <p className="mt-5 text-sm text-white/80 text-center">
            Welcome to EZTech Portal
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                className={`p-3 mx-0 rounded-md mb-2 text-xs font-semibold text-center ${
                  error ? "bg-red-50/60 text-red-500" : "bg-green-50/60 text-green-500"
                }`}
              >
                {error ? error : "Login link sent! Check your email."}
              </div>
            )}

            <label className="block text-xs font-semibold mb-2 text-white">
              Email Address:
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              className="p-2 mb-4 w-full bg-white/30 rounded-lg text-xs text-white border-none outline-none focus:ring-1 focus:ring-white"
            />

            <label className="block text-xs font-semibold mb-2 text-white">
              Password:
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              name="password"
              className="p-2 mb-4 w-full bg-white/30 rounded-lg text-xs text-white border-none outline-none focus:ring-1 focus:ring-white"
            />

            <button
              type="submit"
              className="mt-6 w-full py-2 text-xs font-medium rounded-lg text-white bg-blue-500 hover:text-white hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-600 disabled:opacity-50 hover:cursor-pointer transition-colors duration-500 ease-in-out"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
);
};

export default Login;
