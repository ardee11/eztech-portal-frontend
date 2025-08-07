import { useEffect, useState } from "react";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";
import { ClipLoader } from "react-spinners";
import { showToast } from "../../../utils/toastUtils";

type Props = {
  isNoteModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const ItemNotesModal = ({ isNoteModalOpen, onClose, item, onUpdate }: Props) => {
  const { updateInventory, loading, success, error } = useUpdateInventory();
  const [note, setNote] = useState("");

  const isFormValid = note.trim() !== "" && note !== (item?.notes ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !item.item_id || !isFormValid) return;

    try {
      await updateInventory(item.item_id, { notes: note });
      onUpdate({ notes: note });
      resetFormField();
      showToast("Notes updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update notes", "error");
    }
  };

  useEffect(() => {
    if (!isNoteModalOpen) return;
    if (item) {
      setNote(item.notes || "");
    }
  }, [item?.notes, isNoteModalOpen]);

  const resetFormField = () => {
    setNote("");
    onClose();
  };

  return (
    <>
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl animate-expand-card max-w-lg max-h-96">

            <div className="delay-show">
              <div className="px-8 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Add Notes</h3>

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

              <div className="px-14 py-4 overflow-y-auto flex-grow">
                <form id="editNotes" onSubmit={handleSubmit}>
                  <label htmlFor="itemNote" className="block text-xs mb-1">
                    Notes:
                  </label>
                  <textarea
                    id="itemNote"
                    className="p-2 w-full h-48 text-xs border border-gray-500 rounded-lg resize-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                </form>
              </div>

              <div className="p-5 border-t border-gray-200 flex justify-center gap-10">
                <button
                  type="submit"
                  form="editNotes"
                  disabled={loading || !isFormValid}
                  className="px-12 py-2 text-xs font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
                >
                  {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={resetFormField}
                  className="px-12 py-2 text-xs font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
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

export default ItemNotesModal;