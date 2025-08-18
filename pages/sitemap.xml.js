// pages/sitemap.xml.js

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://xbetvs.vercel.app"; // cámbialo si usas otro dominio

// 🧩 Si luego tienes rutas dinámicas (p.ej. /retos/[id]),
// aquí podrías hacer fetch a tu DB/API para traer slugs.
async function getDynamicUrls() {
  // Ejemplo vacío por ahora:
  // return [{ loc: "/retos/abc123" }, { loc: "/grupos/mi-grupo" }];
  return [];
}

function generateSiteMap(urls) {
  const now = new Date().toISOString();

  const urlNodes = urls
    .map(
      (u) => `
  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod || now}</lastmod>
    <changefreq>${u.changefreq || "weekly"}</changefreq>
    <priority>${u.priority ?? 0.7}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urlNodes}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  // Rutas estáticas principales de tu app
  const staticUrls = [
    { loc: "/" },
    { loc: "/grupos" },
    { loc: "/retos" },
    { loc: "/billetera" },
    { loc: "/deposito" },
    { loc: "/historial" },
    { loc: "/admin" },
  ];

  // Rutas dinámicas (más adelante puedes traerlas de tu DB/API)
  const dynamicUrls = await getDynamicUrls();

  const sitemap = generateSiteMap([...staticUrls, ...dynamicUrls]);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  // Esto nunca se renderiza en el cliente porque ya respondimos con XML
  return null;
}
