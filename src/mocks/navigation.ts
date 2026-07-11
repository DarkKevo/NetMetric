export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: "speed", label: "DASHBOARD", href: "#", active: true },
  { icon: "history", label: "HISTORY", href: "#", active: false },
  { icon: "hub", label: "SERVERS", href: "#", active: false },
  { icon: "settings", label: "SETTINGS", href: "#", active: false },
];
