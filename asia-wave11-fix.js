(() => {
  const prev = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const r = await prev(...args);
    const u = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';

    if (u.includes('/data/countries.json')) {
      const d = await r.clone().json();
      const defaults = {
        SYR:{population:'≈ 25 milhões',history:[['1948','Introdução da libra síria moderna sob o Banco Central da Síria.'],['Atualidade','A libra síria continua a ser a moeda nacional, com várias emissões recentes.']]},
        YEM:{population:'≈ 35 milhões',history:[['1990','Após a unificação do Iémen, o rial iemenita tornou-se a moeda nacional.'],['Atualidade','O rial continua em circulação, com emissões de diferentes períodos.']]},
        PRK:{population:'≈ 26 milhões',history:[['1947','Introdução do won norte-coreano.'],['2009','Reforma monetária e emissão da série atualmente mais conhecida.']]},
        PSE:{population:'≈ 5,5 milhões',history:[['Atualidade','A Palestina não emite atualmente uma moeda nacional própria.'],['Circulação','São usados sobretudo o novo shekel israelita (ILS), o dinar jordano (JOD) e também o dólar dos EUA (USD).']]}
      };
      Object.entries(defaults).forEach(([id,x])=>{
        const c=d.find(v=>v.id===id);
        if(c){
          if(!c.population)c.population=x.population;
          if(!Array.isArray(c.history)||!c.history.length)c.history=x.history;
        }
      });
      return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}});
    }

    if (u.includes('/data/notes.json')) {
      const d = await r.clone().json();
      const n = d.find(x=>x.currency==='YER' && Number(x.value)===100);
      if(n) Object.assign(n,{
        front:'/assets/notes/banknotews/yer/100-front.jpg?v=123',
        back:'/assets/notes/banknotews/yer/100-back.jpg?v=123',
        imageStatus:'local-reference',
        imageSource:'Banknote Museum · banknote.ws',
        imageSourceUrl:'https://www.banknote.ws/COLLECTION/countries/ASI/YEM/YEMW0037.htm',
        status:'circulating',statusLabel:'Em circulação'
      });
      return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}});
    }

    return r;
  };
})();