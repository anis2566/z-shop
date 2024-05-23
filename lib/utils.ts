import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateInvoiceId() {
    const prefix = 'INV';
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    return `${prefix}-${randomNumber}`;
}