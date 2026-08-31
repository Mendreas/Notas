(() => {
  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init)=>{
    const url=typeof input==='string'?input:input?.url||'';
    if(url.startsWith('https://api.frankfurter.app/latest?from=EUR')){
      return Promise.resolve(new Response(JSON.stringify({rates:{}}),{status:200,headers:{'Content-Type':'application/json'}}));
    }
    return nativeFetch(input,init);
  };
})();
