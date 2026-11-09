import type { EducationEntry } from "@/data/education";

export default function EducationTimeline({
  entries,
}: {
  entries: EducationEntry[];
}) {
  return (
    <ol className="relative ml-2 max-w-[30rem] border-l border-white/[0.14]">
      {entries.map((entry, index) => (
        <li
          key={`${entry.level}-${entry.institution}`}
          data-education-item
          className="relative pb-12 pl-7 last:pb-0 md:pb-16 md:pl-10"
        >
          <span
            className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 bg-accent shadow-[0_0_12px_2px_rgba(138,180,248,0.45)]"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <div className="flex items-baseline gap-3">
              <span className="label-accent">0{index + 1}</span>
              <h3 className="text-lg font-semibold uppercase tracking-[-0.02em] text-paper md:text-xl">
                {entry.level}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xl font-semibold tracking-[-0.03em] text-paper md:text-2xl">
                {entry.score}
              </span>
              <span className="ml-2 text-[0.6rem] uppercase tracking-wide text-muted">
                {entry.scoreLabel}
              </span>
            </div>
          </div>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-[0.95rem]">
            {entry.institution}
          </p>

          {entry.degree ? (
            <div className="mt-3 space-y-1.5 text-sm text-muted">
              <p>
                <span className="text-paper">{entry.degree}</span>
                <span className="mx-2 text-white/25">/</span>
                {entry.branch}
              </p>
              {entry.year ? (
                <p className="text-[0.68rem] uppercase tracking-wide text-muted/80">
                  {entry.year}
                </p>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
