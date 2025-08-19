import { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";

type StaffDropdownProps = {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { name: string; aid: string | number }[];
};

export default function StaffDropdown({ label, value, onChange, options }: StaffDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const initialButtonRect = useRef<DOMRect | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
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
      initialButtonRect.current = rect;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const dropdownHeight = Math.min(filteredOptions.length, 9) * 43 + 50;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const openUpward = spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight;

      setDropdownStyles({
        top: openUpward
          ? rect.top + window.scrollY - dropdownHeight
          : rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
        width: rect.width,
        openUpward,
      });
    }
  }, [isOpen, filteredOptions.length]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
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

  useEffect(() => {
    function handleScroll() {
      if (isOpen && buttonRef.current && initialButtonRect.current) {
        const currentRect = buttonRef.current.getBoundingClientRect();
        const prevRect = initialButtonRect.current;

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

  const handleToggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label id={labelId} className="block text-xs 3xl:text-sm mb-1">
          {label}
        </label>
      )}

      <div
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full py-2 px-3 text-left inline-flex items-center justify-between gap-x-1 text-xs 3xl:text-sm rounded-md border border-gray-500 bg-gray-50 text-gray-800 shadow-2xs hover:bg-gray-50 hover:cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
      >
        <div className="flex flex-wrap gap-1 max-w-full truncate">
          {value.length > 0 ? (
            value.map((name) => (
              <span
                key={name}
                className="bg-teal-600 text-white text-xs 3xl:text-sm px-2 py-0.5 rounded-md"
              >
                {name}
              </span>
            ))
          ) : (
            <span className="text-gray-600">-- Select staff --</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

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
            <div className="px-3 pt-3 sticky top-0 bg-white z-10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff..."
                className="w-full px-2 py-1.5 text-xs 3xl:text-sm border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div className="p-1 py-2">
              {filteredOptions.length === 0 ? (
                <div className="text-xs 3xl:text-sm text-gray-500 px-4 py-2">No staff found</div>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option.aid}
                    className="flex items-center gap-2 px-4 py-2 text-xs 3xl:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.name)}
                      onChange={() => handleToggle(option.name)}
                    />
                    {option.name}
                  </label>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
