import { useEffect, useRef, useState } from "react";

type DatePickerProps = {
  onDateSelect: (dateString: string, date: Date) => void;
  selectedDate: string | null;
  onClose: () => void;
};

const DatePicker = ({ onDateSelect, selectedDate, onClose }: DatePickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const yearRange = Array.from({ length: 10 }, (_, i) => 2020 + i);

  const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handleDateClick = (day: number) => {
    const date = new Date(Date.UTC(currentYear, currentMonth, day));
    const dateString = formatDate(date);
    onDateSelect?.(dateString, date);
  };

  const daysArray = Array.from({ length: startOffset + daysInMonth }, (_, index) => {
    const day = index - startOffset + 1;
    return day > 0 ? day : null;
  });

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
      <div className="relative w-70">
<div className="flex flex-row gap-2 mt-3 mb-1">
  {/* Month Dropdown */}
  <div className="relative w-40 px-1.5 mt-1 mb-2">
    <button
      type="button"
      className="border border-gray-400 px-3 py-1 w-40 rounded flex justify-between items-center hover:cursor-pointer"
      onClick={() => setShowMonthDropdown((prev) => !prev)}
    >
      {monthNames[currentMonth]}
      <svg
  width="16"
  height="16"
  fill="none"
  className={`opacity-40 transform transition-transform duration-200 ${showMonthDropdown ? "rotate-180" : ""}`}
>
  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
    </button>
    {showMonthDropdown && (
      <div className="absolute z-10 w-full h-40 text-sm bg-white border border-gray-300 rounded shadow grid grid-cols-3 gap-2 mt-2 px-1 py-1">
        {monthNames.map((name, idx) => (
          <div
            key={name}
            className="px-2 py-1.5 hover:bg-blue-100 rounded cursor-pointer"
            onClick={() => {
              setCurrentMonth(idx);
              setShowMonthDropdown(false);
            }}
          >
            {name}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Year Dropdown */}
  <div className="relative mt-1 mb-2">
    <button
      type="button"
      className="border border-gray-400 px-3 py-1 w-26 rounded flex justify-between items-center hover:cursor-pointer"
      onClick={() => setShowYearDropdown((prev) => !prev)}
    >
      {currentYear}
      <svg
  width="16"
  height="16"
  fill="none"
  className={`opacity-40 transform transition-transform duration-200 ${showYearDropdown ? "rotate-180" : ""}`}
>
  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
    </button>
    {showYearDropdown && (
      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-41 overflow-auto">
        {yearRange.map((year) => (
          <div
            key={year}
            className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setCurrentYear(year);
              setShowYearDropdown(false);
            }}
          >
            {year}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
 

{/* Week Days */}
<div className="flex justify-between text-gray-500">
{weekDays.map((day) => (
<span key={day} className="w-10 text-center">{day}</span>
  ))}
    </div>

{/* Days Grid */}
  <div className="grid grid-cols-7">
    {daysArray.map((day, index) => {
      if (day === null) {
        return <div key={index} className="w-10 h-10 p-0.5" />;
      }

      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

        const dateString = formatDate(new Date(currentYear, currentMonth, day));
        const isSelected = selectedDate === dateString;

        return (
          <div key={index} className="w-10 h-10 p-0.5">
            <button
              onClick={() => handleDateClick(day)}
              className={`w-full h-full rounded-full flex items-center justify-center
                ${
                  isSelected
                    ? "border border-teal-500 text-teal-600"
                    : isToday
                    ? "bg-teal-500 text-white font-medium"
                    : "text-gray-800"
                }
                hover:border hover:cursor-pointer hover:border-teal-500 hover:text-teal-600`}
            >
              {day}
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default DatePicker;