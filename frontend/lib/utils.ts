import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function humanifyEntryDate(isoDateStr) {
  const dt = new Date(isoDateStr);
  const now = new Date();
  let dateStr = "";

  // Compare only the date part
  if (
    dt.getFullYear() === now.getFullYear() &&
    dt.getMonth() === now.getMonth() &&
    dt.getDate() === now.getDate()
  ) {
    dateStr = "Today";
  } else {
    // Check for yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      dt.getFullYear() === yesterday.getFullYear() &&
      dt.getMonth() === yesterday.getMonth() &&
      dt.getDate() === yesterday.getDate()
    ) {
      dateStr = "Yesterday";
    } else {
      dateStr = dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }
  }

  // Format time as h:mm AM/PM
  const timeStr = dt.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr}, ${timeStr}`;
}