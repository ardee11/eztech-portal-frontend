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

  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [markDeliveredItemId, setMarkDeliveredItemId] = useState<string | null>(null);

  const openMarkDeliveredModal = (itemId: string | null) => {
    setMarkDeliveredItemId(itemId);
    setIsMarkDeliveredModalOpen(true);
    setContextMenu(prev => ({ ...prev, visible: false })); // close context menu
  };

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [modalItemId, setModalItemId] = useState<string | null>(null);

  const openDeliveryModal = (itemId: string | null) => {
    setModalItemId(itemId);
    setIsDeliveryModalOpen(true);
    setContextMenu(prev => ({ ...prev, visible: false })); // close context menu
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>("");

  const openDeleteModal = (itemId: string | null) => {
    if (itemId) {
      const item = filteredItems.find(item => item.item_id === itemId);
      setDeleteItemName(item?.item_name || "");
    }
    setDeleteItemId(itemId);
    setIsDeleteModalOpen(true);
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

  return (
    <div className="py-6 px-8 mx-auto flex-grow">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-400 rounded-lg overflow-hidden">
              <div className="px-6 py-4 flex flex-row items-start border-b border-gray-300">

                {/* Header */}
                <div className="basis-124">
                  <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>
                </div>

                <div className="basis-full">
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Search by serial number or company name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                    className="w-full p-2 border border-gray-400 rounded-lg text-xs"
                  />
                </div>
                
                {/* Filter Dropdown */}
                <div className="basis-full ml-5">
                  <label htmlFor="monthYearSelect" className="text-xs mr-1.5">Filter:</label>
                  <div className="hs-dropdown relative inline-flex">
                    <button
                      id="monthYearSelect"
                      type="button"
                      className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-1 text-xs rounded-lg border border-gray-400 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 hover:cursor-pointer"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Dropdown"
                    >
                      {isSearching
                        ? "By Search"
                        : selectedMonthYear
                          ? monthYearToLabel(selectedMonthYear.month, selectedMonthYear.year)
                          : "Select Month Year"}
                      <svg
                        className="hs-dropdown-open:rotate-180 size-4"
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

                    <div
                      className="z-100 hs-dropdown-menu hidden min-w-40 bg-white shadow-md border border-gray-400 rounded-lg mt-2"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="hs-dropdown-default"
                    >
                      <div className="p-1 shadow-md py-2">
                        {monthYearOptions.map(({ month, year }) => {
                          const isSelected =
                            selectedMonthYear?.month === month &&
                            selectedMonthYear?.year === year;

                          return (
                            <button
                              key={`${year}-${month}`}
                              onClick={() => setSelectedMonthYear({ month, year })}
                              className={`block w-full text-left text-xs text-gray-700 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer ${
                                isSelected ? "bg-teal-100 font-semibold" : ""
                              }`}
                              role="menuitem"
                            >
                              {monthYearToLabel(month, year)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="basis-full flex justify-end mt-2 md:mt-0">
                  <button
                    onClick={() => navigate(`/inventory/add`)}
                    className="py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded-lg text-teal-800 bg-teal-200 shadow-2xs hover:bg-teal-400 transition hover:cursor-pointer"
                  >
                    <svg
                      className="shrink-0 size-3"
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
                    <thead className="bg-gray-50 sticky top-0">
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
                              className={`${item.item_status !== "Delivered" && item.item_status !== "For Delivery" ? "text-blue-500 hover:underline" : ""}`}>
                                {item.client_name === "EZTECH" ? "":
                                  item.item_status === "Delivered" || item.item_status === "For Delivery" ? formatTimestampToFullDate(item.delivery_date) : 
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
