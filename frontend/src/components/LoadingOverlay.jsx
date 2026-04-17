export function LoadingOverlay({ scanning }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-surface-container-lowest/30 ghost-border">
          <div className="scan-sweep absolute inset-5 rounded-full" />
          <div className="absolute inset-12 rounded-full bg-surface-container/75 shadow-[inset_0_0_36px_rgba(71,234,237,0.08)] ghost-border" />
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-[0_0_45px_rgba(71,234,237,0.55)]" />
        </div>
        <div className="text-center">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            {scanning ? 'Scanning global signals...' : 'Recalibrating intelligence...'}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-secondary">Syncing market context</p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2, 3].map((item) => (
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-primary"
                key={item}
                style={{ animationDelay: `${item * 140}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
