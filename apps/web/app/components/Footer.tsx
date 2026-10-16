export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-black/80">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <p className="font-mono text-sm text-muted-foreground">rhaditya.me © 2025</p>
        <span className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900/50 px-2.5 py-0.5 text-xs font-mono font-medium text-gray-300">
          ARSIP PRIBADI
        </span>
        <p className="text-sm text-muted-foreground">FULL-STACK ENGINEER • JAKARTA, ID</p>
      </div>
    </footer>
  );
}
