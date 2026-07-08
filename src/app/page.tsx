import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#FDF0E6] flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[380px] sm:max-w-[580px]">

        {/* Card */}
        <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-[#FDDFC4] shadow-[0_6px_32px_0_rgba(196,122,66,0.12)] overflow-hidden">

          {/* Logo area */}
          <div className="flex justify-center px-10 pt-10 pb-8 sm:px-16 sm:pt-14 sm:pb-10">
            <div className="relative w-[220px] h-[82px] sm:w-[300px] sm:h-[112px]">
              <Image
                src="/images/logo_dourada.png"
                alt="Camila Aguiar Fonoaudióloga"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#FDDFC4] mx-8 sm:mx-12" />

          {/* Body */}
          <div className="px-8 pt-7 pb-9 sm:px-14 sm:pt-10 sm:pb-14 flex flex-col gap-5 sm:gap-8">

            {/* Headline */}
            <div className="text-center space-y-2 sm:space-y-3">
              <h1 className="text-[1.55rem] sm:text-[2.25rem] font-extrabold text-[#2C1A0E] leading-tight">
                Avaliação de{" "}
                <span className="text-[#F5A877]">Saúde Vocal</span>
              </h1>
              <p className="text-[0.875rem] sm:text-[1rem] text-[#8B4F1E] leading-relaxed">
                Autoavaliação para profissionais de comunicação oral.
              </p>
            </div>

            {/* Benefits */}
            <ul className="flex flex-col gap-3 sm:gap-4">
              {[
                "Instrumentos validados cientificamente",
                "Resultado personalizado por nível de risco",
                "Leva apenas ~5 minutos",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[0.875rem] sm:text-[1rem] text-[#2C1A0E]"
                >
                  <CheckCircle2 className="shrink-0 w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#F5A877]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/avaliacao"
              className="flex items-center justify-center gap-2 w-full py-[14px] sm:py-5 rounded-xl sm:rounded-2xl bg-[#F5A877] text-white font-bold text-[1rem] sm:text-[1.125rem] hover:bg-[#C47A42] transition-colors"
            >
              Iniciar avaliação
              <ArrowRight className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 sm:mt-6 text-center text-[0.7rem] sm:text-[0.75rem] text-[#C47A42] opacity-60 leading-relaxed px-2">
          Suas respostas são confidenciais e utilizadas apenas para fins desta pesquisa.
        </p>
      </div>
    </main>
  );
}
