import React, { useRef, useState } from "react";
import logo from "../../assets/ez-logo.png";
import userImg from "../../assets/Users.png";
import element1 from "../../assets/element3.png"
import element2 from  "../../assets/element4.png"
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

      if (passwordRef.current) {
    passwordRef.current.value = "";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#99DEEF] to-[#799EFF] px-4">
  
        <img
          src={element1}
          alt="Background Element"
          className="block md:hidden absolute inset-0 w-full h-full object-cover z-0 overflow-hidden"
        />

        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

            <div className="relative flex justify-center items-center p-4 z-20 drop-shadow-lg">
              <img
                src={element2}
                alt="Background Element"
                className="hidden md:block absolute inset-0 w-full h-full object-cover z-0 scale-100 md:scale-180"
              />
              <img
                src={logo}
                alt="EZTech Logo"
                className="w-sm md:w-[325px] mt-13 object-contain z-10"
              />
            </div>

            <div className="flex justify-center items-center p-4 z-20">
              
              <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-[inset_0_15px_30px_rgba(255,255,255,0.1),inset_0_-15px_30px_rgba(255,255,255,0.4)]
              rounded-2xl px-6 py-4 w-full max-w-sm">
                
                <div
                  className="w-35 h-35 mx-auto rounded-full bg-no-repeat bg-cover drop-shadow-sm"
                  style={{ backgroundImage: `url(${userImg})` }}>
                </div>
                

                <h2 className="text-center text-xl font-medium text-black mb-3">
                 <span className="wave-hand text-3xl">👋</span> Hello,<span className="italic"> Welcome Back!</span>
                </h2>

                {error && (
                  <div className="flex items-center justify-center text-red-700 text-base rounded-xl px-4 py-1 mb-4 bg-red-500/10 backdrop-blur-sm">
                    <span className="mr-2">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm italic text-gray-800 ml-2">Email</label>
                    <input
                      type="email"
                      ref={emailRef}
                      className="w-full rounded-xl bg-white/30 shadow-inner shadow-gray-100/90 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm italic text-gray-800 ml-2">Password</label>
                    <input
                      type="password"
                      ref={passwordRef}
                      className="w-full rounded-xl bg-white/30 shadow-inner shadow-gray-100/90 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-[50%] bg-[#4067c4] drop-shadow-xl/50 text-black tracking-wide italic rounded-3xl py-2 mb-2 hover:bg-blue-700/90 transition text-gray filter drop-shadow-lg  opacity-90 transition shadow-inner shadow-gray-100/90"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>
            </div>
        </div>
      </div>
    );
  };

export default Login;
