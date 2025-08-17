# XbetVs — PWA Starter (Next.js)

App web que funciona como app instalable (PWA) para apuestas entre amigos.

## 🚀 Cómo usar
```bash
npm install
npm run dev
# abre http://localhost:3000
```

Para build de producción:
```bash
npm run build
npm start
```

> En desarrollo, el Service Worker de `next-pwa` está desactivado por defecto. En producción (con HTTPS) verás el banner para **instalar**.

## 🧩 Tech
- Next.js 14
- Tailwind CSS
- next-pwa (manifest, service worker)
- Estilo premium oscuro/dorado

## 📁 Páginas
- `/` Home con accesos rápidos
- `/login` Login
- `/deposit` Depósito (métodos + monto)
- `/apuestas` Crear apuestas (placeholder)
- `/historial` Historial (placeholder)

## 🔔 Siguientes pasos
- Conectar pagos (Stripe / SINPE)
- Autenticación (NextAuth o JWT)
- Notificaciones push (Firebase)
- Estados reales (React Query) y API propia
```