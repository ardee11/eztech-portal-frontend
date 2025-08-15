import { useEffect, useState } from "react";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";
import { useAdmin } from "../../../hooks/useAdmin";
import StaffDropdown from "../../elements/StaffDropdown";
import { ClipLoader } from "react-spinners";
import { showToast } from "../../../utils/toastUtils";

type Props = {
  isStatusModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const ItemStatusModal = ({ isStatusModalOpen, onClose, item, onUpdate }: Props) => {
  const { admins } = useAdmin();
  const { updateInventory, loading } = useUpdateInventory();

  const [receivedBy, setReceivedBy] = useState<string[]>([]);
  const [checkedBy, setCheckedBy] = useState<string[]>([]);
  const [deliveredBy, setDeliveredBy] = useState<string[]>([]);

  const isFormValid =
    receivedBy.length > 0 &&
    checkedBy.length > 0 &&
    item !== null &&
    (
      receivedBy.join(", ") !== (item.received_by || "") ||
      checkedBy.join(", ") !== (item.checked_by || "") ||
      deliveredBy.join(", ") !== (item.delivered_by || "")
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !item.item_id || !isFormValid) return;

    try {
      await updateInventory(item.item_id, {
        received_by: receivedBy.join(", "),
        checked_by: checkedBy.join(", "),
        delivered_by: deliveredBy.join(", "),
      });

      onUpdate({
        received_by: receivedBy.join(", "),
        checked_by: checkedBy.join(", "),
        delivered_by: deliveredBy.join(", "),
      });

      resetFormField();
      showToast("Item status updated successfully", "success");
    } catch (err) {
      showToast("Failed to update item status", "error");
    }
  };

  const resetFormField = () => {
    setReceivedBy([]);
    setCheckedBy([]);
    setDeliveredBy([]);
    onClose();
  };

  useEffect(() => {
    if (item && isStatusModalOpen) {
      setReceivedBy(item.received_by ? item.received_by.split(",").map(s => s.trim()) : []);
      setCheckedBy(item.checked_by ? item.checked_by.split(",").map(s => s.trim()) : []);
      setDeliveredBy(item.delivered_by ? item.delivered_by.split(",").map(s => s.trim()) : []);
    }
  }, [item, isStatusModalOpen]);

  return (
    <>
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className={`bg-white rounded-xl shadow-2xl w-full sm:mx-auto animate-expand-card max-w-3xl 3xl:max-w-4xl flex flex-col ${item?.delivered_by ? "max-h-95 3xl:max-h-108" : "max-h-78 3xl:max-h-88"}`}>
            <div className="delay-show">       
              <div className="px-8 py-4 3xl:py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Edit Item Status</h3>
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

              <div className="px-14 py-6 overflow-y-auto flex-grow">
                <form id="editStatus" className="grid gap-y-4" onSubmit={handleSubmit}>
                  <StaffDropdown
                    label="Received By"
                    value={receivedBy}
                    onChange={setReceivedBy}
                    options={admins}
                  />
                  <StaffDropdown
                    label="Checked By"
                    value={checkedBy}
                    onChange={setCheckedBy}
                    options={admins}
                  />
                  <StaffDropdown
                    label="Delivered By"
                    value={deliveredBy}
                    onChange={setDeliveredBy}
                    options={admins}
                  />
                </form>
              </div>

              <div className="p-5 border-t border-gray-200 flex justify-center gap-16">
                <button
                  type="submit"
                  form="editStatus"
                  disabled={loading || !isFormValid}
                  className="px-12 py-2 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
                >
                  {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={resetFormField}
                  className="px-12 py-2 text-xs 3xl:text-sm font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
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

export default ItemStatusModal;
