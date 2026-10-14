"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="rounded-full bg-gray-900/50 p-4 w-20 h-20 mx-auto flex items-center justify-center border border-gray-800">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Halaman tidak ditemukan
          </h1>
          <p className="text-muted-foreground text-lg">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}