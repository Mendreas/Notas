// Enriquece todas as páginas de moeda com história/contexto e ligação à Wikipédia.
(()=>{
 function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 function patch(){
   if(typeof window.showCurrency!=='function'||typeof window.getCurrencyContext!=='function')return false;
   if(window.__currencyContextUIPatched)return true;
   const original=window.showCurrency;
   window.showCurrency=function(code,fromBack=false){
     const result=original(code,fromBack);
     try{
       const c=window.DB?.currencies?.[code];if(!c)return result;
       const members=(window.DB?.countries||[]).filter(x=>x.currency===code);
       const ctx=window.getCurrencyContext(code,c,members);
       const heroIntro=document.querySelector('.country-currency-hero .history-intro');
       if(heroIntro)heroIntro.textContent=ctx.overview;
       const strip=document.querySelector('.dashboard-strip');
       if(strip&&!document.querySelector('[data-currency-context-panel]')){
         const names=members.map(x=>x.name).join(', ')||c.group||'—';
         const html=`<div class="detail-layout" data-currency-context-panel style="margin-top:18px">
           <div class="panel">
             <span class="mini-badge">HISTÓRIA DA MOEDA</span>
             <h3>História e contexto</h3>
             <p class="history-intro">${esc(ctx.overview)}</p>
             <p class="history-intro">${esc(ctx.history)}</p>
             <a class="ghost-btn" href="${esc(ctx.wiki)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;text-decoration:none;margin-top:6px">Wikipédia ↗</a>
           </div>
           <aside class="panel">
             <h3>Referência monetária</h3>
             <div class="info-row"><span>Código ISO</span><strong>${esc(code)}</strong></div>
             <div class="info-row"><span>Área de utilização</span><strong>${esc(names)}</strong></div>
             <div class="info-row"><span>Emissor</span><strong>${esc(c.source||'—')}</strong></div>
             <div class="info-row"><span>Suporte</span><strong>${esc(c.material||'—')}</strong></div>
             <p class="source-note" style="margin-top:14px">${esc(ctx.sourceLabel||'Wikipédia')}</p>
           </aside>
         </div>`;
         strip.insertAdjacentHTML('afterend',html);
       }
     }catch(e){console.warn('currency context',e)}
     return result;
   };
   window.__currencyContextUIPatched=true;
   return true;
 }
 if(!patch())window.addEventListener('load',()=>{patch();});
})();
