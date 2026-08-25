(() => {
  /* Keep banknote cards and detail modals visually clean.
     Reproduction/legal notes live in About / source metadata instead of large notices. */
  const clean=()=>document.querySelectorAll('.restricted-note-notice').forEach(el=>el.remove());
  new MutationObserver(()=>queueMicrotask(clean)).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(clean,0));
})();
