(() => {
  const P='/assets/notes/restricted-front.svg', B='/assets/notes/restricted-back.svg';
  const rules={
    MXN:{values:[20,50,100,200,500,1000],source:'Banco de México',url:'https://www.banxico.org.mx/billetes-y-monedas/',rulesUrl:'https://www.anterior.banxico.org.mx/dyn/disposiciones/autorizaciones-consultas-y-sanciones/reproduccion-billetes-monedas.html',text:'A reprodução integral de imagens de bilhetes mexicanos está sujeita a autorização. A app mantém as denominações e a ficha monetária, mas não incorpora a imagem integral sem essa autorização.'},
    CNY:{values:[1,5,10,20,50,100],source:"People's Bank of China",url:'https://www.pbc.gov.cn/en/3688110/3688259/3689032/index.html',rulesUrl:'https://www.pbc.gov.cn/en/3688110/3688259/3689032/3709448/index.html',text:'O uso de desenhos do renminbi é regulado pelo People’s Bank of China. As imagens integrais ficam reservadas até existir base de utilização adequada.'},
    SGD:{values:[2,5,10,50,100,1000],source:'Monetary Authority of Singapore',url:'https://www.mas.gov.sg/currency',rulesUrl:'https://eservices.mas.gov.sg/sgseapps/public/termsOfUse.jsp',text:'As imagens oficiais da MAS permanecem sujeitas às respetivas condições de reprodução. A app usa imagens independentes apenas quando existe uma licença de reutilização adequada.'},
    HKD:{values:[10,20,50,100,500,1000],source:'Hong Kong Monetary Authority / bancos emissores',url:'https://www.hkma.gov.hk/eng/key-functions/money/hong-kong-currency/',rulesUrl:'https://www.hkma.gov.hk/eng/smart-consumers/frequently-asked-questions/banking/a/11/',text:'As imagens das notas de Hong Kong pertencem aos bancos emissores ou ao Governo. A reprodução pode exigir consentimento dos titulares dos direitos e, consoante o uso, aprovação da HKMA.'}
  };
  // Portrait Series: only override restricted placeholders when a separately reusable image is verified.
  // The S$2 paper obverse below is an uploader-created photograph released CC0 on Wikimedia Commons.
  const SGD_FREE={
    2:{front:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tampak%20depan%202%20dolar%20potret%20kertas.jpg',frontPage:'https://commons.wikimedia.org/wiki/File:Tampak_depan_2_dolar_potret_kertas.jpg'}
  };
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await nativeFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const notes=await response.clone().json();
    for(const [currency,cfg] of Object.entries(rules)){
      for(const value of cfg.values){
        let n=notes.find(x=>x.currency===currency&&Number(x.value)===value);
        if(!n){n={currency,value,status:'circulating',statusLabel:'Em circulação',material:'A confirmar',source:cfg.source};notes.push(n);}
        Object.assign(n,{front:P,back:B,imageStatus:'restricted',imageSource:cfg.source,imageSourceUrl:cfg.url,reproductionRulesUrl:cfg.rulesUrl,restrictionText:cfg.text});
        if(currency==='SGD'){
          n.series='Portrait Series';
          if(Number(value)===1000){n.status='legal-tender-legacy';n.statusLabel='Curso legal · emissão cessada';}
          const free=SGD_FREE[value];
          if(free?.front){n.front=free.front;n.imageStatus='licensed-partial';n.imageSource='Wikimedia Commons · CC0';n.imageSourceUrl=free.frontPage;}
        }
      }
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
  window.NDM_RESTRICTED_RULES=rules;
})();
