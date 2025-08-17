// components/Header.js
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {/* Logo en public/logo.png */}
        <div className="w-10 h-10 rounded-xl overflow-hidden">
          <Image
            src="/logo.png"   // o "/icons/icon-192x192.png"
            alt="XbetVs"
            width={40}
            height={40}
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#d4af37] tracking-tight">
          XbetVs
        </h1>
      </div>

      <Link
        href="/billetera"
        className="rounded-2xl px-4 py-2 bg-[#1a2333] text-white border border-[#2a3654] hover:bg-[#202b42]"
      >
        💰 Billetera
      </Link>
    </header>
  )
}
