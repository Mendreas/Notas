(() => {
  const previousFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const req = args[0];
    const url = typeof req === 'string' ? req : req?.url || '';
    const response = await previousFetch(...args);
    if (!url.includes('/data/notes.json')) return response;
    const data = await response.clone().json();
    for (const note of data) {
      if (note.currency === 'HKD' && Number(note.value) === 10) {
        Object.assign(note, {
          front: '/assets/notes/banknotews/hkd/10-front.jpg',
          back: '/assets/notes/banknotews/hkd/10-back.jpg',
          imageStatus: 'local-user',
          imageSource: 'Imagem fornecida pelo utilizador'
        });
        delete note.restrictionText;
      }
    }
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  };
})();
