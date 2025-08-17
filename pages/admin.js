// pages/admin.js
import Link from "next/link"
import { useEffect, useState } from "react"
import { feeTxns, totalFees } from "../lib/wallet"

export default function Admin() {
  const [total, setTotal] = useState(0)
  const [fees, setFees] = useState([])

  useEffect(() => {
    setTotal(totalFees())
    setFees(feeTxns(100))
  }, [])

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--gold)]">🛠️ Admin · Comisiones</h2>
        <Link href="/" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">← Inicio</Link>
      </header>

      <section className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
          <div className="text-sm text-[#9aa4b2]">Comisión acumulada (5%)</div>
          <div className="text-4xl font-extrabold mt-2">₡{total.toLocaleString("es-CR")}</div>
          <p className="text-xs text-[#9aa4b2] mt-2">Suma de todas las comisiones cobradas al liquidar retos.</p>
        </div>

        <div className="lg:col-span-2 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
          <h3 className="font-semibold mb-3">Últimas comisiones</h3>
          <div className="grid gap-2 max-h-[60vh] overflow-auto">
            {fees.length === 0 && <div className="text-[#9aa4b2]">Aún no hay comisiones.</div>}
            {fees.map(f => (
              <div key={f.id} className="text-sm border-b border-[#1f2a44] pb-2">
                <div className="flex justify-between">
                  <span>Comisión por reto {f.betId}</span>
                  <span className="text-green-400">+₡{f.amount.toLocaleString("es-CR")}</span>
                </div>
                <div className="text-[#6f7890]">{new Date(f.at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
