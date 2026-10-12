import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    images: [{ url: "/images/central-park/clubhouse-dusk.jpg", width: 1920, height: 1274 }],
  },
  /* Prototype build: keep it out of search indexes. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0b",
  width: "device-width",
  initialScale: 1,
};

/*
 * Runs before paint:
 *  1. marks the page for scroll reveals (removed after 3s if the app never hydrates);
 *  2. picks the hero photograph for the time of day in Bengaluru (IST).
 */
const bootstrap = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.remove('js-reveal')},3000);try{var h=Number(new Intl.DateTimeFormat('en-GB',{hour:'numeric',hourCycle:'h23',timeZone:'Asia/Kolkata'}).format(new Date()));d.dataset.daypart=h>=6&&h<16?'day':h>=16&&h<19?'dusk':'night'}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${instrument.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <Script id="bootstrap" strategy="beforeInteractive">
          {bootstrap}
        </Script>
      </body>
    </html>
  );
}
