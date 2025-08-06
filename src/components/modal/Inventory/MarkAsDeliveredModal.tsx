import { ClipLoader } from "react-spinners";
import { useUpdateInventory } from "../../../hooks/useInventory";
import { showToast } from "../../../utils/toastUtils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onUpdate?: (updatedFields: any) => void;
};

const MarkAsDeliveredModal = ({ isOpen, onClose, itemId, onUpdate }: Props) => {
  const { updateInventory, loading } = useUpdateInventory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!itemId) return;

      const updatedFields = {
        delivered: true
      };

      await updateInventory(itemId, updatedFields);

      onClose();

      if (onUpdate) {
        onUpdate(updatedFields);
      }
      showToast("Item marked as delivered successfully", "success");
    } catch (err) {
      showToast("Failed to mark item as delivered", "error");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl max-h-78 max-w-2xl overflow-visible">
            <div className="delay-show">
              <div className="px-20 py-12">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 mb-4">
                    <svg
                      className="h-6 w-6 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Confirm Delivery
                  </h3>
                  
                  <p className="text-sm text-gray-600">
                    Are you sure you want to mark this item as delivered? 
                    This action will update the item status to "Delivered".
                  </p>
                </div>
              </div>

              <div className="px-8 py-4 border-t border-gray-200 flex justify-center gap-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
                >
                  {loading ? (
                    <>
                      <ClipLoader size={16} color="#fff" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Mark as Delivered</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkAsDeliveredModal;