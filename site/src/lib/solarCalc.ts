/**
 * Günəş sisteminin ilkin ölçülməsi. Layihə deyil — mühəndis baxışından
 * əvvəl istiqamət vermək üçün sadə, açıq hesablamadır.
 */

export type SystemType = "on-grid" | "hybrid" | "off-grid";

export type SolarInput = {
  /** Aylıq istehlak, kVt·saat (elektrik qəbzində göstərilir) */
  monthlyKwh: number;
  systemType: SystemType;
  /** Gündəlik ekvivalent tam günəş saatları; Azərbaycanda illik orta ≈ 4 */
  sunHours: number;
  /** Panelin gücü, W */
  panelWatt: number;
  /** Hibrid sistemdə işıq kəsiləndə neçə saat ehtiyat lazımdır */
  backupHours: number;
  /** Avtonom sistemdə günəşsiz neçə gün dayanmalıdır */
  autonomyDays: number;
};

export type SolarResult = {
  dailyKwh: number;
  pvKw: number;
  panelCount: number;
  inverterKw: number;
  batteryKwh: number;
  annualKwh: number;
  roofArea: number;
};

/** İtkilər (temperatur, kabel, invertor, çirklənmə) — tipik planlama dəyəri */
export const PERFORMANCE_RATIO = 0.8;
/** LiFePO4 batareyanın tövsiyə olunan boşalma dərinliyi */
export const DEPTH_OF_DISCHARGE = 0.9;
/** 1 kVt panel üçün təxmini dam sahəsi, m² (≈ 550 W panel 2,6 m²) */
export const AREA_PER_KW = 4.8;

const INVERTER_SIZES = [3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100];

const round1 = (n: number) => Math.round(n * 10) / 10;

export const DEFAULT_INPUT: SolarInput = {
  monthlyKwh: 400,
  systemType: "hybrid",
  sunHours: 4,
  panelWatt: 550,
  backupHours: 6,
  autonomyDays: 1,
};

export function calculateSolar(input: SolarInput): SolarResult | null {
  const { monthlyKwh, sunHours, panelWatt, systemType } = input;
  if (!(monthlyKwh > 0 && sunHours > 0 && panelWatt > 0)) return null;

  const dailyKwh = monthlyKwh / 30;
  const pvKwExact = dailyKwh / (sunHours * PERFORMANCE_RATIO);
  const panelCount = Math.ceil((pvKwExact * 1000) / panelWatt);
  const pvKw = (panelCount * panelWatt) / 1000;

  // İnvertor panel gücündən kiçik olmamalıdır; ən yaxın standart ölçü
  const inverterKw =
    INVERTER_SIZES.find((size) => size >= pvKw * 0.9) ??
    Math.ceil(pvKw / 10) * 10;

  let batteryKwh = 0;
  // Boş (NaN) sahələr üçün ehtiyat dəyərlər
  if (systemType === "hybrid") {
    batteryKwh = ((dailyKwh / 24) * Math.max(0, input.backupHours || 0)) / DEPTH_OF_DISCHARGE;
  } else if (systemType === "off-grid") {
    batteryKwh = (dailyKwh * Math.max(1, input.autonomyDays || 1)) / DEPTH_OF_DISCHARGE;
  }

  return {
    dailyKwh: round1(dailyKwh),
    pvKw: round1(pvKw),
    panelCount,
    inverterKw,
    batteryKwh: round1(batteryKwh),
    annualKwh: Math.round(pvKw * sunHours * PERFORMANCE_RATIO * 365),
    roofArea: Math.ceil(pvKw * AREA_PER_KW),
  };
}
