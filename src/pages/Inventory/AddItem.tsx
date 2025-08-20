import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../components/elements/DatePicker";
import { useAdmin } from "../../hooks/useAdmin";
import StaffDropdown from "../../components/elements/StaffDropdown";
import { useAddInventory } from "../../hooks/useInventory";
import { showToast } from "../../utils/toastUtils";

export default function AddItem() {
  const { admins } = useAdmin();
  const navigate = useNavigate();
  const { addInventory } = useAddInventory();

  const [showPicker, setShowPicker] = useState(false);
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hasSerial, setHasSerial] = useState(false);
  const [clientName, setClientName] = useState("");
  const [distributor, setDistributor] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
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
      created_by: receivedBy,
      serialnumbers,
    };

    try {
      await addInventory(newItem);
      showToast("Item added successfully!", "success");
      navigate(-1);
    } catch (err: any) {
      showToast("Failed to add item. Please try again.", "error");
    }
  };

  return (
<<<<<<< HEAD
    <div className="w-full mx-auto px-4 py-6 relative bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-xl shadow-sm border border-gray-100 px-2 py-1">
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
            <p className="text-sm font-bold text-gray-500">Return to Inventory</p>
          </div>
=======
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
>>>>>>> ez-ArdieDelaCruz
        </div>
      </div>

<<<<<<< HEAD
      <div className="w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Main Form */}
          <div className="space-y-6">
            {/* Enhanced Main Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Item Information</h2>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Date of Entry */}
                <div className="group relative">
                  <label htmlFor="entryDate" className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
=======
        <form
          onSubmit={handleSubmit}
          className="flex flex-row px-8 py-6 gap-x-10 bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <div className="flex-1 flex flex-col gap-y-6">
            <div className="border border-gray-400 rounded-lg h-[70vh] flex flex-col py-6">
              <div className="flex-1 flex flex-col gap-y-2 overflow-y-auto px-6">
                <div className="relative">
                  <label htmlFor="entryDate" className="block text-xs 3xl:text-sm mb-1 mt-2">
>>>>>>> ez-ArdieDelaCruz
                    Date of Entry
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="entryDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
<<<<<<< HEAD
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-default bg-gray-50"
=======
                      className="p-2 pr-10 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg cursor-default"
>>>>>>> ez-ArdieDelaCruz
                      required
                      readOnly
                      placeholder="Select entry date"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setShowPicker((prev) => !prev);
                      }}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                      aria-label="Open calendar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
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
                    <div className="absolute top-full right-0 mt-2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl">
                      <DatePicker
                        onDateSelect={handleDateSelect}
                        selectedDate={selectedDate}
                        onClose={() => setShowPicker(false)} 
                      />
                    </div>
                  )}
                </div>

<<<<<<< HEAD
                {/* Item Name */}
                <div className="group">
                  <label htmlFor="itemName" className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
=======
                <div>
                  <label htmlFor="itemName" className="block text-xs 3xl:text-sm mb-1">
>>>>>>> ez-ArdieDelaCruz
                    Item Name
                  </label>
                  <textarea
                    id="itemName"
                    autoComplete="off"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
