import { useEffect, useState } from "react";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";
import { useAdmin } from "../../../hooks/useAdmin";
import StaffDropdown from "../../elements/StaffDropdown";

type Props = {
  isStatusModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const ItemStatusModal = ({ isStatusModalOpen, onClose, item, onUpdate }: Props) => {
  const { admins } = useAdmin();
  const { updateInventory, loading, success, error } = useUpdateInventory();
  const [receivedBy, setReceivedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [deliveredBy, setDeliveredBy] = useState("");

  const isFormValid =
    checkedBy.trim() !== "" &&
    receivedBy.trim() !== "" &&
    item !== null &&
    (
      checkedBy !== item.checked_by ||
      receivedBy !== item.received_by
    );

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !item.item_id || !isFormValid) return;

    try {
      await updateInventory(item.item_id, {
        received_by: receivedBy,
        checked_by: checkedBy,
        delivered_by: deliveredBy || "",
      });

      onUpdate({
        received_by: receivedBy,
        checked_by: checkedBy,
        delivered_by: deliveredBy || "",
      });
      onClose();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const resetFormField = () => {
    setCheckedBy("");
    setReceivedBy("");
    onClose();
  };

  useEffect(() => {
    if (item && isStatusModalOpen) {
      setCheckedBy(item.checked_by || "");
      setReceivedBy(item.received_by || "");
    }
  }, [item, isStatusModalOpen]);

  return (
    <>
      {isStatusModalOpen && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-xl shadow-2xl w-full sm:mx-auto animate-expand-card max-w-3xl max-h-94 flex flex-col">

          <div className="delay-show">       
            <div className="px-8 py-4 border-b border-gray-200">
              <h3 id="status-modal-label" className="text-lg font-bold text-gray-800">
                Edit Item Status
              </h3>
            </div>

            <div className="px-12 py-6 overflow-y-auto flex-grow">
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

            <div className="py-5 border-t border-gray-200 flex justify-center gap-12">
              <button
                type="submit"
                form="editStatus" 
                disabled={loading || !isFormValid}
                className="text-xs px-24 py-2 bg-teal-500 text-white rounded-lg hover:cursor-pointer hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="text-xs px-24 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 hover:cursor-pointer transition"
                onClick={resetFormField}
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