import { AlertTriangle } from 'lucide-react';

export function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div className="fixed left-4 right-4 top-20 z-[80] flex items-center gap-3 rounded-xl bg-error/12 p-4 text-sm text-error backdrop-blur-md ghost-border md:left-28 md:right-[470px]">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <span>{error}</span>
    </div>
  );
}
