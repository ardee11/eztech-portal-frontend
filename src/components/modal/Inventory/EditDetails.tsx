import { useEffect, useState } from "react";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";
import { ClipLoader } from "react-spinners";
import { showToast } from "../../../utils/toastUtils";

type Props = {
  isEditModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const EditModal = ({ isEditModalOpen, onClose, item, onUpdate }: Props) => {
  const { updateInventory, loading } = useUpdateInventory();
  const [orderNo, setOrderNo] = useState("");

  const isFormValid = orderNo.trim() !== "" && orderNo !== (item?.order_no ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !item.item_id || !isFormValid) return;

    try {
      await updateInventory(item.item_id, { order_no: orderNo });
      onUpdate({ order_no: orderNo });
      resetFormField();
      showToast("Order no. updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update order no.", "error");
    }
  };

  useEffect(() => {
    if (!isEditModalOpen) return;
    if (item) {
      setOrderNo(item.order_no || "");
    }
  }, [item?.order_no, isEditModalOpen]);

  const resetFormField = () => {
    setOrderNo("");
    onClose();
  };

  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl animate-expand-card max-w-xl 3xl:max-w-2xl max-h-76 3xl:max-h-84 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="delay-show px-8 py-4 3xl:py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Edit Purchase/Work Order No.</h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="delay-show px-14 py-4 overflow-auto flex-1">
              <form id="editDetails" onSubmit={handleSubmit}>
                <label htmlFor="orderNo" className="block text-xs 3xl:text-sm mb-1">
                  Purchase/Work Order No:
                </label>
                <textarea
                  id="orderNo"
                  className="p-2 w-full h-24 text-xs border border-gray-500 rounded-lg resize-none"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  required
                />
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="delay-show px-16 3xl:px-20 py-5 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                type="submit"
                form="editDetails"
                disabled={loading || !isFormValid}
                className="px-12 py-2 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
              </button>

              <button
                type="button"
                onClick={resetFormField}
                className="px-12 py-2 text-xs 3xl:text-sm font-medium text-gray-700 border border-gray-500 bg-white rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
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

export default EditModal;