(()=>{
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sources=()=>[window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_AFRICA3,window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2,window.NOTE_CONTEXT_AFRICA1,window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_WAVE5,window.NOTE_CONTEXT_WAVE4].filter(Boolean);
 function infoFor(note,side){
   const k=`${note.currency}:${Number(note.value)}`;
   for(const s of sources()){const i=s?.[k]?.[side];if(i)return i;}
   const g=window.NOTE_CONTEXT_GLOBAL;
   if(g?.get){const i=g.get(note,side);if(i)return i;}
   return null;
 }
 function render(src){
   const viewer=document.querySelector('#imageViewer');if(!viewer||viewer.classList.contains('hidden'))return;
   const n=window.DB?.notes?.find(x=>x.front===src||x.back===src);if(!n)return;
   const side=n.front===src?'front':'back',i=infoFor(n,side);if(!i)return;
   let box=document.querySelector('#imageViewerContext');
   if(!box){box=document.createElement('div');box.id='imageViewerContext';box.className='image-viewer-context';const shell=viewer.querySelector('.image-viewer-shell');const help=viewer.querySelector('.image-viewer-help');if(shell)help?shell.insertBefore(box,help):shell.appendChild(box);}
   const wiki=i.wiki||`https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(i.title||'')}`;
   box.innerHTML=`<div class="note-context-copy"><strong>${esc(i.title)}</strong>${i.summary?`<p>${esc(i.summary)}</p>`:''}${i.more?`<p class="note-context-why"><b>Porque está na nota:</b> ${esc(i.more)}</p>`:''}</div><a class="note-context-wiki" href="${esc(wiki)}" target="_blank" rel="noopener noreferrer">Wikipédia ↗</a>`;
 }
 function hook(){const old=window.openImageViewer;if(typeof old!=='function'||old.__contextHook)return;function wrapped(src,label='Nota'){old(src,label);requestAnimationFrame(()=>render(src));}wrapped.__contextHook=true;window.openImageViewer=wrapped;}
 hook();window.addEventListener('load',hook);
})();