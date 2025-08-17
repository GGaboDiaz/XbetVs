import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { load, save, uid } from "../../lib/storage"

export default function NuevoReto() {
  const router = useRouter()
  const groupIdFromQuery = router.query.group

  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState("")
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [options, setOptions] = useState(["Opción A", "Opción B"])
  const [rule, setRule] = useState("winner_all") // winner_all | proportional
  const [resolveMethod, setResolveMethod] = useState("arbiter") // arbiter | vote
  const [arbiter, setArbiter] = useState("") // texto libre por ahora
  const [minAmount, setMinAmount] = useState(1000)
  const [closeAt, setCloseAt] = useState("")

  useEffect(() => {
    const gs = load("xb_groups", [])
    setGroups(gs)
    if (groupIdFromQuery && typeof groupIdFromQuery === "string") {
      setGroupId(groupIdFromQuery)
    } else if (gs[0]) {
      setGroupId(gs[0].id)
    }
  }, [groupIdFromQuery])

  const addOption = () => setOptions(o => [...o, `Opción ${String.fromCharCode(65+o.length)}`])
  const removeOption = (i) => setOptions(o => o.filter((_, idx) => idx !== i))

  const createBet = (e) => {
    e.preventDefault()
    if (!groupId || !title.trim() || options.length < 2) return
    const bets = load("xb_bets", [])
    const bet = {
      id: uid("b"),
      groupId,
      title: title.trim(),
      description: desc.trim(),
      options: options.map(s => s.trim()).filter(Boolean),
      rule,
      resolveMethod,
      arbiter,
      minAmount: Number(minAmount) || 0,
      closeAt: closeAt || null,
      status: "open", // open | closed | settled
      stakes: []      // [{userId, optionIndex, amount}]
    }
    const next = [bet, ...bets]
    save("xb_bets", next)
    router.push(`/retos/${bet.id}`)
  }

  const group = useMemo(() => groups.find(g => g.id === groupId), [groups, groupId])

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--gold)]">➕ Crear reto</h2>
        <Link href="/grupos" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">← Grupos</Link>
      </header>

      <form onSubmit={createBet} className="mt-6 grid gap-4 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
        {/* Grupo */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[#9aa4b2]">Grupo</label>
            <select className="input" value={groupId} onChange={e=>setGroupId(e.target.value)}>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="text-sm text-[#9aa4b2] flex items-end">
            {group ? <>Código de invitación: <span className="ml-2 text-white">{group.code}</span></> : "—"}
          </div>
        </div>

        {/* Título/Descripción */}
        <input className="input" placeholder="Título del reto (ej. ¿Quién gana el clásico?)"
               value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input min-h-[90px]" placeholder="Descripción breve (opcional)"
                  value={desc} onChange={e=>setDesc(e.target.value)} />

        {/* Opciones */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-[#9aa4b2]">Opciones</label>
            <button type="button" className="rounded-xl px-3 py-2 bg-[#1a2333] border border-[#2a3654]" onClick={addOption}>➕ Agregar opción</button>
          </div>
          <div className="grid gap-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1" value={opt} onChange={e=>{
                  const next = [...options]; next[i] = e.target.value; setOptions(next)
                }} />
                {options.length > 2 && (
                  <button type="button" className="rounded-xl px-3 py-2 bg-[#2a1b1b] border border-[#512a2a]" onClick={()=>removeOption(i)}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reglas */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-[#9aa4b2]">Regla de reparto</label>
            <select className="input" value={rule} onChange={e=>setRule(e.target.value)}>
              <option value="winner_all">Ganador se lleva todo</option>
              <option value="proportional">Reparto proporcional por opción</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[#9aa4b2]">Cierre por</label>
            <select className="input" value={resolveMethod} onChange={e=>setResolveMethod(e.target.value)}>
              <option value="arbiter">Árbitro</option>
              <option value="vote">Votación del grupo</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[#9aa4b2]">Árbitro (usuario/alias)</label>
            <input className="input" placeholder="ej. Luis" value={arbiter} onChange={e=>setArbiter(e.target.value)} disabled={resolveMethod!=="arbiter"} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[#9aa4b2]">Monto mínimo por persona</label>
            <input className="input" type="number" min="0" value={minAmount} onChange={e=>setMinAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-[#9aa4b2]">Fecha/hora límite para unirse</label>
            <input className="input" type="datetime-local" value={closeAt} onChange={e=>setCloseAt(e.target.value)} />
          </div>
        </div>

        <button className="rounded-2xl px-5 py-3 font-semibold bg-[#d4af37] text-black hover:brightness-110 transition">
          Crear reto
        </button>
      </form>
    </main>
  )
}
