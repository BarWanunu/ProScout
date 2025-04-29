// Constants for Landing Page

import { UserIcon, UsersIcon, EyeIcon } from "lucide-react";
import "../features/auth/styles/LandingPage.css" 

export const ROLES = [
  {
    id: "player",
    title: "Connect as Player",
    description:
      "Showcase your skills, connect with teams, and take your career to the next level.",
    icon: UserIcon,
    colorClass: "icon--player",       
  },
  {
    id: "team",
    title: "Connect as Team",
    description:
      "Find the perfect talent for your roster and manage your team's recruitment process.",
    icon: UsersIcon,
    colorClass: "icon--team",
  },
  {
    id: "scout",
    title: "Connect as Scout",
    description:
      "Discover emerging talent, share your insights, and help shape the future of the sport.",
    icon: EyeIcon,
    colorClass: "icon--scout",
  },
];
