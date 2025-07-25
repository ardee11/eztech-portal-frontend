//import { verify } from "crypto";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../components/elements/DatePicker";
import { useAdmin } from "../../hooks/useAdmin";

export default function AddItem() {
  const { admins } = useAdmin();
  const navigate = useNavigate();
  //const [deliveredChecked, setDeliveredChecked] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    setShowPicker(false);
  };
  //const [entryDate, setEntryDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hasSerial, setHasSerial] = useState(false);
  const [clientName, setClientName] = useState("");
  const [distributor, setDistributor] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [itemNote, setitemNote] = useState("");
  const [serialNumbers, setSerialNumbers] = useState<string>("");
  const [verifiedSerials, setVerifiedSerials] = useState<
    { serial: string; note: string; isGood: boolean }[]
  >([]);
  const [serialVerified, setSerialVerified] = useState(false);

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

        <div className="flex flex-row min-w-0 h-[82vh] px-8 py-6 gap-x-10 items-start bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="flex-1 flex flex-col gap-y-6">
            <div className="border border-gray-300 rounded-lg h-[75vh] flex flex-col py-6">
              <div className="flex-1 flex flex-col gap-y-2 overflow-y-auto px-6">
                <div className="relative">
                  <label htmlFor="entryDate" className="block text-xs mb-1">
                    Date of Entry
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      id="entryDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="p-2 pr-10 block w-full text-xs border border-gray-500 rounded-lg"
                      required
                      readOnly
                    />

                    <button
                      type="button"
                      onClick={() => setShowPicker((prev) => !prev)}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
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
                    <div className="absolute z-50 mt-2">
                      <DatePicker onDateSelect={handleDateSelect} />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="itemName" className="block text-xs mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
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
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={serialVerified}
                        className="p-2 w-full text-xs border border-gray-500 rounded-lg"
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
                      <label htmlFor="hasSerial" className="text-xs">Has Serial Number</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="clientName" className="block text-xs mb-1">
                    Client Name / End User
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="distributor" className="block text-xs mb-1">
                    Distributor / Supplier
                  </label>
                  <input
                    type="text"
                    id="distributor"
                    value={distributor}
                    onChange={(e) => setDistributor(e.target.value)}
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="receivedBy" className="block text-xs mb-1">
                    Received By
                  </label>
                  <select
                    id="receivedBy"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    required
                  >
                    <option value="" disabled>-- Select staff --</option>
                    {admins.map((admin) => (
                      <option key={admin.aid} value={admin.name}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="receivedBy" className="block text-xs mb-1">
                    Checked By
                  </label>
                  <select
                    id="checkedBy"
                    value={checkedBy}
                    onChange={(e) => setCheckedBy(e.target.value)}
                    className="p-2 block w-full text-xs border border-gray-500 rounded-lg"
                    required
                  >
                    <option value="" disabled>-- Select staff --</option>
                    {admins.map((admin) => (
                      <option key={admin.aid} value={admin.name}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
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
                    value={itemNote}
                    onChange={(e) => setitemNote(e.target.value)}
                    className="p-2 w-full h-24 text-xs border border-gray-500 rounded-lg resize-y"
                    required
                  />
                </div>

                <div>
                  <button
                    type="button"
                    //onClick={verifySerials}
                    className="text-xs w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer transition"
                  >
                    Add Item
                  </button>
                </div>   
              </div>        
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {hasSerial && !serialVerified && (
              <div className="border border-gray-300 p-6 rounded-lg">
                <div>
                  <label htmlFor="serialNumbers" className="block text-xs mb-1">
                    Serial No. 
                  </label>
                  <textarea
                    id="serialNumbers"
                    value={serialNumbers}
                    onChange={(e) => setSerialNumbers(e.target.value)}
                    className="p-2 w-full h-20 text-xs border border-gray-500 rounded-lg resize-y"
                    required
                  />
                </div>
                <p className="text-xs text-gray-600">Use commas to separate multiple serial numbers in the input field (e.g. SN1234, SN5678, SN91011).</p>

                <div>
                  <button
                    type="button"
                    onClick={verifySerials}
                    className="mt-4 text-xs px-16 w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 hover:cursor-pointer transition"
                  >
                    Enter Serial Numbers
                  </button>
                </div>
              </div>
              )}
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
            </div> */
            }

            {serialVerified && verifiedSerials.length > 0 && hasSerial && (
              <div className="border border-gray-300 rounded-lg h-[75vh] py-6">
                <div className="flex flex-col flex-grow overflow-y-auto h-full px-6">
                  {verifiedSerials.map((item, index) => (
                    <div key={index} className="flex flex-col gap-3 border border-gray-300 rounded-lg text-xs p-4 mb-4">
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
                          className="flex-1 p-1 border border-gray-500 rounded-lg text-xs resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}