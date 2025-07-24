import React, { useRef, useState } from "react";
import logo from "../../assets/ez-logo.png";
import bgImg from "../../assets/Thumb.png";
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
        <img src={bgImg} alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="absolute w-full max-w-xs sm:max-w-sm rounded-xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-xl p-5 backdrop-saturate-150">
        <div className="text-center">
          <img src={logo} className="w-32 h-auto mx-auto" alt="Logo" />
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            {(error) && (
              <div
                className={`p-3 mx-12 rounded-md mb-2 text-xs font-semibold text-center ${
                  error ? "bg-red-50/60 text-red-500" : "bg-green-50/60 text-green-500"
                }`}
              >
                {error ? error : "Login link sent! Check your email."}
              </div>
            )}
            <div className="grid sm:px-3">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold mb-2 text-gray-800">
                  Email Address:
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  className="p-2 w-full border border-black/50 rounded-lg text-xs focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="password" className="block text-xs font-semibold mb-2 text-gray-800">
                  Password:
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  id="password"
                  name="password"
                  className="p-2 w-full border border-black/50 rounded-lg text-xs focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-2 text-xs font-medium rounded-lg bg-blue-600 text-gray-200 hover:bg-blue-700 disabled:opacity-50 hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
