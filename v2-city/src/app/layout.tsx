import type { Metadata, Viewport } from "next";
import { Archivo, Ibarra_Real_Nova } from "next/font/google";
import { CINE } from "@/lib/cine";
import "./globals.css";

/* Titles: Ibarra Real Nova, a classical book face, as an atlas plate would set them. */
const ibarra = Ibarra_Real_Nova({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

/* Text and map labels: Archivo, whose width axis gives the condensed capitals maps use. */
const archivo = Archivo({
  variable: "--font-text",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Disha Habitat | A city, made of homes",
  description:
    "An atlas of Disha Habitat's East Bengaluru: five communities lived in, 1,102 homes handed over since 2014, and Pursuit of the Elements now selling in Gunjur.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1528",
  width: "device-width",
  initialScale: 1,
};

/*
 * Runs in the head, before anything paints:
 *  1. marks large screens that allow motion for the moving atlas (html.cine);
 *  2. starts fetching the one map this screen shows first: the half-size night plate for the moving
 *     atlas, or the phone crop for the still layout (a script, so no browser fetches, or warns about,
 *     the map it does not need).
 */
const bootstrap = `(function(){try{var d=document,cine=matchMedia(${JSON.stringify(CINE)}).matches;if(cine)d.documentElement.classList.add('cine');var l=d.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';if(cine){l.href='/atlas/city-low.avif';l.type='image/avif'}else{l.href='/atlas/city-mobile.webp'}d.head.appendChild(l)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${ibarra.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
