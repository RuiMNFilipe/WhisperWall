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
