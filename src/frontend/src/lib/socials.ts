import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa6";

export interface SocialLink {
  label: string;
  icon: IconType;
}

/**
 * Social placeholders. The brand accounts are not live yet, so these
 * carry no destination — they render as inert, labelled tiles until real
 * profile URLs exist.
 */
export const SOCIALS: SocialLink[] = [
  { label: "Instagram", icon: FaInstagram },
  { label: "Facebook", icon: FaFacebookF },
  { label: "TikTok", icon: FaTiktok },
  { label: "LinkedIn", icon: FaLinkedinIn },
];
