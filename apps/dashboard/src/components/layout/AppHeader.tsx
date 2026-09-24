import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { navigation } from '@/router/navigation';
import { DateRangeSelector } from '@/features/analytics/components/DateRangeSelector';

import { Button } from '@/components/ui/button';
import { PlusIcon, FileDown } from 'lucide-react';

import { CreateWriteKeyDialog } from '@/features/write-keys/components/CreateWriteKeyDialog';
import { ExportEventsDialog } from '@/features/events/components/ExportEventsDialog';

export function AppHeader() {
  const location = useLocation();
  const activeNavItem = navigation.find((item) => item.url === location.pathname);
  const pageTitle = activeNavItem ? activeNavItem.title : 'Dashboard';
  const header = activeNavItem?.header;
  const [createWriteKeyOpen, setCreateWriteKeyOpen] = useState(false);
  const [exportEventsOpen, setExportEventsOpen] = useState(false);

  return (
    <header className="flex h-14 items-center border-b px-6">
      <SidebarTrigger className="md:hidden" />

      <h1 className="ml-4 md:ml-0 text-lg font-semibold">{pageTitle}</h1>

      <div className="ml-auto space-x-2">
        {header?.dateFilter && <DateRangeSelector />}

        {header?.writeKeyButton && (
          <>
            <Button className="cursor-pointer" onClick={() => setCreateWriteKeyOpen(true)}>
              <PlusIcon />
              Write Key
            </Button>

            <CreateWriteKeyDialog open={createWriteKeyOpen} onOpenChange={setCreateWriteKeyOpen} />
          </>
        )}

        {header?.eventExportButton && (
          <>
            <Button className="cursor-pointer" onClick={() => setExportEventsOpen(true)}>
              <FileDown />
              Export
            </Button>

            <ExportEventsDialog open={exportEventsOpen} onOpenChange={setExportEventsOpen} />
          </>
        )}
      </div>
    </header>
  );
}
