import { useState } from "react";
import { useAddAdmin } from "../../../hooks/useAdmin";
import { ClipLoader } from "react-spinners";
import { showToast } from "../../../utils/toastUtils";

type AdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
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
      showToast("Failed to add admin. Please try again.", "error");
    } else {
      resetFormField();
      showToast("Admin added successfully!", "success");
    }
  
    setLoading(false);
  };

  const resetFormField = () => {
    setName("");
    setEmail("");
    setPosition("");
    setRole("Sales");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
          <div className="bg-white animate-expand-card rounded-lg px-8 py-6 max-w-xl max-h-120 flex flex-col">
            <div className="delay-show flex flex-col h-full">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Add Admin</h3>

                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form id="addAdmin" onSubmit={handleSubmit} className="px-6 flex flex-col h-full">
                <div className="grid gap-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-xs mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      autoComplete="name"
                      className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@eztechit.com"
                      required
                    />
                  </div>
                  {/* Position Field */}
                  <div>
                    <label htmlFor="position" className="block text-xs mb-1">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      autoComplete="organization-title"
                      className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="ex. Account Manager"
                      required
                    />
                  </div>
                  {/* Role Selection */}
                  <div>
                    <label htmlFor="role" className="block text-xs mb-1">
                      Role <span className="text-red-500">*</span>
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
                </div>
                <div className="flex justify-center space-x-14 mt-auto">
                  <button
                    type="submit"
                    form="addAdmin"
                    disabled={loading || !isFormValid}
                    className="px-12 py-2 text-xs font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
                  >
                    {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={resetFormField}
                    disabled={loading}
                    className="px-12 py-2 text-xs font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminModal;
