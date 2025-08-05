import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useInventory } from "../../hooks/useInventory";
import { formatTimestampToFullDate } from "../../utils/DateFormat";
import { useNavigate } from "react-router-dom";
import { useInventoryFilterOptions } from "../../hooks/useInventoryFilterOptions";
import InventoryContextMenu from "../../components/elements/InventoryContextMenu";
import SetDeliveryModal from "../../components/modal/Inventory/SetDeliveryModal";

type MonthYear = { month: number; year: number };

function monthYearToLabel(month: number, year: number): string {
  const date = new Date(year, month - 1); 
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

type Status = "Delivered" | "For Delivery" | "Pending" | "Default";

const STATUS_STYLES: Record<Status, { row: string; badge: string }> = {
  Delivered: {
    row: "bg-teal-100/30 hover:bg-teal-100/60",
    badge: "bg-teal-100 text-teal-800",
  },
  "For Delivery": {
    row: "bg-blue-100/30 hover:bg-blue-100/70",
    badge: "bg-blue-100 text-blue-800",
  },
  Pending: {
    row: "bg-amber-100/30 hover:bg-amber-100/60",
    badge: "bg-amber-100 text-amber-800",
  },
  Default: {
    row: "bg-gray-100/30 hover:bg-gray-100/60",
    badge: "bg-gray-100 text-gray-800",
  },
};

function getStatusStyles(status: string) {
  return STATUS_STYLES[status as Status] || STATUS_STYLES.Default;
}

export default function Inventory() {
  const navigate = useNavigate();
  const { options: monthYearOptions } = useInventoryFilterOptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYear | null>(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openDeliveryModal = (itemId: string | null) => {
    setModalItemId(itemId);
    setIsDeliveryModalOpen(true);
    setContextMenu(prev => ({ ...prev, visible: false })); // close context menu
  };
 
  useEffect(() => {
    if (monthYearOptions.length > 0) {
      setSelectedMonthYear(monthYearOptions[0]);
    }
  }, [monthYearOptions]);
  
  const { allItems, items, loading, error } = useInventory(
    selectedMonthYear?.month,
    selectedMonthYear?.year
  );

  const isSearching = searchQuery.trim().length > 0;
  const baseItems = isSearching ? allItems : items;

  const extractNum = (id: string) => parseInt(id.match(/\d+/)?.[0] || "0", 10);

  const filteredItems = baseItems
    .filter(item => {
      if (searchQuery.trim() === "") return true;

      const query = searchQuery.toLowerCase();
      const serialMatch = item.serialnumbers?.some(sn =>
        sn.id.toLowerCase().includes(query)
      ) ?? false;

      const clientMatch = item.client_name?.toLowerCase().includes(query) ?? false;

      return serialMatch || clientMatch;
    })
    .sort((a, b) => {
      const dateDiff = b.entry_date.getTime() - a.entry_date.getTime();
      if (dateDiff !== 0) return dateDiff;

      return extractNum(b.item_id || "") - extractNum(a.item_id || "");
    });
    
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
    itemStatus: string;
    itemDelivered: boolean | null;
  }>({ visible: false, x: 0, y: 0, itemId: null, itemStatus: "", itemDelivered: null });

  const handleRightClick = (
    event: React.MouseEvent,
    itemId: string | null,
    itemStatus: string,
    itemDelivered: boolean | null,
  ) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      itemId,
      itemStatus,
      itemDelivered,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 mx-auto flex-grow">
      <div className="flex flex-col">

        {/* Inventory Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredItems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-teal-100">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredItems.filter(item => item.item_status === "Delivered").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">For Delivery</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredItems.filter(item => item.item_status === "For Delivery").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-amber-100">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredItems.filter(item => item.item_status === "Pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-400 rounded-lg overflow-hidden">
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 space-y-4 sm:space-y-0">

                {/* Header */}
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-teal-100 mr-3">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
                    <p className="text-sm text-gray-600">Manage and track your inventory items</p>
                  </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {/* Search Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="searchInput"
                        placeholder="Search by serial number or company name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                        className="w-full pl-10 pr-10 py-2 border border-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                                     {/* Filter Dropdown */}
                   <div className="flex items-center gap-2">
                     <label htmlFor="monthYearSelect" className="text-sm font-medium text-gray-700">Filter:</label>
                     <div className="relative dropdown-container">
                       <button
                         id="monthYearSelect"
                         type="button"
                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                         className="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-400 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200"
                         aria-haspopup="menu"
                         aria-expanded={isDropdownOpen}
                         aria-label="Dropdown"
                       >
                         <div className="flex items-center gap-x-1">
                           <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                           </svg>
                           {isSearching
                             ? "By Search"
                             : selectedMonthYear
                               ? monthYearToLabel(selectedMonthYear.month, selectedMonthYear.year)
                               : "Select Month Year"}
                         </div>
                         {selectedMonthYear && !isSearching && (
                           <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                             {monthYearOptions.filter(option => 
                               option.month === selectedMonthYear.month && 
                               option.year === selectedMonthYear.year
                             ).length}
                           </span>
                         )}
                         <svg
                           className={`size-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         >
                           <path d="m6 9 6 6 6-6" />
                         </svg>
                       </button>

                       {isDropdownOpen && (
                         <div
                           className="absolute z-[100] min-w-48 bg-white shadow-lg border border-gray-200 rounded-lg mt-2 transform opacity-100 scale-100 transition-all duration-200"
                           role="menu"
                           aria-orientation="vertical"
                           aria-labelledby="hs-dropdown-default"
                         >
                           <div className="p-2">
                             {/* Clear All Filters Option */}
                             {(selectedMonthYear || isSearching) && (
                               <div className="border-b border-gray-200 pb-2 mb-2">
                                 <button
                                   onClick={() => {
                                     setSelectedMonthYear(null);
                                     setSearchQuery("");
                                     setIsDropdownOpen(false);
                                   }}
                                   className="block w-full text-left text-xs text-red-600 px-3 py-2 hover:bg-red-50 hover:cursor-pointer rounded-md transition-colors"
                                   role="menuitem"
                                 >
                                   <div className="flex items-center gap-x-2">
                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                     </svg>
                                     Clear all filters
                                   </div>
                                 </button>
                               </div>
                             )}
                             
                             {/* Filter Options */}
                             <div className="space-y-1">
                               {monthYearOptions.map(({ month, year }) => {
                                 const isSelected =
                                   selectedMonthYear?.month === month &&
                                   selectedMonthYear?.year === year;

                                 return (
                                   <button
                                     key={`${year}-${month}`}
                                     onClick={() => {
                                       setSelectedMonthYear({ month, year });
                                       setIsDropdownOpen(false);
                                     }}
                                     className={`block w-full text-left text-xs text-gray-700 px-3 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md transition-colors ${
                                       isSelected ? "bg-teal-100 text-teal-800 font-semibold" : ""
                                     }`}
                                     role="menuitem"
                                   >
                                     <div className="flex items-center justify-between">
                                       <span>{monthYearToLabel(month, year)}</span>
                                       {isSelected && (
                                         <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                         </svg>
                                       )}
                                     </div>
                                   </button>
                                 );
                               })}
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>

                  {/* Add Item Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/inventory/add`)}
                      className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg text-white bg-teal-600 shadow-sm hover:bg-teal-700 transition-colors"
                    >
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="p-4 flex justify-center">
                  <ClipLoader color="#3498db" size={42} />
                </div>
              )}

              {error && (
                <div className="p-4 flex justify-center">
                  <p>{error}</p>
                </div>
              )}

              {/* Inventory Table */}
              {!loading && !error && (
                <div className="w-full overflow-y-auto h-[calc(100vh-220px)]">
                  <table className="min-w-full overflow-x-auto divide-y divide-gray-300">
                    <thead className="bg-gray-50 sticky top-0 z-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date of Entry</th>
                        <th className="px-6 py-3 w-[18rem] text-left text-xs font-medium text-gray-700 uppercase">Item Description/Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Qty</th>
                        <th className="px-6 py-3 w-48 text-left text-xs font-medium text-gray-700 uppercase">Distributor</th>
                        <th className="px-6 py-3 w-48 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Delivery Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-xs divide-y divide-gray-200">
                      {filteredItems.map((item, index) => (
                        <tr
                          key={item.item_id}
                          onContextMenu={(e) => handleRightClick(e, item.item_id, item.item_status, item.delivered)}
                          className={`hover:cursor-pointer transition border-b border-gray-200 
                            ${getStatusStyles(item.item_status).row}`}

                          onClick={() => navigate(`/inventory/${item.item_id}`)}
                        >
                          <td className="px-6 py-4">
                            <p className="">{index+1}. 
                              <span className="ml-1 font-medium text-blue-700">{formatTimestampToFullDate(item.entry_date)}</span>
                            </p>
                          </td>
                          <td className="px-6 py-4  w-[18rem] break-words">
                            <div className="flex flex-col">
                              <span className="font-medium text-xs mb-2">{item.item_id}</span>
                              <span className="whitespace-pre-wrap">{item.item_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4 w-48 break-words">{item.distributor}</td>
                          <td className="px-6 py-4  w-48 break-words">{item.client_name}</td>
                          <td className="px-6 py-4">
                            <p 
                              onClick={(e) => {
                                if(item.item_status === "For Delivery" || item.delivered) return; 
                                e.stopPropagation();  
                                openDeliveryModal(item.item_id);
                              }}
                              className={`${!item.delivered && item.item_status !== "For Delivery" ? "text-blue-500 hover:underline" : ""}`}>
                                {item.delivered || item.item_status === "For Delivery" ? formatTimestampToFullDate(item.delivery_date) : 
                                item.client_name === "EZTECH" ? "":
                                "Set Delivery Date"
                                }
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`py-1 px-4 inline-flex items-center font-medium rounded-full 
                              ${getStatusStyles(item.item_status).badge}`}
                            >
                              {item.item_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="py-4 flex justify-between border-t border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      <InventoryContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        itemId={contextMenu.itemId}
        itemStatus={contextMenu.itemStatus}
        itemDelivered={contextMenu.itemDelivered}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
        onOpenModal={openDeliveryModal}
      />

      {modalItemId && (
        <SetDeliveryModal
          isOpen={isDeliveryModalOpen}
          onClose={() => setIsDeliveryModalOpen(false)}
          itemId={modalItemId}
        />
      )}

    </div>
  );
}
