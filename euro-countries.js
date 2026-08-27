(() => {
  const euroCountries = [
    {id:'AND',name:'Andorra',flag:'🇦🇩',continent:'Europe',currency:'EUR',capital:'Andorra-a-Velha',population:'≈ 82 mil',language:'Catalão',history:[['até 2001','Franco francês / peseta espanhola'],['2002–hoje','Euro (EUR)']]},
    {id:'AUT',name:'Áustria',flag:'🇦🇹',continent:'Europe',currency:'EUR',capital:'Viena',population:'≈ 9,2 milhões',language:'Alemão',history:[['1925–2001','Xelim austríaco'],['1999/2002–hoje','Euro (EUR)']]},
    {id:'BEL',name:'Bélgica',flag:'🇧🇪',continent:'Europe',currency:'EUR',capital:'Bruxelas',population:'≈ 11,8 milhões',language:'Neerlandês / Francês / Alemão',history:[['1832–2001','Franco belga'],['1999/2002–hoje','Euro (EUR)']]},
    {id:'BGR',name:'Bulgária',flag:'🇧🇬',continent:'Europe',currency:'EUR',capital:'Sófia',population:'≈ 6,4 milhões',language:'Búlgaro',history:[['1881–2025','Lev búlgaro (BGN)'],['2026–hoje','Euro (EUR)']]},
    {id:'HRV',name:'Croácia',flag:'🇭🇷',continent:'Europe',currency:'EUR',capital:'Zagreb',population:'≈ 3,9 milhões',language:'Croata',history:[['1994–2022','Kuna croata'],['2023–hoje','Euro (EUR)']]},
    {id:'CYP',name:'Chipre',flag:'🇨🇾',continent:'Europe',currency:'EUR',capital:'Nicósia',population:'≈ 1,3 milhões',language:'Grego / Turco',history:[['1879–2007','Libra cipriota'],['2008–hoje','Euro (EUR)']]},
    {id:'SVK',name:'Eslováquia',flag:'🇸🇰',continent:'Europe',currency:'EUR',capital:'Bratislava',population:'≈ 5,4 milhões',language:'Eslovaco',history:[['1993–2008','Coroa eslovaca'],['2009–hoje','Euro (EUR)']]},
    {id:'SVN',name:'Eslovénia',flag:'🇸🇮',continent:'Europe',currency:'EUR',capital:'Liubliana',population:'≈ 2,1 milhões',language:'Esloveno',history:[['1991–2006','Tolar esloveno'],['2007–hoje','Euro (EUR)']]},
    {id:'EST',name:'Estónia',flag:'🇪🇪',continent:'Europe',currency:'EUR',capital:'Tallinn',population:'≈ 1,4 milhões',language:'Estónio',history:[['1992–2010','Coroa estónia'],['2011–hoje','Euro (EUR)']]},
    {id:'FIN',name:'Finlândia',flag:'🇫🇮',continent:'Europe',currency:'EUR',capital:'Helsínquia',population:'≈ 5,6 milhões',language:'Finlandês / Sueco',history:[['1860–2001','Marco finlandês'],['1999/2002–hoje','Euro (EUR)']]},
    {id:'GRC',name:'Grécia',flag:'🇬🇷',continent:'Europe',currency:'EUR',capital:'Atenas',population:'≈ 10,4 milhões',language:'Grego',history:[['1832–2001','Dracma grega'],['2001/2002–hoje','Euro (EUR)']]},
    {id:'LVA',name:'Letónia',flag:'🇱🇻',continent:'Europe',currency:'EUR',capital:'Riga',population:'≈ 1,9 milhões',language:'Letão',history:[['1993–2013','Lats letão'],['2014–hoje','Euro (EUR)']]},
    {id:'LTU',name:'Lituânia',flag:'🇱🇹',continent:'Europe',currency:'EUR',capital:'Vilnius',population:'≈ 2,9 milhões',language:'Lituano',history:[['1993–2014','Litas lituano'],['2015–hoje','Euro (EUR)']]},
    {id:'LUX',name:'Luxemburgo',flag:'🇱🇺',continent:'Europe',currency:'EUR',capital:'Luxemburgo',population:'≈ 680 mil',language:'Luxemburguês / Francês / Alemão',history:[['1854–2001','Franco luxemburguês'],['1999/2002–hoje','Euro (EUR)']]},
    {id:'MLT',name:'Malta',flag:'🇲🇹',continent:'Europe',currency:'EUR',capital:'Valeta',population:'≈ 570 mil',language:'Maltês / Inglês',history:[['1972–2007','Lira maltesa'],['2008–hoje','Euro (EUR)']]},
    {id:'NLD',name:'Países Baixos',flag:'🇳🇱',continent:'Europe',currency:'EUR',capital:'Amesterdão',population:'≈ 18 milhões',language:'Neerlandês',history:[['1816–2001','Florim neerlandês'],['1999/2002–hoje','Euro (EUR)']]},
    {id:'MCO',name:'Mónaco',flag:'🇲🇨',continent:'Europe',currency:'EUR',capital:'Mónaco',population:'≈ 39 mil',language:'Francês',history:[['até 2001','Franco francês'],['2002–hoje','Euro (EUR)']]},
    {id:'SMR',name:'San Marino',flag:'🇸🇲',continent:'Europe',currency:'EUR',capital:'San Marino',population:'≈ 34 mil',language:'Italiano',history:[['1864–2001','Lira de San Marino / lira italiana'],['2002–hoje','Euro (EUR)']]},
    {id:'VAT',name:'Vaticano',flag:'🇻🇦',continent:'Europe',currency:'EUR',capital:'Cidade do Vaticano',population:'≈ 800',language:'Italiano / Latim',history:[['1929–2001','Lira vaticana'],['2002–hoje','Euro (EUR)']]},
    {id:'MNE',name:'Montenegro',flag:'🇲🇪',continent:'Europe',currency:'EUR',capital:'Podgorica',population:'≈ 620 mil',language:'Montenegrino',history:[['1999–2001','Marco alemão'],['2002–hoje','Euro (EUR), adoção unilateral']]},
    {id:'XKX',name:'Kosovo',flag:'🇽🇰',continent:'Europe',currency:'EUR',capital:'Pristina',population:'≈ 1,6 milhões',language:'Albanês / Sérvio',history:[['1999–2001','Marco alemão'],['2002–hoje','Euro (EUR), adoção unilateral']]}
  ];
  const previousFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const request = args[0];
    const url = typeof request === 'string' ? request : request?.url || '';
    const response = await previousFetch(...args);
    if (!url.includes('/data/countries.json')) return response;
    const countries = await response.clone().json();
    for (const country of euroCountries) {
      if (!countries.some(c => c.id === country.id)) countries.push(country);
    }
    return new Response(JSON.stringify(countries), {
      status: response.status,
      statusText: response.statusText,
      headers: {'Content-Type':'application/json; charset=utf-8'}
    });
  };
})();
