import { useDeleteInventory } from "../../../hooks/useInventory";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | null;
  itemName?: string;
};

export default function DeleteItemModal({ isOpen, onClose, itemId }: Props) {
  const { deleteInventory, loading, error, success } = useDeleteInventory();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleDelete = async () => {
    if (!itemId) return;
    
    try {
      await deleteInventory(itemId);
      onClose();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center z-50">
      <div className={`bg-white animate-expand-card rounded-lg p-6 max-w-xl w-full mx-4 ${localError ? "max-h-72" : "max-h-60"}`}>
        <div className="delay-show">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Delete Item<span className="font-medium ml-2">({itemId})</span></h3>
            </div>
          </div>
        
          <div className="text-center mt-8">
            <p className="text-sm text-gray-800">
              Are you sure you want to delete this inventory item?
            </p>
            <p className="text-xs text-red-600 mt-4 italic">
              This action cannot be undone. All associated serial numbers will also be deleted.
            </p>
          </div>

                     {localError && (
             <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
               {localError}
             </div>
           )}

          <div className="flex justify-between mx-20 mt-8">
                         <button
               type="button"
               onClick={() => {
                 setLocalError(null);
                 onClose();
               }}
               disabled={loading}
               className="px-6 py-2 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:cursor-pointer disabled:opacity-50"
             >
               Cancel
             </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 text-xs font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 hover:cursor-pointer disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 