import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

/**
 * Seamless looping brand video: autoplay, muted, no controls or download
 * UI, eagerly preloaded, and faded in only once the first frame can paint
 * so there is never a loading flash or black poster artifact.
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
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      controlsList="nodownload noplaybackrate noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      onCanPlay={() => {
        setReady(true);
        // Some browsers pause autoplay videos restored from bfcache.
        ref.current?.play().catch(() => {});
      }}
      src={src}
      aria-label={label}
      className={cn(
        "pointer-events-none transition-opacity duration-700 ease-out",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
