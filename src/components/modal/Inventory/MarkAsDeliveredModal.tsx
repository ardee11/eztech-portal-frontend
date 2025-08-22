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
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl max-h-80 3xl:max-h-90 max-w-2xl 3xl:max-w-3xl overflow-hidden flex flex-col">
            
            {/* Scrollable Content */}
            <div className="delay-show flex-1 overflow-auto px-20 py-12">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 3xl:h-16 3xl:w-16 rounded-full bg-teal-100 mb-4">
                  <svg
                    className="h-6 w-6 3xl:h-8 3xl:w-8 text-teal-600"
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

                <h3 className="text-lg 3xl:text-xl font-medium text-gray-900 mb-2 3xl:mb-4">
                  Confirm Delivery
                </h3>

                <p className="text-sm 3xl:text-base text-gray-600">
                  Are you sure you want to mark this item as delivered? 
                  This action will update the item status to "Delivered".
                </p>
              </div>
            </div>

            {/* Footer (Buttons) */}
            <div className="delay-show px-16 3xl:px-20 py-4 bg-gray-50 flex justify-between border-t border-gray-200">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 3xl:py-3 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 hover:cursor-pointer hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <ClipLoader size={16} color="#fff" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark as Delivered</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2.5 3xl:py-3 text-xs 3xl:text-sm font-medium text-gray-700 bg-white border border-gray-500 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkAsDeliveredModal;