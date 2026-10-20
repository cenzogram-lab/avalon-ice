import { HOME, ROUTES } from "@/lib/seo";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useDocumentHead } from "./use-document-head";

const content = (selector: string) =>
  document.head.querySelector(selector)?.getAttribute("content");

beforeEach(() => {
  document.head.innerHTML = "";
  document.title = "";
});

describe("useDocumentHead", () => {
  it("applies each route's tags as the path changes", () => {
    const { rerender } = renderHook(({ path }) => useDocumentHead(path), {
      initialProps: { path: "/" },
    });
    expect(document.title).toBe(HOME.title);
    expect(document.getElementById("ld-breadcrumb")).toBeNull();

    const about = ROUTES.find((r) => r.path === "/about")!;
    rerender({ path: "/about/" });
    expect(document.title).toBe(about.title);
    expect(content('meta[name="description"]')).toBe(about.description);
    expect(content('meta[property="og:title"]')).toBe(about.title);
    expect(content('meta[property="og:url"]')).toBe(
      "https://www.avalonice.co/about",
    );
    expect(content('meta[name="twitter:description"]')).toBe(about.description);
    expect(
      document.head
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href"),
    ).toBe("https://www.avalonice.co/about");
    const crumbs = JSON.parse(
      document.getElementById("ld-breadcrumb")?.textContent ?? "{}",
    );
    expect(crumbs.itemListElement[1].name).toBe("About");
    expect(
      document.head.querySelectorAll('meta[name="description"]'),
    ).toHaveLength(1);
  });

  it("keeps the admin area and unknown paths out of search results", () => {
    const { rerender } = renderHook(({ path }) => useDocumentHead(path), {
      initialProps: { path: "/admin" },
    });
    expect(content('meta[name="robots"]')).toBe("noindex, nofollow");
    expect(document.title).toBe("Admin | Avalon Ice");
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();

    rerender({ path: "/no-such-page" });
    expect(content('meta[name="robots"]')).toBe("noindex");

    rerender({ path: "/shop" });
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
    expect(
      document.head
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href"),
    ).toBe("https://www.avalonice.co/shop");
    expect(document.getElementById("ld-breadcrumb")).not.toBeNull();
  });
});
