/**
 * Enerji həlləri bölmələri.
 *
 * Hər bölmə API-də məhsulun `section` sahəsinə uyğundur (məs. "solar-energy").
 * Sadəlik üçün `section`, URL yolu və ProductEnum dəyəri eynidir —
 * yeni bölmə əlavə etmək üçün bura bir sətir, `locales/*.json`-a
 * `sections.<key>` mətnləri və `app/[locale]/<key>/` route-u əlavə olunur.
 */
export const ENERGY_SECTIONS = [
  "solar-energy",
  "wind-energy",
  "energy-storage",
  "laser-equipment",
] as const;

export type EnergySection = (typeof ENERGY_SECTIONS)[number];

export const isEnergySection = (value: string): value is EnergySection =>
  (ENERGY_SECTIONS as readonly string[]).includes(value);
