(() => {
  const overrides = {
    "CAD:5":{front:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/5_front.png",back:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/5_back.png",dimensions:"152.4 × 69.85 mm",imageStatus:"official",imageSource:"Bank of Canada"},
    "CAD:10":{front:"/assets/notes/cad/cad-10-front.png",back:"/assets/notes/cad/cad-10-back.png",dimensions:"152.4 × 69.85 mm",imageStatus:"local-reproduction",imageSource:"Imagem fornecida pelo utilizador"},
    "CAD:20":{front:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/20_front.png",back:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/20_back.png",dimensions:"152.4 × 69.85 mm",imageStatus:"official",imageSource:"Bank of Canada"},
    "CAD:50":{front:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/50_front.png",back:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/50_back.png",dimensions:"152.4 × 69.85 mm",imageStatus:"official",imageSource:"Bank of Canada"},
    "CAD:100":{front:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/100_front.png",back:"https://www.bankofcanada.ca/wp-content/uploads/2015/09/100_back.png",dimensions:"152.4 × 69.85 mm",imageStatus:"official",imageSource:"Bank of Canada"}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==="string"?request:request?.url||"";
    const response=await previousFetch(...args);
    if(!url.includes("/data/notes.json"))return response;
    const notes=await response.clone().json();
    notes.forEach(n=>{const k=`${n.currency}:${n.value}`;if(overrides[k])Object.assign(n,overrides[k]);});
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{"Content-Type":"application/json; charset=utf-8"}});
  };
})();
