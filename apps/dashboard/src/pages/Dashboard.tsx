import { Overview } from '@/features/analytics/components/Overview';
import { EventTrend } from '@/features/analytics/components/EventTrend';
import { TopPages } from '@/features/analytics/components/TopPages';
import { TopEvents } from '@/features/analytics/components/TopEvents';
import { Breakdown } from '@/features/analytics/components/Breakdown';

export function Dashboard() {
  return (
    <div className="flex-col space-y-6">
      <Overview />
      <EventTrend />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <TopPages />
        <TopEvents />
        <Breakdown />
      </div>
    </div>
  );
}
