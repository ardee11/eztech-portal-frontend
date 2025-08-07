import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  visible: boolean;
  x: number;
  y: number;
  itemId: string | null;
  itemStatus: string;
  itemDelivered: boolean | null;
  onClose: () => void;
  onOpenModal: (itemId: string | null) => void;
  onOpenMarkDeliveredModal: (itemId: string | null) => void;
  onOpenDeleteModal: (itemId: string | null) => void;
};

export default function InventoryContextMenu({
  visible,
  x,
  y,
  itemId,
  itemStatus,
  itemDelivered,
  onClose,
  onOpenModal,
  onOpenMarkDeliveredModal,
  onOpenDeleteModal,
}: Props) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [visible, onClose]);

  if (!visible || !itemId) return null;

  const safeTop = Math.min(y, window.innerHeight - 100);
  const safeLeft = Math.min(x, window.innerWidth - 160);

  return (
    <ul
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-300 shadow-md rounded-sm text-xs min-w-30"
      style={{ top: safeTop, left: safeLeft }}
    >
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          navigate(`/inventory/${itemId}`);
          onClose();
        }}
      >
        View Details
      </li>

      {!itemDelivered && itemStatus === "Pending" && (
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            onOpenModal(itemId);
          }}
        >
          Set Delivery Date
        </li>
      )}

      {!itemDelivered && itemStatus === "For Delivery" && (
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            onOpenMarkDeliveredModal(itemId);
          }}
        >
          Mark as Delivered
        </li>
      )}

      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 hover:text-red-700"
        onClick={() => {
          onOpenDeleteModal(itemId);
          onClose();
        }}
      >
        Delete Item
      </li>
    </ul>
  );
}
