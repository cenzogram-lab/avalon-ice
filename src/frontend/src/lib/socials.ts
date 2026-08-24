import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from "@/components/BrandIcons";
import type { ComponentType, SVGProps } from "react";

export interface SocialLink {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Social placeholders. The brand accounts are not live yet, so these
 * carry no destination — they render as inert, labelled tiles until real
 * profile URLs exist.
 */
export const SOCIALS: SocialLink[] = [
  { label: "Instagram", icon: InstagramIcon },
  { label: "Facebook", icon: FacebookIcon },
  { label: "TikTok", icon: TikTokIcon },
  { label: "LinkedIn", icon: LinkedInIcon },
];
