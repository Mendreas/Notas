(() => {
  const identify=()=>{
    const h=document.querySelector('#modalBody h2')?.textContent||'';
    const map=[['MXN','$','Peso mexicano'],['CNY','¥','Renminbi'],['SGD','S$','Dólar de Singapura'],['HKD','HK$','Dólar de Hong Kong']];
    for(const [code,symbol,name] of map){if(h.includes(name)||h.includes(`· ${name}`)||(code==='SGD'&&h.includes('Dólar de Singapura'))||(code==='HKD'&&h.includes('Dólar de Hong Kong')))return code;}
    return null;
  };
  const apply=()=>{
    const body=document.querySelector('#modalBody'); if(!body)return;
    const code=identify(), old=body.querySelector('.restricted-note-notice');
    if(!code){old?.remove();return;}
    const cfg=window.NDM_RESTRICTED_RULES?.[code]; if(!cfg)return;
    if(!old){
      const box=document.createElement('div');box.className='notice restricted-note-notice';
      box.innerHTML=`<strong>Reprodução integral não incorporada.</strong><p style="margin:.45rem 0 .65rem">${cfg.text}</p><a href="${cfg.url}" target="_blank" rel="noopener">Ver fonte oficial</a> · <a href="${cfg.rulesUrl}" target="_blank" rel="noopener">Regras de reprodução</a>`;
      const head=body.querySelector('.note-detail-head');(head||body).insertAdjacentElement(head?'afterend':'afterbegin',box);
    }
  };
  new MutationObserver(()=>queueMicrotask(apply)).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0));
})();
