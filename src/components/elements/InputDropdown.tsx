import { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";

type StaffDropdownProps = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { name: string; aid: string | number }[];
};

export default function InputDropdown({ label, value, onChange, options }: StaffDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const initialInputRect = useRef<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredDropdownRef = useRef<HTMLDivElement>(null);

  const id = useId();
  const labelId = `staff-dropdown-label-${id}`;

  const [dropdownStyles, setDropdownStyles] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUpward: false,
  });

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Positioning
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let dropdownHeight = 0;
      if (measuredDropdownRef.current) {
        dropdownHeight = measuredDropdownRef.current.offsetHeight;
      }

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const openUpward = spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight;

      setDropdownStyles({
        top: openUpward
          ? rect.top + window.scrollY - dropdownHeight
          : rect.bottom + window.scrollY + 2,
        left: rect.left + window.scrollX,
        width: rect.width,
        openUpward,
      });
    }
  }, [isOpen, filteredOptions.length]);

  //close on scroll
  useEffect(() => {
  function handleScroll() {
      if (isOpen && inputRef.current && initialInputRect.current) {
      const currentRect = inputRef.current.getBoundingClientRect();
      const prevRect = initialInputRect.current;

      const positionChanged =
          Math.abs(currentRect.top - prevRect.top) > 1 ||
          Math.abs(currentRect.left - prevRect.left) > 1;

      if (positionChanged) {
          setIsOpen(false);
      }
      }
  }

  if (isOpen) {
    window.addEventListener("scroll", handleScroll, true);
  }

  return () => {
    window.removeEventListener("scroll", handleScroll, true);
  };
  }, [isOpen]);

  const handleSelect = (name: string) => {
    onChange(name);
    setSearch(name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label id={labelId} className="block text-xs mb-1">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
        setIsOpen(true);
          if (inputRef.current) {
              initialInputRect.current = inputRef.current.getBoundingClientRect();
          }
        }}
        placeholder={value || "Select..."}
        className="w-full py-2 px-3 text-xs 3xl:text-sm rounded-md border border-gray-600 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-400"
      />

      {isOpen &&
        createPortal(
          <div
            ref={(el) => {
              dropdownRef.current = el;
              measuredDropdownRef.current = el;
            }}
            role="listbox"
            aria-labelledby={labelId}
            className="bg-white shadow-lg border border-gray-400 rounded-lg max-h-70 overflow-y-auto"
            style={{
              position: "absolute",
              top: dropdownStyles.top,
              left: dropdownStyles.left,
              width: dropdownStyles.width,
              zIndex: 9999,
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="text-xs 3xl:text-sm text-gray-500 px-4 py-2">Nothing found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.aid}
                  onClick={() => handleSelect(option.name)}
                  className="px-5 py-2.5 text-xs 3xl:text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  {option.name}
                </div>
              ))
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
