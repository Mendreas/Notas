(() => {
 const base="https://www.banxico.org.mx/multimedia/";
 const notes={
  20:{front:base+"20G_anv.png",back:base+"20G_rev.png",dimensions:"120 × 65 mm",material:"Polímero",officialUrl:"https://www.banxico.org.mx/banknotes-and-coins/20-peso-commemorative-bankn.html"},
  50:{front:base+"50G_anv.png",back:base+"50G_rev.png",dimensions:"125 × 65 mm",material:"Polímero",officialUrl:"https://www.banxico.org.mx/banknotes-and-coins/50-peso-banknote-g-circulat.html"},
  100:{front:base+"100G_anv_ngo.png",back:base+"100G_rev_ngo.png",dimensions:"132 × 65 mm",material:"Polímero",officialUrl:"https://www.banxico.org.mx/banknotes-and-coins/100-peso-banknote-g-circula.html"},
  200:{front:base+"200G_anv_web.png",back:base+"200G_rev_web.png",dimensions:"139 × 65 mm",material:"Papel de algodão",officialUrl:"https://www.banxico.org.mx/banknotes-and-coins/200-peso-banknote-circulati.html"},
  500:{front:base+"bill500G_Anv.png",back:base+"bill500G_Rev.png",dimensions:"146 × 65 mm",material:"Papel de algodão",officialUrl:"https://www.banxico.org.mx/banknotes-and-coins/500-peso-banknote-circulation001.html"},
  1000:{front:base+"1000G_anv_ngo.png",back:base+"1000G_rev_ngo.png",dimensions:"153 × 65 mm",material:"Papel de algodão",officialUrl:"https://www.banxico.org.mx/banknotes-and-coins/pagina-banknotes-and-coins00001.html"}
 };
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const request=args[0],url=typeof request==="string"?request:request?.url||"";
  const response=await oldFetch(...args);
  if(!url.includes("/data/notes.json"))return response;
  const data=await response.clone().json();
  data.filter(n=>n.currency==="MXN"&&notes[n.value]).forEach(n=>Object.assign(n,notes[n.value],{imageStatus:"official",imageSource:"Banco de México",source:"Banco de México"}));
  return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{"Content-Type":"application/json; charset=utf-8"}});
 };
})();
