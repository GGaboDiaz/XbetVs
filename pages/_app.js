// pages/_app.js
import "../styles/globals.css";
import Header from "../components/header";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Header />
      <main className="p-6">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

