// pages/deposito.js
import { useEffect, useState } from "react"
import Link from "next/link"
import { ensureDemoBalance, getBalance, depositDemo, withdrawDemo, getUserTxns } from "../lib/wallet"

export default function Deposito() {
  const [user, setUser] = useState("Usuario")
  const [amount, setAmount] = useState(5000)
  const [mode, setMode] = useState("deposit") // deposit | withdraw
  const [balance, setBalance] = useState(0)
  const [txns, setTxns] = useState([])

  useEffect(() => {
    if (!user) return
    ensureDemoBalance(user)
    refresh()
  }, [user])

  const refresh = () => {
    setBalance(getBalance(user))
    setTxns(getUserTxns(user))
  }

  const submit = (e) => {
    e.preventDefault()
    const ok = mode === "deposit"
      ? depositDemo(user, amount, "Depósito demo")
      : withdrawDemo(user, amount, "Retiro demo")
    if (!ok) {
      alert(mode === "deposit" ? "Monto inválido." : "Saldo insuficiente.")
      return
    }
    setAmount(0)
    refresh()
  }

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--gold)]">💳 Depósito / Retiro (demo)</h2>
        <div className="flex gap-2">
          <Link href="/billetera" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">💰 Billetera</Link>
          <Link href="/" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">← Inicio</Link>
        </div>
      </header>

      <section className="mt-6 grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-[#121826] rounded-2xl p-5 border border-[#1f2a44] grid gap-3">
          <label className="text-sm text-[#9aa4b2]">Alias</label>
          <input className="input" value={user} onChange={e=>setUser(e.target.value)} placeholder="Tu alias" />

          <div className="grid grid-cols-2 gap-3">
            <button type="button"
              onClick={()=>setMode("deposit")}
              className={`rounded-xl px-4 py-2 border ${mode==='deposit'?'bg-[#d4af37] text-black border-[#d4af37]':'bg-[#1a2333] border-[#2a3654]'}`}>
              ➕ Depositar
            </button>
            <button type="button"
              onClick={()=>setMode("withdraw")}
              className={`rounded-xl px-4 py-2 border ${mode==='withdraw'?'bg-[#d4af37] text-black border-[#d4af37]':'bg-[#1a2333] border-[#2a3654]'}`}>
              ⬇ Retirar
            </button>
          </div>

          <label className="text-sm text-[#9aa4b2]">Monto</label>
          <input className="input" type="number" min="0" value={amount} onChange={e=>setAmount(Number(e.target.value||0))} />

          <button className="rounded-2xl px-5 py-3 font-semibold bg-[#d4af37] text-black">
            {mode === "deposit" ? "Confirmar depósito" : "Confirmar retiro"}
          </button>

          <p className="text-sm text-[#9aa4b2]">Saldo actual: <b className="text-white">₡{balance.toLocaleString("es-CR")}</b></p>
        </form>

        <div className="bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
          <h3 className="font-semibold mb-2">Movimientos de {user}</h3>
          <div className="grid gap-2 max-h-[60vh] overflow-auto">
            {txns.length === 0 && <div className="text-[#9aa4b2]">Sin movimientos.</div>}
            {txns.map(t => (
              <div key={t.id} className="text-sm border-b border-[#1f2a44] pb-2">
                <div className="flex justify-between">
                  <span>{t.note}</span>
                  <span className={`${t.amount>=0?'text-green-400':'text-red-400'}`}>{t.amount>=0?'+':''}₡{t.amount.toLocaleString("es-CR")}</span>
                </div>
                <div className="text-[#6f7890]">{new Date(t.at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
