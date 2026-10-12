import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Disha Habitat — Come home to mindful living spaces",
    template: "%s · Disha Habitat",
  },
  description:
    "Since 2014, Disha Habitat has built five residential communities across East Bengaluru for more than 1,000 families. Come home to mindful living spaces.",
  openGraph: {
    type: "website",
    siteName: "Disha Habitat",
    locale: "en_IN",
    images: [{ url: "/images/central-park/clubhouse-dusk.jpg", width: 1920, height: 1280 }],
  },
  /* Prototype build: keep it out of search indexes. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e7",
  width: "device-width",
  initialScale: 1,
};

/*
 * Runs before paint so scroll-reveal content does not flash. If the app fails to
 * hydrate within 3s the class is removed and everything stays visible.
 */
const revealBootstrap = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.remove('js-reveal')},3000)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${instrument.variable} ${manrope.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <Script id="reveal-bootstrap" strategy="beforeInteractive">
          {revealBootstrap}
        </Script>
      </body>
    </html>
  );
}
