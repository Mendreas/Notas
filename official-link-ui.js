(() => {
  const sources={
    HUF:['https://www.mnb.hu/en/banknotes-and-coins/banknotes','Magyar Nemzeti Bank'],
    ISK:['https://sedlabanki.is/greidslumidlun/sedlar-og-mynt/','Seðlabanki Íslands'],
    RSD:['https://www.nbs.rs/en/novac-i-placanja/novcanice/','National Bank of Serbia'],
    ALL:['https://www.bankofalbania.org/Currency/Banknotes_in_circulation/','Bank of Albania'],
    BAM:['https://www.cbbh.ba/Content/Read/1252','Central Bank of Bosnia and Herzegovina'],
    MKD:['https://www.nbrm.mk/banknotes.nspx','National Bank of North Macedonia'],
    MDL:['https://www.bnm.md/en/content/banknotes','National Bank of Moldova'],
    UAH:['https://bank.gov.ua/en/uah/obig-banknote','National Bank of Ukraine'],
    BYN:['https://www.nbrb.by/engl/coinsbanknotes/banknotes','National Bank of Belarus']
  };
  const enhance=()=>{
    const modal=document.querySelector('#noteModal');
    if(!modal||modal.classList.contains('hidden'))return;
    const badge=modal.querySelector('.mini-badge');
    const code=badge?.textContent.trim();
    if(!sources[code])return;
    const [url,label]=sources[code];
    if(modal.querySelector('[data-official-link-note]'))return;
    const imgs=[...modal.querySelectorAll('img')];
    const isPlaceholder=imgs.some(img=>img.src.startsWith('data:image/svg+xml'));
    if(!isPlaceholder)return;
    const box=document.createElement('div');
    box.className='notice';
    box.dataset.officialLinkNote='1';
    box.style.marginTop='16px';
    box.innerHTML=`<strong>Imagens oficiais externas.</strong> A app não incorpora uma reprodução desta nota. <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:6px">Ver na fonte oficial — ${label} ↗</a>`;
    modal.querySelector('#modalBody')?.appendChild(box);
  };
  new MutationObserver(()=>queueMicrotask(enhance)).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('click',()=>setTimeout(enhance,0));
})();
