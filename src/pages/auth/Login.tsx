import React, { useRef, useState } from "react";
import logo from "../../assets/ez-logo.png";
import bgImg from "../../assets/Thumbnail.png";
import { useAuth } from "../../contexts/authContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
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
            className="absolute inset-0 w-full h-full object-cover overflow-hidden"
          />
        </div>

        <div className="relative max-w-2xl md:min-w-3xl 3xl:min-w-4xl rounded-xl overflow-hidden 
          backdrop-blur-md border border-white/5 bg-gradient-to-r from-white/50 to-gray-900/30
          shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.15),0_10px_30px_rgba(0,0,0,0.2)]">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-6">
              <img
                src={logo}
                alt="Logo"
                className="w-54"
              />
            </div>

            <div className="px-10 py-7">
              <form onSubmit={handleSubmit}>
                <p className="block text-xs font-semibold mb-2 text-white">
                  Email Address:
                </p>
                <input
                  autoComplete="on"
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  className="p-2 w-full bg-gray-800/20 rounded-lg text-xs 3xl:text-sm text-white border border-gray-100/30 outline-none focus:ring-1 focus:ring-gray-200"
                  required
                />

                <div className="relative">
                  <p className="block text-xs font-semibold mt-4 mb-2 text-white">
                    Password:
                  </p>
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 mb-2 w-full bg-gray-800/20 rounded-lg text-xs 3xl:text-sm text-white border border-gray-100/30 outline-none focus:ring-1 focus:ring-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`
                      absolute inset-y-10 right-3 flex items-center
                      text-gray-300 hover:text-gray-100 cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${password.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 3xl:h-6 w-5 3xl:w-6" viewBox="0 0 32 32">
                        <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
                          <path d="M29 16c0 3-5.82 9-13 9S3 19 3 16s5.82-9 13-9s13 6 13 9Z"/>
                          <path d="M21 16a5 5 0 1 1-10 0a5 5 0 0 1 10 0Z"/>
                        </g>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 36 36">
                        <path fill="currentColor" d="M25.19 20.4a6.78 6.78 0 0 0 .43-2.4a6.86 6.86 0 0 0-6.86-6.86a6.79 6.79 0 0 0-2.37.43L18 13.23a4.78 4.78 0 0 1 .74-.06A4.87 4.87 0 0 1 23.62 18a4.79 4.79 0 0 1-.06.74Z"/>
                        <path fill="currentColor" d="M34.29 17.53c-3.37-6.23-9.28-10-15.82-10a16.82 16.82 0 0 0-5.24.85L14.84 10a14.78 14.78 0 0 1 3.63-.47c5.63 0 10.75 3.14 13.8 8.43a17.75 17.75 0 0 1-4.37 5.1l1.42 1.42a19.93 19.93 0 0 0 5-6l.26-.48Z"/>
                        <path fill="currentColor" d="m4.87 5.78l4.46 4.46a19.52 19.52 0 0 0-6.69 7.29l-.26.47l.26.48c3.37 6.23 9.28 10 15.82 10a16.93 16.93 0 0 0 7.37-1.69l5 5l1.75-1.5l-26-26Zm9.75 9.75l6.65 6.65a4.81 4.81 0 0 1-2.5.72A4.87 4.87 0 0 1 13.9 18a4.81 4.81 0 0 1 .72-2.47Zm-1.45-1.45a6.85 6.85 0 0 0 9.55 9.55l1.6 1.6a14.91 14.91 0 0 1-5.86 1.2c-5.63 0-10.75-3.14-13.8-8.43a17.29 17.29 0 0 1 6.12-6.3Z"/>
                        <path fill="none" d="M0 0h36v36H0z"/>
                      </svg>
                    )}
                  </button>
                </div>

                <button
                  id="submit-button"
                  type="submit"
                  className="mt-6 w-full py-2 text-xs 3xl:text-sm font-medium rounded-lg text-white disabled:opacity-50 
                  bg-blue-500 hover:opacity-80 hover:cursor-pointer transition-colors duration-500 ease-in-out"
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


      