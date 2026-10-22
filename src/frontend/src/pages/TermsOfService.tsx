import LegalPage, {
  EmailLink,
  LEGAL_ENTITY,
  LegalCallout,
  LegalList,
  type LegalSection,
  LegalSubhead,
  PhoneLink,
  SectionLink,
} from "@/components/legal/LegalPage";

export const TERMS_EFFECTIVE_DATE = "October 19, 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to These Terms",
    content: (
      <>
        <p>
          These Terms of Service govern your use of this website and every
          order, standing order, delivery, and equipment placement provided by{" "}
          {LEGAL_ENTITY} (“Avalon Ice,” “we,” “us”), a packaged and bulk ice
          distributor based in Cape May County, New Jersey. By using the site,
          placing an order, or accepting a delivery, you agree to these Terms.
        </p>
        <p>
          If you have a signed customer, credit, or equipment agreement with us,
          that agreement controls wherever it conflicts with these Terms. Most
          of these Terms are written for commercial accounts; if you buy for
          personal or household use,{" "}
          <SectionLink to="nj-consumers">
            New Jersey Consumer Protections
          </SectionLink>{" "}
          explains how New Jersey law applies to you.
        </p>
      </>
    ),
  },
  {
    id: "food-grade",
    title: "Food Classification & Regulatory Compliance",
    content: (
      <>
        <LegalCallout label="Food grade notice">
          Avalon Ice bagged packaged ice is a regulated food product. It is
          produced, handled, stored, and transported in compliance with the
          FDA’s Current Good Manufacturing Practice requirements (21 CFR Part
          117), the processing and quality standards of 21 CFR Part 129 as they
          apply to the water used to make it, and the New Jersey State Sanitary
          Code for wholesale food and cosmetic establishments (N.J.A.C. § 8:21).
        </LegalCallout>

        <LegalSubhead>Intended use &amp; sanitation standards</LegalSubhead>
        <p>
          Our ice is intended for human consumption and for chilling food and
          beverages. Once ice is in your custody, keeping it food-safe is your
          responsibility under the health code that applies to your
          establishment:
        </p>
        <LegalList>
          <li>
            Keep bags sealed and frozen, stored off the floor in a clean,
            food-grade freezer or merchandiser.
          </li>
          <li>
            Dispense with a clean, dedicated scoop — never bare hands or
            glassware.
          </li>
          <li>
            Do not store ice next to raw foods, chemicals, or cleaning supplies.
          </li>
          <li>
            Ice used to chill bottles, cans, seafood, or other products must not
            afterwards be consumed or returned to a bag.
          </li>
          <li>
            Discard ice that has thawed and refrozen, or any bag that is torn or
            contaminated.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "orders",
    title: "Orders, Emergency Runs & Cancellations",
    content: (
      <>
        <p>
          You can order through this website, by email, or by phone. An order is
          confirmed once we acknowledge it. Prices are those in your quote or
          current price sheet.
        </p>
        <LegalSubhead>Standing orders vs. emergency drops</LegalSubhead>
        <LegalList>
          <li>
            <strong className="text-navy">Seasonal standing orders</strong> run
            on a recurring schedule agreed for the season. Quantities can be
            adjusted with notice, and standing-order customers receive priority
            when demand peaks.
          </li>
          <li>
            <strong className="text-navy">On-demand emergency drops</strong>{" "}
            depend on truck and product availability and may carry an emergency
            or after-hours surcharge, which we disclose when you order. Arrival
            times are estimates unless we confirm a window in writing.
          </li>
        </LegalList>
        <LegalSubhead>Cancellations</LegalSubhead>
        <LegalList>
          <li>
            Standard drops: at least{" "}
            <strong className="text-navy">24 hours’</strong> advance written
            notice.
          </li>
          <li>
            Pallet-scale event drops: at least{" "}
            <strong className="text-navy">48 hours’</strong> advance written
            notice.
          </li>
          <li>
            Send cancellations to <EmailLink />. Orders already dispatched — the
            truck has left with your product — are billed in full.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery, Title & Risk of Loss",
    content: (
      <>
        <p>
          Title to the product, and all risk of loss — including temperature
          management — passes to you immediately upon delivery at your
          designated drop-off point, whether a loading dock, walk-in freezer,
          retailer merchandiser chest, marina, or event staging area.
        </p>
        <LegalCallout label="Temperature & integrity guarantee">
          Product is delivered frozen, between 0°F and 32°F. After delivery,
          Avalon Ice has no liability for melting, slacking, clumping, or
          refreeze crystallization caused by buyer equipment failure, open-air
          sun exposure, ambient dock dwell time, power surges or outages, or
          delayed handling on site.
        </LegalCallout>
        <LegalSubhead>Site accessibility</LegalSubhead>
        <p>
          Delivery locations must provide unobstructed truck access and safe
          unloading clearance. Our drivers may decline a drop that is unsafe. A
          redelivery or abort fee applies when a delivery cannot be completed
          because of a locked gate, blocked access, or an unreachable drop
          point.
        </p>
      </>
    ),
  },
  {
    id: "inspection",
    title: "Inspection & Acceptance",
    content: (
      <>
        <p>
          Inspect every delivery when it arrives. Any discrepancy — a short
          shipment, the wrong product, or torn or damaged bags — must be noted
          on the delivery receipt or bill of lading, or reported in writing to{" "}
          <EmailLink />, within{" "}
          <strong className="text-navy">4 hours of delivery</strong>. Photos
          help us resolve claims quickly.
        </p>
        <p>
          Failure to inspect and report within that window constitutes absolute
          and irrevocable acceptance of the delivery. For verified claims, we
          will replace the product or credit your account.
        </p>
      </>
    ),
  },
  {
    id: "equipment",
    title: "Merchandiser Equipment",
    content: (
      <>
        <p>
          Any ice merchandiser, freezer, or other cold-storage equipment we
          provide remains the exclusive property of Avalon Ice. When we place
          equipment at your site, you agree to:
        </p>
        <LegalList>
          <li>
            Supply a dedicated, properly grounded electrical circuit — no
            extension cords or shared circuits.
          </li>
          <li>
            Stock it only with Avalon Ice product. Competing or third-party
            products may not be stored in it.
          </li>
          <li>
            Not move, modify, or remove branding from it, and give us reasonable
            access to service, inspect, or retrieve it.
          </li>
          <li>
            Tell us promptly about any malfunction, and pay for loss, theft, or
            damage beyond normal wear.
          </li>
        </LegalList>
        <p>
          We may remove equipment if the account closes, an invoice goes unpaid,
          or these conditions are not met.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Commercial Payment Terms",
    content: (
      <>
        <p>
          Payment is due on delivery unless we have approved net terms for your
          account in writing. You are responsible for applicable taxes unless a
          valid resale or exemption certificate is on file.
        </p>
        <p>
          Overdue invoices accrue a late charge of{" "}
          <strong className="text-navy">1.5% per month</strong>, or the maximum
          rate permitted by law if lower. Commercial accounts are also
          responsible for the costs of collecting overdue balances, including
          reasonable attorneys’ fees, to the extent permitted by law. We may
          pause deliveries to an account with past-due invoices.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by New Jersey law, Avalon Ice is not
          liable for indirect, incidental, special, or consequential damages,
          including lost event revenue, beer or beverage spoilage, or business
          interruption, even if we were told such damages were possible.
        </p>
        <p>
          Our total liability for any claim arising from an order is limited to
          the amount you paid for the delivery that gave rise to the claim. This
          website is provided as is, for general information.
        </p>
      </>
    ),
  },
  {
    id: "force-majeure",
    title: "Force Majeure",
    content: (
      <p>
        We are not responsible for delays or failures to perform caused by
        events beyond our reasonable control, including severe coastal storms
        and tropical weather, emergency closures of or gridlock on the Garden
        State Parkway or the Atlantic City Expressway, utility blackouts,
        mechanical casualties, or government orders. We will resume service as
        soon as it is safe and practical to do so.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law & Venue",
    content: (
      <p>
        These Terms are governed strictly by the laws of the State of New
        Jersey, without regard to its conflict-of-law rules. Exclusive
        jurisdiction and venue for any dispute lies in the state courts of New
        Jersey sitting in Cape May County, or, where federal jurisdiction
        exists, the United States District Court for the District of New Jersey,
        Camden Vicinage. You and Avalon Ice consent to the personal jurisdiction
        of those courts.
      </p>
    ),
  },
  {
    id: "nj-consumers",
    title: "New Jersey Consumer Protections",
    content: (
      <>
        <p>
          These Terms are intended to comply with the New Jersey
          Truth-in-Consumer Contract, Warranty and Notice Act (TCCWNA, N.J.S.A.
          § 56:12-14 et seq.) and the New Jersey Consumer Fraud Act (N.J.S.A. §
          56:8-1 et seq.). Nothing in them is intended to violate any clearly
          established legal right of a consumer.
        </p>
        <p>
          If you buy for personal, family, or household use, the following apply
          to you only to the extent New Jersey law permits, and do not waive any
          right you hold under the Consumer Fraud Act, the TCCWNA, or the
          Uniform Commercial Code as adopted in New Jersey that cannot be
          waived:{" "}
          <SectionLink to="inspection">Inspection &amp; Acceptance</SectionLink>
          , <SectionLink to="payment">Commercial Payment Terms</SectionLink>{" "}
          (late charges and attorneys’ fees), and{" "}
          <SectionLink to="liability">Limitation of Liability</SectionLink>.
        </p>
        <p>
          If a court finds any provision of these Terms unenforceable under New
          Jersey law, that provision is limited to the minimum extent necessary
          and the rest of these Terms remain in effect.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: (
      <p>
        We may update these Terms from time to time. The effective date at the
        top of this page shows the current version. Changes apply to orders
        placed after they take effect; orders already confirmed remain under the
        Terms in place when they were placed.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact Us",
    content: (
      <p>
        {LEGAL_ENTITY} · Cape May County, New Jersey
        <br />
        Email: <EmailLink />
        <br />
        Phone: <PhoneLink />
      </p>
    ),
  },
];

/** /terms — order, delivery, equipment, and payment terms for Avalon Ice. */
export default function TermsOfService() {
  return (
    <LegalPage
      ocid="terms"
      title={["Terms of", "Service"]}
      effectiveDate={TERMS_EFFECTIVE_DATE}
      intro={
        <p>
          The terms behind every bag we deliver: food-grade standards, delivery
          and risk of loss, inspection, equipment, and payment — governed by New
          Jersey law.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
