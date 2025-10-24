/**
 * Converts a label to a valid field ID
 * Example: "Email Address" -> "email_address"
 */
export function labelToFieldId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
}

/**
 * Generates a unique field ID based on label
 * Adds a 2-digit random number if duplicate might exist
 */
export function generateFieldId(
  label: string,
  existingIds: string[] = [],
): string {
  const baseId = labelToFieldId(label) || "field";

  // If no duplicates, return base ID
  if (!existingIds.includes(baseId)) {
    return baseId;
  }

  // Add 2-digit random number for uniqueness
  const randomSuffix = Math.floor(Math.random() * 90 + 10); // 10-99
  const uniqueId = `${baseId}_${randomSuffix}`;

  // If still duplicate (very rare), recursively try again
  if (existingIds.includes(uniqueId)) {
    return generateFieldId(label, existingIds);
  }

  return uniqueId;
}
