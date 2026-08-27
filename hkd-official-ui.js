(() => {
  const enhance=()=>{
    const modal=document.querySelector('#noteModal');
    if(!modal||modal.classList.contains('hidden'))return;
    const badge=modal.querySelector('.mini-badge');
    if(!badge||badge.textContent.trim()!=="HKD")return;
    const heading=modal.querySelector('.note-detail-head h2');
    const m=heading?.textContent.match(/HK\$(10|20|50|100|500|1000)\b/);
    if(!m)return;
    const value=+m[1];
    const url=value===10?"https://www.hkma.gov.hk/eng/key-functions/money/hong-kong-currency/notes/":"https://www.hsbc.com.hk/banknotes-2018/";
    const label=value===10?"Ver a nota na fonte oficial — HKMA":"Ver frente e verso na fonte oficial — HSBC";
    if(modal.querySelector('[data-hkd-official]'))return;
    const notice=modal.querySelector('.notice');
    const box=document.createElement('div');
    box.className='notice';box.dataset.hkdOfficial='1';box.style.marginTop='16px';
    box.innerHTML=`<strong>Imagens oficiais externas.</strong> Por restrições de reprodução, a app não armazena estas imagens. <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:6px">${label} ↗</a>`;
    notice?.replaceWith(box) || modal.querySelector('#modalBody')?.appendChild(box);
  };
  new MutationObserver(()=>queueMicrotask(enhance)).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('click',()=>setTimeout(enhance,0));
})();
