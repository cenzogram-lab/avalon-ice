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

export const PRIVACY_EFFECTIVE_DATE = "October 19, 2026";

/** The no-sale declaration, quoted verbatim so tests can pin it. */
export const NO_SALE_STATEMENT =
  "We do not sell consumer personal data, nor do we disclose personal data for third-party cross-context behavioral advertising or profiling without prior consent.";

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    content: (
      <>
        <p>
          {LEGAL_ENTITY} (“Avalon Ice,” “we,” “us”) is a packaged and bulk ice
          distributor based in Cape May County, New Jersey, serving retailers,
          marinas, restaurants, bars, events, and other businesses across South
          Jersey.
        </p>
        <p>
          This Privacy Policy explains what personal data we collect through our
          website, inquiry and order forms, phone and email, and our delivery
          operations; why we collect it; who we share it with; and the choices
          and rights you have. Questions go to <EmailLink /> or <PhoneLink />.
        </p>
      </>
    ),
  },
  {
    id: "legal-framework",
    title: "The Laws This Policy Follows",
    content: (
      <>
        <p>
          This policy is written to meet the{" "}
          <strong className="text-navy">New Jersey Data Privacy Act</strong>{" "}
          (NJDPA, P.L.2023, c.266, enacted as Senate Bill 332) and the{" "}
          <strong className="text-navy">New Jersey Consumer Fraud Act</strong>{" "}
          (N.J.S.A. § 56:8-1 et seq.). In keeping with the Consumer Fraud Act,
          we describe our data practices plainly and accurately, and we do not
          use deceptive or misleading practices in collecting or using your
          information.
        </p>
        <p>
          Most of our customers are businesses. The NJDPA protects individuals
          acting in a personal or household capacity, but we honor the requests
          described in{" "}
          <SectionLink to="your-rights">
            Your Rights Under New Jersey Law
          </SectionLink>{" "}
          from any individual who contacts us, including the people who place
          orders on behalf of a business.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <LegalSubhead>Contact &amp; delivery details</LegalSubhead>
        <LegalList>
          <li>
            Business legal name and the name of your contact representative.
          </li>
          <li>
            Delivery street address and drop-point notes (dock, walk-in freezer,
            merchandiser location, gate or access instructions).
          </li>
          <li>Email address and phone number.</li>
          <li>
            Order and inquiry details you send us: quantities, delivery days and
            frequency, event dates, venue information, and messages.
          </li>
        </LegalList>

        <LegalSubhead>Commercial transaction records</LegalSubhead>
        <LegalList>
          <li>
            Billing entity, invoices, order and delivery history, account
            status, and credit application information.
          </li>
          <li>
            Payment processor tokens. Card payments are handled by Stripe or a
            comparable PCI-DSS–compliant merchant gateway. We receive only a
            token and limited details such as card brand and last four digits;
            we never receive or store full card numbers or security codes.
          </li>
        </LegalList>

        <LegalSubhead>Technical telemetry</LegalSubhead>
        <LegalList>
          <li>
            IP address, device signatures, browser type and identifiers,
            operating system, and referral URLs.
          </li>
          <li>
            Cookies and similar browser storage, plus server and request logs
            (pages requested and timestamps).
          </li>
        </LegalList>

        <p>
          We collect this information directly from you or your business,
          automatically from your device when you use the site, and from our own
          delivery records. We do not seek sensitive data such as health,
          biometric, or religious information — please do not include it in
          messages to us.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Information",
    content: (
      <>
        <LegalList>
          <li>
            <strong className="text-navy">Cold-chain dispatch.</strong>{" "}
            Scheduling wholesale deliveries, planning and optimizing routes
            across South Jersey and Cape May County, confirming drop points, and
            fulfilling emergency shore-run orders.
          </li>
          <li>
            <strong className="text-navy">Accounts &amp; billing.</strong>{" "}
            Commercial invoicing, customer accounts, credit applications,
            collections, and business communications such as quotes, order
            confirmations, and delivery notices.
          </li>
          <li>
            <strong className="text-navy">Running the site.</strong> Keeping the
            website available and secure, preventing fraud and abuse, and
            troubleshooting errors.
          </li>
          <li>
            <strong className="text-navy">Legal obligations.</strong> Meeting
            tax, accounting, and food-safety record-keeping requirements and
            responding to lawful requests.
          </li>
        </LegalList>
        <p>
          We send marketing email only with your consent, and every marketing
          message includes a way to opt out. We do not use your data for
          purposes incompatible with those listed here without first asking you.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who We Share It With",
    content: (
      <>
        <p>
          We share personal data only with service providers (processors) who
          need it to run our business, under contracts that limit their use of
          it to providing services to us:
        </p>
        <LegalList>
          <li>
            <strong className="text-navy">Payment gateways</strong> (Stripe or a
            comparable merchant processor) to process payments.
          </li>
          <li>
            <strong className="text-navy">Cloud and canister hosting</strong> —
            this site is built on Caffeine and runs on the Internet Computer
            Protocol (ICP) network, where data is stored on servers operated by
            independent node providers that may be located outside New Jersey or
            the United States.
          </li>
          <li>
            <strong className="text-navy">Transactional email systems</strong>{" "}
            to send quotes, confirmations, and delivery notices.
          </li>
          <li>
            <strong className="text-navy">
              Mapping and geocoding services
            </strong>{" "}
            to plan routes and confirm delivery addresses.
          </li>
          <li>
            <strong className="text-navy">Content delivery services</strong>{" "}
            (Google Fonts, jsDelivr, and our media host), which receive your IP
            address when your browser loads fonts, map data, or video.
          </li>
        </LegalList>
        <p>
          We may also disclose information when the law requires it, to protect
          our rights or the safety of others, or to a successor in a merger or
          sale of the business, which would remain bound by this policy.
        </p>
        <LegalCallout label="No sale of personal data">
          {NO_SALE_STATEMENT}
        </LegalCallout>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Browser Storage",
    content: (
      <>
        <p>
          We use only the cookies and browser storage needed to run the site —
          for example, keeping an administrator signed in. We do not use
          advertising cookies, cross-site tracking pixels, or third-party
          analytics.
        </p>
        <p>
          You can block or delete cookies in your browser settings; parts of the
          site that need them, such as administrator sign-in, may then stop
          working. We treat a Global Privacy Control signal from your browser as
          a valid request to opt out of targeted advertising, sale, and
          profiling.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights Under New Jersey Law",
    content: (
      <>
        <p>Under the NJDPA you may ask us to:</p>
        <LegalList>
          <li>
            <strong className="text-navy">Access</strong> — confirm whether we
            process your personal data and get a copy of it in a portable
            format.
          </li>
          <li>
            <strong className="text-navy">Correct</strong> — fix inaccurate
            personal data.
          </li>
          <li>
            <strong className="text-navy">Delete</strong> — erase personal data
            you provided or we collected about you.
          </li>
          <li>
            <strong className="text-navy">Opt out</strong> — of targeted
            advertising, sale, or profiling (we do none of these, but you may
            still ask).
          </li>
        </LegalList>
        <p>
          Deletion is subject to the records we are legally required to keep:
          commercial and accounting records, tax records, and food-safety
          traceability records, as well as information needed for an open order,
          an unpaid invoice, or a pending dispute. When we must keep something,
          we tell you what and why, and we delete the rest.
        </p>

        <LegalSubhead>How to make a request</LegalSubhead>
        <p>
          Email <EmailLink /> with the subject line “Privacy Request,” or call{" "}
          <PhoneLink />. We will verify your identity using details we already
          hold, such as your account email or delivery address. An authorized
          agent may submit a request on your behalf with your written
          permission.
        </p>
        <LegalCallout label="Response timeline">
          We respond within 45 days of receiving your request, as the NJDPA
          requires. If we need more time, we may extend that once by up to 45
          additional days when reasonably necessary, and we will tell you why
          within the first 45 days.
        </LegalCallout>
        <p>
          Requests are free. If we decline a request, we will explain why; you
          may reply to ask us to reconsider, and you may contact the New Jersey
          Division of Consumer Affairs. We will never deny service, charge a
          different price, or otherwise treat you differently for exercising
          these rights.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How Long We Keep It",
    content: (
      <p>
        We keep personal data only as long as we need it for the purposes in
        this policy. Account, invoice, and delivery records are kept for as long
        as tax, accounting, and food-safety record-keeping rules require.
        Inquiries that do not become orders are deleted when they are no longer
        needed to follow up with you. Server logs are kept for a short period
        for security and troubleshooting.
      </p>
    ),
  },
  {
    id: "security",
    title: "How We Protect It",
    content: (
      <p>
        We use encrypted (HTTPS) connections, restrict access to customer
        records to the people who need them, and use tokenized payment
        processing so card numbers never reach our systems. No system is
        perfectly secure; if a breach affects your personal information, we will
        notify you and the authorities as New Jersey’s breach notification law
        (N.J.S.A. § 56:8-163) requires.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children’s Privacy",
    content: (
      <>
        <p>
          Our services and website are intended strictly for commercial entities
          and for individuals aged 18 and older. They are not directed to minors
          under 16, nor to children under 13 within the meaning of the
          Children’s Online Privacy Protection Act (COPPA).
        </p>
        <p>
          We do not knowingly collect personal data from anyone under 18, and
          consistent with the NJDPA’s protections for minors, we never process
          the data of a person we know to be under 17 for targeted advertising,
          sale, or profiling. If we learn that we have collected a minor’s data,
          we delete it. A parent or guardian who believes we hold a child’s
          information can contact us at <EmailLink />.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this policy as our services or the law change. The
        effective date at the top of this page shows when it was last revised.
        If we make a material change to how we use personal data, we will notify
        customers by email or with a notice on this site before the change takes
        effect.
      </p>
    ),
  },
  {
    id: "contact",
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

/** /privacy — how Avalon Ice collects, uses, and protects personal data. */
export default function PrivacyPolicy() {
  return (
    <LegalPage
      ocid="privacy"
      title={["Privacy", "Policy"]}
      effectiveDate={PRIVACY_EFFECTIVE_DATE}
      intro={
        <p>
          What we collect, why we collect it, and the rights New Jersey law
          gives you over it. The short version: we use your information to get
          ice to your door and bill for it — and we never sell it.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
