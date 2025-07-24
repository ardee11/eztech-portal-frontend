import { useState } from "react";
import { ClipLoader } from "react-spinners";

const ItemDetailsModal = () => {
  const [itemName, setItemName] = useState("");
  const [clientName, setClientName] = useState("");
  const [itemDistributor, setItemDistributor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFormValid = itemName.trim() !== "" && clientName.trim() !== "" && itemDistributor.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  };

  const resetFormField = () => {
    setItemName("");
    setClientName("");
    setItemDistributor("");
  };

  return (
    <>
      <div
        id="hs-item-modal-form"
        className="hs-overlay hidden size-full fixed flex items-center justify-center inset-0 z-80 overflow-x-hidden"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-item-modal-form-label"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full sm:mx-auto animate-expand-card max-w-3xl max-h-90">
          <div className="px-8 py-6 delay-show">
            <h3 id="item-modal-label" className="text-lg font-bold text-gray-800">
              Edit Item Details
            </h3>

            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
 
                <div>
                  <label htmlFor="itemName" className="block text-xs mb-1">
                    Model Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="clientName" className="block text-xs mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="itemDistributor" className="block text-xs mb-1">
                    Distributor
                  </label>
                  <input
                    type="text"
                    id="itemDistributor"
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    value={itemDistributor}
                    onChange={(e) => setItemDistributor(e.target.value)}
                    required
                  />
                </div>

                <div className="flex mt-4 gap-12 justify-center items-center">
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="text-xs px-24 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer disabled:pointer-events-none transition"
                    aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-success-modal" data-hs-overlay="#hs-success-modal"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="text-xs px-24 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 hover:cursor-pointer transition"
                    onClick={()=>resetFormField()}
                    data-hs-overlay={!error ? `#hs-item-modal-form` : ""}
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

export default ItemDetailsModal;
