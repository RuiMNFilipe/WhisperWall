import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimContentSize(content: string, maxChars: number) {
  return content.length > maxChars
    ? `${content.slice(0, maxChars)}...`
    : content;
}

export const setLocaleDateAndTime = (date: Date) => {
  const fullDate = date.toLocaleDateString("pt-PT");

  // Using padStart to add a leading 0 if hours or minutes are single-digit
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${fullDate} ${hours}:${minutes}`;
};

export const convertMilliseconds = (ms: number) => {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};
