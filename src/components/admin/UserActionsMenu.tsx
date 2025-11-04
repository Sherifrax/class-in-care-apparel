import { useState } from 'react';
import { MoreVertical, Shield, ShieldOff, KeyRound, Mail, Ban, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserWithRole {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  banned?: boolean;
}

interface UserActionsMenuProps {
  user: UserWithRole;
  currentUserId: string;
  onToggleAdmin: () => void;
  onResetPassword: () => void;
  onBanUser: () => void;
  onUnbanUser: () => void;
  onSendMagicLink: () => void;
  disabled?: boolean;
}

export function UserActionsMenu({
  user,
  currentUserId,
  onToggleAdmin,
  onResetPassword,
  onBanUser,
  onUnbanUser,
  onSendMagicLink,
  disabled
}: UserActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const isSelf = user.id === currentUserId;

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={disabled}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleAction(onToggleAdmin)}
          disabled={isSelf}
          className="cursor-pointer"
        >
          {user.is_admin ? (
            <>
              <ShieldOff className="mr-2 h-4 w-4" />
              Remove Admin Access
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Grant Admin Access
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleAction(onResetPassword)}
          className="cursor-pointer"
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Reset Password
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction(onSendMagicLink)}
          className="cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Password Reset Link
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {user.banned ? (
          <DropdownMenuItem
            onClick={() => handleAction(onUnbanUser)}
            disabled={isSelf}
            className="cursor-pointer text-green-600"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleAction(onBanUser)}
            disabled={isSelf}
            className="cursor-pointer text-destructive"
          >
            <Ban className="mr-2 h-4 w-4" />
            Ban User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
