(() => {
  const commons=f=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(f);
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM NÃO INCORPORADA</text><text x="360" y="216" text-anchor="middle" fill="#6f8392" font-family="Arial,sans-serif" font-size="18">VER FONTE OFICIAL</text></svg>`);

  const cfg={
    DKK:{values:[50,100,200,500],source:'Danmarks Nationalbank',material:'Papel',url:'https://www.nationalbanken.dk/en/what-we-do/notes-and-coins',dims:{50:'125 × 72 mm',100:'135 × 72 mm',200:'145 × 72 mm',500:'155 × 72 mm'}},
    ARS:{values:[1000,2000,10000,20000],source:'Banco Central de la República Argentina',material:'Papel',url:'https://www.bcra.gob.ar/billetes-y-monedas/'},
    CLP:{values:[1000,2000,5000,10000,20000],source:'Banco Central de Chile',material:'Papel / polímero',url:'https://www.bcentral.cl/web/banco-central/areas/billetes-y-monedas'},
    MAD:{values:[20,50,100,200],source:'Bank Al-Maghrib',material:'Papel',url:'https://www.bkam.ma/en/Banknotes-and-coins/Cash-lifecycle/Banknotes-in-circulation/2023-series',dims:{20:'131 × 70 mm',50:'138 × 70 mm',100:'145 × 70 mm',200:'151 × 70 mm'}},
    KES:{values:[50,100,200,500,1000],source:'Central Bank of Kenya',material:'Papel',url:'https://www.centralbank.go.ke/currency-services/',dims:{50:'123 × 62 mm',100:'128 × 64 mm',200:'133 × 66 mm',500:'138 × 68 mm',1000:'143 × 70 mm'}},
    EGP:{values:[5,10,20,50,100,200],source:'Central Bank of Egypt',material:'Papel / polímero',url:'https://www.cbe.org.eg/en/banknote/banknote-issuance/denominations'}
  };

  const DKK={50:'https://www.nationalbanken.dk/media/3qmnzfp1/2009a-seddelserie-50kr.png',100:'https://www.nationalbanken.dk/media/rrplhbpz/2009a-seddelserie-100kr.png',200:'https://www.nationalbanken.dk/media/nxlf3s5q/2009a-seddelserie-200kr.png',500:'https://www.nationalbanken.dk/media/yurncwyo/2009a-seddelserie-500kr.png'};
  const MAD_LOCAL={
    20:['/assets/notes/mad/20-front.jpg','/assets/notes/mad/20-back.jpg'],
    50:['/assets/notes/mad/50-front.jpg','/assets/notes/mad/50-back.jpg'],
    100:['/assets/notes/mad/100-front.jpg','/assets/notes/mad/100-back.jpg'],
    200:['/assets/notes/mad/200-front.jpg','/assets/notes/mad/200-back.jpg']
  };
  const MAD_OFFICIAL={
    20:'https://www.bkam.ma/en/Banknotes-and-coins/Cash-lifecycle/Banknotes-in-circulation/2023-series/20-dh-banknote',
    50:'https://www.bkam.ma/en/Banknotes-and-coins/Cash-lifecycle/Banknotes-in-circulation/2023-series',
    100:'https://www.bkam.ma/en/Banknotes-and-coins/Cash-lifecycle/Banknotes-in-circulation/2023-series',
    200:'https://www.bkam.ma/en/Banknotes-and-coins/Cash-lifecycle/Banknotes-in-circulation/2023-series'
  };
  const KES={
    50:['KENW0052-2024o.jpg','Kenya 50 Shilling banknote, reverse.jpg'],
    100:['KENW0053-2024o.jpg','KENW0053-2024r.jpg'],
    200:['KENW0054-2024o.jpg','KENW0054-2024r.jpg'],
    500:['/assets/notes/kes/500-front.jpg','/assets/notes/kes/500-back.jpg'],
    1000:['KENW2019-1000o.jpg','KENW2019-1000r.jpg']
  };
  const EGP={5:['5 EGP obverse 2011-5-19.jpg','5 EGP reverse 2011-5-19.jpg'],10:['10 EGP obverse 2014-8-13.jpg','10 EGP reverse 2014-8-13.jpg'],20:['20 EGP 2022 Polymer - front 01.jpg','20 EGP 2022 Polymer - rear.jpg'],50:['50 EGP obverse 2011-5-4.jpg','50 EGP reverse 2011-5-4.jpg'],100:['100 EGP obverse 2014-1-26.jpg','100 EGP reverse 2014-1-26.jpg'],200:['200 EGP obverse 2010-1-2.jpg','200 EGP reverse 2010-1-2.jpg']};

  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);if(!url.includes('/data/notes.json'))return response;const notes=await response.clone().json();
    for(const [currency,c] of Object.entries(cfg))for(const value of c.values){let n=notes.find(x=>x.currency===currency&&Number(x.value)===Number(value));if(!n){n={currency,value:Number(value)};notes.push(n);}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,imageSource:c.source,imageSourceUrl:c.url,officialUrl:c.url,officialLabel:`Ver ${currency} ${value} na fonte oficial`});if(c.dims?.[value])n.dimensions=c.dims[value];
      if(currency==='DKK'){n.front=DKK[value];n.back=DKK[value];n.series='2009A · atual';n.imageStatus='official-combined-reference';n.imageSource='Danmarks Nationalbank · imagem oficial SPECIMEN (frente + verso)';}
      else if(currency==='MAD'){
        n.front=MAD_LOCAL[value][0];n.back=MAD_LOCAL[value][1];n.series='Série 2023';n.imageStatus='local-reference';n.imageSource='Imagem fornecida pelo utilizador · referência Bank Al-Maghrib';n.imageSourceUrl=MAD_OFFICIAL[value];n.officialUrl=MAD_OFFICIAL[value];n.officialLabel=`Ver MAD ${value} na fonte oficial`;delete n.restrictionText;
      }
      else if(currency==='KES'){
        const local=value===500;
        n.front=local?KES[value][0]:commons(KES[value][0]);n.back=local?KES[value][1]:commons(KES[value][1]);
        n.series=value===1000?'Nova geração 2019':'Nova geração 2019 / atualização 2024';
        n.imageStatus=local?'local-reference':'reference-reproduction';
        n.imageSource=local?'Imagem fornecida pelo utilizador · referência Central Bank of Kenya':'Central Bank of Kenya / Wikimedia Commons';
      }
      else if(currency==='EGP'){n.front=commons(EGP[value][0]);n.back=commons(EGP[value][1]);n.imageStatus='public-domain';n.imageSource='Central Bank of Egypt / Wikimedia Commons';if(value===20){n.series='Polímero 2022';n.material='Polímero';}}
      else{n.front=placeholder(currency,value);n.back=placeholder(currency,value);n.imageStatus='official-link';n.restrictionText=currency==='ARS'?'As notas argentinas atuais permanecem ligadas à fonte oficial; a reprodução de desenhos recentes requer cautela quanto a direitos de autor.':'O Banco Central de Chile declara deter os direitos sobre os desenhos das notas atuais e proíbe a reprodução total ou parcial sem consentimento.';}
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
