import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import DatePicker from "./DatePicker"; // Your actual calendar component

const POPUP_WIDTH = 300;

type Props = {
  pos: { x: number; y: number };
  selectedDate: string;
  onDateSelect: (formatted: string, date: Date) => void;
  onClose: () => void;
};

const DatePickerPopover = ({ pos, selectedDate, onDateSelect, onClose }: Props) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const offsetY = 24;

  return createPortal(
    <div
      ref={pickerRef}
      className="absolute z-[9999]"
      style={{
        position: "absolute",
        top: pos.y + offsetY + window.scrollY,
        left: pos.x + window.scrollX - POPUP_WIDTH,
        width: 320, // or your preferred width
      }}
    >
      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onClose={onClose}
      />
    </div>,
    document.body
  );
};

export default DatePickerPopover;
