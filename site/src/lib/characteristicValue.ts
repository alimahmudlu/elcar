/**
 * Xüsusiyyət dəyərini mətnə çevirir: çoxseçimli siyahılar vergüllə,
 * checkbox dəyərləri "Bəli/Xeyr" kimi. Boş dəyər üçün null qaytarır.
 */
export const formatCharacteristicValue = (
  value: unknown,
  labels: { yes: string; no: string }
): string | null => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || null;
  if (value === true || value === "true") return labels.yes;
  if (value === false || value === "false") return labels.no;
  if (value === null || value === undefined || value === "") return null;
  return String(value);
};
