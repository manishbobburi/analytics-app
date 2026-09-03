import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

import { UserMenu } from './UserMenu';

export function UserNav() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center">
        <SidebarMenuButton size="lg" className="min-w-0 flex-1 cursor-default">
          <Avatar className="h-8 w-8 shrink-0 rounded-full">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">Meta</span>

            <span className="truncate text-xs text-muted-foreground">m@example.com</span>
          </div>
        </SidebarMenuButton>
        <UserMenu />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
