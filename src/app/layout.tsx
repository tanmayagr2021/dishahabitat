import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Caveat, Hanken_Grotesk, Newsreader } from "next/font/google";
import { Header } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

/* Headlines: Newsreader, an editorial serif with optical sizes and a true italic. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

/* Text, labels and figures: Hanken Grotesk, a calm grotesque with clear numerals and ₹. */
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

/* A hand for the note card in "Our approach". */
const caveat = Caveat({
  variable: "--font-caveat",
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
    images: [{ url: "/images/central-park/clubhouse-dusk.jpg", width: 1920, height: 1274 }],
  },
  /* Prototype build: keep it out of search indexes. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#08160f",
  width: "device-width",
  initialScale: 1,
};

/*
 * Runs before paint:
 *  1. marks the page for scroll reveals (removed after 3s if the app never hydrates);
 *  2. picks the hero photograph for the time of day in Bengaluru (IST);
 *  3. decides whether the logo film plays: whenever someone arrives at the site, on any page (never
 *     with reduced motion; `?nointro` skips it for automated checks). It autoplays from the HTML;
 *     moving between pages inside the site does not replay it.
 */
const bootstrap = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.remove('js-reveal')},3000);try{var h=Number(new Intl.DateTimeFormat('en-GB',{hour:'numeric',hourCycle:'h23',timeZone:'Asia/Kolkata'}).format(new Date()));d.dataset.daypart=h>=6&&h<16?'day':h>=16&&h<19?'dusk':'night'}catch(e){}try{var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var skip=/[?&]nointro/.test(location.search);d.dataset.intro=(!rm&&!skip)?'on':'off'}catch(e){d.dataset.intro='off'}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${newsreader.variable} ${hanken.variable} ${caveat.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Intro />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <SmoothScroll />
        <Script id="bootstrap" strategy="beforeInteractive">
          {bootstrap}
        </Script>
      </body>
    </html>
  );
}
