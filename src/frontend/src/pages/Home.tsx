import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { InquiryType } from "@/lib/types";
import type {
  EventFormValues,
  GeneralFormValues,
  WholesaleFormValues,
} from "@/lib/types";
import {
  CalendarDays,
  Check,
  Mail,
  MapPin,
  Phone,
  Snowflake,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: `particle-${i}`,
  size: 6 + (i % 4) * 4,
  left: (i * 53) % 100,
  top: (i * 37) % 100,
  duration: 8 + (i % 6),
  delay: i * 0.4,
}));

function Hero() {
  return (
    <section
      id="top"
      data-ocid="hero"
      className="relative overflow-hidden bg-gradient-primary text-primary-foreground"
    >
      {/* Ambient ice particle drift */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute block rounded-full bg-primary-foreground/30"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `drift ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Badge
          variant="secondary"
          className="badge-vintage-accent mb-6"
          data-ocid="hero.badge"
        >
          Cape May County &amp; Beyond
        </Badge>

        <h1 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
          The Shore's <span className="font-script text-accent">Coldest</span>{" "}
          Delivery.
        </h1>

        <p className="mt-4 max-w-xl text-lg text-primary-foreground/85">
          Jersey Shore Ice Distribution · Same-Day Garden State Parkway Corridor
          Coverage
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            variant="secondary"
            data-ocid="hero.request_button"
          >
            <a href="#order">
              <Truck className="size-5" />
              Request Delivery / Quote
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            data-ocid="hero.call_button"
          >
            <a href="tel:8563089986">
              <Phone className="size-5" />
              Call Now: (856) 308-9986
            </a>
          </Button>
        </div>

        <div className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-3 text-sm">
          <Mail className="size-4" />
          <a
            href="mailto:Sales@AvalonIce.com?subject=Ice%20Delivery%20Request"
            data-ocid="hero.email"
            className="font-medium hover:underline"
          >
            Sales@AvalonIce.com
          </a>
          <span className="text-primary-foreground/60">|</span>
          <span>Cell: 856-308-9986</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                           */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    icon: Warehouse,
    title: "Commercial",
    description:
      "Restaurants, bars, markets and hospitality — reliable bagged and block ice delivered on your schedule.",
  },
  {
    icon: CalendarDays,
    title: "Event & Festival",
    description:
      "Concerts, festivals, weddings and shore gatherings with bulk ice, carving blocks and on-site planning.",
  },
  {
    icon: Zap,
    title: "Emergency",
    description:
      "Storm prep, power outages and urgent restock — fast same-day response along the GSP corridor.",
  },
  {
    icon: Snowflake,
    title: "Premium Bagged & Block",
    description:
      "Cubed 10lb/20lb, crushed, and 300lb carving/cocktail blocks for every need.",
  },
];

function Services() {
  return (
    <section
      id="services"
      data-ocid="services"
      className="bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="script-accent text-2xl">What we deliver</span>
          <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Ice for Every Shore Occasion
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Card
              key={s.title}
              data-ocid={`services.card.${i + 1}`}
              className="panel-offset clip-badge border-0"
            >
              <CardContent className="flex flex-col items-start gap-3 px-6 py-6">
                <span className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
                  <s.icon className="size-6" />
                </span>
                <h3 className="font-display text-lg text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Network map                                                        */
/* ------------------------------------------------------------------ */

const DELIVERY_POINTS = [
  { name: "Cape May", x: 62, y: 88 },
  { name: "Wildwood", x: 70, y: 78 },
  { name: "Stone Harbor", x: 76, y: 68 },
  { name: "Avalon", x: 80, y: 60 },
  { name: "Sea Isle City", x: 84, y: 52 },
  { name: "Ocean City", x: 88, y: 44 },
  { name: "Strathmere", x: 82, y: 56 },
  { name: "Marmora", x: 74, y: 58 },
  { name: "Dennisville", x: 66, y: 62 },
  { name: "North Jersey", x: 52, y: 12 },
];

const STATS = [
  { value: "1", label: "Origin HQ Hub (Woodbine/Avalon)" },
  { value: "11", label: "Delivery Hubs" },
  { value: "33+", label: "Towns Served" },
  { value: "Same-Day", label: "GSP Corridor Coverage" },
];

function NetworkMap() {
  const [active, setActive] = useState<string | null>("Avalon");

  return (
    <section
      id="network"
      data-ocid="network"
      className="bg-gradient-seafoam py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="script-accent text-2xl">Our delivery network</span>
          <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            The Shore, Covered
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            One origin hub in Woodbine/Avalon feeding 11 hubs and 33+ towns
            along the Garden State Parkway corridor.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Stylized map */}
          <div className="panel-offset clip-ticket border-0 p-4">
            <div className="relative">
              <svg
                viewBox="0 0 100 100"
                className="h-auto w-full"
                role="img"
                aria-label="Stylized map of the New Jersey shore delivery corridor"
              >
                {/* Landmass */}
                <path
                  d="M30 0 L95 0 L95 40 L90 55 L86 70 L80 82 L70 92 L60 100 L40 100 L35 88 L30 70 L28 50 L30 30 Z"
                  fill="oklch(0.985 0.008 85)"
                  stroke="oklch(0.26 0.06 245)"
                  strokeWidth="1.5"
                />
                {/* GSP corridor */}
                <path
                  d="M52 12 L66 62 L74 58 L80 60 L84 52 L88 44 L86 70 L80 82 L70 92"
                  fill="none"
                  stroke="oklch(0.8 0.05 200)"
                  strokeWidth="2.5"
                  strokeDasharray="3 2"
                />
                {/* HQ hub marker (visual only) */}
                <g>
                  <circle cx="74" cy="58" r="6" fill="oklch(0.78 0.16 85)" />
                  <circle
                    cx="74"
                    cy="58"
                    r="6"
                    fill="none"
                    stroke="oklch(0.78 0.16 85)"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                  <text
                    x="74"
                    y="50"
                    textAnchor="middle"
                    fontSize="4"
                    fill="oklch(0.26 0.06 245)"
                    fontWeight="700"
                  >
                    HQ
                  </text>
                </g>
                {/* Delivery point markers (visual only) */}
                {DELIVERY_POINTS.map((p) => (
                  <g key={p.name}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="2.4"
                      fill={
                        active === p.name
                          ? "oklch(0.78 0.16 85)"
                          : "oklch(0.26 0.06 245)"
                      }
                      stroke="oklch(0.985 0.008 85)"
                      strokeWidth="0.8"
                    />
                    <text
                      x={p.x}
                      y={p.y - 3}
                      textAnchor="middle"
                      fontSize="2.6"
                      fill="oklch(0.26 0.06 245)"
                    >
                      {p.name}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Interactive overlay buttons */}
              <button
                type="button"
                onClick={() => setActive("HQ Hub")}
                aria-label="HQ Hub at Woodbine/Avalon"
                aria-pressed={active === "HQ Hub"}
                data-ocid="network.hq"
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                style={{ left: "74%", top: "58%" }}
              />
              {DELIVERY_POINTS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setActive(p.name)}
                  aria-label={`${p.name} delivery point`}
                  aria-pressed={active === p.name}
                  data-ocid={`network.point.${p.name.toLowerCase().replace(/\s+/g, "_")}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                />
              ))}
            </div>
          </div>

          {/* Active node callout + stats */}
          <div className="flex flex-col gap-6">
            <div className="panel-offset clip-badge border-0 p-6">
              <div className="flex items-center gap-3">
                <MapPin className="size-6 text-primary" />
                <h3 className="font-display text-xl text-foreground">
                  {active === "HQ Hub" ? "HQ Hub — Woodbine/Avalon" : active}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {active === "HQ Hub"
                  ? "Our origin hub in Cape May County. Direct dispatch, same-day GSP corridor coverage."
                  : `${active} is served by our delivery network with same-day GSP corridor coverage.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  data-ocid={`network.stat.${i + 1}`}
                  className="rounded-lg border-2 border-primary bg-card p-4 text-center"
                >
                  <div className="font-display text-3xl text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Order / inquiry form                                               */
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
              className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm"
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
        className="flex items-center gap-2 text-sm"
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
      <Label>{label}</Label>
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
      className="w-full sm:w-auto"
    >
      {submitting ? "Submitting…" : "Submit Inquiry"}
    </Button>
  );
}

function OrderSection() {
  const [tab, setTab] = useState<ActiveTab>("general");
  const [result, setResult] = useState<{ referenceId: string } | null>(null);
  const submit = useSubmitInquiry();

  // Watch the shared mutation to surface the confirmation card.
  const handleResult = (ref: string) => setResult({ referenceId: ref });

  return (
    <section
      id="order"
      data-ocid="order"
      className="bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="script-accent text-2xl">Request delivery</span>
          <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Get a Quote or Schedule Delivery
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Choose the inquiry type that fits. We'll confirm dispatch receipt
            with a reference ID right away.
          </p>
        </div>

        <div className="mt-8 panel-offset clip-ticket border-0 p-6 sm:p-8">
          {result ? (
            <div
              data-ocid="order.success_state"
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                <Check className="size-7" />
              </span>
              <h3 className="font-display text-2xl text-foreground">
                Inquiry Received!
              </h3>
              <p className="text-muted-foreground">
                Your dispatch receipt reference ID is:
              </p>
              <div className="badge-vintage text-lg">{result.referenceId}</div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Our team will reach out shortly. For urgent needs, call{" "}
                <a href="tel:8563089986" className="text-primary underline">
                  (856) 308-9986
                </a>
                .
              </p>
              <Button
                variant="outline"
                data-ocid="order.new_button"
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
                <TabsList className="w-full">
                  <TabsTrigger
                    value="general"
                    data-ocid="order.tab.general"
                    className="flex-1"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="wholesale"
                    data-ocid="order.tab.wholesale"
                    className="flex-1"
                  >
                    Wholesale
                  </TabsTrigger>
                  <TabsTrigger
                    value="event"
                    data-ocid="order.tab.event"
                    className="flex-1"
                  >
                    Event
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {tab === "general" && <GeneralForm onSubmitted={handleResult} />}
              {tab === "wholesale" && (
                <WholesaleForm onSubmitted={handleResult} />
              )}
              {tab === "event" && <EventForm onSubmitted={handleResult} />}
            </>
          )}
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
      className="bg-gradient-primary py-16 text-primary-foreground md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <span className="script-accent text-2xl text-accent">
          Let's talk ice
        </span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Reach Avalon Ice
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
          Questions, quotes, or same-day delivery — we're ready when you are.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            variant="secondary"
            data-ocid="contact.call_button"
          >
            <a href="tel:8563089986">
              <Phone className="size-5" /> (856) 308-9986
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            data-ocid="contact.email_button"
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
      <Services />
      <NetworkMap />
      <OrderSection />
      <Contact />
    </>
  );
}
