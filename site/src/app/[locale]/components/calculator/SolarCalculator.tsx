"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateSolar,
  DEFAULT_INPUT,
  type CustomerType,
  type SolarInput,
  type SystemType,
} from "@/lib/solarCalc";
import QuoteRequestForm from "../quote/QuoteRequestForm";

const TYPES: SystemType[] = ["on-grid", "hybrid", "off-grid"];
const CUSTOMERS: CustomerType[] = ["home", "business"];

const azn = (n: number) => `${n.toFixed(2).replace(/\.00$/, "")} AZN`;

const inputClass =
  "w-full border rounded-md px-3 py-2 text-sm bg-transparent dark:border-secondary-foreground dark:text-primary-foreground";

const NumberField = ({
  label,
  hint,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  hint?: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) => (
  <label className="block">
    <span className="block text-sm font-bold mb-1 dark:text-primary-foreground">{label}</span>
    <span className="flex items-center gap-2">
      <input
        type="number"
        inputMode="decimal"
        className={inputClass}
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) =>
          // boş sahə NaN kimi saxlanılır ki, yazarkən dərhal 0-a çevrilməsin
          onChange(e.target.value === "" ? NaN : Math.min(max, Math.max(0, Number(e.target.value))))
        }
      />
      <span className="text-sm text-[#00000099] shrink-0 dark:text-secondary-foreground">{unit}</span>
    </span>
    {hint && (
      <span className="block mt-1 text-xs text-[#00000099] dark:text-secondary-foreground">{hint}</span>
    )}
  </label>
);

