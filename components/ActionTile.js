import Link from "next/link"

export default function ActionTile({ href, emoji, title, subtitle }) {
  return (
    <Link href={href} className="group block bg-[#0f1524] hover:bg-[#151c2e] transition rounded-2xl p-5 border border-[#1f2a44]">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-[#9aa4b2] group-hover:text-[#b7c0cf]">{subtitle}</div>
    </Link>
  )
}
