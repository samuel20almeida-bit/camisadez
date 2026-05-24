import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://camisadez.vercel.app";
const description =
  "Crie uma figurinha personalizada no estilo Copa do Mundo 2026 e veja o resultado antes de pagar.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Camisa 10 | Figurinha personalizada Copa 2026",
  description,
  openGraph: {
    title: "Camisa 10 | Figurinha personalizada Copa 2026",
    description,
    url: siteUrl,
    siteName: "Camisa 10",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/hero-camisa10.png",
        width: 1200,
        height: 630,
        alt: "Figurinha personalizada Copa 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Camisa 10 | Figurinha personalizada Copa 2026",
    description,
    images: ["/hero-camisa10.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
