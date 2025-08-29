import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Item, useUpdateInventory } from "../../../hooks/useInventory";
import { showToast } from "../../../utils/toastUtils";
import InputDropdown from "../../elements/InputDropdown";
import { useSuppliers } from "../../../hooks/useInventory";

type Props = {
  isItemModalOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onUpdate: (updatedFields: Partial<Item>) => void;
};

const ItemDetailsModal = ({ isItemModalOpen, onClose, item, onUpdate }: Props) => {
  const { updateInventory, loading } = useUpdateInventory();
  const { suppliers } = useSuppliers();
  const [itemName, setItemName] = useState("");
  const [clientName, setClientName] = useState("");
  const [itemDistributor, setItemDistributor] = useState("");

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
      resetFormField()
      showToast("Item details updated successfully!", "success");
    } catch (err) {
      showToast("Update failed! Try again.", "error");
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
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl w-full max-w-3xl max-h-104 3xl:max-h-116 3xl:max-h-112 3xl:max-w-4xl overflow-hidden flex flex-col">
            
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
              <form id="editDetails" onSubmit={handleSubmit} className="space-y-4 text-sm">
                <label htmlFor="itemName" className="block text-xs 3xl:text-sm mb-1">
                  Item Name
                </label>
                <textarea
                  id="itemName"
                  autoComplete="off"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="p-2 w-full h-16 text-xs 3xl:text-sm border border-gray-500 rounded-lg resize-none"
                />

                <label htmlFor="clientName" className="block text-xs 3xl:text-sm mb-1">
                  Client Name
                </label>
                <input 
                  id="clientName"
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  className="w-full border p-2 text-xs 3xl:text-sm border-gray-500 rounded-lg" 
                  placeholder="Client Name" 
                />

                <p className="block text-xs 3xl:text-sm mb-1">
                  Distributor
                </p>
                <InputDropdown
                  value={itemDistributor}
                  onChange={(value) => setItemDistributor(value ?? "")}
                  options={suppliers.map(supplier => ({
                    name: supplier.name,
                    aid: supplier.aid
                  }))}
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

export default ItemDetailsModal;
