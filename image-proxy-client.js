(() => {
  const previousFetch = window.fetch.bind(window);
  const proxyable = [
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
  ];

  const usdOptimized = new Map([
    ["https://commons.wikimedia.org/wiki/Special:Redirect/file/US_%242_bill_obverse_series_2003_A.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/US_$2_bill_obverse_series_2003_A.jpg/1200px-US_$2_bill_obverse_series_2003_A.jpg"],
    ["https://commons.wikimedia.org/wiki/Special:Redirect/file/US_%242_bill_reverse_series_2003_A.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/US_$2_bill_reverse_series_2003_A.jpg/1200px-US_$2_bill_reverse_series_2003_A.jpg"],
    ["https://commons.wikimedia.org/wiki/Special:Redirect/file/50_USD_Series_2004_Note_Back.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/50_USD_Series_2004_Note_Back.jpg/1200px-US_$2_bill_reverse_series_2003_A.jpg"],
    ["https://commons.wikimedia.org/wiki/Special:Redirect/file/50_USD_Series_2004_Note_Back.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/50_USD_Series_2004_Note_Back.jpg/1200px-50_USD_Series_2004_Note_Back.jpg"]
  ]);

  const unwrapLegacyProxy = (value) => {
    if (!value || typeof value !== "string") return value;
    if (!value.startsWith("/.netlify/functions/note-image?url=")) return value;
    try { const u = new URL(value, location.origin); return u.searchParams.get("url") || value; } catch { return value; }
  };

  const throughProxy = (rawValue) => {
    let value = unwrapLegacyProxy(rawValue);
    value = usdOptimized.get(value) || value;
    if (!value || typeof value !== "string" || !value.startsWith("https://")) return value;
    try {
      const u = new URL(value);
      if (!proxyable.includes(u.hostname)) return value;
      return `/.netlify/functions/image-proxy?url=${encodeURIComponent(value)}`;
    } catch { return value; }
  };

  window.fetch = async (...args) => {
    const request = args[0];
    const url = typeof request === "string" ? request : request?.url || "";
    const response = await previousFetch(...args);
    if (!url.includes("/data/notes.json")) return response;
    const notes = await response.clone().json();
    for (const note of notes) { note.front = throughProxy(note.front); note.back = throughProxy(note.back); }
    return new Response(JSON.stringify(notes), {status:response.status,statusText:response.statusText,headers:{"Content-Type":"application/json; charset=utf-8"}});
  };
})();