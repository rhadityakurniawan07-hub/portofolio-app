export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-black/80">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <p className="font-mono text-sm text-muted-foreground">rhaditya.me © 2025</p>
        <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-2.5 py-0.5 text-xs font-medium text-gray-300">
          ARSIP PRIBADI
        </span>
        <p className="text-sm text-muted-foreground">Full-Stack Engineer • Jakarta, ID</p>
      </div>
    </footer>
  );
}
