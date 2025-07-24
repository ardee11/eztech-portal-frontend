import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { setUserPassword, useRemoveNoPassword } from "../../contexts/authContext/auth";

const SetPasswordModal: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    const trigger = document.querySelector('[data-hs-overlay="#hs-modal-set-password"]') as HTMLElement;
    if (trigger) {
      trigger.click();
    }
  }, []);

  const handleSetPassword = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error("No user signed in");
      }

      await setUserPassword(auth.currentUser, newPassword);
      
      await useRemoveNoPassword(auth.currentUser.email);

      setSuccess(true);
    } catch (err) {
      setError("Failed to update password.");
    } finally {
      setLoading(false); 
    }
  };
  
  return (
    <>
      <div data-hs-overlay="#hs-modal-set-password" className="hidden"></div>

      <div
        id="hs-modal-set-password"
        className="hs-overlay hidden fixed inset-0 z-80 flex items-center justify-center overflow-x-hidden overflow-y-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-modal-set-password-label"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xs pointer-events-auto">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h3
                  id="hs-modal-set-password-label"
                  className="block text-lg font-semibold text-gray-800"
                >
                  Set Your Password
                </h3>
                <div className="mt-4">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full text-xs px-4 py-2 border rounded-lg focus:outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                  {success && (
                    <p className="mt-2 text-sm text-green-600">
                      Password updated successfully!
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={handleSetPassword}
                    className={`py-2 px-4 text-white text-xs font-medium rounded-lg ${
                      loading || success
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 hover:cursor-pointer"
                    }`}
                    disabled={loading || success}
                  >
                    Save Password
                  </button>
                  <button
                    type="button"
                    disabled={!success}                  
                    className="py-2 px-4 text-white text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 hover:cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
                    data-hs-overlay="#hs-modal-set-password"
                  >
                    Close
                  </button>            
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPasswordModal;
