export default function ProjectsPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Koleksi Proyek
          </h1>
          <p className="text-muted-foreground">
            Arsip repositori pribadi dan proyek-proyek yang telah dikerjakan.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Cari proyek (judul, teknologi)..."
              className="w-full rounded-lg border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Cari proyek"
            />
          </div>
          <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            + Simpan Proyek Baru
          </button>
        </div>

        <p className="text-sm text-muted-foreground">Menampilkan 0 proyek</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center text-muted-foreground">
            Belum ada proyek. Klik "Simpan Proyek Baru" untuk menambahkan.
          </div>
        </div>
      </div>
    </div>
  )
}