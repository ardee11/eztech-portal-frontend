import { useState } from "react";
import { removeAdmin } from "../../../hooks/useAdmin";
import { showToast } from "../../../utils/toastUtils";

type AdminModalProps = {
  aid: number;
  name: string;
  email: string;
  onClose: () => void;
  isOpen: boolean;
};

export const AdminRemoveModal = ({aid, name, email, isOpen, onClose}: AdminModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    if (!aid) return;
    
    try {
      await removeAdmin(aid);
      showToast("Admin removed successfully!", "success");
      onClose();
    } catch (err) {
      showToast("Failed to remove admin. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
      <div className="bg-white animate-expand-card rounded-lg max-w-2xl 3xl:max-w-3xl w-full mx-4 max-h-60 3xl:max-h-64 flex flex-col">

        <div className="delay-show flex-1 px-6 py-5 overflow-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg 3xl:text-xl font-medium text-gray-900">Remove Admin</h3>
            </div>
          </div>
        
          <div className="text-center mt-8">
            <p className="text-sm 3xl:text-base text-gray-800">
              Are you sure you want to remove <span className="font-medium">{name}({email})</span>
            </p>
            <p className="text-xs 3xl:text-sm text-red-600 mt-4 italic">
              This action cannot be undone. All associated data will also be removed.
            </p>
          </div>
        </div>

        <div className="delay-show px-16 3xl:px-20 py-4 bg-gray-50 flex justify-between border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-10 py-2 text-xs 3xl:text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 hover:cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-10 py-2 text-xs 3xl:text-sm font-medium bg-white text-gray-800 border border-gray-500 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 
