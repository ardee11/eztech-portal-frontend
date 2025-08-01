import { useEffect, useState } from "react";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";

type Props = {
  isNoteModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const ItemNotesModal = ({ isNoteModalOpen, onClose, item, onUpdate }: Props) => {
  const { updateInventory, loading, success, error } = useUpdateInventory();
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = note.trim() !== "" && note !== (item?.notes ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !item.item_id || !isFormValid) return;

    try {
      await updateInventory(item.item_id, { notes: note });
      onUpdate({ notes: note });
      onClose();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to update notes", err);
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
          <div className="bg-white rounded-xl shadow-2xl animate-expand-card max-w-lg max-h-94">

            <div className="delay-show">
              <div className="px-8 py-4 border-b border-gray-200">
                <h3 id="notes-modal-label" className="text-lg font-bold text-gray-800">
                  Add Notes
                </h3>
              </div>

              <div className="px-6 py-2 overflow-y-auto flex-grow">
                <form id="editNotes" className="mt-3 mx-6" onSubmit={handleSubmit}>
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

              <div className="p-4 border-t border-gray-200 flex justify-center gap-10">
                <button
                  type="submit"
                  form="editNotes"
                  disabled={loading || !isFormValid}
                  className="text-xs px-16 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer disabled:bg-teal-500 disabled:opacity-50 disabled:pointer-events-none transition"
                  aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-success-modal" data-hs-overlay="#hs-success-modal"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="text-xs px-16 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 hover:cursor-pointer transition"
                  onClick={()=>resetFormField()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800">Item Saved Successfully!</h2>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemNotesModal;