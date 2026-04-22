/**
 * Common array utility functions for state management
 */

/**
 * Add an item to an array (immutably)
 */
export function addItem<T>(array: T[], item: T): T[] {
  return [...array, item];
}

/**
 * Remove an item by ID (immutably)
 */
export function removeItemById<T extends { id: string | number }>(
  array: T[],
  id: string | number
): T[] {
  return array.filter(item => item.id !== id);
}

/**
 * Update an item by ID (immutably)
 */
export function updateItemById<T extends { id: string | number }>(
  array: T[],
  id: string | number,
  updates: Partial<T>
): T[] {
  return array.map(item =>
    item.id === id ? { ...item, ...updates } : item
  );
}

/**
 * Toggle an item in an array (add if not present, remove if present)
 */
export function toggleItem<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index === -1) {
    return [...array, item];
  }
  return array.filter((_, i) => i !== index);
}

/**
 * Toggle an item by a predicate function
 */
export function toggleItemBy<T>(
  array: T[],
  item: T,
  predicate: (a: T, b: T) => boolean
): T[] {
  const index = array.findIndex(i => predicate(i, item));
  if (index === -1) {
    return [...array, item];
  }
  return array.filter((_, i) => i !== index);
}

/**
 * Generate a unique ID based on timestamp
 */
export function generateId(): string {
  return Date.now().toString();
}

/**
 * Generate a unique ID with prefix
 */
export function generatePrefixedId(prefix: string): string {
  return `${prefix}_${Date.now()}`;
}

/**
 * Paginate an array
 */
export function paginate<T>(
  array: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}

/**
 * Get total pages for pagination
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Find item by ID
 */
export function findById<T extends { id: string | number }>(
  array: T[],
  id: string | number
): T | undefined {
  return array.find(item => item.id === id);
}

/**
 * Check if array contains item by ID
 */
export function containsById<T extends { id: string | number }>(
  array: T[],
  id: string | number
): boolean {
  return array.some(item => item.id === id);
}

/**
 * Move item in array from one index to another
 */
export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Remove duplicates from array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}
