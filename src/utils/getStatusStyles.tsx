type Status = "Delivered" | "For Delivery" | "Pending" | "Default";

const STATUS_STYLES: Record<Status, { row: string; badge: string }> = {
  Delivered: {
    row: "bg-teal-100/30 hover:bg-teal-100/60",
    badge: "bg-teal-100 text-teal-800",
  },
  "For Delivery": {
    row: "bg-blue-100/30 hover:bg-blue-100/70",
    badge: "bg-blue-100 text-blue-800",
  },
  Pending: {
    row: "bg-red-100/30 hover:bg-red-100/60",
    badge: "bg-red-100 text-red-800",
  },
  Default: {
    row: "bg-gray-100/30 hover:bg-gray-100/60",
    badge: "bg-gray-100 text-gray-800",
  },
};

export function getStatusStyles(status: string) {
  return STATUS_STYLES[status as Status] || STATUS_STYLES.Default;
}