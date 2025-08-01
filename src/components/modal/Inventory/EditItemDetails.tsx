import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";

type Props = {
  isItemModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const ItemDetailsModal = ({ isItemModalOpen, onClose, item, onUpdate }: Props) => {
  const { updateInventory, loading, success, error } = useUpdateInventory();
  const [itemName, setItemName] = useState("");
  const [clientName, setClientName] = useState("");
  const [itemDistributor, setItemDistributor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid =
    itemName.trim() !== "" &&
    clientName.trim() !== "" &&
    itemDistributor.trim() !== "" &&
    item !== null &&
    (
      itemName !== item.item_name ||
      clientName !== item.client_name ||
      itemDistributor !== item.distributor
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;
    
    try {
      if (!item || !item.item_id) return;

      await updateInventory(item.item_id, {
        item_name: itemName,
        client_name: clientName,
        distributor: itemDistributor,
      });

      onUpdate({
        item_name: itemName,
        client_name: clientName,
        distributor: itemDistributor,
      });
      onClose();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 500); 
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const resetFormField = () => {
    setItemName("");
    setClientName("");
    setItemDistributor("");
    onClose();
  };

  useEffect(() => {
    if (item && isItemModalOpen) {
      setItemName(item.item_name || "");
      setClientName(item.client_name || "");
      setItemDistributor(item.distributor || "");
    }
  }, [item, isItemModalOpen]);

  return (
    <>
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl w-full max-w-3xl max-h-100">

            <div className="delay-show">
              <div className="px-8 py-4 border-b border-gray-200">
                <h3 id="details-modal-label" className="text-lg font-bold text-gray-800">
                  Edit Item Details
                </h3>
              </div>

              <div className="px-12 py-4 overflow-y-auto flex-grow">
                <form id="editDetails" onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <label htmlFor="itemName" className="block text-xs mb-1">
                    Item Name
                  </label>

                  <textarea
                    id="itemName"
                    autoComplete="off"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="p-2 w-full h-16 text-xs border border-gray-500 rounded-lg resize-none"
                  />

                  <label htmlFor="clientName" className="block text-xs mb-1">
                    Client Name
                  </label>

                  <input 
                    id="clientName"
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    className="w-full border p-2 text-xs border border-gray-500 rounded-lg" 
                    placeholder="Client Name" 
                  />
                  <label htmlFor="itemDistributor" className="block text-xs mb-1">
                    Distributor
                  </label>

                  <input 
                    id="itemDistributor"
                    value={itemDistributor} 
                    onChange={(e) => setItemDistributor(e.target.value)} 
                    className="w-full border p-2 text-xs border border-gray-500 rounded-lg"
                    placeholder="Distributor" 
                  />
                </form>
              </div>

              <div className="p-5 border-t border-gray-200 flex justify-center gap-10">
                <button
                  type="submit"
                  form="editDetails"
                  disabled={loading || !isFormValid}
                  className="bg-teal-500 text-xs text-white px-20 py-2 rounded-lg hover:bg-teal-600 disabled:bg-teal-500 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer"
                >
                  {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={resetFormField}
                  className="bg-gray-400 text-xs text-white px-20 py-2 rounded-lg hover:bg-gray-500 hover:cursor-pointer"
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

export default ItemDetailsModal;
