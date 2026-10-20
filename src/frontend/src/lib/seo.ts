/**
 * Search and share metadata for every public route — the single source the
 * runtime head manager (useDocumentHead), the build-time page generator
 * (vite.config.js) and the tests all read from. public/sitemap.xml and the
 * home-page tags in index.html are checked against it by seo.test.ts.
 *
 * Plain data and string builders only: this module is also imported by the
 * Vite config, so it must not touch the DOM or React.
 */

/** Canonical origin. Every canonical, og:url and schema URL uses `www`. */
export const SITE_URL = "https://www.avalonice.co";
export const SITE_NAME = "Avalon Ice";
export const LEGAL_NAME = "Avalon Ice, LLC";
export const LOGO_URL = `${SITE_URL}/assets/images/avalon-heron.webp`;
export const PHONE_E164 = "+1-856-308-9986";
export const EMAIL = "Sales@AvalonIce.co";

/** Default share image (kept per AGENTS.md until a branded 1200×630 exists). */
export const SHARE_IMAGE = "https://caffeine.ai/imgs/share-logo.jpeg";
export const SHARE_IMAGE_ALT = "Avalon Ice — the Shore's coldest delivery";

export interface RouteSeo {
  /** Route path without a trailing slash ("/" for home). */
  path: string;
  title: string;
  /** 150–160 characters. */
  description: string;
  /** Breadcrumb / navigation label. */
  name: string;
  priority: string;
  changefreq: "weekly" | "monthly" | "yearly";
}

export const HOME: RouteSeo = {
  path: "/",
  title: "Avalon Ice | Bulk & Packaged Ice Distribution · Cape May County, NJ",
  description:
    "Packaged ice delivery across Cape May County: 7 lb bags, bulk ice pallets for events and emergency shore drops in Avalon, Stone Harbor and Sea Isle City.",
  name: "Home",
  priority: "1.0",
  changefreq: "weekly",
};

export const ROUTES: RouteSeo[] = [
  HOME,
  {
    path: "/shop",
    title: "Bulk Ice & Merchandisers | Pricing & Pallets · Avalon Ice",
    description:
      "Shop Avalon Ice: 7 lb packaged ice, pallet-scale bulk orders and commercial ice merchandisers for Cape May County businesses. Online storefront coming soon.",
    name: "Shop",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "About Avalon Ice | Shore Route Ice Distribution · Cape May County",
    description:
      "Avalon Ice is a Cape May County ice company built for the Shore, with packaged ice delivery and emergency shore drops for Avalon, Stone Harbor and Sea Isle.",
    name: "About",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Avalon Ice | Emergency Ice Drops & Route Inquiries",
    description:
      "Need ice fast? Request an emergency shore drop, a standing delivery route or bulk ice pallets from Avalon Ice in Cape May County. Call (856) 308-9986 today.",
    name: "Contact",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Avalon Ice",
    description:
      "How Avalon Ice, LLC collects, uses and protects customer data under the New Jersey Data Privacy Act, including your rights to access, correct or delete it.",
    name: "Privacy Policy",
    priority: "0.3",
    changefreq: "yearly",
  },
  {
    path: "/terms",
    title: "Terms of Service | Avalon Ice",
    description:
      "Avalon Ice, LLC terms for packaged ice orders and deliveries: food-grade standards, risk of loss, inspection windows, merchandisers and New Jersey law.",
    name: "Terms of Service",
    priority: "0.3",
    changefreq: "yearly",
  },
];

/** Routes that must never be indexed (also disallowed in robots.txt). */
export const NOINDEX_PREFIXES = ["/admin"];

/** The primary links offered to search engines as site navigation. */
export const PRIMARY_NAV = [
  { name: "Home", path: "/" },
  { name: "Shop & Bulk Ice", path: "/shop" },
  { name: "About & Story", path: "/about" },
  { name: "Contact & Emergency Drops", path: "/contact" },
];

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function seoForPath(pathname: string): RouteSeo | undefined {
  const path = normalizePath(pathname);
  return ROUTES.find((r) => r.path === path);
}

