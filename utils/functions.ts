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

export function removeFromArr<T>(arr: T[], key: keyof T, equal: any) {
  let hasUpdate = false;
  const res = arr.filter((item) => {
    if (item[key] === equal) {
      hasUpdate = true;
      return item[key] !== equal;
    }

    return item;
  });

  return { res, hasUpdate };
}

/**
 * Removes duplicate objects from an array based on a nested key path.
 *
 * @template T - The type of the objects in the array.
 * @param {T[]} arr - The array of objects to filter.
 * @param {string} path - The path to the key (supports nested keys with dot notation, e.g., "address.street").
 * @returns {T[]} A new array containing only unique objects based on the specified key path.
 *
 * @example
 * const arr = [
 *   { name: "John", address: { street: "st1" } },
 *   { name: "Jane", address: { street: "st2" } },
 *   { name: "Doe", address: { street: "st1" } }
 * ];
 *
 * removeDuplicatesByPath(arr, "address.street");
 * // => [{ name: "John", address: { street: "st1" } }, { name: "Jane", address: { street: "st2" } }]
 */
export const removeDuplicatesByPath = <T>(arr: T[], path: string): T[] => {
  const uniqueMap = new Map<string | number, T>();

  const getValueByPath = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  for (const item of arr) {
    const keyValue = getValueByPath(item, path);
    if (keyValue !== undefined && !uniqueMap.has(keyValue)) {
      uniqueMap.set(keyValue, item);
    }
  }

  return Array.from(uniqueMap.values());
};
