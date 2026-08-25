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
import { InquiryType } from "@/lib/types";
import type {
  EventFormValues,
  GeneralFormValues,
  WholesaleFormValues,
} from "@/lib/types";
import { AlertTriangle, Check, Loader2, Mail, Phone, Truck } from "lucide-react";
import { useState } from "react";

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
      <SubmitButton submitting={submit.isPending} failed={submit.isError} />
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
      <SubmitButton submitting={submit.isPending} failed={submit.isError} />
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
        <Field label="Total Bags" error={errors.totalBags}>
          <Input
            data-ocid="order.event.bags"
            value={values.totalBags}
            onChange={(e) => set("totalBags", e.target.value)}
            placeholder="e.g. 60 bags"
          />
        </Field>
        <Field label="Bag Type" error={errors.iceType}>
          <Select
            value={values.iceType}
            onValueChange={(v) => set("iceType", v)}
          >
            <SelectTrigger data-ocid="order.event.ice_type" className="w-full">
              <SelectValue placeholder="Select bag type" />
            </SelectTrigger>
            <SelectContent>
              {/* Single launch product: standard 7 lb bags. */}
              <SelectItem value="7 lb">7 lb</SelectItem>
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
      <SubmitButton submitting={submit.isPending} failed={submit.isError} />
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

function SubmitButton({
  submitting,
  failed,
}: {
  submitting: boolean;
  failed?: boolean;
}) {
  return (
    <div className="mt-2 flex flex-col gap-3">
      {/* A dropped submit must never fail silently — this is the site's
          primary conversion path, so surface it with a way to recover. */}
      {failed && (
        <div
          role="alert"
          data-ocid="order.submit_error"
          className="flex items-start gap-2.5 rounded-xl border-[3px] border-destructive/70 bg-destructive/10 px-4 py-3 font-body text-sm text-navy"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <span>
            We couldn't send that just now — your details are still here, so
            press submit to try again. If it keeps failing, call{" "}
            <a
              href="tel:8563089986"
              className="font-bold text-navy underline underline-offset-2"
            >
              (856) 308-9986
            </a>{" "}
            or email{" "}
            <a
              href="mailto:Sales@AvalonIce.co"
              className="font-bold text-navy underline underline-offset-2"
            >
              Sales@AvalonIce.co
            </a>
            .
          </span>
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        data-ocid="order.submit_button"
        className="btn-brutal btn-brutal-ice min-h-12 w-full bg-navy py-6 font-body text-base font-bold uppercase tracking-wide text-cream-bright hover:bg-navy sm:w-auto"
      >
        {submitting ? "Submitting…" : failed ? "Try Again" : "Submit Inquiry"}
      </Button>
    </div>
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
            Choose the inquiry type that fits and we'll confirm receipt with a
            reference ID right away.
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
                  Your dispatch reference ID is:
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
                      className="min-h-12 flex-1 font-body font-bold uppercase tracking-wide data-[state=active]:bg-navy data-[state=active]:text-cream-bright"
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="wholesale"
                      data-ocid="order.tab.wholesale"
                      className="min-h-12 flex-1 font-body font-bold uppercase tracking-wide data-[state=active]:bg-navy data-[state=active]:text-cream-bright"
                    >
                      Wholesale
                    </TabsTrigger>
                    <TabsTrigger
                      value="event"
                      data-ocid="order.tab.event"
                      className="min-h-12 flex-1 font-body font-bold uppercase tracking-wide data-[state=active]:bg-navy data-[state=active]:text-cream-bright"
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
            <a href="mailto:Sales@AvalonIce.co?subject=Ice%20Delivery%20Inquiry">
              <Mail className="size-5" /> Sales@AvalonIce.co
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

/**
 * The inquiry form plus the contact band, as they sit at the foot of the
 * homepage. Every public page ends with this so a visitor can submit from
 * wherever they happen to be; the admin panel deliberately does not.
 */
export default function ContactSection() {
  return (
    <>
      <OrderSection />
      <Contact />
    </>
  );
}
