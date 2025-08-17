import { useEffect, useState } from "react"
import Link from "next/link"
import { load, save, uid } from "../lib/storage"

function GroupCard({ group }) {
  return (
    <div className="bg-[#121826] rounded-2xl p-5 border border-[#1f2a44]">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{group.name}</div>
          <div className="text-sm text-[#9aa4b2]">Código: {group.code}</div>
        </div>
        <Link href={`/retos/nuevo?group=${group.id}`} className="rounded-xl px-4 py-2 bg-[#d4af37] text-black font-semibold">
          ➕ Crear reto
        </Link>
      </div>
      <div className="mt-3">
        <Link href={`/retos?group=${group.id}`} className="text-sm text-[#b7c0cf] underline">
          Ver retos del grupo →
        </Link>
      </div>
    </div>
  )
}

export default function Grupos() {
  const [groups, setGroups] = useState([])
  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  useEffect(() => {
    setGroups(load("xb_groups", []))
  }, [])

  const createGroup = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const g = { id: uid("g"), name: name.trim(), code: code || uid("code").slice(-6) }
    const next = [g, ...groups]
    setGroups(next)
    save("xb_groups", next)
    setName(""); setCode("")
  }

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--gold)]">👥 Mis grupos</h2>
        <Link href="/" className="rounded-xl px-4 py-2 bg-[#1a2333] border border-[#2a3654]">← Inicio</Link>
      </header>

      <form onSubmit={createGroup} className="mt-6 bg-[#121826] rounded-2xl p-5 border border-[#1f2a44] grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Nombre del grupo (ej. Los compas del finde)"
               value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Código (opcional para invitar)" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="btn btn-gold">Crear grupo</button>
      </form>

      <section className="mt-6 grid gap-4">
        {groups.length === 0 && (
          <div className="text-[#9aa4b2]">Aún no tienes grupos. Crea uno y comparte el código con tus amigos.</div>
        )}
        {groups.map(g => <GroupCard key={g.id} group={g} />)}
      </section>
    </main>
  )
}
