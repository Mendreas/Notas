(()=>{
  const storageKey='ndm-collection-v1';
  const q=s=>document.querySelector(s);
  const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}};
  const write=o=>localStorage.setItem(storageKey,JSON.stringify(o));
  function cleanEmpty(all){
    for(const [k,st] of Object.entries(all)){
      if(!st||(!st.owned&&!st.wanted&&!st.seen))delete all[k];
    }
    return all;
  }
  function clearField(field){
    const all=read();
    for(const st of Object.values(all))if(st&&typeof st==='object')delete st[field];
    write(cleanEmpty(all));
  }
  function resetAll(){localStorage.removeItem(storageKey)}
  function renderPanel(){
    if(q('[data-collection-management]'))return;
    const summary=q('.collection-summary');
    if(!summary)return;
    summary.insertAdjacentHTML('afterend',`<div class="panel collection-management" data-collection-management style="margin-top:16px"><h3>Gerir coleção pessoal</h3><p class="history-intro">Use estas opções para corrigir registos antigos guardados neste dispositivo. A limpeza de “Já vi” não altera as notas marcadas como “Tenho” ou “Quero”.</p><div class="collection-actions"><button type="button" class="ghost-btn" data-clear-collection="seen">Limpar “Já vi”</button><button type="button" class="ghost-btn" data-clear-collection="wanted">Limpar “Quero”</button><button type="button" class="ghost-btn" data-clear-collection="all">Repor coleção pessoal</button></div><p class="source-note" data-collection-clean-feedback></p></div>`);
    q('[data-clear-collection="seen"]')?.addEventListener('click',()=>{
      if(!confirm('Apagar todas as marcas “Já vi” deste dispositivo? As marcas “Tenho” e “Quero” serão mantidas.'))return;
      clearField('seen');
      window.showCollection?.();
    });
    q('[data-clear-collection="wanted"]')?.addEventListener('click',()=>{
      if(!confirm('Apagar todas as marcas “Quero” deste dispositivo? As marcas “Tenho” e “Já vi” serão mantidas.'))return;
      clearField('wanted');
      window.showCollection?.();
    });
    q('[data-clear-collection="all"]')?.addEventListener('click',()=>{
      if(!confirm('Repor toda a coleção pessoal neste dispositivo? Isto apaga “Tenho”, “Quero” e “Já vi”.'))return;
      resetAll();
      window.showCollection?.();
    });
  }
  function patch(){
    if(typeof window.showCollection!=='function'||window.showCollection.__management177)return false;
    const old=window.showCollection;
    function wrapped(...args){const r=old(...args);requestAnimationFrame(renderPanel);return r}
    wrapped.__management177=true;
    window.showCollection=wrapped;
    if(window.state?.currentKind==='collection')requestAnimationFrame(renderPanel);
    return true;
  }
  if(!patch()){
    let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>100)clearInterval(timer)},50);
  }
  window.addEventListener('load',patch);
})();