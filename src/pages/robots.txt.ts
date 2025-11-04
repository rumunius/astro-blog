import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Disallow: /admin/
Disallow: /styles/
Disallow: /scripts/

User-agent: GPTBot
Disallow: /
User-agent: DataForSeoBot
Disallow: /
User-agent: MJ12bot
Disallow: /
User-agent: YisouSpider
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: SemrushBot-SA
Disallow: /
User-agent: SemrushBot-BA
Disallow: /
User-agent: SemrushBot-SI
Disallow: /
User-agent: SemrushBot-SWA
Disallow: /
User-agent: SemrushBot-CT
Disallow: /
User-agent: SemrushBot-BM
Disallow: /
User-agent: SemrushBot-SEOAB
Disallow: /
user-agent: AhrefsBot
Disallow: /
User-agent: DotBot
Disallow: /
User-agent: Uptimebot
Disallow: /
User-agent: MegaIndex.ru
Disallow: /
User-agent: ZoominfoBot
Disallow: /
User-agent: Mail.Ru
Disallow: /
User-agent: BLEXBot
Disallow: /
User-agent: ExtLinksBot
Disallow: /
User-agent: aiHitBot
Disallow: /
User-agent: Researchscan
Disallow: /
User-agent: DnyzBot
Disallow: /
User-agent: spbot
Disallow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};