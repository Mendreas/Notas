(()=>{
 const style=document.createElement('style');
 style.textContent=`
  .country-flag-tip{position:relative;display:inline-flex;align-items:center;justify-content:center;cursor:help;border-radius:6px;padding:1px 2px;outline:none}
  .country-flag-tip:hover,.country-flag-tip:focus{background:rgba(255,255,255,.08)}
  .country-flag-tip::after{content:attr(data-country);position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);white-space:nowrap;background:rgba(7,16,26,.98);color:#fff;border:1px solid #536b7d;border-radius:8px;padding:6px 8px;font-size:12px;font-weight:600;line-height:1;box-shadow:0 8px 22px rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .12s ease;z-index:30}
  .country-flag-tip::before{content:'';position:absolute;left:50%;bottom:100%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#536b7d;opacity:0;pointer-events:none;transition:opacity .12s ease;z-index:31}
  .country-flag-tip:hover::after,.country-flag-tip:hover::before,.country-flag-tip:focus::after,.country-flag-tip:focus::before{opacity:1}
 `;
 document.head.appendChild(style);

 function enhance(){
   const root=document.getElementById('modalBody');
   if(!root||!window.DB?.countries?.length)return;
   root.querySelectorAll('.fact-label').forEach(label=>{
     if(!/^País\(es\)$/i.test((label.textContent||'').trim()))return;
     const card=label.closest('.stat,.modal-fact,.fact-card')||label.parentElement;
     const value=card?.querySelector('.fact-value')||label.nextElementSibling;
     if(!value||value.dataset.flagTooltipReady==='1')return;
     let html=value.innerHTML;
     let changed=false;
     const countries=[...DB.countries].sort((a,b)=>(b.flag||'').length-(a.flag||'').length);
     for(const c of countries){
       if(!c.flag||!html.includes(c.flag))continue;
       const safeName=String(c.name||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
       html=html.split(c.flag).join(`<span class="country-flag-tip" data-country="${safeName}" tabindex="0" aria-label="${safeName}">${c.flag}</span>`);
       changed=true;
     }
     if(changed){value.innerHTML=html;value.dataset.flagTooltipReady='1'}
   });
 }
 const obs=new MutationObserver(enhance);
 const modal=document.getElementById('noteModal');
 if(modal)obs.observe(modal,{subtree:true,childList:true});
 enhance();
})();