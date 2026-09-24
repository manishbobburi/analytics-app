import { Activity, KeyRound, LayoutDashboard } from 'lucide-react';

export const navigation = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    header: {
      dateFilter: true,
      writeKeyButton: false,
      eventExportButton: false,
    },
  },
  {
    title: 'Events',
    url: '/events',
    icon: Activity,
    header: {
      dateFilter: false,
      writeKeyButton: false,
      eventExportButton: true,
    },
  },
  {
    title: 'Write Keys',
    url: '/write-keys',
    icon: KeyRound,
    header: {
      dateFilter: false,
      writeKeyButton: true,
      eventExportButton: false,
    },
  },
] as const;
