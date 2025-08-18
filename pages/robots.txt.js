// pages/robots.txt.js

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://xbetvs.vercel.app";

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(robotsTxt);
  res.end();
  return { props: {} };
}

export default function Robots() {
  return null;
}
