import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Piazzolla } from "next/font/google";
import "./globals.css";

/* Display: Piazzolla, a sharp, warm book face with optical sizes and a true italic. */
const piazzolla = Piazzolla({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

/* Text and labels: Instrument Sans, clear at small sizes with honest numerals. */
const instrument = Instrument_Sans({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Disha Habitat | A home is never just a place",
  description:
    "Since 2014 Disha Habitat has built mindful living spaces in East Bengaluru: 1,102 homes handed over across five communities, and Pursuit of the Elements now selling in Gunjur.",
  /* A design prototype: never indexed, wherever it is hosted. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#eee9e0",
  width: "device-width",
  initialScale: 1,
};

/*
 * Runs while the HTML is parsed, before the first paint. Large screens that allow motion get the
 * scroll sequence ("cine"); everything else, and any browser without JavaScript, gets the static
 * composition, which carries the same words and pictures.
 */
const bootstrap = `(function(){var d=document.documentElement;d.dataset.act='gate';try{if(matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches)d.classList.add('cine')}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${piazzolla.variable} ${instrument.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
