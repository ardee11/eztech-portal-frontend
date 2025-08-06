import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { formatTimestampToFullDate } from "../../utils/DateFormat";
import { Item, useItemDetails } from "../../hooks/useInventory";

import ItemDetailsModal from "../../components/modal/Inventory/EditItemDetails";
import ItemNotesModal from "../../components/modal/Inventory/EditItemNotes";
import ItemStatusModal from "../../components/modal/Inventory/EditItemStatus";
import SetDeliveryModal from "../../components/modal/Inventory/SetDeliveryModal";

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
    <div className="w-full mx-auto px-4 py-6 relative bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div
            onClick={() => navigate(-1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? navigate(-1) : null)}
            className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 rounded-xl p-2 transition-all duration-200 group"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Item Details</p>
            <p className="text-lg font-bold text-gray-900">
              ITEM ID: <span className="text-blue-600">{item?.item_id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <div className="relative flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[85vh]">
            <ClipLoader color="#3498db" size={42} />
            <p className="text-gray-400 text-xs mt-2">Loading item details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-2xl shadow-lg border border-red-100 mx-auto max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
            <p className="text-red-600 text-center mb-4">Unable to load item details. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* Enhanced Item Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
                      </div>
                      <button
                        onClick={() => setIsItemModalOpen(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="group">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Model Name</label>
                        <p className="text-lg font-medium text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                          {item?.item_name ?? "-"}
                        </p>
                      </div>
                      <div className="group">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quantity</label>
                        <p className="text-lg font-medium text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                          {item?.quantity ?? "-"}
                        </p>
                      </div>
                      <div className="group">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Client Name</label>
                        <p className="text-lg font-medium text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                          {item?.client_name ?? "-"}
                        </p>
                      </div>
                      <div className="group">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Distributor</label>
                        <p className="text-lg font-medium text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                          {item?.distributor ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ItemDetailsModal 
                  isItemModalOpen={isItemModalOpen} 
                  onClose={() => setIsItemModalOpen(false)} 
                  item={item}
                  onUpdate={handleItemUpdate}
                />

                {/* Enhanced Serial Numbers Table */}
                {item?.serialnumbers && item.serialnumbers.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Serial Numbers</h2>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {item.serialnumbers.length} items
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                              Serial No.
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/2">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                              Notes
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {item?.serialnumbers?.map((serial, index) => (
                            <tr key={serial.id} className="hover:bg-blue-50/50 transition-all duration-200 group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                    {index + 1}
                                  </div>
                                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{serial.id}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-2">
                                  {serial.remarks === "Good" ? (
                                    <>
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Checked
                                      </span>
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Passed
                                      </span>
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Good
                                      </span>
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Sealed
                                      </span>
                                    </>
                                  ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                      Defective
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                <div className="max-w-full" title={serial.notes || "No notes available"}>
                                  {serial.notes || <span className="text-gray-400 italic">No notes</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
                                  //onClick={}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-400 group-hover:text-blue-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Notes and Status */}
              <div className="xl:col-span-1 space-y-6">
                {/* Enhanced Notes Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Notes</h2>
                      </div>
                      <button
                        onClick={() => setIsNoteModalOpen(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                        {item?.notes || (
                          <span className="text-gray-400 italic">No additional notes available.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <ItemNotesModal 
                  isNoteModalOpen={isNoteModalOpen} 
                  onClose={() => setIsNoteModalOpen(false)} 
                  item={item}
                  onUpdate={handleItemUpdate}
                />

                {/* Enhanced Status Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div className="flex items-center space-x-3">
                          <h2 className="text-xl font-bold text-gray-900">Status</h2>
                          
                          {/* Action Buttons */}
                          {!item?.delivered && item?.item_status === "For Delivery" && (
                            <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-full transition-colors duration-200">
                              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Mark as Delivered
                            </button>
                          )}

                          {!item?.delivered && item?.item_status === "Pending" && (
                            <button
                              onClick={() => setIsSetDeliveryModalOpen(true)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors duration-200"
                            >
                              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Set Delivery Date
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setIsStatusModalOpen(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced Timeline */}
                  <div className="p-6">
                    <div className="space-y-6 min-h-[300px]">
                      {/* Received Stage */}
                      {item?.received_by && (
                        <div className="relative">
                          <div className="flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                              </div>
                              {(item.checked_by || (item.delivered && item.delivery_date && item.delivered_by)) && (
                                <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-amber-300 mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">Received</h3>
                                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    ✓ Complete
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Date:</span> {formatTimestampToFullDate(item.entry_date)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">By:</span> <span className="text-blue-600 font-semibold">{item.received_by}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Checked Stage */}
                      {item?.checked_by && (
                        <div className="relative">
                          <div className="flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              </div>
                              {(item.delivered && item.delivery_date && item.delivered_by) && (
                                <div className="w-0.5 h-8 bg-gradient-to-b from-amber-300 to-green-300 mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">Checked</h3>
                                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    ✓ Complete
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Date:</span> {formatTimestampToFullDate(item.entry_date)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">By:</span> <span className="text-amber-600 font-semibold">{item.checked_by}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Delivered Stage */}
                      {item?.delivered && item?.delivered_by && item?.delivery_date && (
                        <div className="relative">
                          <div className="flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">Delivered</h3>
                                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    ✓ Complete
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Date:</span> {formatTimestampToFullDate(item.delivery_date)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">By:</span> <span className="text-green-600 font-semibold">{item.delivered_by}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <SetDeliveryModal
                  isOpen={isSetDeliveryModalOpen}
                  onClose={() => setIsSetDeliveryModalOpen(false)}
                  itemId={item?.item_id ?? ""}
                />

                <ItemStatusModal 
                  isStatusModalOpen={isStatusModalOpen} 
                  onClose={() => setIsStatusModalOpen(false)} 
                  item={item}
                  onUpdate={handleItemUpdate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;
