import { randomUUID } from "crypto";

/**
 * Converts a string to a URL-friendly slug by removing spaces and special characters.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a random numeric ID of the specified length.
 *
 * @param {number} length - The length of the generated ID.
 * @returns {string} A randomly generated numeric string.
 *
 * @example
 * console.log(generateId(6)); // e.g., "839214"
 */
export const generateId = (length: number): string => {
  const numbers = "0123456789";
  return Array.from({ length }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  ).join("");
};

/**
 * Generates a random alphanumeric ID of the specified length.
 *
 * @param {number} length - The length of the generated ID.
 * @returns {string} A randomly generated alphanumeric string.
 *
 * @example
 * console.log(generateRandomID(8)); // e.g., "A9XbT7P3"
 */
export const generateRandomID = (length: number): string => {
  const char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () =>
    char.charAt(Math.floor(Math.random() * char.length))
  ).join("");
};

export const generateUUID = () => randomUUID();
