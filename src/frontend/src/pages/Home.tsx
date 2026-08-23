import BrandVideo from "@/components/home/BrandVideo";
import FrostOverlay from "@/components/home/FrostOverlay";
import IceFrame from "@/components/home/IceFrame";
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
import { HERO_VIDEO, LOOP_VIDEO } from "@/lib/media";
import { InquiryType } from "@/lib/types";
import type {
  EventFormValues,
  GeneralFormValues,
  WholesaleFormValues,
} from "@/lib/types";
import {
  Check,
  Loader2,
  Mail,
  MapPin,
  Phone,
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
import { Suspense, lazy, useId, useRef, useState } from "react";

const NJDeliveryMap = lazy(() => import("@/components/home/NJDeliveryMap"));

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="top"
      data-ocid="hero"
      className="relative overflow-hidden bg-gradient-to-b from-cream-bright via-cream to-ice-light md:flex md:min-h-[85vh] md:items-center"
    >
      {/* md+: full-bleed cover video behind the content. On phones the video
          instead renders inline below the CTAs at its native aspect ratio,
          so it scales with the viewport with no cropping or letterboxing. */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <BrandVideo
          src={HERO_VIDEO}
          label="Avalon Ice brand animation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Legibility scrim + fade into the next cream section */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream" />
      </div>

      {/* Ambient frost / ice-particle drift */}
      <FrostOverlay />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-32">
        <span className="chip chip-solid mb-6" data-ocid="hero.badge">
          <MapPin className="size-3.5" />
          Avalon, N.J. · Cape May County
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
            href="mailto:Sales@AvalonIce.com?subject=Ice%20Delivery%20Request"
            data-ocid="hero.email"
            className="font-script text-lg text-lagoon hover:underline"
          >
            Sales@AvalonIce.com
          </a>
          <span className="text-ice-deep">|</span>
          <span>Cell: 856-308-9986</span>
        </div>

        {/* Mobile: inline hero video at native aspect ratio */}
        <div className="mt-9 md:hidden">
          <div className="overflow-hidden rounded-2xl border-[3px] border-navy shadow-[0_6px_0_#A3CCD1]">
            <div className="aspect-video w-full bg-gradient-ice-card">
              <BrandVideo
                src={HERO_VIDEO}
                label="Avalon Ice brand animation"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Secondary showcase video — delivery & route                         */
/* ------------------------------------------------------------------ */

function TruckSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 92"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {/* Box body with livery */}
      <rect
        x="4"
        y="8"
        width="112"
        height="58"
        rx="6"
        fill="#FDFCF8"
        stroke="#0C3552"
        strokeWidth="4"
      />
      <text
        x="60"
        y="34"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="17"
        fill="#0C3552"
      >
        AVALON
      </text>
      <rect x="30" y="41" width="60" height="4" rx="2" fill="#8CBEC5" />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="14"
        fill="#0C3552"
      >
        ICE
      </text>
      {/* Cab */}
      <path
        d="M116 26h34a8 8 0 0 1 6.6 3.5l14 20a8 8 0 0 1 1.4 4.5v4a8 8 0 0 1-8 8h-48V26Z"
        fill="#0C3552"
      />
      <rect x="122" y="32" width="22" height="15" rx="3" fill="#A3CCD1" />
      {/* Wheels */}
      {[34, 86, 146].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="72" r="13" fill="#061F33" />
          <circle cx={cx} cy="72" r="5.5" fill="#F7F2EA" />
        </g>
      ))}
    </svg>
  );
}

