import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type AccountManagersDropdown = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { name: string; aid: string | number }[];
};

export default function AccountManagersDropdown({ id, label, value, onChange, options }: AccountManagersDropdown) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [dropdownStyles, setDropdownStyles] = useState<{
    top: number;
    left: number;
    width: number;
    openUpward: boolean;
  }>({ top: 0, left: 0, width: 0, openUpward: false });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      const dropdownHeight = Math.min(options.length, 9) * 32; 
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let openUpward = false;

      if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
        openUpward = true;
      }

      setDropdownStyles({
        top: openUpward ? rect.top + window.scrollY - dropdownHeight : rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        openUpward,
      });
    }
  }, [isOpen, options.length]);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs mb-1">{label}</label>

      <button
        id={id}
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full py-2 px-3 inline-flex items-center justify-between gap-x-1 text-xs rounded-lg border border-gray-400 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 hover:cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value || "-- Select staff --"}
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            tabIndex={-1}
            className="bg-white mt-2 shadow-md border border-gray-400 rounded-lg max-h-36 overflow-y-auto"
            style={{
              position: "absolute",
              top: dropdownStyles.top,
              left: dropdownStyles.left,
              width: dropdownStyles.width,
              zIndex: 9999,
            }}
          >
            <div className="p-1 py-2">
              {options.map((option) => (
                <button
                  key={option.aid}
                  role="option"
                  onClick={() => {
                    onChange(option.name);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left text-xs text-gray-700 px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    value === option.name ? "bg-teal-100 font-semibold" : ""
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
