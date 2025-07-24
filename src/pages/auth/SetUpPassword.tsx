import React, { useState } from "react";
import logo from "../../assets/ez-logo.png";
import bgImg from "../../assets/Thumb.png";
import { useNavigate, useSearchParams } from "react-router-dom";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;

function SetUpPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admins/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Failed to set password");
        }
        throw new Error(data.message || "Failed to set password");
      }
      
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p>Invalid link. Contact your IT administrator.</p>;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="absolute inset-0">
        <img src={bgImg} alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="absolute w-full max-w-xs sm:max-w-sm rounded-xl border border-white/30 bg-white/60 backdrop-blur-xl shadow-xl p-5 backdrop-saturate-150">
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
                <label htmlFor="password" className="block text-xs font-semibold mb-2 text-gray-800">
                  New Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 w-full border border-black/50 rounded-lg text-xs focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="confirmPassRef" className="block text-xs font-semibold mb-2 text-gray-800">
                  Password:
                </label>
                <input
                  type="password"
                  name="confirmPassRef"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
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

export default SetUpPassword;
