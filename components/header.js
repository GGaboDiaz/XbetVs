// components/header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0f1524] border-b border-[#1f2a44]">
      <div className="flex items-center gap-3">
        <img
        src="/icons/icon-192x192.png" 
        alt="XbetVs" width="48" 
        height="48" 
        className="w-12 h-12 rounded-lg object-contain" />

        <span className="text-2xl sm:text-3xl font-extrabold text-[#d4af37]">XbetVs</span>
      </div>
      <Link href="/billetera" className="rounded-2xl px-4 py-2 bg-[#1a2333] text-white border border-[#2a3654] hover:bg-[#202b42] transition">
        💰 Billetera
      </Link>
    </header>
  );
}
