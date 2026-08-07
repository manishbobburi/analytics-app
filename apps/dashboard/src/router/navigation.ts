import { Activity, KeyRound, LayoutDashboard, Settings } from 'lucide-react';

export const navigation = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Events',
    url: '/events',
    icon: Activity,
  },
  {
    title: 'Write Keys',
    url: '/write-keys',
    icon: KeyRound,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
] as const;
