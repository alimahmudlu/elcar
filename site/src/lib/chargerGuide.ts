import type { ProductType } from "@/types";

export type GuideUsage = "fixed" | "portable";
export type GuideCar = "hybrid" | "electric";
export type GuideConnector = "type2" | "gbt" | "type1" | "unknown";
export type GuidePhase = "one" | "three" | "unknown";

export type GuideAnswers = {
  usage?: GuideUsage;
  car?: GuideCar;
  connector?: GuideConnector;
  phase?: GuidePhase;
};

export type GuideReason =
  | "portable"
  | "hybrid"
  | "type1"
  | "ev-three"
  | "ev-one"
  | "ev-unknown";

export type GuideResult = { reason: GuideReason; products: ProductType[] };

const MAX_RESULTS = 3;

/** Bağlayıcı növü bazadakı xarakteristikadan oxunur, məhsul adından təxmin edilmir */
export const connectorOf = (product: ProductType): GuideConnector => {
  const values = (product.characteristicGroups ?? []).flatMap((group) =>
    (group.characteristics ?? []).flatMap((item) => item.value ?? [])
  );
  const text = values.filter((value) => typeof value === "string").join(" ");
  if (/GBT|GB\/T/i.test(text)) return "gbt";
  if (/Type\s?1\b/i.test(text)) return "type1";
  if (/Type\s?2\b/i.test(text)) return "type2";
  return "unknown";
};

export const powerOf = (product: ProductType): number =>
  Number(product.title?.match(/([\d.]+)\s*kW\b/i)?.[1] ?? 0);

/** Portativ seriyalar: EVA03 və EVA07 */
export const isPortable = (product: ProductType): boolean =>
  /\bEVA0\d/i.test(product.title ?? "");

const priceOf = (product: ProductType) =>
  product.discountedPrice ?? product.price ?? Number.MAX_SAFE_INTEGER;

/** 4-cü sual yalnız tam elektrik avtomobil + sabit stansiya + Type 1 olmayanda lazımdır */
export const needsPhase = ({ usage, car, connector }: GuideAnswers): boolean =>
  usage === "fixed" && car === "electric" && !!connector && connector !== "type1";

export const isComplete = (answers: GuideAnswers): boolean =>
  !!answers.usage &&
  !!answers.car &&
  !!answers.connector &&
  (!needsPhase(answers) || !!answers.phase);

const fixedPlan = (answers: GuideAnswers): { reason: GuideReason; power: number } => {
  if (answers.car === "hybrid") return { reason: "hybrid", power: 7 };
  if (answers.connector === "type1") return { reason: "type1", power: 7 };
  if (answers.phase === "three") return { reason: "ev-three", power: 22 };
  return { reason: answers.phase === "one" ? "ev-one" : "ev-unknown", power: 7 };
};

export const recommend = (
  products: ProductType[],
  answers: GuideAnswers
): GuideResult | null => {
  if (!isComplete(answers)) return null;

  const matchesConnector = (product: ProductType) =>
    answers.connector === "unknown" || connectorOf(product) === answers.connector;
  const byPrice = (a: ProductType, b: ProductType) => priceOf(a) - priceOf(b);

  if (answers.usage === "portable") {
    return {
      reason: "portable",
      products: products
        .filter((product) => isPortable(product) && matchesConnector(product))
        .sort((a, b) => powerOf(a) - powerOf(b) || byPrice(a, b))
        .slice(0, MAX_RESULTS),
    };
  }

  const { reason, power } = fixedPlan(answers);
  return {
    reason,
    products: products
      .filter(
        (product) =>
          !isPortable(product) && powerOf(product) === power && matchesConnector(product)
      )
      .sort(byPrice)
      .slice(0, MAX_RESULTS),
  };
};
