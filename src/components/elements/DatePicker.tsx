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

  // --- New Logic: Add a year and month selector ---
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 4 + i);
  //const years = Array.from({ length: 5 }, (_, i) => 2021 + i);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(event.target.value, 10));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(event.target.value, 10));
  };
  // --------------------------------------------------

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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    <div
      ref={pickerRef}
      className="fade-in w-80 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-3 text-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={() => setCurrentMonth(m => (m === 0 ? 11 : m - 1))} className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 hover:cursor-pointer rounded-full">
          ‹
        </button>
        <div className="flex space-x-2">
          {/* Month Selector */}
          <select value={currentMonth} onChange={handleMonthChange} className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm font-medium">
            {monthNames.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>
          {/* Year Selector */}
          <select value={currentYear} onChange={handleYearChange} className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm font-medium">
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setCurrentMonth(m => (m === 11 ? 0 : m + 1))} className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 hover:cursor-pointer rounded-full">
          ›
        </button>
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