<<<<<<< HEAD
                    className="w-full px-4 py-3 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none h-20"
                    placeholder="Enter item name or description"
                  />
                </div>

                {/* Quantity and Serial Number Toggle */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="itemQty" className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Quantity
                    </label>
                    <input
                      id="itemQty"
                      type="number"
                      autoComplete="off"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      disabled={serialVerified}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                      placeholder="0"
                      min="1"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      <p>&nbsp;</p>
                    </label>
                    <div className="flex items-center space-x-3 h-9.5 px-4 ">
=======
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
>>>>>>> ez-ArdieDelaCruz
                      <input
                        type="checkbox"
                        id="hasSerial"
                        checked={hasSerial}
                        onChange={handleToggle}
                        disabled={serialVerified}
                        className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                      />
<<<<<<< HEAD
                      <label htmlFor="hasSerial" className="text-xs text-gray-700 font-medium">Has Serial Numbers</label>
=======
                      <label htmlFor="hasSerial" className="text-xs 3xl:text-sm">Has Serial Number</label>
>>>>>>> ez-ArdieDelaCruz
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                {/* Client and Distributor */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="clientName" className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      autoComplete="off"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                      placeholder="Enter client name"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="distributor" className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Distributor
                    </label>
                    <input
                      type="text"
                      id="distributor"
                      autoComplete="off"
                      value={distributor}
                      onChange={(e) => setDistributor(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                      placeholder="Enter distributor name"
                    />
                  </div>
                </div>

                {/* Staff Selection */}
                <div className="grid grid-cols-2 gap-4 h-12 text-gray-500">
                  <div className="group">
                    <StaffDropdown
                      label="Received By"
                      value={receivedBy}
                      onChange={setReceivedBy}
                      options={admins}
                    />
                  </div>

                  <div className="group">
                    <StaffDropdown
                      label="Checked By"
                      value={checkedBy}
                      onChange={setCheckedBy}
                      options={admins}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="group">
                  <label htmlFor="itemNotes" className="block text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Additional Notes
=======
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
                  <input
                    type="text"
                    id="distributor"
                    autoComplete="off"
                    value={distributor}
                    onChange={(e) => setDistributor(e.target.value)}
                    className="p-2 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg"
                    required
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
>>>>>>> ez-ArdieDelaCruz
                  </label>
                  <textarea
                    id="itemNotes"
                    autoComplete="off"
                    value={itemNote}
                    onChange={(e) => setitemNote(e.target.value)}
<<<<<<< HEAD
                    className="w-full px-4 py-3 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none h-24"
                    placeholder="Enter any additional notes or comments"
=======
                    className="p-2 w-full h-24 text-xs 3xl:text-sm border border-gray-500 rounded-lg resize-none"
>>>>>>> ez-ArdieDelaCruz
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
<<<<<<< HEAD
                    disabled={loading}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
=======
                    className="text-xs 3xl:text-sm mb-4 w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer transition"
>>>>>>> ez-ArdieDelaCruz
                  >
                    {loading ? "Adding Item..." : "Add Item to Inventory"}
                  </button>
                </div>
              </form>
            </div>
          </div>

<<<<<<< HEAD
                     {/* Right Column - Serial Numbers */}
           <div className="space-y-6">
             {/* Serial Numbers Input Card - Always Visible */}
             <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${
               hasSerial ? 'hover:shadow-xl' : 'opacity-60'
             }`}>
               <div className={`px-6 py-4 border-b border-gray-100 ${
                 hasSerial 
                   ? 'bg-gradient-to-r from-green-50 to-emerald-50' 
                   : 'bg-gradient-to-r from-gray-50 to-gray-100'
               }`}>
                 <div className="flex items-center space-x-3">
                   <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                     hasSerial ? 'bg-green-100' : 'bg-gray-200'
                   }`}>
                     <svg className={`w-4 h-4 ${
                       hasSerial ? 'text-green-600' : 'text-gray-400'
                     }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                     </svg>
                   </div>
                   <h2 className={`text-sm font-bold ${
                     hasSerial ? 'text-gray-900' : 'text-gray-500'
                   }`}>
                     Serial Numbers
                   </h2>
                   {!hasSerial && (
                     <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                       Disabled
                     </span>
                   )}
                 </div>
               </div>
               
               <div className="p-6 space-y-4">
                 <div className="group">
                   <label htmlFor="serialNumbers" className={`block text-2xs font-semibold uppercase tracking-wide mb-2 ${
                     hasSerial ? 'text-gray-500' : 'text-gray-400'
                   }`}>
                     Enter Serial Numbers
                   </label>
                   <textarea
                     id="serialNumbers"
                     value={serialNumbers}
                     onChange={(e) => setSerialNumbers(e.target.value)}
                     disabled={!hasSerial}
                     className={`w-full px-4 py-3 text-xs border rounded-lg resize-none h-24 transition-all duration-200 ${
                       hasSerial 
                         ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                         : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                     }`}
                     required={hasSerial}
                     placeholder={hasSerial ? "SN1234, SN5678, SN91011" : "Enable serial numbers to enter data"}
                   />
                   <p className={`text-xs mt-2 ${
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
                       ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' 
                       : 'bg-gray-400 cursor-not-allowed'
                   }`}
                 >
                   {hasSerial ? "Verify Serial Numbers" : "Serial Numbers Disabled"}
                 </button>
               </div>
             </div>

             {/* Verified Serial Numbers Card - Only show when verified */}
             {serialVerified && verifiedSerials.length > 0 && hasSerial && (
               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                         </svg>
                       </div>
                       <h2 className="text-xs font-bold text-gray-900">Verified Serial Numbers</h2>
                       <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                         {verifiedSerials.length} {verifiedSerials.length === 1 ? "item" : "items"}
                       </span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                   {verifiedSerials.map((item, index) => (
                     <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                       <div className="flex items-center space-x-3 mb-3">
                         <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                           {index + 1}
                         </div>
                         <span className="text-xs font-medium text-gray-900">Serial #{index + 1}</span>
                       </div>
                       
                       <div className="space-y-3">
                         <div className="flex items-center space-x-3">
                           <input
                             type="checkbox"
                             id={`good-${index}`}
                             checked={item.isGood}
                             onChange={(e) => updateSerialField(index, "isGood", e.target.checked)}
                             className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-2"
                           />
                           <label htmlFor={`good-${index}`} className="text-sm text-gray-700 font-medium">
                             Item is in good condition
                           </label>
                         </div>
=======
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
>>>>>>> ez-ArdieDelaCruz

                         <div className="grid grid-cols-1 gap-3">
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Serial Number</label>
                             <input
                               type="text"
                               value={item.serial}
                               onChange={(e) => updateSerialField(index, "serial", e.target.value)}
                               className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                             />
                           </div>

                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                             <textarea
                               value={item.note}
                               onChange={(e) => updateSerialField(index, "note", e.target.value)}
                               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none h-16"
                               placeholder="Optional notes for this item"
                             />
                           </div>
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
    </div>
  );
}