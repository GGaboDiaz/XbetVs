// components/Layout.js
import Header from "../Header"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  )
}
