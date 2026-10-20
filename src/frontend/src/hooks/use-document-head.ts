import {
  breadcrumbJsonLd,
  isNoindexPath,
  jsonLdScript,
  routeMeta,
  seoForPath,
} from "@/lib/seo";
import { useEffect } from "react";

const BREADCRUMB_ID = "ld-breadcrumb";
const ADMIN_TITLE = "Admin | Avalon Ice";
const NOT_FOUND_TITLE = "Page not found | Avalon Ice";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeCanonical() {
  document.head.querySelector('link[rel="canonical"]')?.remove();
}

function setRobots(content: string | null) {
  const el = document.head.querySelector('meta[name="robots"]');
  if (content === null) {
    el?.remove();
    return;
  }
  upsertMeta("name", "robots", content);
}

function setBreadcrumb(json: string | null) {
  const existing = document.getElementById(BREADCRUMB_ID);
  if (json === null) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement("script");
  el.id = BREADCRUMB_ID;
  el.setAttribute("type", "application/ld+json");
  el.textContent = json;
  if (!existing) document.head.appendChild(el);
}

/**
 * Keep <head> in step with the current route: title, description,
 * canonical, OpenGraph/Twitter tags, robots and the breadcrumb JSON-LD.
 *
 * The built site also ships a pre-rendered index.html per public route
 * (see vite.config.js) so crawlers that don't run JavaScript see the same
 * tags; this hook covers client-side navigation and any host that serves
 * the root index.html for every path.
 */
export function useDocumentHead(pathname: string) {
  useEffect(() => {
    const route = seoForPath(pathname);
    if (!route) {
      // Admin screens and unknown paths stay out of search results, and
      // carry no canonical (it would point search engines elsewhere).
      const admin = isNoindexPath(pathname);
      document.title = admin ? ADMIN_TITLE : NOT_FOUND_TITLE;
      setRobots(admin ? "noindex, nofollow" : "noindex");
      removeCanonical();
      setBreadcrumb(null);
      return;
    }
    document.title = route.title;
    const meta = routeMeta(route);
    for (const [key, value] of Object.entries(meta.name)) {
      upsertMeta("name", key, value);
    }
    for (const [key, value] of Object.entries(meta.property)) {
      upsertMeta("property", key, value);
    }
    setCanonical(meta.canonical);
    setRobots(null);
    const crumbs = breadcrumbJsonLd(route);
    setBreadcrumb(crumbs ? jsonLdScript(crumbs) : null);
  }, [pathname]);
}
