import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

import { UserMenu } from './UserMenu';
import { AccountSkeleton } from './AccountSkeleton';
import { useCurrentOrganization } from '@/features/auth/hooks';

export function UserNav() {
  const { data, isPending } = useCurrentOrganization();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center">
        <SidebarMenuButton size="lg" className="min-w-0 flex-1 cursor-default">
          {isPending ? (
            <AccountSkeleton />
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarFallback>{data?.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{data?.name}</span>

                <span className="truncate text-xs text-muted-foreground">{data?.email}</span>
              </div>
            </div>
          )}
        </SidebarMenuButton>
        <UserMenu data={data} isPending={isPending} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
