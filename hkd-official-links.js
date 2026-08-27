(() => {
  const HKMA_10 = "https://www.hkma.gov.hk/eng/key-functions/money/hong-kong-currency/notes/";
  const HSBC_2018 = "https://www.hsbc.com.hk/banknotes-2018/";
  const info = {
    10:{dimensions:"134 × 66 mm",issuer:"Governo da RAE de Hong Kong",material:"Polímero",officialUrl:HKMA_10,officialLabel:"Ver a nota HK$10 na fonte oficial (HKMA)"},
    20:{dimensions:"143 × 71.5 mm",issuer:"HSBC · série representativa 2018",material:"Papel",officialUrl:HSBC_2018,officialLabel:"Ver frente e verso oficiais no HSBC"},
    50:{dimensions:"148 × 74 mm",issuer:"HSBC · série representativa 2018",material:"Papel",officialUrl:HSBC_2018,officialLabel:"Ver frente e verso oficiais no HSBC"},
    100:{dimensions:"153 × 76.5 mm",issuer:"HSBC · série representativa 2018",material:"Papel",officialUrl:HSBC_2018,officialLabel:"Ver frente e verso oficiais no HSBC"},
    500:{dimensions:"158 × 79 mm",issuer:"HSBC · série representativa 2018",material:"Papel",officialUrl:HSBC_2018,officialLabel:"Ver frente e verso oficiais no HSBC"},
    1000:{dimensions:"163 × 81.5 mm",issuer:"HSBC · série representativa 2018",material:"Papel",officialUrl:HSBC_2018,officialLabel:"Ver frente e verso oficiais no HSBC"}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==="string"?request:request?.url||"";
    const response=await previousFetch(...args);
    if(!url.includes("/data/notes.json"))return response;
    const notes=await response.clone().json();
    notes.filter(n=>n.currency==="HKD"&&info[n.value]).forEach(n=>{
      const x=info[n.value];
      Object.assign(n,{dimensions:x.dimensions,material:x.material,displayIssuer:x.issuer,officialUrl:x.officialUrl,officialLabel:x.officialLabel,imageStatus:"official-link",imageSource:n.value===10?"Hong Kong Monetary Authority":"HSBC Hong Kong"});
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{"Content-Type":"application/json; charset=utf-8"}});
  };
})();
