(() => {
  const nativeFetch = window.fetch.bind(window);
  const jsonResponse = (res, data) => new Response(JSON.stringify(data), {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });

  window.fetch = async (input, init) => {
    const res = await nativeFetch(input, init);
    const url = typeof input === 'string' ? input : (input && input.url) || '';

    if (url.includes('/data/currencies.json')) {
      const data = await res.clone().json();
      if (!data.MOP) {
        data.MOP = {
          name: 'Pataca de Macau',
          symbol: 'MOP$',
          group: 'Macau',
          source: 'Autoridade Monetária de Macau / bancos emissores',
          rate: 9.4,
          material: 'Papel',
          notes: [10,20,50,100,500,1000],
          countries: ['MAC'],
          editorial: {
            role: 'Moeda oficial da Região Administrativa Especial de Macau',
            issuer: 'Banco Nacional Ultramarino e Banco da China, sob supervisão da Autoridade Monetária de Macau',
            fact: 'A pataca está ligada ao dólar de Hong Kong e é emitida por dois bancos autorizados.',
            security: 'Marcas de água, fios de segurança, microimpressão e elementos ópticos variáveis conforme a emissão.'
          },
          focus: false
        };
      }
      return jsonResponse(res, data);
    }

    if (url.includes('/data/countries.json')) {
      const data = await res.clone().json();
      if (!data.some(c => c.id === 'MAC')) {
        data.push({
          id: 'MAC',
          name: 'Macau',
          flag: '🇲🇴',
          continent: 'Asia',
          currency: 'MOP',
          capital: 'Macau',
          population: '≈ 0,7 milhões',
          language: 'Chinês / Português',
          history: [
            ['1906–hoje', 'Pataca de Macau (MOP)'],
            ['1999–hoje', 'Moeda da Região Administrativa Especial de Macau']
          ]
        });
      }
      return jsonResponse(res, data);
    }

    if (url.includes('/data/notes.json')) {
      const data = await res.clone().json();
      const values = [10,20,50,100,500,1000];
      for (const value of values) {
        if (!data.some(n => n.currency === 'MOP' && Number(n.value) === value)) {
          data.push({
            currency: 'MOP',
            value,
            front: '/assets/notes/placeholder-front.svg',
            back: '/assets/notes/placeholder-back.svg',
            status: 'circulating',
            statusLabel: 'Em circulação',
            source: 'Autoridade Monetária de Macau / Banco Nacional Ultramarino',
            material: 'Papel'
          });
        }
      }
      return jsonResponse(res, data);
    }

    return res;
  };
})();
