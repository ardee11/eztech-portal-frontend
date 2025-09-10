// SerialNumberContextMenu.tsx

import { useEffect, useRef } from "react";
import { SerialNumber } from "../../hooks/useInventory";

interface SerialNumberContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  serial: SerialNumber | null;
  onClose: () => void;
  onEdit: (serial: SerialNumber | null) => void;
  onDelete: (serialId: string | null) => void;
}

export default function SerialNumberContextMenu({
  visible,
  x,
  y,
  serial, 
  onClose,
  onEdit,
  onDelete,
}: SerialNumberContextMenuProps) {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [visible, onClose]);

  if (!visible || !serial) return null;

  const safeTop = Math.min(y, window.innerHeight - 80);
  const safeLeft = Math.max(x - 158, 0);

  return (
    <ul
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-300 shadow-md rounded text-xs 3xl:text-sm min-w-34 3xl:min-w-40"
      style={{ top: safeTop, left: safeLeft }}
    >
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          onEdit(serial);
          onClose();
        }}
      >
        Edit
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 hover:text-red-700"
        onClick={() => {
          onDelete(serial.id); 
          onClose();
        }}
      >
        Delete
      </li>
    </ul>
  );
}