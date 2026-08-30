(() => {
  const previousFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const req = args[0];
    const url = typeof req === 'string' ? req : req?.url || '';
    const response = await previousFetch(...args);
    if (!url.includes('/data/notes.json')) return response;
    const data = await response.clone().json();
    for (const note of data) {
      if (note.currency === 'PHP' && Number(note.value) === 200) {
        Object.assign(note, {
          front: '/assets/notes/banknotews/php/200-front.jpg?v=20260830-2',
          back: '/assets/notes/banknotews/php/200-back.jpg?v=20260830-2',
          imageStatus: 'local-reference',
          imageSource: 'Banknote Museum · banknote.ws',
          imageSourceUrl: 'https://www.banknote.ws/COLLECTION/countries/ASI/PIL/PILW2020-0200.htm'
        });
      }
    }
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  };
})();
