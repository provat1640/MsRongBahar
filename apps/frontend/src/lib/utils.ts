import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function calculatePaintCoverage(lengthFt: number, widthFt: number, heightFt: number, coats: number = 2) {
  const wallArea = 2 * (lengthFt + widthFt) * heightFt;
  const ceilingArea = lengthFt * widthFt;
  const totalAreaSqFt = wallArea + ceilingArea;
  
  // Standard emulsion coverage: approx 120 sq ft per litre per coat
  const litresNeeded = (totalAreaSqFt * coats) / 120;
  return {
    totalAreaSqFt: Math.round(totalAreaSqFt),
    litresNeeded: parseFloat(litresNeeded.toFixed(2)),
    estimatedGallons: parseFloat((litresNeeded / 3.64).toFixed(2)),
  };
}
