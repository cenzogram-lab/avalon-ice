import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type State = "loading" | "playing" | "failed";

/**
 * Seamless looping brand video: autoplay, muted, no controls or download
 * UI, eagerly preloaded, and faded in only once the first frame can paint
 * so there is never a loading flash or black poster artifact.
 *
 * Every caller renders this over a branded gradient, which is what shows
 * through while the video is loading — and permanently if it fails. A
 * failure is logged loudly and recorded on `data-video-state`, so a dead
 * URL or CDN outage is diagnosable instead of being an invisible element
 * stuck at opacity 0.
 *
 * Mobile autoplay is fussy and worth spelling out. React assigns `muted`
 * as a DOM *property*, and the attribute is what iOS Safari inspects when
 * it decides whether an autoplay is allowed — so the property is forced on
 * the element before play is attempted. Without that, WebKit blocks the
 * autoplay and paints its big start-playback button over the video, which
 * is exactly the play badge that must never appear on an ambient backdrop.
 */
export default function BrandVideo({
  src,
  className,
  label,
}: {
  src: string;
  className?: string;
  label?: string;
}) {
  const [state, setState] = useState<State>("loading");
  const ref = useRef<HTMLVideoElement>(null);

  // Belt and braces for mobile WebKit/Blink: force muted before any play
  // attempt, and keep trying quietly if the browser deferred the start.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.play().catch(() => {});
  }, []);

  const handleError = () => {
    const err = ref.current?.error;
    console.warn(
      `Avalon Ice: brand video failed to load — falling back to the branded gradient.\n  src: ${src}\n  reason: ${
        err ? `${err.code} ${err.message || ""}`.trim() : "unknown"
      }\n  Check that the file exists at that URL and is reachable.`,
    );
    setState("failed");
  };

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      preload="auto"
      poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
      disablePictureInPicture
      disableRemotePlayback
      // Older WebKit and the Android/X5 engines read these attribute
      // spellings rather than the standard `playsinline`.
      {...{
        "webkit-playsinline": "true",
        "x5-playsinline": "true",
        "x5-video-player-type": "h5",
      }}
      onCanPlay={() => {
        setState("playing");
        // Some browsers pause autoplay videos restored from bfcache.
        ref.current?.play().catch(() => {});
      }}
      onError={handleError}
      onStalled={handleError}
      src={src}
      aria-label={label}
      data-video-state={state}
      data-ocid="brand_video"
      className={cn(
        "brand-video pointer-events-none transition-opacity duration-700 ease-out",
        state === "playing" ? "opacity-100" : "opacity-0",
        // A failed video must not sit on top of the gradient it fell back to.
        state === "failed" && "hidden",
        className,
      )}
    />
  );
}
