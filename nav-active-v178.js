(()=>{
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];

  function activate(kind){
    qa('#sidebar .nav-item').forEach(el=>el.classList.remove('active'));
    const tool=q(`#sidebar [data-ndm-tool="${kind}"]`);
    const native=q(`#sidebar [data-nav="${kind}"]`);
    (tool||native)?.classList.add('active');
  }

  function wrap(name,kind){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__navActive178)return false;
    function wrapped(...args){
      const r=fn(...args);
      requestAnimationFrame(()=>activate(kind));
      return r;
    }
    wrapped.__navActive178=true;
    window[name]=wrapped;
    return true;
  }

  function bindToolClicks(){
    qa('#sidebar [data-ndm-tool]').forEach(btn=>{
      if(btn.dataset.navActive178)return;
      btn.dataset.navActive178='1';
      btn.addEventListener('click',()=>requestAnimationFrame(()=>activate(btn.dataset.ndmTool)));
    });
  }

  function patch(){
    bindToolClicks();
    wrap('showCollection','collection');
    wrap('showAdvancedSearch','advanced');
    wrap('showQuiz','quiz');
    wrap('showCuriosities','curiosities');
    const kind=window.state?.currentKind;
    if(['collection','advanced','quiz','curiosities'].includes(kind))activate(kind);
  }

  patch();
  let tries=0;
  const timer=setInterval(()=>{tries++;patch();if(tries>120)clearInterval(timer)},50);
  window.addEventListener('load',patch);
  new MutationObserver(bindToolClicks).observe(document.documentElement,{childList:true,subtree:true});
})();
