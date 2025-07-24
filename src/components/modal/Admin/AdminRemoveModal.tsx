import { useState } from "react";
import { removeAdmin } from "../../../hooks/useAdmin";
//import { useAuth } from "../../contexts/authContext";
import { ClipLoader } from "react-spinners";

type AdminModalProps = {
  aid: number;
  safeEmail: string;
  onClose?: () => void;
};


const AdminRemoveModal = ({aid, safeEmail, onClose}: AdminModalProps) => {
  //const { currentUser } = useAuth();
  //const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await removeAdmin(aid);
     if(result.success) {
       setSuccess(true);
     } else if(result.error) {
      setError(result.error);
     }
    setLoading(false);
  };

  const reset = () => {
    setSuccess(false);
    setError("");
    if (onClose && success) onClose();
  };

  return (
    <>
      <div 
        id={`hs-modal-admin-${safeEmail}`}
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden overflow-y-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby={`hs-modal-admin-${safeEmail}-label`}
      >
        <div className="bg-white rounded-xl shadow-2xl w-[95%] max-w-lg mx-auto sm:w-full sm:mx-auto">
          <div className="p-6 mt-2 text-sm">
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

              <div className="grid gap-y-3">  
                <div className="block text-sm text-center">
                  <p className="font-semibold text-black mb-2"> Are you sure you want to remove this admin?</p>
                  <p className="text-xs italic text-red-500">This action cannot be undone.</p>
                </div>

                <div className="flex justify-between mx-8 sm:mx-26 items-center mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-xs px-8 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer disabled:bg-teal-100 disabled:pointer-events-none transition"
                    aria-haspopup="dialog" aria-expanded="false" aria-controls={`hs-msg-remove-modal-${safeEmail}`} data-hs-overlay={`#hs-msg-remove-modal-${safeEmail}`}
                  >
                    Submit
                  </button>
                  <button
                    onClick={reset}
                    type="button"
                    className="ml-4 text-xs px-8 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 hover:cursor-pointer transition"
                    data-hs-overlay={`#hs-modal-admin-${safeEmail}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>    
      </div>

      <div
        id={`hs-msg-remove-modal-${safeEmail}`}
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden overflow-y-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby={`hs-msg-remove-modal-${safeEmail}-label`}
      >
        <div className="bg-white py-5 rounded-lg shadow-lg max-w-sm w-full text-center">
          {success ? (
            <div>
              <p className="text-lg font-bold text-gray-800">Successfully removed!</p>
            </div>
          ) : !success && error ? (
            <div>
              <p className="text-lg font-bold text-gray-800">Action Failed! Please try again.</p> 
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : (
            <div>
              <ClipLoader color="#3498db" size={32} />
            </div>
          )}
          
          <button
            onClick={reset}
            className="mt-6 bg-teal-500 text-xs text-white px-6 py-2 rounded-lg hover:bg-teal-600 hover:cursor-pointer transition disabled:bg-teal-100"
            data-hs-overlay={`#hs-msg-remove-modal-${safeEmail}`}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminRemoveModal;
