import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://camisadez.vercel.app";

export function GET() {
  const urls = [
    { loc: siteUrl, priority: "1.0", changefreq: "daily" },
    { loc: `${siteUrl}/termos`, priority: "0.3", changefreq: "monthly" },
    { loc: `${siteUrl}/privacidade`, priority: "0.3", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority, changefreq }) =>
      `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
