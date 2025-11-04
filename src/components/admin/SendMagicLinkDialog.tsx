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
import { Mail } from 'lucide-react';

interface SendMagicLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function SendMagicLinkDialog({
  open,
  onOpenChange,
  userName,
  userEmail,
  onConfirm,
  loading
}: SendMagicLinkDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-500/10 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <AlertDialogTitle>Send Magic Link</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-4">
            <p>
              Send a password reset magic link to <strong>{userName}</strong>.
            </p>
            <div className="rounded-lg bg-muted p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email will be sent to:</p>
                  <p className="text-sm text-primary font-mono">{userEmail}</p>
                </div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium">The email will contain:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>A secure one-time login link</li>
                <li>Instructions to reset their password</li>
                <li>Link expires in 24 hours</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
