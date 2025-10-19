// Shared utilities for status normalization and color mapping
export const barColors = {
  accepted: "#198754",
  pending: "#ffc107",
  rejected: "#dc3545",
  unknown: "#6c757d",
};

/**
 * Normalize various status strings to a canonical set.
 * @param {string} status
 * @returns {'accepted'|'pending'|'rejected'|'unknown'}
 */
export function normalizeStatus(status) {
  if (!status) return "unknown";
  const s = String(status).trim().toLowerCase();
  if (s.includes("accept")) return "accepted";
  if (s.includes("pending") || s.includes("wait")) return "pending";
  if (s.includes("reject") || s.includes("denied")) return "rejected";
  return "unknown";
}

export function getColor(status) {
  return barColors[normalizeStatus(status)] || barColors.unknown;
}
