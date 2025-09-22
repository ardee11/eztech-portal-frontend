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
      showToast("Please check the 'Has Serial Number' box to enter serial numbers.", "warning");
      return;
    }

    const numericQuantity = Number(quantity);
    if (!quantity || numericQuantity <= 0) {
      showToast("Please ensure you entered a valid quantity.", "warning");
      return;
    }

    const cleanedString = serialNumbers.replace(/\n/g, ',');
    const serials = cleanedString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (serials.length !== numericQuantity) {
      showToast(`You entered ${serials.length} serial number(s), but quantity is ${quantity}. Please correct it.`, "warning");
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
      order_no: null,
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
    <div className="w-full mx-auto p-4 relative bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex items-center space-x-4">
          <div
            onClick={() => navigate(-1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? navigate(-1) : null)}
            className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 rounded-xl p-2 transition-all duration-200 group"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 5H1m0 0 4 4M1 5l4-4"/>
            </svg>
          </div>
          <div className="text-base 3xl:text-lg font-bold text-gray-900">
            Add New Inventory Item
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col xl:flex-row gap-4 items-start">
          {/* Enhanced Main Form Card */}
          <div className="w-full xl:w-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-base 3xl:text-lg font-bold text-gray-800">Item Information</h2>
              </div>
            </div>
              
            <form onSubmit={handleSubmit} className="p-6 space-y-4 3xl:space-y-6">
              {/* Date of Entry */}
              <div className="group relative">
                <label htmlFor="entryDate" className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Date of Entry
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="entryDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2 py-2 text-xs 3xl:text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 hover:cursor-pointer transition-all duration-200 bg-white"
                    required
                    readOnly
                    placeholder="Select entry date"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowPicker((prev) => !prev);
                    }}
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowPicker((prev) => !prev);
                    }}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 hover:cursor-pointer transition-colors duration-200"
                    aria-label="Open calendar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </button>
                </div>

                {showPicker && (
                  <div className="absolute top-full right-0 mt-2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl">
                    <DatePicker
                      onDateSelect={handleDateSelect}
                      selectedDate={selectedDate}
                      onClose={() => setShowPicker(false)} 
                    />
                  </div>
                )}
              </div>

              {/* Item Name */}
              <div className="group">
                <label htmlFor="itemName" className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Item Name
                </label>
                <textarea
                  id="itemName"
                  autoComplete="off"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-xs 3xl:text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all duration-200 resize-none h-20 bg-white"
                  placeholder="Enter item name or description"
                />
              </div>

              {/* Quantity and Serial Number Toggle */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="group">
                  <label htmlFor="itemQty" className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                    Quantity
                  </label>
                  <input
                    id="itemQty"
                    type="number"
                    autoComplete="off"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={serialVerified}
                    className="w-full p-2 text-xs 3xl:text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all duration-200 bg-white"
                    required
                    placeholder="0"
                    min="1"
                  />
                </div>
                
                <div className="group">
                  <div className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                    <p>&nbsp;</p>
                  </div>
                  <div className="flex items-center space-x-3 h-9.5 px-4 ">
                    <input
                      type="checkbox"
                      id="hasSerial"
                      checked={hasSerial}
                      onChange={handleToggle}
                      disabled={serialVerified}
                      className="w-4 h-4 border-gray-300 rounded focus:outline-none focus:ring-0 disabled:opacity-50"
                    />
                    <label htmlFor="hasSerial" className="text-xs text-gray-700 font-medium">Has Serial Numbers</label>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="clientName" className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  autoComplete="off"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-2 py-2 text-xs 3xl:text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all duration-200 bg-white"
                  required
                  placeholder="Enter client name"
                />
              </div>

              <div className="group">
                <p className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Distributor
                </p>
                <InputDropdown
                  value={distributor}
                  onChange={(value) => setDistributor(value ?? "")}
                  options={suppliers.map(supplier => ({
                    name: supplier.name,
                    aid: supplier.aid
                  }))}
                />
              </div>

              <div className="group">
                <p className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Received By
                </p>
                <StaffDropdown
                  value={receivedBy}
                  onChange={setReceivedBy}
                  options={admins}
                />
              </div>

              <div className="group">
                <p className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Checked By
                </p>
                <StaffDropdown
                  value={checkedBy}
                  onChange={setCheckedBy}
                  options={admins}
                />
              </div>

              {/* Notes */}
              <div className="group">
                <label htmlFor="itemNotes" className="block text-xs 3xl:text-sm font-semibold text-gray-800 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="itemNotes"
                  autoComplete="off"
                  value={itemNote}
                  onChange={(e) => setitemNote(e.target.value)}
                  className="w-full px-4 py-3 text-xs 3xl:text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all duration-200 resize-none h-24 bg-white"
                  placeholder="Enter any additional notes or comments"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white text-xs 3xl:text-sm font-semibold rounded-lg transition-all duration-200 hover:cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Item..." : "Add Item to Inventory"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Serial Numbers */}
          {!serialVerified && (
            <div className={`w-full xl:w-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${
              hasSerial ? 'hover:shadow-xl' : 'opacity-60'
              }`}>
              <div className={`px-6 py-4 border-b border-gray-100 ${
                hasSerial 
                  ? 'bg-emerald-100/80' 
                  : 'bg-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    hasSerial ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      hasSerial ? 'text-green-600' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                  </div>
                  <h2 className={`text-base 3xl:text-lg font-bold ${
                    hasSerial ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    Serial Numbers
                  </h2>
                  {!hasSerial && (
                    <span className="bg-gray-300 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      Disabled
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="group">
                  <label htmlFor="serialNumbers" className={`block text-xs 3xl:text-sm font-semibold mb-2 ${
                    hasSerial ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    Enter Serial Numbers
                  </label>

                  <textarea
                    id="serialNumbers"
                    value={serialNumbers}
                    onChange={(e) => setSerialNumbers(e.target.value)}
                    disabled={!hasSerial}
                    className={`w-full px-4 py-3 text-xs 3xl:text-sm border rounded-md resize-none h-24 transition-all duration-200 ${
                      hasSerial 
                        ? 'border-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-gray-50' 
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    required={hasSerial}
                    placeholder={hasSerial ? "SN1234, SN5678, SN91011" : "Enable serial numbers to enter data"}
                  />
                  <p className={`text-xs mt-1 ml-3 ${
                    hasSerial ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {hasSerial 
                      ? "Use commas to separate multiple serial numbers" 
                      : "Check the 'Has Serial Numbers' checkbox to enable this section"
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={verifySerials}
                  disabled={!hasSerial}
                  className={`w-full py-3 px-6 text-white text-xs font-semibold rounded-lg transition-all duration-200 ${
                    hasSerial 
                      ? 'bg-teal-600 hover:bg-teal-700 hover:cursor-pointer' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {hasSerial ? "Confirm Serial Numbers" : "Serial Numbers Disabled"}
                </button>
              </div>
            </div>
          )}

          {/* Verified Serial Numbers Card - Only show when verified */}
          {serialVerified && verifiedSerials.length > 0 && hasSerial && (
            <div className="w-full xl:w-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-100/80 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h2 className="text-base 3xl:text-lg font-bold text-gray-900">Serial Numbers</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {verifiedSerials.length} {verifiedSerials.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                {verifiedSerials.map((item, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50 duration-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-xs font-medium text-gray-900">Serial #{index + 1}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`good-${index}`}
                          checked={item.isGood}
                          onChange={(e) => updateSerialField(index, "isGood", e.target.checked)}
                          className="w-4 h-4 border-gray-300 rounded text-blue-600 bg-white focus:ring-0"
                        />
                        <label htmlFor={`good-${index}`} className="text-xs 3xl:text-sm text-gray-800 font-medium">
                          Item is in good condition
                        </label>
                      </div>

                        <div>
                          <label className="block text-xs 3xl:text-sm font-medium text-gray-800 mb-1">Serial Number</label>
                          <input
                            type="text"
                            value={item.serial}
                            onChange={(e) => updateSerialField(index, "serial", e.target.value)}
                            className="w-full px-3 py-2 text-xs 3xl:text-sm border border-gray-500 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                          <textarea
                            value={item.note}
                            onChange={(e) => updateSerialField(index, "note", e.target.value)}
                            className="w-full px-3 py-2 text-xs 3xl:text-sm border border-gray-500 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all duration-200 resize-none h-16"
                            placeholder="Optional notes for this item"
                          />
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}