import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const navigate = useNavigate();
  const [deliveredChecked, setDeliveredChecked] = useState(false);

  return (
    <>
      <div className="max-w-[85rem] mx-auto px-6 py-4 relative">
        <div className="flex items-center mb-3">
          <div
            onClick={() => navigate(-1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? navigate(-1) : null)}
            className="cursor-pointer hover:bg-gray-100 rounded-full block mr-4"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
          </div>

          <p className="text-md font-semibold text-gray-800">
            Add New Item
          </p>
        </div>

        <div className="flex flex-row min-w-0 h-[82vh] px-8 py-6 mx-8 gap-x-16 items-start bg-white border border-gray-200 rounded-lg shadow-md border border-gray-200 rounded-lg shadow-md">
          <div className="flex-1 flex flex-col gap-y-2">
            <div>
              <label htmlFor="entryDate" className="block text-xs mb-1">
                Date of Entry
              </label>
              <input
                type="text"
                id="entryDate"
                className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="itemName" className="block text-xs mb-1">
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs mb-1">Qty</label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <input
                    type="number"
                    id="quantity"
                    className="p-2 w-full text-xs border border-gray-500 rounded-lg"
                    required
                  />
                </div>

                <div className="w-1/2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasSerial"
                    className="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500"
                  />
                  <label htmlFor="hasSerial" className="text-xs">Has Serial Number</label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="clientName" className="block text-xs mb-1">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="distributor" className="block text-xs mb-1">
                Distributor
              </label>
              <input
                type="text"
                id="distributor"
                className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                required
              />
            </div>

            {/* <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="shrink-0 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                id="delivered"
                checked={deliveredChecked}
                onChange={(e) => setDeliveredChecked(e.target.checked)}
              />
              <label htmlFor="delivered" className="text-xs">
                Mark as Delivered
              </label>
            </div>

            <div>
              <label htmlFor="deliveryDate" className={`block text-xs mb-1 ${deliveredChecked ? "" : "text-gray-500"}`}>
                Date of Delivery
              </label>
              <input
                type="text"
                id="deliveryDate"
                disabled={!deliveredChecked}
                className={`p-2 block w-full text-xs border border-gray-500 rounded-lg ${deliveredChecked ? "" : "bg-gray-100 cursor-not-allowed"}`}
                required
              />
            </div>

            <div>
              <label htmlFor="deliveredBy" className={`block text-xs mb-1 ${deliveredChecked ? "" : "text-gray-500"}`}>
                Delivered by
              </label>
              <input
                type="text"
                id="deliveredBy"
                disabled={!deliveredChecked}
                className={`p-2 block w-full text-xs border border-gray-500 rounded-lg ${deliveredChecked ? "" : "bg-gray-100 cursor-not-allowed"}`}
                required
              />
            </div> */}

            <div>
              <label htmlFor="itemNotes" className="block text-xs mb-1">
                Notes
              </label>
              <textarea
                id="itemNotes"
                className="p-2 w-full h-24 text-xs border border-gray-500 rounded-lg resize-y"
                required
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div>
              <label htmlFor="serialNumbers" className="block text-xs mb-1">
                Serial No. 
              </label>
              <textarea
                id="serialNumbers"
                className="p-2 w-full h-20 text-xs border border-gray-500 rounded-lg resize-y"
                required
              />
            </div>
            <p className="text-xs text-gray-600">Use commas to separate multiple serial numbers in the input field (e.g. SN1234, SN5678, SN91011).</p>

            <div>
              <button
                type="button"
                className="mt-4 text-xs px-16 w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer transition"
              >
                Enter Serial No.
              </button>
            </div>
            {/* <div className="border border-dashed border-blue-600 p-8 rounded-xl flex justify-center items-center mx-8 hover:bg-blue-50 transition hover:cursor-pointer">
              <button
                type="button"
                className="p-2 bg-blue-500 text-white rounded-full hover:cursor-pointer"
                aria-label="Add item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}