import { Timestamp } from "firebase/firestore";

export const formatTimestampToFullDate = (timestamp: Timestamp | Date | null): string => {
  if (!timestamp) return "";

  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatTimestampToFullDateTime = (timestamp: Timestamp | Date | null): string => {
  if (!timestamp) return "";

  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  let formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    ...(dateYear !== currentYear && { year: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
  }).format(date);

  return formattedDate.replace("am", "AM").replace("pm", "PM");
};

