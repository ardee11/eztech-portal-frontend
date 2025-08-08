import React, { useRef, useState } from "react";
import logo from "../../assets/ez-logo.png";
import userImg from "../../assets/User.png";
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
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#99DEEF] px-4">
      
      <div className="flex-1 flex justify-center">
        <img src={logo} alt="EZTech Logo" className="max-w-xs" />
      </div>

      
      <div className="flex-1 flex justify-center">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-lg rounded-2xl p-8 w-[320px]">
         
          <div
            className="w-20 h-20 mx-auto rounded-full bg-no-repeat bg-cover mb-4 shadow-md"
            style={{ backgroundImage: `url(${userImg})` }}
          ></div>

         
          <h2 className="text-center text-lg font-medium text-black mb-6">
            Hello, Welcome Back!
          </h2>

          
          {error && (
            <p className="text-center text-red-500 text-sm mb-4">{error}</p>
          )}

         
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm italic text-gray-800">
                Email
              </label>
              <input
                type="email"
                ref={emailRef}
                className="w-full rounded-lg bg-white/30 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm italic text-gray-800">
                Password
              </label>
              <input
                type="password"
                ref={passwordRef}
                className="w-full rounded-lg bg-white/30 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

           
            <button
              type="submit"
              disabled={loading}
              className="w-[50%] bg-[#4067c4] text-white rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
