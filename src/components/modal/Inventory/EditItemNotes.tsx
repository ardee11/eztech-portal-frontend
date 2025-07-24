import { useState } from "react";
import { ClipLoader } from "react-spinners";

const ItemNotesModal = () => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFormValid = note.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoading(false);
  };

  const resetFormField = () => {
    setNote("");
    setError(null);
  };

  return (
    <>
      <div
        id="hs-notes-modal-form"
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-notes-modal-form-label"
      >
        <div className="bg-white rounded-xl shadow-2xl animate-expand-card max-w-lg max-h-90">
          <div className="px-8 py-6 delay-show">
            <h3 id="notes-modal-label" className="text-lg font-bold text-gray-800">
              Add Notes
            </h3>

            <form className="mt-3 mx-6" onSubmit={handleSubmit}>
              <div className="">
                <div>
                  <label htmlFor="itemNote" className="block text-xs mb-1">
                    Notes:
                  </label>
                  <textarea
                    id="itemNote"
                    className="p-2 w-full h-48 text-xs border border-gray-500 rounded-lg resize-y"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-center items-center mt-4 gap-10">
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="text-xs px-16 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer disabled:pointer-events-none transition"
                    aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-success-modal" data-hs-overlay="#hs-success-modal"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="text-xs px-16 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 hover:cursor-pointer transition"
                    onClick={()=>resetFormField()}
                    data-hs-overlay={!error ? `#hs-notes-modal-form` : ""}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {!error && (
      <div
        id="hs-success-modal"
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden overflow-y-auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-success-modal-label"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          {!loading ? (
            <>
              <h2 className="text-xl font-bold text-gray-800">Admin Added Successfully</h2>
            </>
          ) : (
            <div>
              <ClipLoader color="#3498db" size={32} />
            </div>
          )}
            <button
              className="mt-4 bg-teal-500 text-xs text-white px-4 py-2 rounded-lg hover:bg-teal-600 hover:cursor-pointer transition disabled:bg-teal-100"
              data-hs-overlay="#hs-success-modal"
              disabled={loading}
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
