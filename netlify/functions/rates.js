exports.handler = async function(){
  try{
    const r=await fetch('https://open.er-api.com/v6/latest/EUR',{headers:{'User-Agent':'NotasDoMundo/1.0'}});
    if(!r.ok) throw new Error('upstream '+r.status);
    const j=await r.json();
    if(!j || !j.rates) throw new Error('invalid payload');
    return {statusCode:200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=1800, s-maxage=1800'},body:JSON.stringify({base:'EUR',time_last_update_utc:j.time_last_update_utc||null,rates:j.rates})};
  }catch(e){
    return {statusCode:502,headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({error:'rates_unavailable'})};
  }
};
