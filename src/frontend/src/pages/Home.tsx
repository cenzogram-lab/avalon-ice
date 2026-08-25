import ErrorBoundary from "@/components/ErrorBoundary";
import BrandVideo from "@/components/home/BrandVideo";
import ContactSection from "@/components/ContactSection";
import ComingSoonRibbon from "@/components/home/ComingSoonRibbon";
import IceFrame from "@/components/home/IceFrame";
import RoadParade from "@/components/home/RoadParade";
import VideoBackdrop from "@/components/home/VideoBackdrop";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitInquiry } from "@/lib/api";
import { HERO_VIDEO, LOOP_VIDEO, MERCH_TEASER_VIDEO } from "@/lib/media";
import { InquiryType } from "@/lib/types";
import type {
  EventFormValues,
  GeneralFormValues,
  WholesaleFormValues,
} from "@/lib/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Snowflake,
  Truck,
} from "lucide-react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Suspense, lazy, useEffect, useId, useRef, useState } from "react";

const NJDeliveryMap = lazy(() => import("@/components/home/NJDeliveryMap"));

/**
 * True once `ref` comes within `rootMargin` of the viewport.
 *
 * React fetches a lazy chunk as soon as the component renders, even far
 * below the fold — gating on this keeps the ~870KB 3D map out of the
 * homepage's first load until the visitor is heading for it.
 */
function useNearViewport(
  ref: React.RefObject<Element | null>,
  rootMargin = "600px",
) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="top"
      data-ocid="hero"
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-gradient-to-b from-cream-bright via-cream to-ice-light sm:min-h-[88vh] md:min-h-[85vh]"
    >
      {/* Full-bleed cover video behind the content at every width. Phones
          get the same backdrop rather than an inline card below the CTAs,
          so the headline always sits over the footage instead of the video
          dropping out of the background. */}
      <VideoBackdrop
        src={HERO_VIDEO}
        label="Avalon Ice brand animation"
        scrim="side"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-32">
        <span className="chip chip-solid mb-6" data-ocid="hero.badge">
          <MapPin className="size-3.5" />
          Cape May County
        </span>

        <h1 className="script-heading max-w-3xl text-5xl sm:text-6xl md:text-7xl">
          The Shore's{" "}
          <span className="text-block-ice text-4xl sm:text-5xl md:text-6xl">
            Coldest
          </span>{" "}
          Delivery.
        </h1>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button
            asChild
            size="lg"
            data-ocid="hero.request_button"
            className="btn-brutal btn-brutal-ice bg-navy px-7 py-6 font-body text-base font-bold uppercase tracking-wide text-cream-bright hover:bg-navy"
          >
            <a href="#order-form">
              <Truck className="size-5" />
              Request Delivery / Quote
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            data-ocid="hero.call_button"
            className="btn-brutal bg-cream-bright px-7 py-6 font-body text-base font-bold uppercase tracking-wide text-navy hover:bg-ice-frost"
          >
            <a href="tel:8563089986">
              <Phone className="size-5" />
              Call Now: (856) 308-9986
            </a>
          </Button>
        </div>

        <div className="mt-9 inline-flex flex-wrap items-center gap-2.5 rounded-xl border-[3px] border-navy bg-cream-bright/95 px-5 py-3 font-body text-sm font-semibold text-navy shadow-[0_5px_0_#A3CCD1]">
          <Mail className="size-4 text-lagoon" />
          <a
            href="mailto:Sales@AvalonIce.co?subject=Ice%20Delivery%20Request"
            data-ocid="hero.email"
            className="inline-flex min-h-12 items-center font-script text-lg text-lagoon hover:underline"
          >
            Sales@AvalonIce.co
          </a>
          <span className="text-ice-deep">|</span>
          <span>Cell: 856-308-9986</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Secondary showcase video — delivery & route                         */
/* ------------------------------------------------------------------ */