/** Waving egret mascot behind a looping parade of delivery trucks. */
function MascotParade() {
  return (
    <div
      className="relative mt-12 h-52 overflow-hidden sm:h-64"
      aria-hidden="true"
    >
      {/* Mascot in the background, gently waving */}
      <div className="absolute bottom-9 left-1/2 z-0 -translate-x-1/2 sm:bottom-10">
        <img
          src="/assets/images/avalon-egret.webp"
          alt=""
          className="animate-mascot-wave h-36 w-auto mix-blend-multiply sm:h-48"
        />
      </div>

      {/* Roadway */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-10 border-t-[3px] border-navy bg-navy sm:h-11">
        <div className="road-stripes absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 opacity-70" />
      </div>

      {/* Trucks drive in front of the mascot */}
      <div
        className="animate-truck-drive absolute bottom-7 left-0 z-20 w-36 sm:w-44"
        style={{ "--truck-duration": "17s" } as React.CSSProperties}
      >
        <TruckSVG className="h-auto w-full drop-shadow-[0_4px_0_rgba(6,31,51,0.25)]" />
      </div>
      <div
        className="animate-truck-drive absolute bottom-7 left-0 z-20 w-28 sm:w-32"
        style={
          {
            "--truck-duration": "26s",
            "--truck-delay": "-14s",
          } as React.CSSProperties
        }
      >
        <TruckSVG className="h-auto w-full drop-shadow-[0_4px_0_rgba(6,31,51,0.25)]" />
      </div>
    </div>
  );
}

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

        <MascotParade />
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
    title: "Commercial Ice Delivery",
    description:
      "Standing orders and on-demand drops kept cold on arrival, every route, every run.",
    chips: [{ label: "Restaurants" }, { label: "Bars" }, { label: "Marinas" }],
    clip: "a",
  },
  {
    title: "Event & Festival Bulk Supply",
    description:
      "Pallet-scale bagged and block ice, scheduled to your run-of-show and restocked on cue.",
    chips: [{ label: "Festivals" }, { label: "Weddings" }, { label: "Venues" }],
    clip: "b",
  },
  {
    title: "Emergency & Same-Day Shore Run",
    description:
      "Freezer down? Crowd surge? Same-day shore runs across Cape May County and up the coast.",
    chips: [{ label: "Same-Day", solid: true }, { label: "7 Days a Week" }],
    clip: "c",
  },
  {
    title: "Premium Bagged & Block Ice",
    description:
      "Crystal-clear cubes, crushed, and block ice — cleanly bagged and consistently sized.",
    chips: [{ label: "Cubed" }, { label: "Crushed" }, { label: "Block" }],
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
  // Meltwater appears once the cube has settled into place.
  const settle = useTransform(
    progress,
    [end - 0.03, Math.min(end + 0.14, 1)],
    [0, 1],
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
        className={`absolute -top-9 z-0 ${index % 2 === 0 ? "-right-3" : "-left-3"} ${CUBE_SIZES[index]}`}
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
          {/* Meltwater drips once the cube comes to rest */}
          <motion.div
            style={reduceMotion ? undefined : { opacity: settle }}
            className="pointer-events-none"
          >
            <span
              className="ice-drip -bottom-1 left-[30%]"
              style={
                {
                  "--drip-delay": `${index * 0.7}s`,
                } as React.CSSProperties
              }
            />
            <span
              className="ice-drip -bottom-2 left-[64%]"
              style={
                {
                  "--drip-delay": `${1.6 + index * 0.5}s`,
                  "--drip-duration": "3.9s",
                } as React.CSSProperties
              }
            />
          </motion.div>
        </div>

        {/* Melt puddle spreading beneath the settled cube */}
        <div className="absolute -bottom-2 left-1/2 w-[92%] -translate-x-1/2">
          <motion.div
            style={
              reduceMotion ? undefined : { opacity: settle, scaleX: settle }
            }
          >
            <div className="ice-puddle w-full" />
          </motion.div>
        </div>
      </motion.div>

      <IceFrame
        clip={product.clip}
        cracks
        className="relative z-10 h-full"
        innerClassName="flex h-full flex-col gap-3 p-6 pb-7"
      >
        {/* Slow light sweep across the wet card face */}
        <span
          className="ice-sheen"
          style={{ "--sheen-delay": `${index * 1.4}s` } as React.CSSProperties}
          aria-hidden="true"
        />
        <h3 className="text-block-navy text-lg leading-snug sm:text-xl">
          {product.title}
        </h3>
        <p className="font-body text-sm leading-relaxed text-lagoon">
          {product.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {product.chips.map((chip) => (
            <span
              key={chip.label}
              className={chip.solid ? "chip chip-solid" : "chip"}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </IceFrame>
    </motion.div>
  );
}

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
      className="texture-paper overflow-x-clip bg-cream py-16 md:py-24"
    >
      {/* Drifting background ice, behind the cards */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        aria-hidden="true"
      >
        <motion.div
          style={reduceMotion ? undefined : { y: bgY1, rotate: bgRot1 }}
          className="absolute left-[3%] top-28 w-12 opacity-50"
        >
          <IceCubeSVG className="h-auto w-full" />
        </motion.div>
        <motion.div
          style={reduceMotion ? undefined : { y: bgY2, rotate: bgRot2 }}
          className="absolute right-[3%] top-1/2 w-10 opacity-40"
        >
          <IceCubeSVG className="h-auto w-full" />
        </motion.div>
        <motion.div
          style={reduceMotion ? undefined : { y: bgY3, rotate: bgRot1 }}
          className="absolute bottom-8 left-[9%] w-14 opacity-45"
        >
          <IceCubeSVG className="h-auto w-full" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="eyebrow inline-flex items-center gap-2">
          <Snowflake className="size-4" />
          What We'll Be Running
        </span>
        <h2 className="script-heading mt-3 max-w-2xl text-4xl sm:text-5xl md:text-6xl">
          Cold for every cooler on the coast.
        </h2>

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
/* Network — interactive 3D NJ delivery map                            */
/* ------------------------------------------------------------------ */

function Network() {
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
        <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-lagoon">
          Every route starts at our Woodbine HQ and runs up the Garden State
          Parkway — supplying marinas, bars, festivals, and venues from Cape May
          County to North Jersey. Orbit the state, watch the Avalon Ice trucks
          make their runs, and pick a town from the list (or tap its dot) to
          drop a pin on it.
        </p>

        <div className="mt-10">
          <IceFrame
            clip="b"
            fill="cream"
            shadow="ice"
            innerClassName="p-1.5 sm:p-2"
          >
            <Suspense
              fallback={
                <div className="flex h-[30rem] w-full flex-col items-center justify-center gap-3 sm:h-[34rem]">
                  <Loader2 className="size-8 animate-spin text-lagoon" />
                  <p className="font-body text-sm font-medium text-lagoon">
                    Charting the shore…
                  </p>
                </div>
              }
            >
              <NJDeliveryMap />
            </Suspense>
          </IceFrame>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Order / inquiry engine — 3 modes                                    */
/* ------------------------------------------------------------------ */

type ActiveTab = "general" | "wholesale" | "event";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function emailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function phoneValid(phone: string) {
  return /^[+]?[\d\s().-]{7,}$/.test(phone);
}

function GeneralForm({ onSubmitted }: { onSubmitted: (ref: string) => void }) {
  const [values, setValues] = useState<GeneralFormValues>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<GeneralFormValues>>({});
  const submit = useSubmitInquiry();

  const set = (k: keyof GeneralFormValues, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<GeneralFormValues> = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!phoneValid(values.phone)) next.phone = "Enter a valid phone number.";
    if (!emailValid(values.email)) next.email = "Enter a valid email address.";
    if (!values.message.trim()) next.message = "Please enter a message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    submit.mutate(
      { type: InquiryType.General, values },
      { onSuccess: (res) => onSubmitted(res.referenceId) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name}>
          <Input
            data-ocid="order.general.name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Phone Number" error={errors.phone}>
          <Input
            data-ocid="order.general.phone"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(856) 555-0123"
          />
        </Field>
      </div>
      <Field label="Email Address" error={errors.email}>
        <Input
          data-ocid="order.general.email"
          type="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Message" error={errors.message}>
        <Textarea
          data-ocid="order.general.message"
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you need…"
        />
      </Field>
      <SubmitButton submitting={submit.isPending} />
    </form>
  );
}

function WholesaleForm({
  onSubmitted,
}: { onSubmitted: (ref: string) => void }) {
  type WholesaleErrors = Partial<Record<keyof WholesaleFormValues, string>>;
  const [values, setValues] = useState<WholesaleFormValues>({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    estimatedWeeklyUsage: "",
    street: "",
    city: "",
    zip: "",
    desiredDeliveryDays: [],
    deliveryFrequency: "",
  });
  const [errors, setErrors] = useState<WholesaleErrors>({});
  const submit = useSubmitInquiry();

  const set = (k: keyof WholesaleFormValues, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));

  const toggleDay = (day: string) =>
    setValues((s) => ({
      ...s,
      desiredDeliveryDays: s.desiredDeliveryDays.includes(day)
        ? s.desiredDeliveryDays.filter((d) => d !== day)
        : [...s.desiredDeliveryDays, day],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: WholesaleErrors = {};
    if (!values.businessName.trim()) next.businessName = "Required.";
    if (!values.contactPerson.trim()) next.contactPerson = "Required.";
    if (!phoneValid(values.phone)) next.phone = "Enter a valid phone number.";
    if (!emailValid(values.email)) next.email = "Enter a valid email address.";
    if (!values.street.trim()) next.street = "Required.";
    if (!values.city.trim()) next.city = "Required.";
    if (!values.zip.trim()) next.zip = "Required.";
    if (values.desiredDeliveryDays.length === 0)
      next.desiredDeliveryDays = "Select at least one day.";
    if (!values.deliveryFrequency) next.deliveryFrequency = "Required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    submit.mutate(
      { type: InquiryType.Wholesale, values },
      { onSuccess: (res) => onSubmitted(res.referenceId) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business Name" error={errors.businessName}>
          <Input
            data-ocid="order.wholesale.business"
            value={values.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            placeholder="Shoreline Restaurant Group"
          />
        </Field>
        <Field label="Contact Person" error={errors.contactPerson}>
          <Input
            data-ocid="order.wholesale.contact"
            value={values.contactPerson}
            onChange={(e) => set("contactPerson", e.target.value)}
            placeholder="Jane Doe"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <Input
            data-ocid="order.wholesale.phone"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(856) 555-0123"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            data-ocid="order.wholesale.email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
      </div>
      <Field
        label="Estimated Weekly Ice Usage"
        error={errors.estimatedWeeklyUsage}
      >
        <Input
          data-ocid="order.wholesale.usage"
          value={values.estimatedWeeklyUsage}
          onChange={(e) => set("estimatedWeeklyUsage", e.target.value)}
          placeholder="e.g. 40 bags / week"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Street" error={errors.street}>
          <Input
            data-ocid="order.wholesale.street"
            value={values.street}
            onChange={(e) => set("street", e.target.value)}
            placeholder="123 Ocean Ave"
          />
        </Field>
        <Field label="City" error={errors.city}>
          <Input
            data-ocid="order.wholesale.city"
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Avalon"
          />
        </Field>
        <Field label="Zip" error={errors.zip}>
          <Input
            data-ocid="order.wholesale.zip"
            value={values.zip}
            onChange={(e) => set("zip", e.target.value)}
            placeholder="08202"
          />
        </Field>
      </div>
      <Field label="Desired Delivery Days" error={errors.desiredDeliveryDays}>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <label
              key={day}
              htmlFor={`wholesale-day-${day.toLowerCase()}`}
              className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-navy/60 bg-cream-bright px-3 py-2 font-body text-sm font-medium text-navy"
            >
              <Checkbox
                id={`wholesale-day-${day.toLowerCase()}`}
                data-ocid={`order.wholesale.day.${day.toLowerCase()}`}
                checked={values.desiredDeliveryDays.includes(day)}
                onCheckedChange={() => toggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Delivery Frequency" error={errors.deliveryFrequency}>
        <Select
          value={values.deliveryFrequency}
          onValueChange={(v) => set("deliveryFrequency", v)}
        >
          <SelectTrigger
            data-ocid="order.wholesale.frequency"
            className="w-full"
          >
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="3x/Week">3x / Week</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="On-Demand">On-Demand</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <SubmitButton submitting={submit.isPending} />
    </form>
  );
}

function EventForm({ onSubmitted }: { onSubmitted: (ref: string) => void }) {
  const [values, setValues] = useState<EventFormValues>({
    hostName: "",
    contactPerson: "",
    phone: "",
    email: "",
    eventDate: "",
    deliveryTimeWindow: "",
    venueName: "",
    venueAddress: "",
    totalBags: "",
    iceType: "",
    onSiteFreezer: false,
  });
  const [errors, setErrors] = useState<Partial<EventFormValues>>({});
  const submit = useSubmitInquiry();

  const set = (k: keyof EventFormValues, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<EventFormValues> = {};
    if (!values.hostName.trim()) next.hostName = "Required.";
    if (!values.contactPerson.trim()) next.contactPerson = "Required.";
    if (!phoneValid(values.phone)) next.phone = "Enter a valid phone number.";
    if (!emailValid(values.email)) next.email = "Enter a valid email address.";
    if (!values.eventDate) next.eventDate = "Required.";
    if (!values.venueName.trim()) next.venueName = "Required.";
    if (!values.totalBags.trim()) next.totalBags = "Required.";
    if (!values.iceType) next.iceType = "Required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    submit.mutate(
      { type: InquiryType.Event, values },
      { onSuccess: (res) => onSubmitted(res.referenceId) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Host / Organization Name" error={errors.hostName}>
          <Input
            data-ocid="order.event.host"
            value={values.hostName}
            onChange={(e) => set("hostName", e.target.value)}
            placeholder="Avalon Beach Festival"
          />
        </Field>
        <Field label="Contact Person" error={errors.contactPerson}>
          <Input
            data-ocid="order.event.contact"
            value={values.contactPerson}
            onChange={(e) => set("contactPerson", e.target.value)}
            placeholder="Jane Doe"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <Input
            data-ocid="order.event.phone"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(856) 555-0123"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            data-ocid="order.event.email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Event Date" error={errors.eventDate}>
          <Input
            data-ocid="order.event.date"
            type="date"
            value={values.eventDate}
            onChange={(e) => set("eventDate", e.target.value)}
          />
        </Field>
        <Field label="Delivery Time Window" error={errors.deliveryTimeWindow}>
          <Input
            data-ocid="order.event.window"
            value={values.deliveryTimeWindow}
            onChange={(e) => set("deliveryTimeWindow", e.target.value)}
            placeholder="e.g. 8:00 AM – 10:00 AM"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Venue Name" error={errors.venueName}>
          <Input
            data-ocid="order.event.venue"
            value={values.venueName}
            onChange={(e) => set("venueName", e.target.value)}
            placeholder="Avalon Community Hall"
          />
        </Field>
        <Field label="Venue Address" error={errors.venueAddress}>
          <Input
            data-ocid="order.event.venue_address"
            value={values.venueAddress}
            onChange={(e) => set("venueAddress", e.target.value)}
            placeholder="235 21st St, Avalon, NJ"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Total Bags / Ice Type" error={errors.totalBags}>
          <Input
            data-ocid="order.event.bags"
            value={values.totalBags}
            onChange={(e) => set("totalBags", e.target.value)}
            placeholder="e.g. 60 bags"
          />
        </Field>
        <Field label="Ice Type" error={errors.iceType}>
          <Select
            value={values.iceType}
            onValueChange={(v) => set("iceType", v)}
          >
            <SelectTrigger data-ocid="order.event.ice_type" className="w-full">
              <SelectValue placeholder="Select ice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cubed 10lb">Cubed 10lb</SelectItem>
              <SelectItem value="Cubed 20lb">Cubed 20lb</SelectItem>
              <SelectItem value="Crushed">Crushed</SelectItem>
              <SelectItem value="300lb Carving/Cocktail Block">
                300lb Carving / Cocktail Block
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <label
        htmlFor="order-event-freezer"
        className="flex items-center gap-2 font-body text-sm text-navy"
      >
        <Checkbox
          id="order-event-freezer"
          data-ocid="order.event.freezer"
          checked={values.onSiteFreezer}
          onCheckedChange={(c) =>
            setValues((s) => ({ ...s, onSiteFreezer: c === true }))
          }
        />
        On-site freezer required
      </label>
      <SubmitButton submitting={submit.isPending} />
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="font-body font-semibold text-navy">{label}</Label>
      {children}
      {error && (
        <p data-ocid="order.error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ submitting }: { submitting: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={submitting}
      data-ocid="order.submit_button"
      className="btn-brutal btn-brutal-ice mt-2 w-full bg-navy py-6 font-body text-base font-bold uppercase tracking-wide text-cream-bright hover:bg-navy sm:w-auto"
    >
      {submitting ? "Submitting…" : "Submit Inquiry"}
    </Button>
  );
}

function OrderSection() {
  const [tab, setTab] = useState<ActiveTab>("general");
  const [result, setResult] = useState<{ referenceId: string } | null>(null);
  const submit = useSubmitInquiry();

  const handleResult = (ref: string) => setResult({ referenceId: ref });

  return (
    <section
      id="order-form"
      data-ocid="order"
      className="texture-paper bg-cream py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="eyebrow inline-flex items-center gap-2">
            <Truck className="size-4" />
            Request Delivery
          </span>
          <h2 className="script-heading mt-3 text-4xl sm:text-5xl">
            Get a quote or schedule a drop.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-lagoon">
            Choose the inquiry type that fits. We'll confirm dispatch receipt
            with a reference ID right away.
          </p>
        </div>

        <div className="mt-10">
          <IceFrame
            clip="b"
            fill="cream"
            shadow="ice"
            innerClassName="p-6 sm:p-9"
          >
            {result ? (
              <div
                data-ocid="order.success_state"
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <span className="flex size-14 items-center justify-center rounded-full border-[3px] border-navy bg-ice-light text-navy shadow-[0_4px_0_#A3CCD1]">
                  <Check className="size-7" />
                </span>
                <h3 className="script-heading text-3xl">Inquiry received!</h3>
                <p className="font-body text-lagoon">
                  Your dispatch receipt reference ID is:
                </p>
                <div className="badge-vintage font-body text-lg">
                  {result.referenceId}
                </div>
                <p className="max-w-sm font-body text-sm text-lagoon">
                  Our team will reach out shortly. For urgent needs, call{" "}
                  <a
                    href="tel:8563089986"
                    className="font-bold text-navy underline"
                  >
                    (856) 308-9986
                  </a>
                  .
                </p>
                <Button
                  variant="outline"
                  data-ocid="order.new_button"
                  className="btn-brutal bg-cream-bright font-body font-bold uppercase tracking-wide text-navy"
                  onClick={() => {
                    setResult(null);
                    submit.reset();
                  }}
                >
                  Submit another inquiry
                </Button>
              </div>
            ) : (
              <>
                <Tabs
                  value={tab}
                  onValueChange={(v) => setTab(v as ActiveTab)}
                  className="mb-6"
                >
                  <TabsList className="w-full border-2 border-navy bg-ice-mist">
                    <TabsTrigger
                      value="general"
                      data-ocid="order.tab.general"
                      className="flex-1 font-body font-bold uppercase tracking-wide data-[state=active]:bg-navy data-[state=active]:text-cream-bright"
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="wholesale"
                      data-ocid="order.tab.wholesale"
                      className="flex-1 font-body font-bold uppercase tracking-wide data-[state=active]:bg-navy data-[state=active]:text-cream-bright"
                    >
                      Wholesale
                    </TabsTrigger>
                    <TabsTrigger
                      value="event"
                      data-ocid="order.tab.event"
                      className="flex-1 font-body font-bold uppercase tracking-wide data-[state=active]:bg-navy data-[state=active]:text-cream-bright"
                    >
                      Event
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {tab === "general" && (
                  <GeneralForm onSubmitted={handleResult} />
                )}
                {tab === "wholesale" && (
                  <WholesaleForm onSubmitted={handleResult} />
                )}
                {tab === "event" && <EventForm onSubmitted={handleResult} />}
              </>
            )}
          </IceFrame>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                            */
/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section
      id="contact"
      data-ocid="contact"
      className="bg-gradient-primary py-16 text-cream-bright md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <span className="font-script text-3xl text-ice">Let's talk ice</span>
        <h2 className="text-block-ice mt-3 text-3xl sm:text-4xl md:text-5xl">
          Reach Avalon Ice
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-cream/85">
          Questions, quotes, or same-day delivery — we're ready when you are.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            data-ocid="contact.call_button"
            className="btn-brutal btn-brutal-ice bg-cream-bright px-7 py-6 font-body text-base font-bold uppercase tracking-wide text-navy hover:bg-ice-frost"
          >
            <a href="tel:8563089986">
              <Phone className="size-5" /> (856) 308-9986
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            data-ocid="contact.email_button"
            className="btn-brutal btn-brutal-ice bg-transparent px-7 py-6 font-body text-base font-bold uppercase tracking-wide text-cream-bright hover:bg-navy-deep"
          >
            <a href="mailto:Sales@AvalonIce.com?subject=Ice%20Delivery%20Inquiry">
              <Mail className="size-5" /> Sales@AvalonIce.com
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Hero />
      <ShowcaseVideo />
      <Products />
      <Network />
      <OrderSection />
      <Contact />
    </>
  );
}
