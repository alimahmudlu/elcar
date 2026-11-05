"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProductEnum } from "@/constants/enums";
import type { ProductType } from "@/types";
import {
  needsPhase,
  recommend,
  type GuideAnswers,
} from "@/lib/chargerGuide";
import ProductItem from "../common/ProductItem";
import QuoteRequestForm from "../quote/QuoteRequestForm";

type QuestionKey = keyof GuideAnswers;

const OPTIONS: Record<QuestionKey, string[]> = {
  usage: ["fixed", "portable"],
  car: ["hybrid", "electric"],
  connector: ["type2", "gbt", "type1", "unknown"],
  phase: ["one", "three", "unknown"],
};

/** Bir neçə sualla kataloqdan uyğun şarj cihazını göstərir */
const ChargerGuide = ({ products }: { products: ProductType[] }) => {
  const t = useTranslations("guide");
  const [answers, setAnswers] = useState<GuideAnswers>({});

  const questions: QuestionKey[] = ["usage", "car", "connector"];
  if (needsPhase(answers)) questions.push("phase");

  const select = (key: QuestionKey, value: string) =>
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      // faza yalnız müəyyən cavablarda soruşulur; lazım olmayanda köhnə cavab qalmasın
      if (!needsPhase(next)) delete next.phase;
      return next;
    });

  const result = recommend(products, answers);

  const summary = result
    ? [
        ...questions.map(
          (key) => `${t(`questions.${key}`)}: ${t(`options.${key}.${answers[key]}`)}`
        ),
        ...result.products.map((product) => product.title),
      ].join("\n")
    : undefined;

  return (
    <div className="mt-8">
      <div className="space-y-6 max-w-3xl">
        {questions.map((key, index) => (
          <fieldset key={key}>
            <legend className="font-black text-title dark:text-primary-foreground">
              {index + 1}. {t(`questions.${key}`)}
            </legend>
            <p className="mt-1 text-xs text-[#00000099] dark:text-secondary-foreground">
              {t(`hints.${key}`)}
            </p>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {OPTIONS[key].map((value) => (
                <label
                  key={value}
                  className={`cursor-pointer border rounded-md p-3 text-sm font-bold transition-colors ${
                    answers[key] === value
                      ? "border-elcar bg-elcar-opacity text-elcar dark:bg-popover dark:text-primary-foreground"
                      : "dark:border-secondary-foreground dark:text-primary-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name={key}
                    value={value}
                    checked={answers[key] === value}
                    onChange={() => select(key, value)}
                    className="sr-only"
                  />
                  {t(`options.${key}.${value}`)}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div aria-live="polite">
        {result && (
          <section className="mt-10">
            <h2 className="text-2xl font-black text-title dark:text-primary-foreground">
              {t("result-title")}
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-subtitle dark:text-secondary-foreground">
              {t(`reasons.${result.reason}`)}
            </p>
            {answers.connector === "unknown" && (
              <p className="mt-2 max-w-3xl text-sm font-bold text-elcar dark:text-primary-foreground">
                {t("unknown-connector")}
              </p>
            )}

            {result.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {result.products.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    type={ProductEnum.ChargingStation}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm font-bold dark:text-primary-foreground">{t("no-match")}</p>
            )}

            {answers.usage === "fixed" && (
              <p className="mt-4 max-w-3xl text-xs text-[#00000099] dark:text-secondary-foreground">
                {t("install-note")}
              </p>
            )}

            <div className="mt-10">
              <QuoteRequestForm summary={summary} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ChargerGuide;