export function isNoindexPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return NOINDEX_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** BreadcrumbList for a sub-page; null for the home page. */
export function breadcrumbJsonLd(
  route: RouteSeo,
): Record<string, unknown> | null {
  if (route.path === "/") return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: HOME.name,
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.name,
        item: absoluteUrl(route.path),
      },
    ],
  };
}

const AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "Cape May County, NJ" },
  ...[
    "Avalon",
    "Stone Harbor",
    "Sea Isle City",
    "Ocean City",
    "Wildwood",
    "Cape May",
  ].map((name) => ({ "@type": "City", name: `${name}, NJ` })),
  { "@type": "Place", name: "South Jersey Shore" },
];

/** Site-wide structured data, embedded in index.html. */
export function siteJsonLd(): Record<string, unknown> {
  const business = `${SITE_URL}/#business`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "WholesaleStore"],
        "@id": business,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: absoluteUrl("/"),
        logo: LOGO_URL,
        image: LOGO_URL,
        telephone: PHONE_E164,
        email: EMAIL,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cape May County",
          addressRegion: "NJ",
          addressCountry: "US",
        },
        areaServed: AREA_SERVED,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        publisher: { "@id": business },
        inLanguage: "en-US",
      },
      ...PRIMARY_NAV.map((link) => ({
        "@type": "SiteNavigationElement",
        name: link.name,
        url: absoluteUrl(link.path),
      })),
    ],
  };
}

/** JSON for a <script type="application/ld+json"> body; "<" is escaped. */
export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** The tags that differ per route, as [selector-attribute, key, value]. */
export function routeMeta(route: RouteSeo): {
  name: Record<string, string>;
  property: Record<string, string>;
  canonical: string;
} {
  const url = absoluteUrl(route.path);
  return {
    name: {
      description: route.description,
      "twitter:title": route.title,
      "twitter:description": route.description,
    },
    property: {
      "og:title": route.title,
      "og:description": route.description,
      "og:url": url,
    },
    canonical: url,
  };
}

export function sitemapXml(lastmod: string): string {
  const urls = ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${absoluteUrl(r.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const escapeAttr = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escapeText = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Replace exactly one match, or fail: a silent miss would ship wrong tags. */
function replaceOnce(
  html: string,
  pattern: RegExp,
  replacement: string,
  what: string,
): string {
  const matches = html.match(
    new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`),
  );
  if (!matches || matches.length !== 1) {
    throw new Error(
      `seo: expected exactly one ${what} in index.html, found ${matches?.length ?? 0}`,
    );
  }
  return html.replace(pattern, replacement);
}

/**
 * The built home page rewritten for another route: its own title,
 * description, canonical, OpenGraph/Twitter tags and BreadcrumbList.
 * Used at build time to emit dist/<route>/index.html.
 */
export function renderRouteHtml(homeHtml: string, route: RouteSeo): string {
  const meta = routeMeta(route);
  let html = replaceOnce(
    homeHtml,
    /<title>[^<]*<\/title>/,
    `<title>${escapeText(route.title)}</title>`,
    "<title>",
  );
  for (const [attr, entries] of [
    ["name", meta.name],
    ["property", meta.property],
  ] as const) {
    for (const [key, value] of Object.entries(entries)) {
      const pattern = new RegExp(
        `(<meta\\s+${attr}="${key.replace(/:/g, "\\:")}"\\s+content=")[^"]*(")`,
      );
      html = replaceOnce(
        html,
        pattern,
        `$1${escapeAttr(value).replace(/\$/g, "$$$$")}$2`,
        `${attr}="${key}"`,
      );
    }
  }
  html = replaceOnce(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${meta.canonical}$2`,
    "canonical link",
  );
  const crumbs = breadcrumbJsonLd(route);
  if (crumbs) {
    html = replaceOnce(
      html,
      /<\/head>/,
      `  <script type="application/ld+json" id="ld-breadcrumb">${jsonLdScript(crumbs)}</script>\n  </head>`,
      "</head>",
    );
  }
  return html;
}
