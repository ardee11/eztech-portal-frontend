import { useState } from "react";
import { useAddAdmin } from "../../../hooks/useAdmin";
import { ClipLoader } from "react-spinners";

type AdminModalProps = {
  onClose?: () => void;
};

const AdminModal = ({ onClose }: AdminModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("Sales");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFormValid = name.trim() !== "" && email.trim() !== "" && position.trim() !== "" && role.trim() !== "";
  const { addAdmin } = useAddAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const result = await addAdmin(name, email, position, role);
    
    if (!result.success) {
      setError(result.error || "Something went wrong");
    } else {
      resetFormField();
    }
  
    setLoading(false);
  };

  const resetFormField = () => {
    setName("");
    setEmail("");
    setPosition("");
    setRole("Sales");
  };

  return (
    <>
      <div
        id="hs-modal-form"
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden overflow-y-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-modal-form-label"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-3 sm:mx-auto">
          <div className="px-8 py-6">
            <div className="text-center">
              <h3 id="admin-modal-label" className="text-lg font-bold text-gray-800">
                Add New Admin
              </h3>
              <p className="mt-2 text-xs text-gray-600">Enter the details below to add a new admin.</p>
            </div>

            {/* Form */}
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* Position Field */}
                <div>
                  <label htmlFor="position" className="block text-xs mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    autoComplete="organization-title"
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-xs mb-1">
                    Role
                  </label>
                  <select id="role" autoComplete="off" className="py-2 px-1 block w-full text-xs border border-gray-500 rounded-lg" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Inventory Viewer">Inventory Viewer</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <div className="flex justify-between sm:mx-16 items-center">
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="text-xs px-10 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer disabled:bg-teal-100 disabled:pointer-events-none transition"
                    aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-success-modal" data-hs-overlay="#hs-success-modal"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="text-xs px-10 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 hover:cursor-pointer transition"
                    onClick={()=>resetFormField()}
                    data-hs-overlay={!error ? `#hs-modal-form` : ""}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {!error && (
      <div
        id="hs-success-modal"
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden overflow-y-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-success-modal-label"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          {!loading ? (
            <>
              <h2 className="text-xl font-bold text-gray-800">Admin Added Successfully</h2>
            </>
          ) : (
            <div>
              <ClipLoader color="#3498db" size={32} />
            </div>
          )}
            <button
              onClick={() => {
                if (onClose) onClose();
              }}
              className="mt-4 bg-teal-500 text-xs text-white px-4 py-2 rounded-lg hover:bg-teal-600 hover:cursor-pointer transition disabled:bg-teal-100"
              data-hs-overlay="#hs-success-modal"
              disabled={loading}
            >
              Close
            </button>
        </div>
      </div>
      )}
    </>
  );
};

export default AdminModal;
