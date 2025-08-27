import { useEffect, useState } from "react";
import { useAddAdmin, useAdminDetails, useEditAdmin } from "../../../hooks/useAdmin";
import { ClipLoader } from "react-spinners";
import { showToast } from "../../../utils/toastUtils";
import RoleDropdown from "../../elements/RoleDropdown";

type AdminModalProps = {
  aid: number;
  isOpen: boolean;
  onClose: () => void;
};

const AdminEditModal = ({ aid, isOpen, onClose }: AdminModalProps) => {
  const { editAdmin } = useEditAdmin();
  const { adminData, loadingDetails, errorDetails } = useAdminDetails(aid);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const isFormValid = 
    name.trim() !== "" && 
    position.trim() !== "" && 
    role.length > 0;
    adminData !== null &&
    (
      name !== adminData.name ||
      position !== adminData.position ||
      JSON.stringify(role) !== JSON.stringify(adminData.role)
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const result = await editAdmin(aid, name, email, position, role);
    
    if (!result.success) {
      showToast("Failed to edit admin. Please try again.", "error");
    } else {
      resetFormField();
      showToast("Changes made successfully!", "success");
    }
    setLoading(false);
  };

  const resetFormField = () => {
    setName("");
    setEmail("");
    setPosition("");
    setRole([]);
    onClose();
  };

  useEffect(() => {
    if (adminData && isOpen) {
      setName(adminData.name || "");
      setEmail(adminData.email || "");
      setPosition(adminData.position || "");
      setRole(Array.isArray(adminData.role) ? adminData.role : []);
    }
  }, [adminData, isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
          <div className="bg-white animate-expand-card rounded-lg px-8 py-6 max-w-xl 3xl:max-w-2xl max-h-120 flex flex-col">
            <div className="delay-show flex flex-col h-full">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Edit Admin</h3>

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
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs text-gray-700 3xl:text-sm mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="new-email"
                      autoComplete="new-email"
                      className="p-2 block w-full text-xs 3xl:text-sm border border-gray-500 text-gray-600 rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@eztechit.com"
                      readOnly
                    />
                  </div>
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-xs 3xl:text-sm mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      autoComplete="off"
                      className="p-2 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  {/* Position Field */}
                  <div>
                    <label htmlFor="position" className="block text-xs 3xl:text-sm mb-1">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      autoComplete="off"
                      className="p-2 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Account Manager"
                      required
                    />
                  </div>
                    <RoleDropdown
                      label="Role(s)"
                      value={role}
                      onChange={setRole}
                      options={[
                        "Super Admin",
                        "Admin",
                        "Inventory Manager",
                        "Inventory Viewer",
                        "Sales Manager",
                        "Sales",
                        "Sales Viewer"
                      ]}
                    />
                </div>
                <div className="flex justify-center space-x-14 mt-auto">
                  <button
                    type="submit"
                    form="addAdmin"
                    disabled={loading || !isFormValid}
                    className="px-12 py-2 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
                  >
                    {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={resetFormField}
                    disabled={loading}
                    className="px-12 py-2 text-xs 3xl:text-sm font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
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

export default AdminEditModal;
