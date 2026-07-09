import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avaliação de Saúde Vocal — Camila Aguiar Fonoaudióloga",
  description:
    "Descubra como está a saúde da sua voz com esta autoavaliação desenvolvida pela fonoaudióloga Camila Aguiar.",
  openGraph: {
    title: "Avaliação de Saúde Vocal — Camila Aguiar Fonoaudióloga",
    description: "Autoavaliação vocal para profissionais de comunicação oral.",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