function ShowcaseVideo() {
  return (
    <section
      id="route"
      data-ocid="showcase"
      className="texture-paper bg-cream py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="eyebrow inline-flex items-center gap-2">
            <Truck className="size-4" />
            On the Road
          </span>
          <h2 className="script-heading mt-3 text-4xl sm:text-5xl">
            Cold from our door to yours.
          </h2>
        </div>

        <IceFrame clip="c" shadow="ice" innerClassName="p-2 sm:p-3">
          <div className="overflow-hidden rounded-xl border-2 border-navy/70">
            <div className="aspect-video w-full bg-gradient-ice-card">
              <BrandVideo
                src={LOOP_VIDEO}
                label="Avalon Ice delivery route loop"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </IceFrame>

        <RoadParade className="mt-12" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Products — ice-block cards with scroll-driven cube slide            */
/* ------------------------------------------------------------------ */

interface Product {
  title: string;
  description: string;
  chips: { label: string; solid?: boolean }[];
  clip: "a" | "b" | "c" | "d";
}

const PRODUCTS: Product[] = [
  {
    title: "Fresh Ice. Made at the Shore.",
    description:
      "Clean, fresh ice produced locally in South Jersey and delivered throughout the shore.",
    chips: [
      { label: "7 LB BAGS", solid: true },
      { label: "LOCALLY MADE" },
      { label: "FRESH & CLEAN" },
    ],
    clip: "a",
  },
  {
    title: "Commercial Ice Delivery",
    description:
      "Standing orders and on-demand drops kept cold on arrival, every route, every run.",
    chips: [
      { label: "RETAILERS" },
      { label: "MARINAS" },
      { label: "BARS/RESTAURANTS" },
    ],
    clip: "b",
  },
  {
    title: "Event & Festival Bulk Supply",
    description:
      "Pallet-scale bagged ice, scheduled to your run-of-show and restocked on cue.",
    chips: [
      { label: "FESTIVALS" },
      { label: "EVENTS" },
      { label: "CATERERS" },
    ],
    clip: "c",
  },
  {
    title: "Emergency & Same-Day Shore Run",
    description:
      "Freezer down? Crowd surge? Same-day shore runs across Cape May County and up the coast.",
    chips: [{ label: "SAME-DAY", solid: true }, { label: "7 DAYS A WEEK" }],
    clip: "d",
  },
];

function IceCubeSVG({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const topId = `cube-top-${uid}`;
  const leftId = `cube-left-${uid}`;
  const rightId = `cube-right-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        {/* Wet-ice face gradients: bright frosted top, darker saturated
            faces toward the melting base */}
        <linearGradient id={topId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FDFCF8" />
          <stop offset="1" stopColor="#E4F1F0" />
        </linearGradient>
        <linearGradient id={leftId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9ECEB" />
          <stop offset="0.7" stopColor="#C9E4E4" />
          <stop offset="1" stopColor="#9ECBD0" />
        </linearGradient>
        <linearGradient id={rightId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B7D9DC" />
          <stop offset="0.65" stopColor="#A3CCD1" />
          <stop offset="1" stopColor="#82B4BC" />
        </linearGradient>
      </defs>

      <g stroke="#0C3552" strokeWidth="3.5" strokeLinejoin="round">
        <polygon points="50,5 93,27 50,49 7,27" fill={`url(#${topId})`} />
        <polygon points="7,27 50,49 50,95 7,73" fill={`url(#${leftId})`} />
        <polygon points="93,27 50,49 50,95 93,73" fill={`url(#${rightId})`} />
      </g>

      {/* Wet base edge pooling toward the bottom */}
      <path
        d="M10 71 L50 91.5 L90 71"
        fill="none"
        stroke="#5E8A93"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Specular gloss streaks on the sunlit face */}
      <polygon
        points="60,47 69,42.5 69,79 60,84.5"
        fill="#FDFCF8"
        opacity="0.32"
      />
      <polygon
        points="74,40 78,38 78,74.5 74,77"
        fill="#FDFCF8"
        opacity="0.5"
      />
      {/* Sheen pooling on the top face */}
      <polygon
        points="50,10 77,23.5 62,31 35,17.5"
        fill="#FFFFFF"
        opacity="0.5"
      />

      {/* Clinging meltwater droplets */}
      <circle
        cx="24"
        cy="60"
        r="2.3"
        fill="#E9F4F3"
        stroke="#5E8A93"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <circle
        cx="39"
        cy="79"
        r="1.7"
        fill="#E9F4F3"
        stroke="#5E8A93"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <circle
        cx="81"
        cy="61"
        r="2"
        fill="#F4FAF9"
        stroke="#5E8A93"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Internal cracks */}
      <path
        d="M24 32l12-6M62 60v13M31 66l7 4"
        stroke="#0C3552"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sparkle glint */}
      <path
        d="M70 16h8M74 12v8"
        stroke="#FDFCF8"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const CUBE_SIZES = [
  "w-20 md:w-24",
  "w-16 md:w-20",
  "w-24 md:w-28",
  "w-16 md:w-20",
];

function ProductCard({
  product,
  index,
  progress,
}: {
  product: Product;
  index: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();

  // Staggered scroll window per card; cubes travel left → right with
  // rotation and per-cube parallax speed, settling behind their card.
  const start = 0.02 + index * 0.09;
  const end = 0.52 + index * 0.1;
  const slideMid = (start + end) / 2;
  const cubeX = useTransform(progress, [start, end], [-(340 + index * 130), 0]);
  const cubeRotate = useTransform(
    progress,
    [start, end],
    [-200 - index * 40, index % 2 === 0 ? -6 : 5],
  );
  // Springs trail the scroll targets, so the cube glides with inertia and
  // overshoots slightly before settling — like ice skidding to a stop.
  const cubeXSpring = useSpring(cubeX, {
    stiffness: 65,
    damping: 14,
    mass: 1.15,
  });
  const cubeRotateSpring = useSpring(cubeRotate, {
    stiffness: 58,
    damping: 13,
  });
  const cubeOpacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  const cardY = useTransform(progress, [start, end], [46, 0]);
  const cardOpacity = useTransform(progress, [start, start + 0.2], [0, 1]);
  // Wet slick trail behind the cube: strongest mid-slide, gone at rest.
  const trailOpacity = useTransform(
    progress,
    [start + 0.03, slideMid, end - 0.02],
    [0, 0.75, 0],
  );
  const trailScale = useTransform(
    progress,
    [start + 0.03, slideMid, end - 0.02],
    [0.25, 1, 0.2],
  );
  return (
    <motion.div
      data-ocid={`products.card.${index + 1}`}
      style={reduceMotion ? undefined : { y: cardY, opacity: cardOpacity }}
      className="relative"
    >
      {/* Illustrated ice cube sliding in behind the card */}
      <motion.div
        style={
          reduceMotion
            ? undefined
            : {
                x: cubeXSpring,
                rotate: cubeRotateSpring,
                opacity: cubeOpacity,
              }
        }
        className={`absolute -top-16 z-0 opacity-70 blur-[0.6px] ${index % 2 === 0 ? "-right-2" : "-left-2"} ${CUBE_SIZES[index]}`}
        aria-hidden="true"
      >
        {/* Wet slick streak dragged behind the sliding cube */}
        {!reduceMotion && (
          <div className="absolute right-2/3 top-1/2 w-40 -translate-y-1/2">
            <motion.div
              style={{ opacity: trailOpacity, scaleX: trailScale }}
              className="h-[7px] origin-right rounded-full bg-gradient-to-l from-ice-deep/60 via-ice/40 to-transparent blur-[1.5px]"
            />
          </div>
        )}

        <div className="animate-bob-cube relative">
          <IceCubeSVG className="h-auto w-full drop-shadow-[0_6px_0_rgba(163,204,209,0.7)]" />
        </div>
      </motion.div>

      {/* Deep coastal-navy card. `group` drives the hover glow and the ice
          reflection sweep below. */}
      <div className="group relative z-10 flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-[#0C2B48] via-[#081B2E] to-[#0D3A63] p-6 pb-7 shadow-xl shadow-slate-950/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-950/40">
        {/* Soft inner glow, revealed on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,rgba(56,189,248,0.18),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* Delicate ice reflection sweeping the card face */}
        <span
          aria-hidden="true"
          className="card-ice-reflection pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <h3 className="relative text-xl font-bold tracking-tight text-white md:text-2xl">
          {product.title}
        </h3>
        <p className="relative font-body text-sm leading-relaxed text-slate-300">
          {product.description}
        </p>
        <div className="relative mt-auto flex flex-wrap gap-2 pt-3">
          {product.chips.map((chip) => (
            <span
              key={chip.label}
              className={
                chip.solid
                  ? "rounded-full border border-sky-300/50 bg-sky-400/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-100"
                  : "rounded-full border border-sky-400/30 bg-sky-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300"
              }
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Staggered word-pop headline: each segment springs up and fades in as the
 * heading scrolls into view. Segments are declared explicitly rather than
 * split on whitespace so a multi-word accent ("every cooler") animates and
 * gradients as one unit. All motion is skipped under reduced-motion.
 */
function WordPop({
  segments,
  className,
  as: Tag = "h2",
  delay = 0,
}: {
  segments: { t: string; accent?: boolean }[];
  className?: string;
  as?: "h2" | "span";
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ACCENT =
    "bg-gradient-to-r from-sky-200 via-white to-sky-400 bg-clip-text text-transparent";

  return (
    <Tag className={className}>
      {segments.map((seg, i) => (
        <motion.span
          key={seg.t}
          // Inline-block keeps each segment on the text baseline while still
          // allowing it to be transformed independently.
          className={`inline-block ${seg.accent ? ACCENT : "text-white"}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 20,
            delay: delay + i * 0.08,
          }}
        >
          {seg.t}
          {i < segments.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}

const EYEBROW_SEGMENTS = [
  { t: "What" },
  { t: "We'll" },
  { t: "Be" },
  { t: "Running", accent: true },
];

const HEADLINE_SEGMENTS = [
  { t: "Cold", accent: true },
  { t: "for" },
  { t: "every cooler", accent: true },
  { t: "on" },
  { t: "the coast.", accent: true },
];

function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 88%", "end 78%"],
  });

  // Loose background cubes drifting at different parallax rates.
  const bgY1 = useTransform(scrollYProgress, [0, 1], [80, -100]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [30, -160]);
  const bgY3 = useTransform(scrollYProgress, [0, 1], [120, -50]);
  const bgRot1 = useTransform(scrollYProgress, [0, 1], [-18, 12]);
  const bgRot2 = useTransform(scrollYProgress, [0, 1], [10, -22]);

  return (
    <section
      ref={sectionRef}
      id="services"
      data-ocid="products"
      className="relative overflow-x-clip bg-gradient-to-b from-[#081B2E] via-[#0C2B48] to-[#081B2E] py-16 md:py-24"
    >
      {/* Soft edges: the band is bracketed by cream sections, so both ends
          fade into that rather than cutting off on a hard rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream to-transparent md:h-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent md:h-28"
      />

      {/* Ambient glass ice drifting behind the cards. Blurred and held at
          low opacity so it never competes with the card copy. */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        aria-hidden="true"
      >
        <motion.div
          style={reduceMotion ? undefined : { y: bgY1, rotate: bgRot1 }}
          className="ice-float absolute left-[3%] top-28 w-14 opacity-25 blur-[1px]"
        >
          <IceCubeSVG className="h-auto w-full" />
        </motion.div>
        <motion.div
          style={reduceMotion ? undefined : { y: bgY2, rotate: bgRot2 }}
          className="ice-float absolute right-[4%] top-1/2 w-12 opacity-20 blur-[1.5px]"
          
        >
          <IceCubeSVG className="h-auto w-full" />
        </motion.div>
        <motion.div
          style={reduceMotion ? undefined : { y: bgY3, rotate: bgRot1 }}
          className="ice-float absolute bottom-10 left-[9%] w-16 opacity-25 blur-[1px]"
        >
          <IceCubeSVG className="h-auto w-full" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <span className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          <Snowflake className="size-4" />
          <WordPop as="span" segments={EYEBROW_SEGMENTS} />
        </span>
        <WordPop
          segments={HEADLINE_SEGMENTS}
          delay={0.1}
          className="script-heading mt-3 max-w-3xl text-4xl text-white sm:text-5xl md:text-6xl"
        />

        <div className="mt-14 grid gap-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.title}
              product={product}
              index={i}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shop teaser — merch promo hero band under the "Coming Soon" ribbon  */
/* ------------------------------------------------------------------ */

function ShopTeaser() {
  return (
    <section
      id="shop-preview"
      data-ocid="shop_teaser"
      className="relative flex min-h-[50vh] items-end overflow-hidden bg-cream py-14 sm:min-h-[65vh] md:min-h-[80vh] md:pb-14 md:pt-24 lg:min-h-[85vh]"
    >
      {/* The merch cut plays full-bleed behind the band */}
      <VideoBackdrop
        src={MERCH_TEASER_VIDEO}
        label="Avalon Ice merch promo"
        scrim="even"
      />

      {/* No ribbon here — the band leans on the merch footage itself, so the
          heron stays visible. The "Coming Soon" mark lives on /shop.
          w-full matters: the section is a flex container from md up, so
          without it this wrapper shrinks to fit and mx-auto re-centers the
          card instead of holding it to the left. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Copy and CTA ride a cream card so they stay legible over video */}
        <div className="ice-shadow max-w-md border-[4px] border-navy bg-cream-bright/95 px-5 py-6 text-center backdrop-blur-[2px] sm:px-7">
          <h3 className="text-block-navy text-2xl uppercase leading-tight sm:text-3xl">
            Shore Gear, Straight From the Ice House
          </h3>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-relaxed text-lagoon sm:text-base">
            Tees, hoodies, hats, and cooler gear stamped with the heron —
            alongside packaged and bulk ice, ready to order the moment the doors
            open.
          </p>
          <Button
            asChild
            size="lg"
            data-ocid="shop_teaser.visit_button"
            className="btn-brutal btn-brutal-ice mt-6 bg-navy px-7 py-6 font-body text-sm font-bold uppercase tracking-[0.1em] text-cream-bright hover:bg-navy"
          >
            <Link to="/shop">
              <ShoppingBag className="size-5" />
              Visit the Shop
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Network — interactive 3D NJ delivery map                            */
/* ------------------------------------------------------------------ */

function Network() {
  const mapRef = useRef<HTMLDivElement>(null);
  const nearMap = useNearViewport(mapRef);

  return (
    <section
      id="network"
      data-ocid="network"
      className="texture-paper bg-cream pb-16 pt-4 md:pb-24 md:pt-8"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="eyebrow inline-flex items-center gap-2">
          <MapPin className="size-4" />
          The Network
        </span>
        <h2 className="script-heading mt-3 text-4xl sm:text-5xl md:text-6xl">
          From Avalon to the whole shore.
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 font-body text-base leading-relaxed text-lagoon">
          <p>
            Based in Woodbine, Avalon Ice is built to serve the shore. Our
            routes connect Cape May County and surrounding South Jersey
            communities with reliable, locally produced ice — delivered
            directly to retailers, marinas, restaurants, bars, and businesses.
          </p>
          <p>
            Explore the map to see the communities we’re building our routes
            around.
          </p>
        </div>

      </div>

      {/* Full-bleed and unframed: the canvas breaks out of the text column
          and sits straight on the section background, so the region reads
          as a landmass on the page rather than a widget in a panel. */}
      <div ref={mapRef} className="mt-8 w-full">
        <ErrorBoundary label="the delivery map">
          <Suspense
            fallback={
              <div className="flex h-[500px] w-full flex-col items-center justify-center gap-3 md:h-[650px]">
                <Loader2 className="size-8 animate-spin text-lagoon" />
                <p className="font-body text-sm font-medium text-lagoon">
                  Charting the shore…
                </p>
              </div>
            }
          >
            {nearMap && <NJDeliveryMap />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <ShopTeaser />
      <Products />
      <ShowcaseVideo />
      <Network />
      <ContactSection />
    </>
  );
}
