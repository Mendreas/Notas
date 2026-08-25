(() => {
  const P='/assets/notes/restricted-front.svg', B='/assets/notes/restricted-back.svg';
  const rules={
    MXN:{values:[20,50,100,200,500,1000],source:'Banco de México',url:'https://www.banxico.org.mx/billetes-y-monedas/',rulesUrl:'https://www.anterior.banxico.org.mx/dyn/disposiciones/autorizaciones-consultas-y-sanciones/reproduccion-billetes-monedas.html',text:'A reprodução integral de imagens de bilhetes mexicanos está sujeita a autorização. A app mantém as denominações e a ficha monetária, mas não incorpora a imagem integral sem essa autorização.'},
    CNY:{values:[1,5,10,20,50,100],source:"People's Bank of China",url:'https://www.pbc.gov.cn/en/3688110/3688259/3689032/index.html',rulesUrl:'https://www.pbc.gov.cn/en/3688110/3688259/3689032/3709448/index.html',text:'O uso de desenhos do renminbi é regulado pelo People’s Bank of China. As imagens integrais ficam reservadas até existir base de utilização adequada.'},
    SGD:{values:[2,5,10,50,100,1000],source:'Monetary Authority of Singapore',url:'https://www.mas.gov.sg/currency/circulation-currency/circulation-currency-notes',rulesUrl:'https://eservices.mas.gov.sg/sgseapps/public/termsOfUse.jsp',text:'As reproduções SPECIMEN usadas na app foram fornecidas a partir da página oficial da MAS e estão guardadas como assets locais.'},
    HKD:{values:[10,20,50,100,500,1000],source:'Hong Kong Monetary Authority / bancos emissores',url:'https://www.hkma.gov.hk/eng/key-functions/money/hong-kong-currency/',rulesUrl:'https://www.hkma.gov.hk/eng/smart-consumers/frequently-asked-questions/banking/a/11/',text:'As imagens das notas de Hong Kong pertencem aos bancos emissores ou ao Governo. A reprodução pode exigir consentimento dos titulares dos direitos e, consoante o uso, aprovação da HKMA.'}
  };
  const SGD_LOCAL={
    2:{front:'/assets/notes/sgd/sgd-2-front.png',back:'/assets/notes/sgd/sgd-2-back.png'},
    5:{front:'/assets/notes/sgd/sgd-5-front.png',back:'/assets/notes/sgd/sgd-5-back.png'},
    10:{front:'/assets/notes/sgd/sgd-10-front.png',back:'/assets/notes/sgd/sgd-10-back.png'},
    50:{front:'/assets/notes/sgd/sgd-50-front.png',back:'/assets/notes/sgd/sgd-50-back.png'},
    100:{front:'/assets/notes/sgd/sgd-100-front.jpeg',back:'/assets/notes/sgd/sgd-100-back.png'},
    1000:{front:'/assets/notes/sgd/sgd-1000-front.png',back:'/assets/notes/sgd/sgd-1000-back.png'}
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
          n.material='Papel / polímero';
          if(Number(value)===1000){n.status='legal-tender-legacy';n.statusLabel='Curso legal · emissão cessada';}
          const local=SGD_LOCAL[value];
          if(local){
            n.front=local.front;
            n.back=local.back;
            n.imageStatus='official-reproduction';
            n.imageSource='Monetary Authority of Singapore · Portrait Series · SPECIMEN';
            n.imageSourceUrl=cfg.url;
            delete n.restrictionText;
          }
        }
      }
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
  window.NDM_RESTRICTED_RULES=rules;
})();
