/**
 * Ortaq siyahı/detal səhifələri ilə işləyən bölmələr
 * (enerji həlləri + ayrıca baş bölmə olan lazer avadanlıqları).
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
  "inverters",
  "laser-equipment",
] as const;

export type EnergySection = (typeof ENERGY_SECTIONS)[number];

export const isEnergySection = (value: string): value is EnergySection =>
  (ENERGY_SECTIONS as readonly string[]).includes(value);

/** "Enerji Həlləri" qrupuna daxil olan bölmələr (lazer ayrıca baş bölmədir) */
export const ENERGY_SOLUTIONS = ENERGY_SECTIONS.filter(
  (section): section is Exclude<EnergySection, "laser-equipment"> =>
    section !== "laser-equipment"
);

/**
 * API-dəki məhsul `section` dəyərini saytdakı məhsul tipinə çevirir
 * (ProductItem linki bu tipə görə qurulur). Axtarış nəticələrində istifadə olunur.
 */
export const productTypeForSection = (section: string): string => {
  if (isEnergySection(section)) return section;
  if (section === "vehicles") return "car";
  if (section === "accessories") return "connector-accessory";
  return "charging-station";
};
