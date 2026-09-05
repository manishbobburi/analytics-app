import { LogOut, MoreVertical } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { AccountSkeleton } from './AccountSkeleton';
import { useLogout } from '@/features/auth/hooks';
import type { GetOrganizationResponse } from '@/features/auth/types';

interface UserMenuProps {
  data: GetOrganizationResponse | undefined;
  isPending: boolean;
}

export function UserMenu({ data, isPending }: UserMenuProps) {
  const logoutMutation = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="mr-2 rounded-md p-2 hover:bg-muted"
        aria-label="Open account menu"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
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
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={logoutMutation.isPending}
            onClick={() => {
              logoutMutation.mutate();
            }}
          >
            <LogOut />
            {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
