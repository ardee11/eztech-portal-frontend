import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../components/elements/DatePicker";
import { useAdmin } from "../../hooks/useAdmin";
import StaffDropdown from "../../components/elements/StaffDropdown";
import { useAddInventory, useSuppliers } from "../../hooks/useInventory";
import { showToast } from "../../utils/toastUtils";
import { useAuth } from "../../contexts/authContext";
import InputDropdown from "../../components/elements/InputDropdown";

export default function AddItem() {
  const { admins } = useAdmin();
  const { suppliers } = useSuppliers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addInventory } = useAddInventory();

  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hasSerial, setHasSerial] = useState(false);
  const [clientName, setClientName] = useState("");
  const [distributor, setDistributor] = useState("");
  const [receivedBy, setReceivedBy] = useState<string[]>([]);
  const [checkedBy, setCheckedBy] = useState<string[]>([]);
  const [itemNote, setitemNote] = useState("");
  const [serialNumbers, setSerialNumbers] = useState<string>("");
  const [serialVerified, setSerialVerified] = useState(false);
  const [verifiedSerials, setVerifiedSerials] = useState<
    { serial: string; note: string; isGood: boolean }[]
  >([]);
  
  const handleDateSelect = (dateString: string, date: Date) => {
    setEntryDate(date);
    setSelectedDate(dateString);
    setShowPicker(false);
  };

  const handleToggle = () => {
    setHasSerial((prev) => !prev);
  };

  const updateSerialField = (index: number, field: string, value: any) => {
    const updated = [...verifiedSerials];
    updated[index] = { ...updated[index], [field]: value };
    setVerifiedSerials(updated);
  };

  const verifySerials = () => {
    if (!hasSerial) {
      alert("Please check the 'Has Serial Number' box to enter serial numbers.");
      return;
    }

    const numericQuantity = Number(quantity);
    if (!quantity || numericQuantity <= 0) {
      alert("Please ensure you entered a valid quantity.");
      return;
    }

    const serials = serialNumbers
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (serials.length !== numericQuantity) {
      alert(`You entered ${serials.length} serial number(s), but quantity is ${quantity}. Please correct it.`);
      return;
    }

    const structuredSerials = serials.map((serial) => ({
      serial,
      note: "",
      isGood: true,
    }));

    setSerialVerified(true);
    setVerifiedSerials(structuredSerials);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!entryDate) {
      showToast("Please select an entry date", "warning");
      return;
    }
    if (!receivedBy) {
      showToast("Please select who received the item.", "warning");
      return;
    }
    if (!checkedBy) {
      showToast("Please select who checked the item.", "warning");
      return;
    }

    const serialnumbers = hasSerial
      ? verifiedSerials.map((s) => ({
          id: s.serial,
          inventory_id: null,
          remarks: s.isGood ? "Good" : "Defective",
          notes: s.note || null,
        }))
      : [];

    const newItem = {
      item_id: null,
      item_name: itemName.trim(),
      quantity: Number(quantity),
      distributor: distributor.trim(),
      client_name: clientName.trim(),
      entry_date: entryDate || new Date(),
      checked_by: checkedBy,
      received_by: receivedBy,
      delivered: false,
      delivery_date: null,
      delivered_by: null,
      item_status: "Pending",
      notes: itemNote.trim(),
      created_at: new Date(),
      created_by: user?.name || user?.email || "Unknown",
      serialnumbers,
    };

    try {
      await addInventory(newItem);
      showToast("Item added successfully!", "success");
      navigate(-1);
    } catch (err: any) {
      showToast("Failed to add item. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between mb-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
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
              <p className="text-md 3xl:text-lg font-bold text-gray-800">
                Add New Item
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-row px-8 py-6 gap-x-10 bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <div className="flex-1 flex flex-col gap-y-6">
            <div className="border border-gray-400 rounded-lg h-[70vh] flex flex-col py-6">
              <div className="flex-1 flex flex-col gap-y-2 overflow-y-auto px-6">
                <div className="relative">
                  <label htmlFor="entryDate" className="block text-xs 3xl:text-sm mb-1 mt-2">
                    Date of Entry
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      id="entryDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="p-2 pr-10 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg cursor-default"
                      required
                      readOnly
                    />

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setShowPicker((prev) => !prev);
                      }}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 hover:cursor-pointer"
                      aria-label="Open calendar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  {showPicker && (
                    <div className="absolute top-full right-0 mt-2 z-50">
                      <DatePicker
                        onDateSelect={handleDateSelect}
                        selectedDate={selectedDate}
                        onClose={() => setShowPicker(false)} 
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="itemName" className="block text-xs 3xl:text-sm mb-1">
                    Item Name
                  </label>
                  <textarea
                    id="itemName"
                    autoComplete="off"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    className="p-2 w-full h-16 text-xs 3xl:text-sm border border-gray-500 rounded-lg resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="itemQty" className="block text-xs 3xl:text-sm mb-1">
                    Qty
                  </label>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <input
                        id="itemQty"
                        type="number"
                        autoComplete="off"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={serialVerified}
                        className="p-2 w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg"
                        required
                      />
                    </div>

                    <div className="w-1/2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasSerial"
                        checked={hasSerial}
                        onChange={handleToggle}
                        disabled={serialVerified}
                        className="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500"
                      />
                      <label htmlFor="hasSerial" className="text-xs 3xl:text-sm">Has Serial Number</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="clientName" className="block text-xs 3xl:text-sm mb-1">
                    Client Name / End User
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    autoComplete="off"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="p-2 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="distributor" className="block text-xs 3xl:text-sm mb-1">
                    Distributor / Supplier
                  </label>
                  <InputDropdown
                    value={distributor}
                    onChange={(value) => setDistributor(value ?? "")}
                    options={suppliers.map(supplier => ({
                      name: supplier.name,
                      aid: supplier.id
                    }))}
                  />
                </div>

                <div className="relative">
                  <StaffDropdown
                    label="Received By"
                    value={receivedBy}
                    onChange={setReceivedBy}
                    options={admins}
                  />
                </div>

                <div className="relative">
                  <StaffDropdown
                    label="Checked By"
                    value={checkedBy}
                    onChange={setCheckedBy}
                    options={admins}
                  />
                </div>

                <div>
                  <label htmlFor="itemNotes" className="block text-xs 3xl:text-sm mb-1">
                    Notes
                  </label>
                  <textarea
                    id="itemNotes"
                    autoComplete="off"
                    value={itemNote}
                    onChange={(e) => setitemNote(e.target.value)}
                    className="p-2 w-full h-24 text-xs 3xl:text-sm border border-gray-500 rounded-lg resize-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-xs 3xl:text-sm mb-4 w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer transition"
                  >
                    Add Item
                  </button>
                </div>   
              </div>        
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {hasSerial && !serialVerified && (
              <div className="border border-gray-400 p-6 rounded-lg">
                <div>
                  <label htmlFor="serialNumbers" className="block text-xs 3xl:text-sm mb-1">
                    Serial No. 
                  </label>
                  <textarea
                    id="serialNumbers"
                    value={serialNumbers}
                    onChange={(e) => setSerialNumbers(e.target.value)}
                    className="p-2 w-full h-20 text-xs 3xl:text-sm border border-gray-500 rounded-lg resize-none"
                    required
                  />
                </div>
                <p className="text-xs 3xl:text-sm text-gray-600">Use commas to separate multiple serial numbers in the input field (e.g. SN1234, SN5678, SN91011).</p>

                <div>
                  <button
                    type="button"
                    onClick={verifySerials}
                    className="mt-4 text-xs 3xl:text-sm px-16 w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer transition"
                  >
                    Enter Serial Numbers
                  </button>
                </div>
              </div>
            )}

            {serialVerified && verifiedSerials.length > 0 && hasSerial && (
              <div className="border border-gray-300 rounded-lg h-[75vh] py-6">
                <div className="flex flex-col flex-grow overflow-y-auto h-full px-6">
                  {verifiedSerials.map((item, index) => (
                    <div key={index} className="flex flex-col gap-3 border border-gray-300 rounded-lg text-xs 3xl:text-sm p-4 mb-4">
                      <div className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={item.isGood}
                          onChange={(e) => updateSerialField(index, "isGood", e.target.checked)}
                        />
                        <label>Item is in good condition</label>
                      </div>

                      <div className="flex gap-4 items-center">
                        <label className="w-20 font-medium">Serial #{index + 1}:</label>
                        <input
                          type="text"
                          value={item.serial}
                          onChange={(e) => updateSerialField(index, "serial", e.target.value)}
                          className="flex-1 p-1 border border-gray-500 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex gap-4 items-start">
                        <label className="w-20 font-medium">Notes:</label>
                        <textarea
                          value={item.note}
                          onChange={(e) => updateSerialField(index, "note", e.target.value)}
                          className="flex-1 p-1 border border-gray-500 rounded-lg text-xs resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}