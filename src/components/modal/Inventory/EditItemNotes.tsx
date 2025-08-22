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
  const { updateInventory, loading } = useUpdateInventory();
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
    <div className="bg-white rounded-xl shadow-2xl animate-expand-card max-w-xl 3xl:max-w-2xl max-h-100 3xl:max-h-110 overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="delay-show px-8 py-4 3xl:py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Add Notes</h3>
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
        <form id="editNotes" onSubmit={handleSubmit}>
          <label htmlFor="itemNote" className="block text-xs 3xl:text-sm mb-1">
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

      {/* Sticky Footer */}
      <div className="delay-show px-16 3xl:px-20 py-5 border-t border-gray-200 bg-gray-50 flex justify-between">
        <button
          type="submit"
          form="editNotes"
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

export default ItemNotesModal;