/** Günəş sisteminin ilkin ölçülməsi + nəticə ilə təklif sorğusu */
const SolarCalculator = () => {
  const t = useTranslations("calculator");
  const [input, setInput] = useState<SolarInput>(DEFAULT_INPUT);
  const set = <K extends keyof SolarInput>(key: K, value: SolarInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => calculateSolar(input), [input]);

  const rows = result
    ? [
        { label: t("daily"), value: `${result.dailyKwh} kWh` },
        { label: t("pv"), value: `${result.pvKw} kW`, strong: true },
        { label: t("panels"), value: `${t("pcs", { n: result.panelCount })} × ${input.panelWatt} W`, strong: true },
        { label: t("inverter"), value: `${result.inverterKw} kW`, strong: true },
        ...(input.systemType !== "on-grid"
          ? [{ label: t("battery"), value: `${result.batteryKwh} kWh`, strong: true }]
          : []),
        { label: t("annual"), value: `≈ ${result.annualKwh.toLocaleString("en-US").replace(/,/g, " ")} kWh` },
        { label: t("roof"), value: `≈ ${result.roofArea} m²` },
        ...(result.savings
          ? [
              { label: t("bill-now"), value: azn(result.savings.monthlyBillNow) },
              { label: t("bill-solar"), value: azn(result.savings.monthlyBillWithSolar) },
              { label: t("saving-year"), value: `≈ ${result.savings.annualSaving} AZN`, strong: true },
            ]
          : []),
      ]
    : [];

  // Sorğu ilə birlikdə göndərilən mətn
  const summary = result
    ? [
        `${t("monthly")}: ${input.monthlyKwh} kWh`,
        `${t("type")}: ${t(`types.${input.systemType}`)}`,
        `${t("customer")}: ${t(`customers.${input.customerType}`)}`,
        input.systemType === "hybrid" && `${t("backup")}: ${input.backupHours} ${t("backup-unit")}`,
        input.systemType === "off-grid" && `${t("autonomy")}: ${input.autonomyDays} ${t("autonomy-unit")}`,
        ...rows.map((row) => `${row.label}: ${row.value}`),
      ]
        .filter(Boolean)
        .join("\n")
    : undefined;

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-8">
      <div className="space-y-5">
        <NumberField
          label={t("monthly")}
          hint={t("monthly-hint")}
          unit="kWh"
          value={input.monthlyKwh}
          min={10}
          max={100000}
          step={10}
          onChange={(v) => set("monthlyKwh", v)}
        />

        <fieldset>
          <legend className="text-sm font-bold mb-2 dark:text-primary-foreground">{t("customer")}</legend>
          <div className="inline-flex rounded-full border p-1 dark:border-secondary-foreground">
            {CUSTOMERS.map((customer) => (
              <label
                key={customer}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  input.customerType === customer
                    ? "bg-elcar text-white"
                    : "text-elcar dark:text-primary-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="customerType"
                  value={customer}
                  checked={input.customerType === customer}
                  onChange={() => set("customerType", customer)}
                  className="sr-only"
                />
                {t(`customers.${customer}`)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold mb-2 dark:text-primary-foreground">{t("type")}</legend>
          <div className="grid sm:grid-cols-3 gap-2">
            {TYPES.map((type) => (
              <label
                key={type}
                className={`cursor-pointer border rounded-md p-3 text-sm transition-colors ${
                  input.systemType === type
                    ? "border-elcar bg-elcar-opacity dark:bg-popover"
                    : "dark:border-secondary-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="systemType"
                  value={type}
                  checked={input.systemType === type}
                  onChange={() => set("systemType", type)}
                  className="sr-only"
                />
                <span className="block font-bold text-elcar dark:text-primary-foreground">
                  {t(`types.${type}`)}
                </span>
                <span className="block mt-1 text-xs text-[#00000099] dark:text-secondary-foreground">
                  {t(`type-hints.${type}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {input.systemType === "hybrid" && (
          <NumberField
            label={t("backup")}
            unit={t("backup-unit")}
            value={input.backupHours}
            min={1}
            max={72}
            onChange={(v) => set("backupHours", v)}
          />
        )}
        {input.systemType === "off-grid" && (
          <NumberField
            label={t("autonomy")}
            unit={t("autonomy-unit")}
            value={input.autonomyDays}
            min={1}
            max={7}
            onChange={(v) => set("autonomyDays", v)}
          />
        )}

        <details className="border rounded-md p-3 dark:border-secondary-foreground">
          <summary className="cursor-pointer text-sm font-bold dark:text-primary-foreground">
            {t("advanced")}
          </summary>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <NumberField
              label={t("sun-hours")}
              hint={t("sun-hours-hint")}
              unit="h"
              value={input.sunHours}
              min={1}
              max={8}
              step={0.1}
              onChange={(v) => set("sunHours", v)}
            />
            <NumberField
              label={t("panel-watt")}
              unit="W"
              value={input.panelWatt}
              min={100}
              max={800}
              step={5}
              onChange={(v) => set("panelWatt", v)}
            />
          </div>
        </details>
      </div>

      <div>
        <div className="bg-elcar-opacity p-6 dark:bg-popover" aria-live="polite">
          <h2 className="text-2xl font-black text-title dark:text-primary-foreground">{t("result")}</h2>
          {result ? (
            <dl className="mt-4 divide-y divide-elcar/20">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-2 text-sm">
                  <dt className="dark:text-secondary-foreground">{row.label}</dt>
                  <dd className={`text-right dark:text-primary-foreground ${row.strong ? "font-black text-elcar text-base" : "font-bold"}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm">—</p>
          )}
          {result && !result.savings && (
            <p className="mt-3 text-xs text-[#00000099] dark:text-secondary-foreground">
              {input.systemType === "off-grid" ? t("saving-offgrid") : t("saving-unavailable")}
            </p>
          )}
          {result?.savings && (
            <p className="mt-3 text-xs text-[#00000099] dark:text-secondary-foreground">{t("saving-note")}</p>
          )}
          <p className="mt-4 text-xs text-[#00000099] dark:text-secondary-foreground">{t("disclaimer")}</p>
          <a
            href="#quote"
            className="mt-4 inline-block bg-elcar text-white text-sm font-bold rounded-full px-5 py-2"
          >
            {t("cta")}
          </a>
        </div>
      </div>

      <div id="quote" className="lg:col-span-2 scroll-mt-24">
        <QuoteRequestForm summary={summary} />
      </div>
    </div>
  );
};

export default SolarCalculator;
