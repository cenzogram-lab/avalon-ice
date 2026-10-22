import { describe, expect, it } from "vitest";
import { inviteLink, parseAdminLink } from "./admin-links";

describe("admin links", () => {
  it("defaults to the login form", () => {
    expect(parseAdminLink("")).toEqual({ kind: "login" });
    expect(parseAdminLink("#contact")).toEqual({ kind: "login" });
    expect(parseAdminLink("#invited")).toEqual({ kind: "login" });
  });

  it("reads invite and setup links", () => {
    expect(parseAdminLink("#invite=ABCDE-FGHJK")).toEqual({
      kind: "invite",
      code: "ABCDE-FGHJK",
    });
    expect(parseAdminLink("#invite")).toEqual({ kind: "invite", code: "" });
    expect(parseAdminLink("#setup")).toEqual({ kind: "setup" });
  });

  it("round-trips the link the dashboard copies", () => {
    const link = inviteLink("https://www.avalonice.co", "ABCDE-FGHJK");
    expect(link).toBe("https://www.avalonice.co/admin#invite=ABCDE-FGHJK");
    expect(parseAdminLink(new URL(link).hash)).toEqual({
      kind: "invite",
      code: "ABCDE-FGHJK",
    });
  });
});
