// pages/index.js
import Link from "next/link"
import { useEffect, useState } from "react"
import { ensureDemoBalance, getBalance } from "../lib/wallet"

export default function HomePage() {
  // Alias actual y saldo mostrado en la Home
  const [user, setUser] = useState("Usuario")
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // Asegura una billetera demo y actualiza el saldo al cambiar de alias
    ensureDemoBalance(user)
    setBalance(getBalance(user))
  }, [user])

  return (
    <main className="min-h-screen p-6 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#4338ca] grid place-items-center font-bold">Vs</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#d4af37] tracking-tight">XbetVs</h1>
        </div>
        <Link href="/billetera" className="rounded-2xl px-4 py-2 bg-[#1a2333] text-white border border-[#2a3654] hover:bg-[#202b42]">
          💰 Billetera
        </Link>
      </header>

      {/* Tarjeta de saldo + alias */}
      <section className="relative z-10 mt-6 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[#9aa4b2]">Saldo disponible</p>
            <p className="text-3xl font-extrabold text-white">₡{balance.toLocaleString("es-CR")}</p>
          </div>
          <div className="w-full sm:w-auto">
            <label className="text-sm text-[#9aa4b2] block mb-1">Tu alias</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="input w-full sm:w-[180px]"
              placeholder="Ej. Gabriel"
            />
          </div>
        </div>
        <p className="text-xs text-[#9aa4b2] mt-2">
          Este saldo es <b>demo</b>. Al unirte a un reto se descuenta; al cerrar, se reparte y la app cobra 5% de comisión.
        </p>
      </section>

      {/* Accesos rápidos */}
      <section className="relative z-10 mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/grupos" className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold">Mis grupos</div>
          <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">Crea o entra a tus grupos privados</div>
        </Link>

        <Link href="/retos/nuevo" className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-3xl mb-2">➕</div>
          <div className="font-semibold">Crear reto</div>
          <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">Propón un reto entre tus amigos</div>
        </Link>

        <Link href="/retos?group=" className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-3xl mb-2">🔥</div>
          <div className="font-semibold">Retos activos</div>
          <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">Revisa y únete a los retos abiertos</div>
        </Link>

        <Link href="/deposito" className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-3xl mb-2">💳</div>
          <div className="font-semibold">Depósito / Retiro</div>
          <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">Mueve tu saldo (demo)</div>
        </Link>

        <Link href="/historial" className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-3xl mb-2">📊</div>
          <div className="font-semibold">Historial</div>
          <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">Rendimiento y movimientos</div>
        </Link>

        <Link href="/admin" className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-3xl mb-2">🛠️</div>
          <div className="font-semibold">Admin (Comisiones)</div>
          <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">Total cobrado (5%) y últimas comisiones</div>
        </Link>
      </section>

      {/* Nota de instalación como App (opcional) */}
      <section className="relative z-10 mt-6 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
        <h3 className="font-bold mb-2">Instálala como App</h3>
        <p className="text-sm text-[#9aa4b2]">
          Cuando la publiquemos (HTTPS) podrás <b>agregarla a tu pantalla de inicio</b> y usarla como app.
        </p>
      </section>

    </main>
  )
}
