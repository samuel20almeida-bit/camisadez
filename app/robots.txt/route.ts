import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://camisadez.vercel.app";

export function GET() {
  return new NextResponse(
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /criar\nDisallow: /preview\nDisallow: /sucesso\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    { headers: { "Content-Type": "text/plain" } },
  );
}
