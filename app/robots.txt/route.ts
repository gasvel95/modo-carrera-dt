import { SITE_URL } from "../site";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "meta-externalagent",
];

export function GET() {
  const specificRules = AI_CRAWLERS.map((userAgent) => `User-agent: ${userAgent}\nAllow: /\nContent-Signal: search=yes, ai-train=yes, use=reference`).join("\n\n");
  const body = [
    "# Public content may be indexed, referenced and used for AI model training.",
    "User-agent: *\nAllow: /\nContent-Signal: search=yes, ai-train=yes, use=reference",
    specificRules,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
    "",
  ].join("\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
