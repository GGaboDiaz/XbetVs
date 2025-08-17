export default function Card({ className = "", children }) {
  return (
    <div className={`bg-[#121826] rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] ${className}`}>
      {children}
    </div>
  )
}
