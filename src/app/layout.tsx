import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { SiteFooter } from "@/components/showroom/SiteFooter";
import { SiteHeader } from "@/components/showroom/SiteHeader";
import { indexing, siteUrl } from "@/lib/launch";
import { company } from "@/lib/site";
import "./globals.css";

/* Text and controls: Hanken Grotesk, as plain as tesla.com's own face. */
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/* Headlines only: Newsreader, Disha's display serif. One static weight, so it never slows the first picture. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Disha Habitat | Homes in East Bengaluru",
    template: "%s · Disha Habitat",
  },
  description:
    "Pursuit of the Elements, now selling in Gunjur, and 1,102 homes handed over across five Disha Habitat communities in East Bengaluru since 2014.",
  openGraph: {
    type: "website",
    siteName: "Disha Habitat",
    locale: "en_IN",
    images: [{ url: "/images/og/home.jpg", width: 1200, height: 630 }],
  },
  /* Out of search indexes until launch day (SITE_INDEXING=true; see lib/launch.ts). */
  robots: indexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/* What search engines read about the company: published facts only (lib/site.ts). */
const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  legalName: company.legalName,
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  foundingDate: String(company.founded),
  email: company.email,
  telephone: company.phones.map((p) => p.display),
  address: {
    "@type": "PostalAddress",
    streetAddress: company.office.lines[0],
    addressLocality: "Bengaluru",
    postalCode: "560066",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  sameAs: company.socials.map((s) => s.href),
};

/* Marks that scripts run, before the first paint, so controls that need them only show when they work. */
const bootstrap = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${hanken.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <FeedbackWidget />
      </body>
    </html>
  );
}
