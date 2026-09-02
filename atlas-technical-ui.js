(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function enhance(){
    const body=document.querySelector('#modalBody');
    if(!body||body.querySelector('[data-technical-status]'))return;
    const title=body.querySelector('h2')?.textContent||'';
    const code=body.querySelector('.mini-badge')?.textContent?.trim()||title.match(/\b[A-Z]{3}\b/)?.[0];
    let value=null;
    const m=title.match(/(?:^|\s)([\d.,]+)(?:\s|·)/);if(m)value=Number(m[1].replace(/\./g,'').replace(',','.'));
    let note=null;
    if(code&&Number.isFinite(value))note=window.DB?.notes?.find(n=>n.currency===code&&Number(n.value)===value);
    if(!note){
      const h=body.textContent||'';
      note=window.DB?.notes?.find(n=>h.includes(n.currency)&&h.includes(String(n.value)));
    }
    if(!note)return;
    const t=window.NOTE_TECHNICAL?.get?.(note.currency,note.value);if(!t)return;
    const aside=body.querySelector('.note-enrichment aside.panel');if(!aside)return;
    const source=t.sourceUrl?`<a class="ghost-btn" href="${esc(t.sourceUrl)}" target="_blank" rel="noopener">Fonte técnica: ${esc(t.source)} ↗</a>`:`<span>${esc(t.source||'')}</span>`;
    aside.insertAdjacentHTML('beforeend',`<div class="technical-status-box" data-technical-status><h4>Situação de circulação</h4><p>${esc(t.circulation||'')}</p><div class="motif-links">${source}</div></div>`);
    window.GLOSSARY?.enhance?.(aside);
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(enhance));
  const start=()=>{const b=document.querySelector('#modalBody');if(b)obs.observe(b,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
