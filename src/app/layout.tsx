import type { Metadata } from "next";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortuna Vita | Consultoria Financeira e Planejamento Patrimonial",
  description:
    "Especialistas em consultoria financeira, planejamento patrimonial, investimentos e proteção patrimonial.",
  metadataBase: new URL("https://fortunavita.com.br"),
  openGraph: {
    title: "Fortuna Vita | Consultoria Financeira e Planejamento Patrimonial",
    description:
      "Especialistas em consultoria financeira, planejamento patrimonial, investimentos e proteção patrimonial.",
    url: "https://fortunavita.com.br",
    siteName: "Fortuna Vita",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortuna Vita | Consultoria Financeira e Planejamento Patrimonial",
    description:
      "Especialistas em consultoria financeira, planejamento patrimonial, investimentos e proteção patrimonial.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18204680927"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "AW-18204680927");
          `}
        </Script>

        {children}

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
      </body>
    </html>
  );
}
