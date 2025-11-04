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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: (reason: string, notifyUser: boolean) => void;
  loading?: boolean;
}

export function BanUserDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
  loading
}: BanUserDialogProps) {
  const [reason, setReason] = useState('');
  const [notifyUser, setNotifyUser] = useState(false);

  const handleConfirm = () => {
    onConfirm(reason, notifyUser);
    setReason('');
    setNotifyUser(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Ban User Account</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4 pt-4">
            <p>
              You are about to ban <strong>{userName}</strong>. This will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Prevent them from logging in</li>
              <li>Invalidate their current session</li>
              <li>Restrict access to all features</li>
            </ul>

            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason (optional but recommended)</Label>
              <Textarea
                id="ban-reason"
                placeholder="Enter the reason for banning this user..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-ban"
                checked={notifyUser}
                onCheckedChange={(checked) => setNotifyUser(checked as boolean)}
              />
              <label
                htmlFor="notify-ban"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send notification email to user
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Banning...' : 'Ban User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
