import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { load, save } from "../../lib/storage"
import { ensureDemoBalance, getBalance, addBalance, addTxn, potOf } from "../../lib/wallet"

const APP_ACCOUNT = "APP"        // donde cae la comisión
const COMMISSION_RATE = 0.05     // 5%

export default function RetoDetalle() {
  const router = useRouter()
  const { id } = router.query

  const [bet, setBet] = useState(null)
  const [amount, setAmount] = useState(1000)
  const [optIndex, setOptIndex] = useState(0)
  const [name, setName] = useState("Usuario") // alias temporal
  const [winner, setWinner] = useState(0)     // opción ganadora para liquidar
  const [busy, setBusy] = useState(false)

  // Cargar reto
  useEffect(() => {
    if (!id) return
    const bets = load("xb_bets", [])
    const b = bets.find(x => x.id === id)
    setBet(b || null)
    setOptIndex(0)
    setWinner(0)
  }, [id])

  // Asegurar saldo demo para alias que se escriba
  useEffect(() => {
    if (!name) return
    ensureDemoBalance(name)
  }, [name])

  const stakesByOption = useMemo(() => {
    if (!bet) return []
    const map = bet.options.map(()=>[])
    bet.stakes.forEach(s => map[s.optionIndex].push(s))
    return map
  }, [bet])

  const totalPot = useMemo(() => bet ? potOf(bet) : 0, [bet])

  const joinBet = () => {
    if (!bet) return
    const m = Number(amount || 0)
    if (m <= 0) return
    // verificar saldo
    if (getBalance(name) < m) {
      alert(`Saldo insuficiente para ${name}. Ve a Billetera (demo) o reduce el monto.`)
      return
    }
    const bets = load("xb_bets", [])
    const idx = bets.findIndex(x => x.id === bet.id)
    if (idx === -1) return
    // descuenta saldo, agrega stake
    addBalance(name, -m)
    addTxn({ user: name, betId: bet.id, type: "stake", amount: -m, note: `Participación en "${bet.title}"` })
    const stake = { user: name, optionIndex: Number(optIndex)||0, amount: m }
    bets[idx].stakes.push(stake)
    save("xb_bets", bets)
    setBet({...bets[idx]})
  }

  // liquidar con 5% de comisión
  const settle = () => {
    if (!bet || bet.status === "settled") return
    setBusy(true)

    const bets = load("xb_bets", [])
    const idx = bets.findIndex(x => x.id === bet.id)
    if (idx === -1) { setBusy(false); return }

    const pot = potOf(bet)
    const winners = (bet.stakes || []).filter(s => s.optionIndex === Number(winner))
    const losers  = (bet.stakes || []).filter(s => s.optionIndex !== Number(winner))

    if (winners.length === 0) {
      // Sin ganadores: por justicia, devolvemos TODO y NO cobramos comisión
      losers.forEach(s => {
        addBalance(s.user, s.amount)
        addTxn({ user: s.user, betId: bet.id, type: "refund", amount: s.amount, note: `Devolución por reto sin ganadores: "${bet.title}"` })
      })
      bets[idx].status = "settled"
      bets[idx].result = { optionIndex: winner, commission: 0, distributed: 0 }
      save("xb_bets", bets)
      setBet({...bets[idx]})
      setBusy(false)
      alert("Reto cerrado: no hubo ganadores, se devolvió el dinero.")
      return
    }

    const fee = Math.floor(pot * COMMISSION_RATE) // redondeo a entero
    const distributable = pot - fee

    // reparto: proporcional al aporte dentro de la opción ganadora
    const sumWinners = winners.reduce((s, x) => s + x.amount, 0) || 1
    winners.forEach(w => {
      const share = Math.floor(distributable * (w.amount / sumWinners))
      addBalance(w.user, share)
      addTxn({ user: w.user, betId: bet.id, type: "payout", amount: share, note: `Ganancia en "${bet.title}"` })
    })

    // comisión para la cuenta APP
    ensureDemoBalance(APP_ACCOUNT, 0)
    addBalance(APP_ACCOUNT, fee)
    addTxn({ user: APP_ACCOUNT, betId: bet.id, type: "fee", amount: fee, note: `Comisión 5% de "${bet.title}"` })

    // marcar reto liquidado
    bets[idx].status = "settled"
    bets[idx].result = { optionIndex: winner, commission: fee, distributed: distributable }
    save("xb_bets", bets)
    setBet({...bets[idx]})
    setBusy(false)
    alert(`Reto liquidado. Comisión: ₡${fee.toLocaleString("es-CR")}, repartido: ₡${distributable.toLocaleString("es-CR")}.`)
  }

  if (!bet) {
    return (
      <main className="min-h-screen p-6">
        <div className="text-[#9aa4b2]">Cargando reto…</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--gold)]">🔥 {bet.title}</h2>
        <div className="flex gap-2">
          <Link href="/billetera" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">💰 Billetera</Link>
          <Link href="/grupos" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">← Grupos</Link>
        </div>
      </header>

      <div className="text-sm text-[#9aa4b2] mt-1">
        Bote actual: <b className="text-white">₡{totalPot.toLocaleString("es-CR")}</b> · Comisión al cerrar: <b className="text-white">5%</b>
        {bet.status === "settled" && bet.result ? <> · Resultado: <b className="text-white">{bet.options[bet.result.optionIndex]}</b> · Comisión cobrada: <b className="text-white">₡{bet.result.commission.toLocaleString("es-CR")}</b></> : null}
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
          <p className="text-[#b7c0cf]">{bet.description || "Sin descripción"}</p>
          <div className="mt-4 text-sm text-[#9aa4b2]">
            Regla: <b className="text-white">{bet.rule === "winner_all" ? "Ganador se lleva todo" : "Proporcional"}</b> ·
            Cierre por: <b className="text-white">{bet.resolveMethod === "arbiter" ? "Árbitro" : "Votación"}</b>
            {bet.resolveMethod === "arbiter" && bet.arbiter ? <> · Árbitro: <b className="text-white">{bet.arbiter}</b></> : null}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {bet.options.map((op, i) => (
              <div key={i} className="bg-[#0f1524] rounded-xl p-4 border border-[#1f2a44]">
                <div className="font-semibold">{op}</div>
                <div className="mt-2 text-sm text-[#9aa4b2]">
                  Participantes: {stakesByOption[i]?.length || 0}
                </div>
                <div className="mt-2 grid gap-1">
                  {(stakesByOption[i] || []).map((s, idx) => (
                    <div key={idx} className="text-sm text-[#b7c0cf]">• {s.user} — ₡{s.amount.toLocaleString("es-CR")}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unirme */}
        <div className="bg-[#121826] rounded-2xl p-5 border border-[#1f2a44] h-fit">
          <div className="text-sm text-[#9aa4b2]">Unirme al reto (descarga de tu saldo)</div>
          <input className="input mt-2" placeholder="Tu nombre/alias" value={name} onChange={e=>setName(e.target.value)} />
          <div className="text-xs text-[#9aa4b2] mt-1">Saldo: ₡{getBalance(name).toLocaleString("es-CR")}</div>

          <label className="text-sm text-[#9aa4b2] block mt-3">Elegir opción</label>
          <select className="input" value={optIndex} onChange={e=>setOptIndex(e.target.value)}>
            {bet.options.map((op,i)=><option key={i} value={i}>{op}</option>)}
          </select>
          <label className="text-sm text-[#9aa4b2] block mt-3">Monto</label>
          <input className="input" type="number" min={bet.minAmount||0} value={amount} onChange={e=>setAmount(e.target.value)} />
          <button onClick={joinBet} className="mt-4 w-full rounded-2xl px-5 py-3 font-semibold bg-[#d4af37] text-black">Unirme</button>
          <p className="text-xs text-[#9aa4b2] mt-2">El monto queda en escrow hasta el cierre.</p>

          {/* Panel de cierre (solo si no está settled) */}
          {bet.status !== "settled" && (
            <div className="mt-6 border-t border-[#1f2a44] pt-4">
              <div className="text-sm text-[#9aa4b2]">Cerrar y liquidar (aplica 5% de comisión)</div>
              <label className="text-sm text-[#9aa4b2] block mt-2">Opción ganadora</label>
              <select className="input" value={winner} onChange={e=>setWinner(Number(e.target.value))}>
                {bet.options.map((op,i)=><option key={i} value={i}>{op}</option>)}
              </select>
              <button disabled={busy} onClick={settle} className="mt-3 w-full rounded-2xl px-5 py-3 font-semibold bg-[#1a2333] border border-[#2a3654] hover:bg-[#202b42]">
                {busy ? "Liquidando..." : "Cerrar reto y liquidar"}
              </button>
              <p className="text-xs text-[#9aa4b2] mt-2">
                Comisión estimada: ₡{Math.floor(totalPot * COMMISSION_RATE).toLocaleString("es-CR")}. Si no hay ganadores, se devuelve el dinero y no se cobra comisión.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
