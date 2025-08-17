export default function PrimaryButton({ children, className="", ...props }) {
  return (
    <button
      className={`rounded-2xl px-5 py-3 font-semibold bg-[#d4af37] text-black hover:brightness-110 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
