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
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${fullDate} ${hours}:${minutes}`;
};
