"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { Link } from "@/i18n/navigation";
import { compareHref, useCompareStore } from "@/lib/compareStore";

export type CompareColumn = {
  _id: string;
  title: string;
  href: string;
  image?: string;
};

export type CompareRow = {
  label: string;
  /** sütunlara uyğun dəyərlər; boş dəyər "—" kimi göstərilir */
  values: (string | null)[];
};

const CompareTable = ({
  locale,
  columns,
  rows,
}: {
  locale: string;
  columns: CompareColumn[];
  rows: CompareRow[];
}) => {
  const t = useTranslations("compare");
  const router = useRouter();
  const { remove } = useCompareStore();
  const [diffOnly, setDiffOnly] = useState(false);

  const isDifferent = (row: CompareRow) =>
    new Set(row.values.map((v) => v ?? "")).size > 1;
  const visibleRows = diffOnly ? rows.filter(isDifferent) : rows;

  const removeColumn = (id: string) => {
    remove(id);
    const rest = columns.map((c) => c._id).filter((c) => c !== id);
    router.replace(`/${locale}${compareHref(rest)}`);
  };

  return (
    <>
      <label className="mt-6 inline-flex items-center gap-2 text-sm cursor-pointer dark:text-primary-foreground">
        <input
          type="checkbox"
          checked={diffOnly}
          onChange={(e) => setDiffOnly(e.target.checked)}
          className="accent-[#006965] w-4 h-4"
        />
        {t("diffOnly")}
      </label>

      <div className="mt-4 overflow-x-auto border dark:border-secondary-foreground">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white dark:bg-foreground w-48 min-w-40" />
              {columns.map((col) => (
                <th
                  key={col._id}
                  scope="col"
                  className="align-top p-4 border-l text-left font-normal dark:border-secondary-foreground"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeColumn(col._id)}
                      aria-label={`${t("remove")}: ${col.title}`}
                      className="p-1 text-gray-500 hover:text-elcar dark:text-secondary-foreground"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  </div>
                  <Link href={col.href} className="block">
                    {col.image && (
                      <Image
                        src={col.image}
                        alt={col.title}
                        width={240}
                        height={160}
                        className="w-full h-32 object-contain"
                      />
                    )}
                    <span className="mt-2 block font-black text-title dark:text-primary-foreground">
                      {col.title}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const differs = isDifferent(row);
              return (
                <tr key={row.label} className="border-t dark:border-secondary-foreground">
                  <th
                    scope="row"
                    className="sticky left-0 bg-white dark:bg-foreground text-left font-normal p-3 text-[#00000099] dark:text-secondary-foreground"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={columns[i]._id}
                      className={`p-3 border-l dark:border-secondary-foreground dark:text-primary-foreground ${
                        differs ? "font-bold" : ""
                      }`}
                    >
                      {value ?? "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CompareTable;
