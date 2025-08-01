import { useState, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { useUpdateInventory } from "../../../hooks/useInventory";
import { useAdmin } from "../../../hooks/useAdmin";

import StaffDropdown from "../../elements/StaffDropdown";
import DatePickerPopover from "../../elements/DatePickerPopover";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
};

const SetDeliveryModal = ({ isOpen, onClose, itemId }: Props) => {
  const { admins } = useAdmin();
  const { updateInventory, loading } = useUpdateInventory();
  const [delivered, setDelivered] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveredBy, setDeliveredBy] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!itemId) return;

      await updateInventory(itemId, {
        delivered: delivered,
        delivery_date: deliveryDate,
        delivered_by: deliveredBy,
      });

      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDateSelect = (dateString: string, date: Date) => {
    setDeliveryDate(date);
    setSelectedDate(dateString);
    setShowPicker(false);
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPickerPos({ x: e.clientX, y: e.clientY });
    setShowPicker((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl w-full max-w-2xl max-h-80 overflow-visible">
            <div className="delay-show">
              <div className="px-8 py-4 border-b border-gray-200">
                <h3 id="details-modal-label" className="text-lg font-bold text-gray-800">
                  Edit Delivery Details
                </h3>
              </div>

              <div className="px-12 py-6 flex-grow">
                <form id="editDetails" onSubmit={handleSubmit} className="space-y-6 text-sm">
                  <div className="relative">
                    <label htmlFor="entryDate" className="block text-xs mb-1">
                      Date of Delivery:
                    </label>

                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1/2">
                        <input
                          ref={inputRef}
                          type="text"
                          id="entryDate"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="p-2 pr-10 block w-full text-xs border border-gray-500 rounded-lg cursor-default"
                          required
                          readOnly
                        />

                        <button
                          type="button"
                          onMouseDown={handleCalendarClick}
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

                      <label htmlFor="isDelivered" className="flex-1/3 items-center text-xs space-x-2 select-none">
                        <input
                          type="checkbox"
                          id="isDelivered"
                          checked={delivered}
                          onChange={() => setDelivered(!delivered)}
                          className="text-teal-600 border-gray-300 rounded focus:ring-teal-500 hover:cursor-pointer"
                        />
                        <span>Delivered</span>
                      </label>
                    </div>

                    {showPicker && pickerPos && (
                      <DatePickerPopover
                        pos={pickerPos}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onClose={() => setShowPicker(false)}
                      />
                    )}
                  </div>

                  <div>
                    <StaffDropdown
                      label="Delivered By:"
                      value={deliveredBy}
                      onChange={setDeliveredBy}
                      options={admins}
                    />
                  </div>
                </form>
              </div>

              <div className="mt-3 p-4 border-t border-gray-200 flex justify-center gap-10">
                <button
                  type="submit"
                  form="editDetails"
                  disabled={loading}
                  className="bg-teal-500 text-xs text-white px-20 py-2 rounded-lg hover:bg-teal-600 disabled:bg-teal-500 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer"
                >
                  {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-xs text-white px-20 py-2 rounded-lg hover:bg-gray-500 hover:cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SetDeliveryModal;
