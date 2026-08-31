(() => {
  const groups = [
    window.NOTE_CONTEXT_MANUAL,
    window.NOTE_CONTEXT_CATALOG,
    window.NOTE_CONTEXT_WAVE5,
    window.NOTE_CONTEXT_WAVE4,
    window.NOTE_CONTEXT_WAVE3,
    window.NOTE_CONTEXT_WAVE2
  ].filter(Boolean);

  function cleanQuery(title='') {
    return String(title)
      .replace(/\s*[·|].*$/,'')
      .replace(/\s*\([^)]*\)\s*$/,'')
      .replace(/^Frente\s*:\s*/i,'')
      .replace(/^Verso\s*:\s*/i,'')
      .trim();
  }

  function wikiSearch(title='') {
    const q = cleanQuery(title);
    if (!q) return '';
    return `https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`;
  }

  for (const group of groups) {
    for (const entry of Object.values(group || {})) {
      for (const side of ['front','back']) {
        const info = entry?.[side];
        if (!info) continue;
        if (!info.wiki) info.wiki = wikiSearch(info.title || info.summary || '');
      }
    }
  }

  window.NOTE_CONTEXT_ENRICHMENT = { wikiSearch };
})();
