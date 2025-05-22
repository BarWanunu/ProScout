// Constants for Landing Page

import { UserIcon, UsersIcon, EyeIcon } from "lucide-react";
import "../features/auth/styles/LandingPage.css" 

// This file contains the constants for the landing page, including the roles and their properties.
// Each role has an id, title, description, icon, and a color class for styling.
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


export const ROLE_META = {
  player: {
    id: "player",
    label: "Player",
    icon: UserIcon,
    color: "blue",
    accent: "#2563eb",
    description: "Join as a player to showcase your skills", 
  },
  team: {
    id: "team",
    label: "Team",
    icon: UsersIcon,
    color: "green",
    accent: "#059669",
    description: "Join as a team to find talented players",
  },
  scout: {
    id: "scout",
    label: "Scout",
    icon: EyeIcon,
    color: "purple",
    accent: "#7c3aed",
    description: "Join as a scout to discover new talent",
  },
};
