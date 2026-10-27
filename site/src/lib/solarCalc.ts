/**
 * Günəş sisteminin ilkin ölçülməsi. Layihə deyil — mühəndis baxışından
 * əvvəl istiqamət vermək üçün sadə, açıq hesablamadır.
 */

export type SystemType = "on-grid" | "hybrid" | "off-grid";
export type CustomerType = "home" | "business" | "industry";

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
  /** Ev, biznes və ya sənaye/kənd təsərrüfatı — tarif fərqlidir */
  customerType: CustomerType;
  /** Günəşin örtəcəyi istehlak payı, % (10–100); kiçik və ucuz sistem üçün azaldılır */
  coverage: number;
};

export type SolarResult = {
  dailyKwh: number;
  pvKw: number;
  panelCount: number;
  inverterKw: number;
  batteryKwh: number;
  annualKwh: number;
  roofArea: number;
  /** Elektrik qəbzi üzrə qənaət, AZN; avtonom sistemdə null */
  savings: {
    monthlyBillNow: number;
    monthlyBillWithSolar: number;
    annualSaving: number;
  } | null;
};

/** İtkilər (temperatur, kabel, invertor, çirklənmə) — tipik planlama dəyəri */
export const PERFORMANCE_RATIO = 0.8;
/** LiFePO4 batareyanın tövsiyə olunan boşalma dərinliyi */
export const DEPTH_OF_DISCHARGE = 0.9;
/** 1 kVt panel üçün təxmini dam sahəsi, m² (≈ 550 W panel 2,6 m²) */
export const AREA_PER_KW = 4.8;

/**
 * Əhali üçün pilləli tarif (Azərişıq), AZN/kVt·saat — aylıq istehlaka görə.
 * Tariflər dəyişəndə yalnız bu cədvəl yenilənir.
 */
export const HOUSEHOLD_TARIFF = [
  { upTo: 200, price: 0.084 },
  { upTo: 300, price: 0.1 },
  { upTo: Infinity, price: 0.15 },
];

/**
 * Qeyri-əhali tarifləri (ƏDV daxil), AZN/kVt·saat — sabit, pilləsiz.
 * "business" = digər qeyri-əhali istehlakçıları (elektromobil doldurma
 * stansiyaları da eyni tarifdədir).
 */
export const NON_HOUSEHOLD_TARIFF: Record<Exclude<CustomerType, "home">, number> = {
  business: 0.125,
  industry: 0.106,
};

/** Aylıq elektrik qəbzi, AZN */
export function monthlyBill(kwh: number, customerType: CustomerType): number {
  if (customerType !== "home") return kwh * NON_HOUSEHOLD_TARIFF[customerType];
  let bill = 0;
  let from = 0;
  for (const tier of HOUSEHOLD_TARIFF) {
    if (kwh <= from) break;
    bill += (Math.min(kwh, tier.upTo) - from) * tier.price;
    from = tier.upTo;
  }
  return bill;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const INVERTER_SIZES = [3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100];

const round1 = (n: number) => Math.round(n * 10) / 10;

export const DEFAULT_INPUT: SolarInput = {
  monthlyKwh: 400,
  systemType: "hybrid",
  sunHours: 4,
  panelWatt: 550,
  backupHours: 6,
  autonomyDays: 1,
  customerType: "home",
  coverage: 100,
};

export function calculateSolar(input: SolarInput): SolarResult | null {
  const { monthlyKwh, sunHours, panelWatt, systemType } = input;
  if (!(monthlyKwh > 0 && sunHours > 0 && panelWatt > 0)) return null;

  const dailyKwh = monthlyKwh / 30;
  // Avtonom sistem bütün istehlakı örtməlidir; boş dəyər 100% sayılır
  const coverage =
    systemType === "off-grid" ? 1 : Math.min(100, Math.max(10, input.coverage || 100)) / 100;
  const pvKwExact = (dailyKwh * coverage) / (sunHours * PERFORMANCE_RATIO);
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

  const annualKwh = Math.round(pvKw * sunHours * PERFORMANCE_RATIO * 365);

  // Qənaət: günəş istehlakın bir hissəsini örtür, qəbz qalan hissəyə görə gəlir.
  // Pilləli tarifdə günəş əvvəlcə ən baha pilləni əvəz edir. Şəbəkəyə verilən
  // artıq enerji nəzərə alınmır; aylar bərabər sayılır (mövsümilik yoxdur).
  let savings: SolarResult["savings"] = null;
  if (systemType !== "off-grid") {
    const now = monthlyBill(monthlyKwh, input.customerType);
    const withSolar = monthlyBill(Math.max(0, monthlyKwh - annualKwh / 12), input.customerType);
    savings = {
      monthlyBillNow: round2(now),
      monthlyBillWithSolar: round2(withSolar),
      annualSaving: Math.round((now - withSolar) * 12),
    };
  }

  return {
    dailyKwh: round1(dailyKwh),
    pvKw: round1(pvKw),
    panelCount,
    inverterKw,
    batteryKwh: round1(batteryKwh),
    annualKwh,
    roofArea: Math.ceil(pvKw * AREA_PER_KW),
    savings,
  };
}
