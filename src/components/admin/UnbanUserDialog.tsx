import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck } from 'lucide-react';

interface UnbanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: (notifyUser: boolean) => void;
  loading?: boolean;
}

export function UnbanUserDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
  loading
}: UnbanUserDialogProps) {
  const [notifyUser, setNotifyUser] = useState(true);

  const handleConfirm = () => {
    onConfirm(notifyUser);
    setNotifyUser(true);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500/10 p-2">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <AlertDialogTitle>Unban User Account</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4 pt-4">
            <p>
              You are about to unban <strong>{userName}</strong>. This will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Restore their login access</li>
              <li>Allow them to use all features</li>
              <li>Remove all restrictions from their account</li>
            </ul>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-unban"
                checked={notifyUser}
                onCheckedChange={(checked) => setNotifyUser(checked as boolean)}
              />
              <label
                htmlFor="notify-unban"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send welcome back email to user
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Unbanning...' : 'Unban User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
