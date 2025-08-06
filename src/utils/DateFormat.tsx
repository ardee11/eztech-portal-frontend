import { Timestamp } from "firebase/firestore";

export const formatTimestampToFullDate = (timestamp: Timestamp | Date | null): string => {
  if (!timestamp) return "";
  
  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else {
    console.warn("Invalid date passed to formatTimestampToFullDateTime:", timestamp);
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatTimestampToFullDateTime = (timestamp: Timestamp | Date | string | null): string => {
  if (!timestamp) return "";

  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else {
    console.warn("Invalid date passed to formatTimestampToFullDateTime:", timestamp);
    return "";
  }

  if (isNaN(date.getTime())) {
    console.warn("Invalid date passed to formatTimestampToFullDateTime:", timestamp);
    return "";
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  }).format(date);

  return `${datePart} ${timePart.toUpperCase()}`;
};




