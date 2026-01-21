import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind sınıflarını güvenli bir şekilde birleştirir.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
