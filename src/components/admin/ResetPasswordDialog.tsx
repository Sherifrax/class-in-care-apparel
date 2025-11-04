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
import { KeyRound } from 'lucide-react';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  userName,
  userEmail,
  onConfirm,
  loading
}: ResetPasswordDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <AlertDialogTitle>Reset User Password</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-4">
            <p>
              You are about to initiate a password reset for <strong>{userName}</strong>.
            </p>
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <p className="text-sm font-medium">What will happen:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A password reset email will be sent to: <strong>{userEmail}</strong></li>
                <li>The user will receive a secure reset link</li>
                <li>The link will expire in 24 hours</li>
                <li>The user can create a new password using the link</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              This action is safe and commonly used when users forget their passwords.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
