import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useInventory } from "../../hooks/useInventory";
import { formatTimestampToFullDate } from "../../utils/DateFormat";
import { useNavigate } from "react-router-dom";
import { useInventoryFilterOptions } from "../../hooks/useInventoryFilterOptions";
import InventoryContextMenu from "../../components/elements/InventoryContextMenu";
import SetDeliveryModal from "../../components/modal/Inventory/SetDeliveryModal";
import MarkAsDeliveredModal from "../../components/modal/Inventory/MarkAsDeliveredModal";
import DeleteItemModal from "../../components/modal/Inventory/DeleteItemModal";
import { getStatusStyles } from "../../utils/getStatusStyles";
import { useAuth } from "../../contexts/authContext";

type MonthYear = { month: number | null; year: number };

function monthYearToLabel(month: number, year: number): string {
  const date = new Date(year, month - 1); 
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

export default function Inventory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { monthYearOptions, yearOptions } = useInventoryFilterOptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYear | null>(null);

  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [markDeliveredItemId, setMarkDeliveredItemId] = useState<string | null>(null);

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");
  const canEditInventoryRoles = ["Admin", "Super Admin", "Inventory Manager"];

  const canEditInventory = Array.isArray(user?.role)
    ? user.role.some(role => canEditInventoryRoles.includes(role))
    : canEditInventoryRoles.includes(user?.role || "");

  const openMarkDeliveredModal = (itemId: string | null) => {
    setMarkDeliveredItemId(itemId);
    setIsMarkDeliveredModalOpen(true);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const openDeliveryModal = (itemId: string | null) => {
    setModalItemId(itemId || "");
    setIsDeliveryModalOpen(true);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const openDeleteModal = (itemId: string | null) => {
    if (itemId) {
      const item = filteredItems.find(item => item.item_id === itemId);
      setDeleteItemName(item?.item_name || "");
    }
    setDeleteItemId(itemId);
    setIsDeleteModalOpen(true);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };
 
  useEffect(() => {
    if (yearOptions.length > 0) {
      setSelectedMonthYear({ month: null, year: yearOptions[0] }); 
    }
  }, [yearOptions]);
  
  const { inventoryItems, loading, error } = useInventory();

  const isSearching = searchQuery.trim().length > 0;
  //const baseItems = isSearching ? allItems : items;

  const extractNum = (id: string) => parseInt(id.match(/\d+/)?.[0] || "0", 10);

  const filteredItems = inventoryItems
    .filter((item) => {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const idMatch = item.item_id?.toLowerCase().includes(query) ?? false;
        const serialMatch =
          item.serialnumbers?.some((sn) => sn.id.toLowerCase().includes(query)) ??
          false;
        const clientMatch =
          item.client_name?.toLowerCase().includes(query) ?? false;
        return idMatch || serialMatch || clientMatch;
      }

      const matchYear = item.entry_date.getFullYear() === selectedMonthYear?.year;
      const matchMonth =
        selectedMonthYear?.month === null
          ? true
          : item.entry_date.getMonth() + 1 === selectedMonthYear?.month;

      if (!matchYear) return false;
      if (selectedMonthYear?.month) {
        return matchMonth;
      }
      return true;
    })
    .sort((b, a) => {
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

  const groupByYear = (options: MonthYear[]) => {
    return options.reduce((acc, { month, year }) => {
      if (month === null) return acc;
      if (!acc[year]) acc[year] = [];
      acc[year].push(month);
      acc[year].sort((a, b) => a - b);
      return acc;
    }, {} as Record<number, number[]>);
  };

  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  
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

  const [monthlyCount, setMonthlyCount] = useState(0);
  const [yearlyCount, setYearlyCount] = useState({
    total: 0,
    delivered: 0,
    forDelivery: 0,
    pending: 0,
  });
  
  useEffect(() => {
    if (selectedMonthYear?.year) {
      const yearItems = inventoryItems.filter(item => item.entry_date.getFullYear() === selectedMonthYear.year);
      
      const deliveredCount = yearItems.filter(item => item.item_status === "Delivered").length;
      const forDeliveryCount = yearItems.filter(item => item.item_status === "For Delivery").length;
      const pendingCount = yearItems.filter(item => item.item_status === "Pending").length;
      
      setYearlyCount({
        total: yearItems.length,
        delivered: deliveredCount,
        forDelivery: forDeliveryCount,
        pending: pendingCount,
      });

      if (selectedMonthYear.month) {
        const monthItems = yearItems.filter(item => item.entry_date.getMonth() + 1 === selectedMonthYear.month);
        setMonthlyCount(monthItems.length);
      } else {
        setMonthlyCount(0);
      }
    }
  }, [inventoryItems, selectedMonthYear]);

  return (
    <div className="w-full mx-auto p-4 relative bg-gray-50">

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">

        {/* Total Items Card */}
        <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex items-baseline space-x-2">
                <p className="text-sm 3xl:text-lg font-bold text-gray-900">Total Items:</p>
                {/* <p className="text-sm 3xl:text-lg text-gray-900">{filteredItems.length}</p> */}
                <p className="text-sm 3xl:text-lg text-gray-900">{yearlyCount.total}</p>
              </div>
              <p className="text-xs 3xl:text-sm text-gray-600 mt-1">All inventory items ({selectedMonthYear?.year || 'Year'})</p>
            </div>
          </div>
        </div>

        {/* Delivered Items Card */}
        <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex items-baseline space-x-2">
                <p className="text-sm 3xl:text-lg font-bold text-gray-900">Delivered:</p>
                <p className="text-sm 3xl:text-lg text-gray-900">{yearlyCount.delivered}</p>
              </div>
              <p className="text-xs 3xl:text-sm text-gray-600 mt-1">Items Delivered ({selectedMonthYear?.year || 'Year'})</p>
            </div>
          </div>
        </div>

        {/* For Delivery Items Card */}
        <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex items-baseline space-x-2">
                <p className="text-sm 3xl:text-lg font-bold text-gray-900">For Delivery:</p>
                <p className="text-sm 3xl:text-lg text-gray-900">{yearlyCount.forDelivery}</p>
              </div>
              <p className="text-xs 3xl:text-sm text-gray-600 mt-1">For Delivery ({selectedMonthYear?.year || 'Year'})</p>
            </div>
          </div>
        </div>

        {/* Pending Items Card */}
        <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex items-baseline space-x-2">
                <p className="text-sm 3xl:text-lg font-bold text-gray-900">Pending:</p>
                <p className="text-sm 3xl:text-lg text-gray-900">{yearlyCount.pending}</p>
              </div>
              <p className="text-xs 3xl:text-sm text-gray-600 mt-1">Awaiting processing ({selectedMonthYear?.year || 'Year'})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="bg-blue-100 px-4 py-3 3xl:px-6 3xl:py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h2 className="text-md 3xl:text-xl font-bold text-gray-900">Inventory Items</h2>
              {!isSearching && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedMonthYear?.month ? `${monthlyCount}` : `${yearlyCount.total}`} items
                </span>
              )}
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex items-center space-x-4">
              {/* Search Input */}
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
                  className="text-xs 3xl:text-sm w-86 3xl:w-110 pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-800 hover:cursor-pointer transition-colors"
                    type="button"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative dropdown-container">
                <button
                  id="monthYearSelect"
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="py-2 px-3 text-xs 3xl:text-sm inline-flex items-center gap-x-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200"
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
                        ? selectedMonthYear.month === null
                          ? `${selectedMonthYear.year}`
                          : monthYearToLabel(selectedMonthYear.month, selectedMonthYear.year)
                        : "Select Month Year"}
                  </div>
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
                    className="absolute z-[100] min-w-96 bg-white shadow-lg border border-gray-200 rounded-lg mt-2 p-4"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-dropdown-default"
                    style={{ right: 0, left: "auto" }}
                  >
                    {/* Mega Menu Years - 6 per column */}
                    <div className="grid grid-cols-1 gap-8">
                      {(() => {
                        // Group years into arrays of 6 for columns
                        const years = Object.keys(groupByYear(monthYearOptions)).map(Number).sort((a, b) => b - a);
                        const columns: number[][] = [];
                        for (let i = 0; i < years.length; i += 6) {
                          columns.push(years.slice(i, i + 6));
                        }
                        return columns.map((colYears, colIdx) => (
                          <div key={colIdx} className="flex flex-col">
                            {colYears.map(year => (
                              <div key={year}>
                                <button
                                  type="button"
                                    onClick={() => {
                                    if(expandedYears.includes(year)) {
                                      setExpandedYears([]);
                                      setSelectedMonthYear({ month: null, year }); 
                                    } else {
                                      setExpandedYears([year]);
                                      setSelectedMonthYear({ month: null, year }); 
                                    }
                                  }}
                                  className={`py-1 px-2 rounded-lg font-bold text-blue-700 mb-2 flex items-center justify-between w-full hover:cursor-pointer ${year === selectedMonthYear?.year ? "bg-blue-100/70" : ""}`}
                                >
                                  {year}
                                  <svg
                                    className={`w-4 h-4 transition-transform ${expandedYears.includes(year) ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                                  </svg>
                                </button>
                                {/* Months grid: only show if this year is expanded */}
                                {expandedYears.includes(year) && (() => {
                                  const months = groupByYear(monthYearOptions)[year];
                                  const monthCount = months.length;
                                  const isGrid = monthCount >= 4;
                                  return (
                                    <div
                                      className={`${isGrid ? "grid grid-cols-2" : "flex flex-col"} gap-1 mb-2`}
                                    >
                                      {months.map((month) => {
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
                                            className={`block text-left text-xs text-gray-700 px-3 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md transition-colors ${
                                              isSelected ? "bg-blue-100 text-blue-800 font-semibold" : ""
                                            }`}
                                            role="menuitem"
                                          >
                                            {monthYearToLabel(month, year)}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                            ))}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {canEditInventory && (
              <div>
                <button
                  onClick={() => navigate("/inventory/add")}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 text-xs 3xl:text-sm flex items-center hover:cursor-pointer"
                >
                  <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d  ="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>
              )}

            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <ClipLoader color="#3498db" size={42} />
              <p className="text-gray-400 text-xs mt-2">Loading inventory items...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-[40vh] bg-white mx-auto max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
              <p className="text-red-600 text-center mb-4">Unable to load inventory items. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 font-semibold bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white rounded-lg transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {/* Enhanced Inventory Table */}
          {!loading && !error && (
            <div className="w-full overflow-y-auto h-[calc(100vh-270px)] pb-1">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                      Date of Entry
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                      Item Description/Model
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/18">
                      Qty
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/7">
                      Distributor
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/7">
                      Client
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/7">
                      Delivery Date
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.item_id}
                      onContextMenu={(e) => handleRightClick(e, item.item_id, item.item_status, item.delivered)}
                      className={`transition-all duration-200 cursor-pointer
                        ${getStatusStyles(item.item_status).row}`}
                      onClick={() => navigate(`/inventory/${item.item_id}`)}
                    >
                      <td className="px-4">
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs 3xl:text-sm">{index + 1}. <span className="font-medium text-blue-800">{formatTimestampToFullDate(item.entry_date)}</span></p>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-900 mb-1">{item.item_id}</span>
                          <span className="text-sm text-gray-800 whitespace-pre-wrap">{item.item_name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-800 break-words">
                        {item.distributor}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-800 break-words">
                        {item.client_name}
                      </td>
                      <td className="text-center items-center">
                        <button 
                          onClick={(e) => {
                            if(item.item_status === "For Delivery" || item.delivered) return; 
                            e.stopPropagation();  
                            openDeliveryModal(item.item_id);
                          }}
                          className={`text-xs 3xl:text-sm font-medium ${
                            !item.delivered && item.item_status !== "For Delivery" 
                              ? "italic text-blue-500 hover:underline hover:cursor-pointer" 
                              : "text-gray-900"
                          }`}
                        >
                          {item.delivered || item.item_status === "For Delivery" 
                            ? formatTimestampToFullDate(item.delivery_date) 
                            : item.client_name === "EZTECH" 
                              ? "" 
                              : "Set Delivery Date"
                          }
                        </button>
                      </td>
                      <td className="text-center items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs 3xl:text-sm font-semibold 
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
        onOpenMarkDeliveredModal={openMarkDeliveredModal}
        onOpenDeleteModal={openDeleteModal}
      />

      {modalItemId && (
        <SetDeliveryModal
          isOpen={isDeliveryModalOpen}
          onClose={() => setIsDeliveryModalOpen(false)}
          itemId={modalItemId}
        />
      )}

      {markDeliveredItemId && (
        <MarkAsDeliveredModal
          isOpen={isMarkDeliveredModalOpen}
          onClose={() => setIsMarkDeliveredModalOpen(false)}
          itemId={markDeliveredItemId}
        />
      )}

      {deleteItemId && (
        <DeleteItemModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          itemId={deleteItemId}
          itemName={deleteItemName}
        />
      )}
    </div>
  );
}
