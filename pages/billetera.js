import { useEffect, useState } from "react"
import Link from "next/link"
import { load } from "../lib/storage"
import { getBalance } from "../lib/wallet"

export default function Billetera() {
  const [users, setUsers] = useState([])
  const [txns, setTxns] = useState([])

  useEffect(() => {
    const wallets = load("xb_wallets", {})
    const tx = load("xb_txns", [])
    setUsers(Object.keys(wallets))
    setTxns(tx)
  }, [])

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--gold)]">💰 Billetera (demo)</h2>
        <Link href="/" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">← Inicio</Link>
      </header>

      <section className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
          <h3 className="font-semibold mb-2">Saldos</h3>
          <div className="grid gap-2">
            {users.length === 0 && <div className="text-[#9aa4b2]">Aún no hay usuarios.</div>}
            {users.map(u => (
              <div key={u} className="flex justify-between border-b border-[#1f2a44] py-2">
                <span>{u}</span>
                <span>₡{getBalance(u).toLocaleString("es-CR")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
          <h3 className="font-semibold mb-2">Movimientos</h3>
          <div className="grid gap-2 max-h-[60vh] overflow-auto">
            {txns.length === 0 && <div className="text-[#9aa4b2]">Sin movimientos.</div>}
            {txns.map(t => (
              <div key={t.id} className="text-sm border-b border-[#1f2a44] pb-2">
                <div className="flex justify-between">
                  <b>{t.user}</b>
                  <span className={`${t.amount>=0?'text-green-400':'text-red-400'}`}>{t.amount>=0?'+':''}₡{t.amount.toLocaleString("es-CR")}</span>
                </div>
                <div className="text-[#9aa4b2]">{t.note} {t.betId ? `· Reto ${t.betId}` : ""}</div>
                <div className="text-[#6f7890]">{new Date(t.at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
