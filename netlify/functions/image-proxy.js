const ALLOWED_HOSTS = new Set([
  "commons.wikimedia.org",
  "upload.wikimedia.org",
  "www.boj.or.jp",
  "boj.or.jp",
  "www.banknotes.rba.gov.au",
  "banknotes.rba.gov.au",
  "www.ecb.europa.eu",
  "ecb.europa.eu",
  "www.banrep.gov.co",
  "banrep.gov.co"
]);

exports.handler = async (event) => {
  try {
    const raw = event.queryStringParameters?.url;
    if (!raw) return { statusCode: 400, body: "Missing url" };

    const target = new URL(raw);
    if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
      return { statusCode: 403, body: "Host not allowed" };
    }

    const headers = {
      "User-Agent": "Notas-do-Mundo/0.9.7 (+https://notas-mundo.netlify.app)",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
    };
    if (target.hostname === "www.banrep.gov.co" || target.hostname === "banrep.gov.co") {
      headers.Referer = "https://www.banrep.gov.co/";
    }

    const response = await fetch(target.toString(), {redirect:"follow", headers});
    if (!response.ok) return { statusCode: response.status, body: `Upstream image error ${response.status}` };

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      return { statusCode: 415, body: `Upstream did not return an image (${contentType})` };
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "Access-Control-Allow-Origin": "*"
      },
      body: bytes.toString("base64")
    };
  } catch (error) {
    console.error("image-proxy", error);
    return { statusCode: 500, body: "Image proxy failed" };
  }
};