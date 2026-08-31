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
 function countries(){return [...(window.DB?.countries||[])].filter(c=>c?.flag&&c?.name).sort((a,b)=>b.flag.length-a.flag.length)}
 function wrapTextNode(node){
   if(!node?.parentElement||node.parentElement.closest('.country-flag-tip'))return;
   const text=node.nodeValue||'';let hit=false;
   for(const c of countries())if(text.includes(c.flag)){hit=true;break}
   if(!hit)return;
   const frag=document.createDocumentFragment();let rest=text;
   while(rest){
     let best=null,pos=-1;
     for(const c of countries()){
       const i=rest.indexOf(c.flag);
       if(i>=0&&(pos<0||i<pos)){best=c;pos=i}
     }
     if(!best){frag.appendChild(document.createTextNode(rest));break}
     if(pos>0)frag.appendChild(document.createTextNode(rest.slice(0,pos)));
     const span=document.createElement('span');span.className='country-flag-tip';span.dataset.country=best.name;span.setAttribute('aria-label',best.name);span.tabIndex=0;span.textContent=best.flag;frag.appendChild(span);
     rest=rest.slice(pos+best.flag.length);
   }
   node.replaceWith(frag);
 }
 function enhanceRoot(root){
   if(!root||!window.DB?.countries?.length)return;
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
     if(!n.nodeValue?.trim())return NodeFilter.FILTER_REJECT;
     if(n.parentElement?.closest('.country-flag-tip,script,style'))return NodeFilter.FILTER_REJECT;
     return NodeFilter.FILTER_ACCEPT;
   }});
   const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(wrapTextNode);
 }
 function enhance(){enhanceRoot(document.getElementById('modalBody'));enhanceRoot(document.getElementById('view'))}
 document.addEventListener('pointerdown',e=>{const el=e.target.closest?.('.country-flag-tip');if(el){if(e.pointerType!=='mouse'){e.preventDefault();active===el?hide():show(el)}return}hide()},true);
 document.addEventListener('focusin',e=>{const el=e.target.closest?.('.country-flag-tip');if(el)show(el)});
 document.addEventListener('focusout',e=>{if(e.target.closest?.('.country-flag-tip'))hide()});
 document.addEventListener('scroll',hide,true);window.addEventListener('blur',hide);document.addEventListener('mouseleave',hide);
 const observer=new MutationObserver(()=>{hide();enhance()});observer.observe(document.body,{subtree:true,childList:true});enhance();
})();