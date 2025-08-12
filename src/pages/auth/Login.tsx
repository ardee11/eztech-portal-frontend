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
  const [showPassword, setShowPassword] = useState(false);

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
      setError("Invalid email or password, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("errorModal");
    if (modal) {
      modal.classList.add("hidden");
    }
  };

  return (
    <>
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
                className="w-32"
              />
              <p className="mt-5 text-md text-white/80 text-center font-bold">
                Welcome to EZTech Portal
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="p-2 mb-2 w-full bg-white/30 rounded-lg text-xs text-white border-none outline-none focus:ring-1 focus:ring-white"
                />

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showPassword" className="text-xs text-white">
                    Show password
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-2 text-xs font-medium rounded-lg text-white bg-blue-500 disabled:opacity-50 
                  hover:text-white hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-600 hover:cursor-pointer transition-colors duration-500 ease-in-out"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div id="errorModal" className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${error ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center transform transition-all duration-300 ${error ? "scale-100" : "scale-95"}`}>
            <h2 className="mt-5 text-lg font-semibold text-red-600">Login Failed</h2>
              <p className="text-sm text-gray-600 mt-2">
                {error}
              </p>
              <button onClick={closeModal} className="mt-10 px-3 py-2 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:cursor-pointer transition-colors duration-300">
                Return to Login
              </button>
        </div>
      </div>
    </>
  );
};

export default Login;
