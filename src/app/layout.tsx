import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "TradeDocs - Commodity & Agricultural Trade Document Templates",
    template: "%s | TradeDocs",
  },
  description:
    "256+ professional document templates for commodity and agricultural trading. Contracts, shipping docs, SGS certificates, trade finance, China import/export compliance. Used by traders in 50+ countries.",
  keywords: [
    "commodity trade documents",
    "agricultural trade templates",
    "GAFTA contract template",
    "bill of lading template",
    "SGS certificate template",
    "letter of credit template",
    "FCO template",
    "China GACC registration",
    "trade document marketplace",
    "export documentation",
    "import documentation",
    "commodity trading startup",
  ],
  openGraph: {
    title: "TradeDocs - Professional Trade Document Templates",
    description:
      "256+ ready-to-use document templates for commodity and agricultural trading companies.",
    url: "https://tradedocs.com",
    siteName: "TradeDocs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeDocs - Professional Trade Document Templates",
    description:
      "256+ ready-to-use document templates for commodity and agricultural trading.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
