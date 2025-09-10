import { useDeleteSerialNum } from "../../../../hooks/useInventory";
import { showToast } from "../../../../utils/toastUtils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  serialId: string | null;
  onDeleteSuccess?: (deletedId: string) => void;
};

export default function DeleteSerialModal({ isOpen, onClose, serialId, onDeleteSuccess }: Props) {
  const { deleteSerialNum, loading } = useDeleteSerialNum();
  const handleDelete = async () => {
    if (!serialId) return;
    
    try {
      await deleteSerialNum(serialId);
      showToast("Item deleted successfully!", "success");
      onDeleteSuccess?.(serialId);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete item. Please try again.";
      showToast(message, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white animate-expand-card rounded-lg max-h-60 3xl:max-h-68 max-w-xl 3xl:max-w-2xl flex flex-col">

        <div className="delay-show flex-1 px-8 py-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Delete Serial<span className="font-medium ml-2">({serialId})</span></h3>
            </div>
          </div>
        
          <div className="text-center mt-8 3xl:mt-10">
            <p className="text-sm 3xl:text-base text-gray-800">
              Are you sure you want to delete this serial item?
            </p>
            <p className="text-xs 3xl:text-sm text-red-600 mt-4 italic">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="delay-show px-16 3xl:px-20 py-4 bg-gray-50 flex justify-between border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-10 py-2 text-xs 3xl:text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 hover:cursor-pointer disabled:opacity-50"
          >
            Delete
          </button>
          <button
              type="button"
              onClick={() => {
                onClose();
              }}
              disabled={loading}
              className="px-10 py-2 text-xs 3xl:text-sm font-medium text-gray-700 bg-white border border-gray-500 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
            >
              Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 