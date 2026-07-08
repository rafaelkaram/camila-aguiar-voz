"use client";

interface LikertOption {
  value: number;
  label: string;
}

interface LikertScaleProps {
  question: string;
  questionNumber: number;
  options: LikertOption[];
  value: number | undefined;
  onChange: (value: number) => void;
}

export function LikertScale({
  question,
  questionNumber,
  options,
  value,
  onChange,
}: LikertScaleProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Question */}
      <p className="text-lg sm:text-xl font-semibold text-[#2C1A0E] leading-snug">
        <span className="text-[#F5A877] font-extrabold mr-1">{questionNumber}.</span>
        {question}
      </p>

      {/* Mobile: vertical stacked */}
      <div className="flex flex-col gap-2 sm:hidden">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2
                text-left transition-all duration-150 select-none
                ${
                  selected
                    ? "border-[#F5A877] bg-[#F5A877] text-white shadow-md"
                    : "border-[#FDDFC4] bg-white text-[#2C1A0E] hover:border-[#F5A877] hover:bg-[#FDF0E6]"
                }
              `}
              aria-pressed={selected}
            >
              <span className={`text-2xl font-extrabold w-8 text-center shrink-0 ${selected ? "text-white" : "text-[#F5A877]"}`}>
                {opt.value}
              </span>
              <span className="text-base font-medium leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: horizontal cards */}
      <div className="hidden sm:flex gap-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-2
                min-h-[100px] rounded-2xl border-2 px-3 py-4
                transition-all duration-150 select-none
                ${
                  selected
                    ? "border-[#F5A877] bg-[#F5A877] text-white shadow-lg scale-[1.04]"
                    : "border-[#FDDFC4] bg-white text-[#2C1A0E] hover:border-[#F5A877] hover:bg-[#FDF0E6]"
                }
              `}
              aria-pressed={selected}
            >
              <span className={`text-3xl font-extrabold leading-none ${selected ? "text-white" : "text-[#F5A877]"}`}>
                {opt.value}
              </span>
              <span className={`text-xs font-semibold text-center leading-tight ${selected ? "text-white/90" : "text-[#8B4F1E]"}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
