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
  href: string;
}

/** Placeholder social destinations until the brand accounts go live. */
export const SOCIALS: SocialLink[] = [
  { label: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { label: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
  { label: "TikTok", icon: FaTiktok, href: "https://tiktok.com" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
];
