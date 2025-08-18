// components/layout.js
import Header from "./header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      
      <main className="p-6">{children}</main>
    </div>
  );
}
