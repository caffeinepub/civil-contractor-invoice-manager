/**
 * Format a number as Indian Rupee currency
 * e.g. 123456.78 → ₹1,23,456.78
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a bigint timestamp (nanoseconds from IC) as DD MMM YYYY
 */
export function formatDate(timestamp: bigint): string {
  // IC timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a bigint timestamp as relative time or date
 */
export function formatDateShort(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
