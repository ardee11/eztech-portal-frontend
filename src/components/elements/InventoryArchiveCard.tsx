import { useNavigate } from "react-router-dom";

export default function InventoryArchiveCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/inventory/archives")}
      className="w-full p-1.5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-center justify-between hover:cursor-pointer"
      aria-label="Open Inventory Archives"
    >
      <div className="flex items-center space-x-3">
        
        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5  text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </div>

        <div className="text-left">
          <p className="text-md font-bold text-gray-900">Inventory Archives</p>
          <p className="text-xs text-gray-600">Open archived inventory items</p>
        </div>
      </div>

      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
