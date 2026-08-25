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
    "ecb.europa.eu"
  ];

  const throughProxy = (value) => {
    if (!value || typeof value !== "string" || !value.startsWith("https://")) return value;
    try {
      const u = new URL(value);
      if (!proxyable.includes(u.hostname)) return value;
      return `/.netlify/functions/image-proxy?url=${encodeURIComponent(value)}`;
    } catch {
      return value;
    }
  };

  window.fetch = async (...args) => {
    const request = args[0];
    const url = typeof request === "string" ? request : request?.url || "";
    const response = await previousFetch(...args);
    if (!url.includes("/data/notes.json")) return response;

    const notes = await response.clone().json();
    for (const note of notes) {
      note.front = throughProxy(note.front);
      note.back = throughProxy(note.back);
    }

    return new Response(JSON.stringify(notes), {
      status: response.status,
      statusText: response.statusText,
      headers: {"Content-Type": "application/json; charset=utf-8"}
    });
  };
})();
