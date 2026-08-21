import { Link } from "@/i18n/navigation";

type Props = {
  /** cari səhifə (1-dən başlayır) */
  page: number;
  total: number;
  perPage: number;
  /** dil prefiksi olmadan: "/charging-stations" */
  basePath: string;
  labels: { prev: string; next: string; pageLabel: string };
};

/**
 * Axtarış motorları üçün kəşf ediləbilən səhifələmə.
 * Real <a href> linkləridir — sonsuz sürüşdürmə Google üçün işləmir,
 * çünki bot səhifəni sürüşdürmür.
 */
export default function Pagination({
  page,
  total,
  perPage,
  basePath,
  labels,
}: Props) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  const nums: number[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 2) nums.push(i);
  }

  const href = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`);

  return (
    <nav
      aria-label={labels.pageLabel}
      className="flex flex-wrap items-center justify-center gap-2 my-10"
    >
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          className="px-3 py-2 border rounded-md dark:text-primary-foreground"
        >
          {labels.prev}
        </Link>
      )}

      {nums.map((n, i) => {
        const gap = i > 0 && n - nums[i - 1] > 1;
        return (
          <span key={n} className="flex items-center gap-2">
            {gap && <span className="px-1 text-gray-400">…</span>}
            {n === page ? (
              <span
                aria-current="page"
                className="px-3 py-2 border rounded-md bg-elcar text-white font-semibold"
              >
                {n}
              </span>
            ) : (
              <Link
                href={href(n)}
                className="px-3 py-2 border rounded-md dark:text-primary-foreground"
              >
                {n}
              </Link>
            )}
          </span>
        );
      })}

      {page < pages && (
        <Link
          href={href(page + 1)}
          rel="next"
          className="px-3 py-2 border rounded-md dark:text-primary-foreground"
        >
          {labels.next}
        </Link>
      )}
    </nav>
  );
}
