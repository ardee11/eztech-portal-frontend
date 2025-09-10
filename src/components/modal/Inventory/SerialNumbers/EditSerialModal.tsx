import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { SerialNumber, useUpdateSerialNum } from "../../../../hooks/useInventory";
import { showToast } from "../../../../utils/toastUtils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  serialNum: SerialNumber | null;
  onUpdate: (updatedFields: Partial<SerialNumber>) => void;
};

const EditSerialDetailsModal = ({ isOpen, onClose, serialNum, onUpdate }: Props) => {
  const { updateSerialNum, loading } = useUpdateSerialNum();
  const [serialNumber, setSerialNumber] = useState("");
  const [isDefective, setIsDefective] = useState(false); // New state for the checkbox
  const [notes, setNotes] = useState("");

  const isFormValid =
    serialNumber.trim() !== "" &&
    serialNum !== null &&
    (
      serialNumber !== serialNum.id ||
      (isDefective ? "Defective" : "Good") !== serialNum.remarks || 
      notes !== serialNum.notes
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      if (!serialNum || !serialNum.id) return;

      const updatedRemarks = isDefective ? "Defective" : "Good";

      const updatedItem = await updateSerialNum(serialNum.id, {
        id: serialNumber,
        remarks: updatedRemarks,
        notes: notes,
      });
      
      if (updatedItem) {
        onUpdate(updatedItem);
        resetFormField();
        showToast("Item details updated successfully!", "success");
      }
    } catch (err) {
      showToast("Update failed! Try again.", "error");
    }
  };

  const resetFormField = () => {
    setSerialNumber("");
    setIsDefective(false); // Reset boolean state
    setNotes("");
    onClose();
  };

  useEffect(() => {
    if (serialNum && isOpen) {
      setSerialNumber(serialNum.id || "");
      setIsDefective(serialNum.remarks === "Defective");
      setNotes(serialNum.notes || "");
    }
  }, [serialNum, isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl w-full max-w-3xl max-h-86 3xl:max-h-96 3xl:max-w-4xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="delay-show px-8 py-4 3xl:py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Edit Item Details</h3>
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

            {/* Scrollable Form Body */}
            <div className="delay-show px-12 py-4 3xl:py-5 overflow-auto flex-1">
              <form id="editDetails" onSubmit={handleSubmit} className="space-y-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="serialId" className="block text-xs 3xl:text-sm mb-1">
                      Serial Number
                    </label>
                    <input 
                      id="serialId"
                      value={serialNumber} 
                      onChange={(e) => setSerialNumber(e.target.value)} 
                      className="w-full border p-2 text-xs 3xl:text-sm border-gray-500 rounded-lg" 
                      placeholder="Serial Number" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="isDefective"
                      checked={isDefective}
                      onChange={(e) => setIsDefective(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefective" className="text-xs 3xl:text-sm font-medium text-gray-700">
                      Mark as Defective
                    </label>
                  </div>
                </div>
                
                <label htmlFor="itemNotes" className="block text-xs 3xl:text-sm mb-1">
                  Notes
                </label>
                <textarea
                  id="itemNotes"
                  autoComplete="off"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="p-2 w-full h-16 text-xs 3xl:text-sm border border-gray-500 rounded-lg resize-none"
                />
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="delay-show px-16 3xl:px-20 py-5 bg-gray-50 flex justify-between border-t border-gray-200">
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

export default EditSerialDetailsModal;