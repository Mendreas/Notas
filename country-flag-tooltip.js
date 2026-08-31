(()=>{
 const style=document.createElement('style');
 style.textContent=`
  .country-flag-tip{position:relative;display:inline-flex;align-items:center;justify-content:center;cursor:help;border-radius:6px;padding:1px 2px;outline:none}
  @media (hover:hover) and (pointer:fine){.country-flag-tip:hover{background:rgba(255,255,255,.08)}}
  .country-flag-tip::after{content:attr(data-country);position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);white-space:nowrap;background:rgba(7,16,26,.98);color:#fff;border:1px solid #536b7d;border-radius:8px;padding:6px 8px;font-size:12px;font-weight:600;line-height:1;box-shadow:0 8px 22px rgba(0,0,0,.35);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .12s ease,visibility .12s ease;z-index:9999}
  .country-flag-tip::before{content:'';position:absolute;left:50%;bottom:100%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#536b7d;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .12s ease,visibility .12s ease;z-index:10000}
  @media (hover:hover) and (pointer:fine){.country-flag-tip:hover::after,.country-flag-tip:hover::before{opacity:1;visibility:visible}}
  .country-flag-tip.tip-visible::after,.country-flag-tip.tip-visible::before{opacity:1;visibility:visible}
 `;
 document.head.appendChild(style);
 let active=null;
 const hide=()=>{if(active){active.classList.remove('tip-visible');active=null}};
 const show=el=>{hide();active=el;el.classList.add('tip-visible')};
 const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 function countryList(){return [...(window.DB?.countries||[])].filter(c=>c?.flag&&c?.name).sort((a,b)=>b.flag.length-a.flag.length)}
 function wrapFlags(value){
   if(!value||value.dataset.flagTooltipReady==='1')return;
   let html=value.innerHTML,changed=false;
   for(const c of countryList()){
     if(!html.includes(c.flag))continue;
     const name=esc(c.name);
     html=html.split(c.flag).join(`<span class="country-flag-tip" data-country="${name}" aria-label="${name}" tabindex="0">${c.flag}</span>`);
     changed=true;
   }
   if(changed){value.innerHTML=html;value.dataset.flagTooltipReady='1'}
 }
 function findValueFromLabel(label){
   const card=label.closest('.stat,.modal-fact,.fact-card,.info-row')||label.parentElement;
   if(!card)return null;
   return card.querySelector('.fact-value')||card.querySelector('strong')||label.nextElementSibling;
 }
 function enhance(){
   if(!window.DB?.countries?.length)return;
   document.querySelectorAll('.fact-label').forEach(label=>{
     if(!/^País\(es\)$/i.test((label.textContent||'').trim()))return;
     wrapFlags(findValueFromLabel(label));
   });
   document.querySelectorAll('.stat,.modal-fact,.fact-card').forEach(card=>{
     const txt=(card.textContent||'').trim();
     if(!/^País\(es\)/i.test(txt))return;
     wrapFlags(card.querySelector('.fact-value')||card.querySelector('strong')||card.lastElementChild);
   });
 }
 document.addEventListener('pointerdown',e=>{
   const el=e.target.closest('.country-flag-tip');
   if(el){if(e.pointerType!=='mouse'){e.preventDefault();active===el?hide():show(el)}return}
   hide();
 },true);
 document.addEventListener('focusin',e=>{const el=e.target.closest?.('.country-flag-tip');if(el)show(el)});
 document.addEventListener('focusout',e=>{if(e.target.closest?.('.country-flag-tip'))hide()});
 document.addEventListener('scroll',hide,true);
 window.addEventListener('blur',hide);
 document.addEventListener('mouseleave',hide);
 const observer=new MutationObserver(()=>{hide();enhance()});
 observer.observe(document.body,{subtree:true,childList:true});
 enhance();
})();