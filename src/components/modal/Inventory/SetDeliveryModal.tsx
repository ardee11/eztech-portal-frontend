import { useState, useRef, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useUpdateInventory } from "../../../hooks/useInventory";
import { useAdmin } from "../../../hooks/useAdmin";

import StaffDropdown from "../../elements/StaffDropdown";
import DatePickerPopover from "../../elements/DatePickerPopover";
import { showToast } from "../../../utils/toastUtils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onUpdate?: (updatedFields: any) => void;
};

const SetDeliveryModal = ({ isOpen, onClose, itemId, onUpdate }: Props) => {
  const { admins } = useAdmin();
  const { updateInventory, loading } = useUpdateInventory();

  const [delivered, setDelivered] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [deliveredBy, setDeliveredBy] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemId || !deliveryDate || deliveredBy.length === 0) return;

    try {
      const updatedFields = {
        delivered,
        delivery_date: deliveryDate,
        delivered_by: deliveredBy,
      };

      await updateInventory(itemId, updatedFields);
      onResetForm();

      if (onUpdate) {
        onUpdate(updatedFields);
      }

      showToast("Delivery details updated successfully", "success");
    } catch (err) {
      showToast("Failed to update delivery details", "error");
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

  const onResetForm = () => {
    setDelivered(false);
    setDeliveryDate(null);
    setSelectedDate("");
    setDeliveredBy([]);
    onClose();
  };

  // Optional: auto-reset on close
  useEffect(() => {
    if (!isOpen) {
      onResetForm();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
          <div className="bg-white animate-expand-card rounded-xl shadow-2xl w-full max-w-2xl 3xl:max-w-3xl max-h-84 3xl:max-h-94 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="delay-show px-8 py-4 3xl:py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Edit Delivery Details</h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="delay-show px-12 py-6 flex-1 overflow-auto">
              <form id="editDetails" onSubmit={handleSubmit} className="space-y-6 text-sm">
                <div className="relative">
                  <label htmlFor="entryDate" className="block text-xs 3xl:text-sm mb-1">
                    Date of Delivery:
                  </label>

                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1/2">
                      <input
                        ref={inputRef}
                        type="text"
                        id="entryDate"
                        value={selectedDate}
                        onMouseDown={handleCalendarClick}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 pr-10 block w-full text-xs 3xl:text-sm border border-gray-500 rounded-lg cursor-default"
                        required
                        readOnly
                      />

                      <button
                        type="button"
                        onMouseDown={handleCalendarClick}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
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

                    <label htmlFor="isDelivered" className="flex-1/3 items-center text-xs 3xl:text-sm space-x-2 select-none">
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

            {/* Sticky Footer */}
            <div className="delay-show px-16 3xl:px-20 py-5 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                type="submit"
                form="editDetails"
                disabled={loading || !deliveryDate || deliveredBy.length === 0}
                className="px-12 py-2.5 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? <ClipLoader size={18} color="#fff" /> : "Submit"}
              </button>

              <button
                type="button"
                onClick={onResetForm}
                className="px-6 py-2.5 text-xs 3xl:text-sm font-medium text-gray-700 bg-white border border-gray-500 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SetDeliveryModal;
