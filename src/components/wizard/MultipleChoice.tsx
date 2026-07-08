"use client";

interface MCOption {
  label: string;
  value: number;
}

interface MultipleChoiceProps {
  question: string;
  questionNumber: number;
  options: MCOption[];
  value: number | undefined;
  onChange: (value: number) => void;
}

export function MultipleChoice({
  question,
  questionNumber,
  options,
  value,
  onChange,
}: MultipleChoiceProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Question */}
      <p className="text-lg sm:text-xl font-semibold text-[#2C1A0E] leading-snug">
        <span className="text-[#F5A877] font-extrabold mr-1">{questionNumber}.</span>
        {question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                w-full text-left px-5 py-4 sm:py-5 rounded-2xl border-2
                text-base sm:text-lg font-medium
                transition-all duration-150 min-h-[56px] sm:min-h-[64px]
                ${
                  selected
                    ? "border-[#F5A877] bg-[#F5A877] text-white shadow-md"
                    : "border-[#FDDFC4] bg-white text-[#2C1A0E] hover:border-[#F5A877] hover:bg-[#FDF0E6]"
                }
              `}
              aria-pressed={selected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
