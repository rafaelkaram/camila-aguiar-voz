import Image from "next/image";

interface LogoProps {
  variant?: "color" | "dark";
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({
  variant = "color",
  className = "",
  width = 160,
  height = 60,
}: LogoProps) {
  const src =
    variant === "color"
      ? "/images/logo_dourada.png"
      : "/images/logo_preta.png";

  return (
    <Image
      src={src}
      alt="Camila Aguiar Fonoaudióloga"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

// Inline SVG wave icon (acoustic waves in "C" shape) — brand symbol
export function WaveIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer arc */}
      <path
        d="M48 8C56 16 60 24 60 32C60 40 56 48 48 56"
        stroke="#F5A877"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Middle arc */}
      <path
        d="M40 16C45 21 48 26.5 48 32C48 37.5 45 43 40 48"
        stroke="#F5A877"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Inner arc */}
      <path
        d="M32 22C35 25.5 37 28.7 37 32C37 35.3 35 38.5 32 42"
        stroke="#F5A877"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="24" cy="32" r="4" fill="#F5A877" />
    </svg>
  );
}
