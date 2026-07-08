interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);

  return (
    <div className="w-full px-4 py-3.5 bg-white border-b border-[#FDDFC4] sticky top-0 z-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-semibold text-[#8B4F1E] uppercase tracking-wide truncate pr-4">
            {label}
          </span>
          <span className="text-xs sm:text-sm text-[#C47A42] font-medium shrink-0">
            {current} / {total}
          </span>
        </div>
        <div className="h-2 sm:h-2.5 bg-[#FDDFC4] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F5A877] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
