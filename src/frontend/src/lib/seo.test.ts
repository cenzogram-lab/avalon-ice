import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  HOME,
  PRIMARY_NAV,
  ROUTES,
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  renderRouteHtml,
  siteJsonLd,
  sitemapXml,
} from "./seo";

const read = (rel: string) =>
  fs.readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
const parse = (html: string) =>
  new DOMParser().parseFromString(html, "text/html");
const meta = (doc: Document, attr: string, key: string) =>
  doc.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute("content");

const indexHtml = read("../../index.html");

describe("route metadata", () => {
  it("uses the specified titles", () => {
    const byPath = Object.fromEntries(ROUTES.map((r) => [r.path, r.title]));
    expect(byPath).toMatchObject({
      "/": "Avalon Ice | Bulk & Packaged Ice Distribution · Cape May County, NJ",
      "/shop": "Shop Avalon Ice | Bulk Ice, Pallets & Merchandisers",
      "/about":
        "About Avalon Ice | Shore Route Ice Distribution · Cape May County",
      "/privacy": "Privacy Policy | Avalon Ice",
      "/terms": "Terms of Service | Avalon Ice",
    });
  });

  it("gives every route a unique title and a 150–160 character description", () => {
    expect(new Set(ROUTES.map((r) => r.title)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((r) => r.description)).size).toBe(ROUTES.length);
    for (const r of ROUTES) {
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(150);
      expect(r.description.length, r.path).toBeLessThanOrEqual(160);
    }
  });

  it("covers the target keywords without promising products the site doesn't sell", () => {
    const all = ROUTES.map((r) => `${r.title} ${r.description}`).join(" ");
    for (const term of [
      "packaged ice delivery",
      "bulk ice pallets",
      "emergency shore drop",
      "merchandisers",
      "Cape May County",
      "Avalon",
      "Sea Isle",
      "Stone Harbor",
    ]) {
      expect(all.toLowerCase()).toContain(term.toLowerCase());
    }
    expect(all).not.toMatch(/\b(16|40)\s?lb/i);
    // /shop has no prices yet, so no title or description may promise them.
    expect(all).not.toMatch(/pricing/i);
  });

  it("registers every route in the app router", () => {
    const app = read("../App.tsx");
    for (const r of ROUTES) expect(app).toContain(`path: "${r.path}"`);
  });

  it("keeps all URLs on the canonical www origin", () => {
    expect(SITE_URL).toBe("https://www.avalonice.co");
    expect(absoluteUrl("/")).toBe("https://www.avalonice.co/");
    expect(absoluteUrl("/shop")).toBe("https://www.avalonice.co/shop");
  });
});

describe("index.html (home page head)", () => {
  const doc = parse(indexHtml);

  it("carries the home title, description, canonical and social tags", () => {
    expect(doc.title).toBe(HOME.title);
    expect(meta(doc, "name", "description")).toBe(HOME.description);
    expect(
      doc.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://www.avalonice.co/");
    // AGENTS.md: og:title === <title>, og:description === description.
    expect(meta(doc, "property", "og:title")).toBe(doc.title);
    expect(meta(doc, "property", "og:description")).toBe(HOME.description);
    expect(meta(doc, "property", "og:url")).toBe("https://www.avalonice.co/");
    expect(meta(doc, "name", "twitter:title")).toBe(doc.title);
    expect(meta(doc, "name", "twitter:description")).toBe(HOME.description);
    expect(meta(doc, "name", "twitter:card")).toBe("summary_large_image");
    for (const key of ["og:image"])
      expect(meta(doc, "property", key)).toMatch(/^https:\/\//);
    expect(meta(doc, "name", "twitter:image")).toMatch(/^https:\/\//);
  });

  it("embeds the site-wide JSON-LD exactly as generated from seo.ts", () => {
    const script = doc.getElementById("ld-site");
    expect(script?.getAttribute("type")).toBe("application/ld+json");
    expect(JSON.parse(script?.textContent ?? "")).toEqual(siteJsonLd());
  });

  it("describes the business and the primary site navigation", () => {
    const graph = (siteJsonLd()["@graph"] as Record<string, unknown>[]) ?? [];
    const business = graph.find((n) => n["@id"] === `${SITE_URL}/#business`);
    expect(business).toMatchObject({
      "@type": ["LocalBusiness", "WholesaleStore"],
      name: "Avalon Ice",
      legalName: "Avalon Ice, LLC",
      url: "https://www.avalonice.co/",
      logo: "https://www.avalonice.co/assets/images/avalon-heron.webp",
      telephone: "+1-856-308-9986",
      email: "Sales@AvalonIce.co",
      priceRange: "$$",
      address: { addressRegion: "NJ", addressCountry: "US" },
    });
    const served = (business?.areaServed as { name: string }[]).map(
      (a) => a.name,
    );
    for (const place of [
      "Cape May County, NJ",
      "Avalon, NJ",
      "Stone Harbor, NJ",
      "Sea Isle City, NJ",
      "Ocean City, NJ",
      "Wildwood, NJ",
      "Cape May, NJ",
      "South Jersey Shore",
    ]) {
      expect(served).toContain(place);
    }
    const nav = graph.filter((n) => n["@type"] === "SiteNavigationElement");
    expect(nav.map((n) => n.url)).toEqual(
      PRIMARY_NAV.map((l) => absoluteUrl(l.path)),
    );
  });
});

describe("public/robots.txt and public/sitemap.xml", () => {
  it("blocks the admin area and points at the sitemap", () => {
    const robots = read("../../public/robots.txt");
    expect(robots).toContain("User-agent: *");
    expect(robots).toMatch(/^Disallow: \/admin$/m);
    expect(robots).toContain("Sitemap: https://www.avalonice.co/sitemap.xml");
  });

  it("lists exactly the public routes", () => {
    const xml = read("../../public/sitemap.xml");
    const lastmod = xml.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? "";
    expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(xml).toBe(sitemapXml(lastmod));
    expect(xml).not.toContain("/admin");
  });
});

describe("pre-rendered route pages", () => {
  it.each(ROUTES.filter((r) => r.path !== "/"))(
    "renders $path with its own head",
    (route) => {
      const doc = parse(renderRouteHtml(indexHtml, route));
      const url = absoluteUrl(route.path);
      expect(doc.title).toBe(route.title);
      expect(doc.head.querySelectorAll("title")).toHaveLength(1);
      expect(meta(doc, "name", "description")).toBe(route.description);
      expect(meta(doc, "property", "og:title")).toBe(route.title);
      expect(meta(doc, "property", "og:description")).toBe(route.description);
      expect(meta(doc, "property", "og:url")).toBe(url);
      expect(meta(doc, "name", "twitter:title")).toBe(route.title);
      expect(doc.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(
        1,
      );
      expect(
        doc.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      ).toBe(url);
      // Site-wide schema stays; the breadcrumb is added.
      expect(doc.getElementById("ld-site")).not.toBeNull();
      expect(
        JSON.parse(doc.getElementById("ld-breadcrumb")?.textContent ?? ""),
      ).toEqual(breadcrumbJsonLd(route));
    },
  );

  it("builds a two-level breadcrumb for sub-pages only", () => {
    expect(breadcrumbJsonLd(HOME)).toBeNull();
    const shop = breadcrumbJsonLd(ROUTES.find((r) => r.path === "/shop")!);
    expect(shop).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home", item: "https://www.avalonice.co/" },
        { position: 2, name: "Shop", item: "https://www.avalonice.co/shop" },
      ],
    });
  });
});
