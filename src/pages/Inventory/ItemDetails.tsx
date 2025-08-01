import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { formatTimestampToFullDate } from "../../utils/DateFormat";
import { Item, useItemDetails } from "../../hooks/useInventory";

import ItemDetailsModal from "../../components/modal/Inventory/EditItemDetails";
import ItemNotesModal from "../../components/modal/Inventory/EditItemNotes";
import ItemStatusModal from "../../components/modal/Inventory/EditItemStatus";
import SetDeliveryModal from "../../components/modal/Inventory/SetDeliveryModal";
import MarkAsDeliveredModal from "../../components/modal/Inventory/MarkAsDeliveredModal";

function ItemDetails() {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const { item: fetchedItem, loading, error, refetch } = useItemDetails(itemId!);
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (fetchedItem) {
      setItem(fetchedItem);
    }
  }, [fetchedItem]);

  const handleItemUpdate = (updatedFields: Partial<Item>) => {
    setItem((prev) => prev ? { ...prev, ...updatedFields } : prev);
    refetch();
  };

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSetDeliveryModalOpen, setIsSetDeliveryModalOpen] = useState(false);
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setTimeout(() => {
        if (window.HSOverlay) {
          window.HSOverlay.autoInit();
        }
      }, 100);
    }
  }, [item]);
  return (
    <div className="max-w-full mx-auto px-6 py-4 relative">
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

        <p className="text-md">
          Item ID:{" "}
          <span className="font-bold text-blue-700">{item?.item_id}</span>
        </p>
      </div>

      <div className="relative flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[85vh]">
            <ClipLoader color="#3498db" size={42} />
            <p className="text-gray-400 text-xs mt-2">Loading item details...</p>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center mt-10">
            <p>Failed to load item details. Please try again later.</p>
          </div>
        ) : (
          <div className="ml-8">
            <div className="flex flex-row gap-3 items-start">
              <div className="flex-[2] min-w-0 flex flex-col gap-4">
                <div className="bg-white shadow-md border border-gray-200 px-4 py-3 min-h-48">
                  <div className="flex justify-between items-center">
                    <p className="text-md font-semibold text-gray-800">
                      Item Details
                    </p>
                    <p className="text-xs text-blue-600 hover:font-semibold hover:cursor-pointer"
                      onClick={() => setIsItemModalOpen(true)}>
                      Edit
                    </p>
                  </div>
                  <div className="mt-2 ml-3 space-y-1 break-words whitespace-pre-line">
                    <p className="text-sm font-semibold text-gray-800">
                      Model Name:
                      <span className="font-normal">
                        {" "}
                        {item?.item_name ?? "-"}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      Quantity:
                      <span className="font-normal">
                        {" "}
                        {item?.quantity ?? "-"}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      Client Name:
                      <span className="font-normal">
                        {" "}
                        {item?.client_name ?? "-"}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      Distributor:
                      <span className="font-normal">
                        {" "}
                        {item?.distributor ?? "-"}
                      </span>
                    </p>
                  </div>
                </div>
                <ItemDetailsModal 
                  isItemModalOpen={isItemModalOpen} 
                  onClose={() => setIsItemModalOpen(false)} 
                  item={item}
                  onUpdate={handleItemUpdate}
                />

                {item?.serialnumbers && item.serialnumbers.length > 0 && (
                  <div className="bg-white border border-gray-200 shadow-md overflow-hidden">
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-6 py-3 w-40 text-left text-xs font-medium text-gray-700 uppercase">
                              Serial No.
                            </th>
                            <th className="px-6 py-3 w-100 text-left text-xs font-medium text-gray-700 uppercase">
                              Remarks
                            </th>
                            <th className="px-6 py-3 w-70 text-left text-xs font-medium text-gray-700 uppercase">
                              Notes
                            </th>
                            <th className="px-6 py-3 w-10 text-left text-xs font-medium text-gray-700 uppercase">
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {item?.serialnumbers?.map((serial, index) => (
                            <tr key={serial.id} className="hover:bg-gray-100/60 transition">
                              <td className="px-6 py-4 w-40 whitespace-nowrap text-xs">
                                <p>{index + 1}. <span className="font-medium text-blue-600">{serial.id}</span></p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-800">
                                {serial.remarks === "Good" ? (
                                  <>
                                    <span className="py-0.5 px-2 inline-flex items-center text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                                      <svg
                                        className="size-2.5 mr-1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                      </svg>
                                      Checked
                                    </span>
                                    <span className="ml-2 py-0.5 px-2 inline-flex items-center text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                                      <svg
                                        className="size-2.5 mr-1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                      </svg>
                                      Passed
                                    </span>
                                    <span className="ml-2 py-0.5 px-2 inline-flex items-center text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                                      <svg
                                        className="size-2.5 mr-1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                      </svg>
                                      Good
                                    </span>
                                    <span className="ml-2 py-0.5 px-2 inline-flex items-center text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                                      <svg
                                        className="size-2.5 mr-1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                      </svg>
                                      Sealed
                                    </span>
                                  </>
                                ) : (
                                  <span className="py-0.5 px-2 inline-flex items-center text-xs font-medium rounded-full bg-red-200 text-red-800">
                                    <svg
                                      className="size-2.5 mr-1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                    </svg>
                                    Defective
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-xs whitespace-nowrap text-gray-800">
                                {serial.notes ?? "..."}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-800 cursor-pointer">
                                <div 
                                  className="hover:bg-gray-200 py-1 px-1.5 rounded-full"
                                  //onClick={}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="bg-white shadow-md border border-gray-200 px-4 py-3 min-h-48">
                  <div className="flex justify-between">
                    <p className="text-md font-semibold text-gray-800">Notes</p>
                    <p className="text-xs text-blue-600 hover:font-semibold hover:cursor-pointer" onClick={() => setIsNoteModalOpen(true)}>
                      Edit
                    </p>
                  </div>
                  <div className="mt-3 ml-3">
                    <p className="text-xs text-gray-800 break-words whitespace-pre-wrap">
                      {item?.notes ?? "No additional notes."}
                    </p>
                  </div>
                </div>
                <ItemNotesModal 
                  isNoteModalOpen={isNoteModalOpen} 
                  onClose={() => setIsNoteModalOpen(false)} 
                  item={item}
                  onUpdate={handleItemUpdate}
                />

                {/* Status */}
                <div className="bg-white border border-gray-200 shadow-md px-4 py-3">
                  <div className="flex justify-between">
                    <div className="flex gap-x-2">
                      <p className="text-md font-semibold text-gray-800">Status</p>

                      {!item?.delivered && item?.item_status === "For Delivery" && (
                      <p 
                        onClick={()=> setIsMarkDeliveredModalOpen(true)}
                        className="flex text-xs border border-blue-600 text-blue-600 px-2 rounded-full items-center hover:bg-blue-500/10 hover:cursor-pointer transition">
                        Mark as Delivered
                      </p>
                      )}

                      {!item?.delivered && item?.item_status === "Pending" && (
                      <p
                        onClick={() => setIsSetDeliveryModalOpen(true)}
                        className="flex text-xs border border-blue-600 text-blue-600 px-2 rounded-full items-center hover:bg-blue-500/10 hover:cursor-pointer transition">
                        Set Delivery Date
                      </p>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 hover:font-semibold hover:cursor-pointer" onClick={() => setIsStatusModalOpen(true)}>
                      Edit
                    </p>
                  </div>
                  <div className="m-4">
                    {item?.received_by && (
                      <>
                        <div className="my-1">
                          <h3 className="text-xs font-medium uppercase text-gray-500">
                            {formatTimestampToFullDate(item.entry_date)}
                          </h3>
                        </div>

                        <div className="flex gap-x-2">
                          <div className={`relative after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] ${ item.checked_by ? "after:bg-gray-300" : ""}`}>
                            <div className="relative z-10 size-7 flex justify-center items-center">
                              <div className="size-2 rounded-full bg-blue-500"></div>
                            </div>
                          </div>

                          <div className="grow pt-1.5 pb-5">
                            <h3 className="font-semibold text-xs text-gray-800">Received</h3>
                            <p className="mt-0.5 text-xs text-gray-600">By <span className="text-blue-600">{item.received_by}</span></p>
                          </div>
                        </div>
                      </>
                    )}

                    {item?.checked_by && (
                      <>
                        <div className="my-1">
                          <h3 className="text-xs font-medium uppercase text-gray-500">
                            {formatTimestampToFullDate(item.entry_date)}
                          </h3>
                        </div>

                        <div className="flex gap-x-2">
                          <div className={`relative after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] ${ item.delivered && item.delivery_date && item.delivered_by ? "after:bg-gray-300" : ""}`}>
                            <div className="relative z-10 size-7 flex justify-center items-center">
                              <div className="size-2 rounded-full bg-yellow-500"></div>
                            </div>
                          </div>

                          <div className="grow pt-1.5 pb-5">
                            <h3 className="font-semibold text-xs text-gray-800">Checked</h3>
                            <p className="mt-0.5 text-xs text-gray-600">By <span className="text-blue-600">{item.checked_by}</span></p>
                          </div>
                        </div>
                      </>
                    )}
                    {!item?.delivered && item?.delivery_date && (
                      <>
                        <div className="my-1">
                          <h3 className="text-xs font-medium uppercase text-gray-500">
                            {formatTimestampToFullDate(item.delivery_date)}
                          </h3>
                        </div>

                        <div className="flex gap-x-2">
                          <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px]">
                            <div className="relative z-10 size-7 flex justify-center items-center">
                              <div className="size-2 rounded-full bg-green-300"></div>
                            </div>
                          </div>

                          <div className="grow pt-0.5">
                            <h3 className="font-semibold text-xs text-gray-800">For Dispatch</h3>
                            <p className="mt-0.5 text-xs text-gray-600">c/o <span className="text-blue-600">{item.delivered_by}</span></p>
                          </div>
                        </div>
                      </>
                    )}
                    {item?.delivered && (
                      <>
                        <div className="my-1">
                          <h3 className="text-xs font-medium uppercase text-gray-500">
                            {formatTimestampToFullDate(item.delivery_date)}
                          </h3>
                        </div>

                        <div className="flex gap-x-2">
                          <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px]">
                            <div className="relative z-10 size-7 flex justify-center items-center">
                              <div className="size-2 rounded-full bg-green-500"></div>
                            </div>
                          </div>

                          <div className="grow pt-0.5">
                            <h3 className="font-semibold text-xs text-gray-800">Delivered</h3>
                            <p className="mt-0.5 text-xs text-gray-600">By <span className="text-blue-600">{item.delivered_by}</span></p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <ItemStatusModal 
                  isStatusModalOpen={isStatusModalOpen} 
                  onClose={() => setIsStatusModalOpen(false)} 
                  item={item}
                  onUpdate={handleItemUpdate}
                />
              </div>
              <SetDeliveryModal
                isOpen={isSetDeliveryModalOpen}
                onClose={() => setIsSetDeliveryModalOpen(false)}
                itemId={item?.item_id ?? ""}
                onUpdate={handleItemUpdate}
              />

              <MarkAsDeliveredModal
                isOpen={isMarkDeliveredModalOpen}
                onClose={() => setIsMarkDeliveredModalOpen(false)}
                itemId={item?.item_id ?? ""}
                onUpdate={handleItemUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;
