import type { SolarResult, SystemType } from "./solarCalc";

/** Hesablayıcıya serverdən ötürülən yüngül məhsul məlumatı */
export type CatalogueItem = {
  title: string;
  slug: string;
  section: string;
  description?: string;
};

export type CatalogueMatch = {
  kind: "panel" | "inverter" | "battery";
  item: CatalogueItem;
  /** Lazım olan say */
  quantity: number;
};

/** Rack batareyanın təsvirinə görə paralel qoşula bilən ən çox modul sayı */
const MAX_PARALLEL_MODULES = 16;
/** Bundan böyük tutum (konteyner, mobil stansiya) avtomatik təklif olunmur, layihə ilə seçilir */
const MAX_AUTO_BATTERY_KWH = 100;
/** Kataloqdakı batareya modulları 51,2 V-dur, ona görə yalnız 48 V invertorla uyğun gəlir */
const is48Volt = (item: CatalogueItem) => /\b48\s*V\b/i.test(item.description ?? "");

const valueOf = (title: string, unit: "W" | "kW" | "kWh"): number => {
  const match = title.match(new RegExp(`([\\d.]+)\\s*${unit}\\b`, "i"));
  return match ? Number(match[1]) : 0;
};

const smallestAtLeast = (items: CatalogueItem[], unit: "kW" | "kWh", need: number) =>
  items
    .filter((item) => valueOf(item.title, unit) >= need)
    .sort((a, b) => valueOf(a.title, unit) - valueOf(b.title, unit))[0];

/**
 * Hesablama nəticəsinə kataloqdan ən yaxın məhsulları tapır. İlkin istiqamətdir:
 * gərginlik və cərəyan uyğunluğu layihədə ayrıca yoxlanır.
 * Kataloqda yalnız hibrid invertorlar olduğu üçün digər sistem növlərində invertor seçilmir.
 */
export const matchCatalogue = (
  catalogue: CatalogueItem[],
  result: SolarResult,
  systemType: SystemType,
  panelWatt: number
): CatalogueMatch[] => {
  const inSection = (section: string) => catalogue.filter((item) => item.section === section);
  const matches: CatalogueMatch[] = [];

  const panel = inSection("solar-energy")
    .filter((item) => valueOf(item.title, "W") > 0)
    .sort(
      (a, b) =>
        Math.abs(valueOf(a.title, "W") - panelWatt) - Math.abs(valueOf(b.title, "W") - panelWatt)
    )[0];
  if (panel) {
    const watt = valueOf(panel.title, "W");
    matches.push({
      kind: "panel",
      item: panel,
      quantity: Math.ceil((result.pvKw * 1000) / watt),
    });
  }

  if (systemType === "hybrid") {
    const inverter = smallestAtLeast(inSection("inverters").filter(is48Volt), "kW", result.inverterKw);
    if (inverter) matches.push({ kind: "inverter", item: inverter, quantity: 1 });
  }

  if (systemType !== "on-grid" && result.batteryKwh > 0) {
    const storage = inSection("energy-storage");
    const smallest = storage
      .filter((item) => valueOf(item.title, "kWh") > 0)
      .sort((a, b) => valueOf(a.title, "kWh") - valueOf(b.title, "kWh"))[0];
    const moduleKwh = smallest ? valueOf(smallest.title, "kWh") : 0;
    const modules = moduleKwh ? Math.ceil(result.batteryKwh / moduleKwh) : 0;

    if (smallest && modules <= MAX_PARALLEL_MODULES) {
      matches.push({ kind: "battery", item: smallest, quantity: modules });
    } else if (result.batteryKwh <= MAX_AUTO_BATTERY_KWH) {
      const large = smallestAtLeast(storage, "kWh", result.batteryKwh);
      if (large) matches.push({ kind: "battery", item: large, quantity: 1 });
    }
  }

  return matches;
};
