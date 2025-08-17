import Link from 'next/link'

export default function Login() {
  return (
    <main className="min-h-screen p-6">
      <h2 className="text-2xl font-bold text-[var(--gold)]">Iniciar sesión</h2>
      <form className="card mt-6 space-y-4 max-w-md">
        <input className="input" placeholder="Correo electrónico" type="email" />
        <input className="input" placeholder="Contraseña" type="password" />
        <button className="btn btn-gold w-full">Entrar</button>
        <p className="text-center text-sm text-[var(--muted)]">
          ¿No tienes cuenta? <Link href="#" className="text-[var(--gold)]">Crear cuenta</Link>
        </p>
      </form>
    </main>
  )
}