(() => {
  const overrides = {
    "BRL:2": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/2_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/2_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"},
    "BRL:5": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/5_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/5_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"},
    "BRL:10": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/10_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/10_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"},
    "BRL:20": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/20_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/20_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"},
    "BRL:50": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/50_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/50_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"},
    "BRL:100": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/100_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/100_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"},
    "BRL:200": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/200_Brazil_real_Second_Obverse.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/200_Brazil_real_Second_Reverse.jpg",imageStatus:"official-reproduction",imageSource:"Banco Central do Brasil / Wikimedia Commons",imageSourceUrl:"https://www.bcb.gov.br/cedulasemoedas/cedulas"}
  };

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const request = args[0];
    const url = typeof request === "string" ? request : request?.url || "";
    const response = await nativeFetch(...args);
    if (!url.includes("/data/notes.json")) return response;
    const notes = await response.clone().json();
    for (const note of notes) {
      const key = `${note.currency}:${note.value}`;
      if (overrides[key]) Object.assign(note, overrides[key]);
    }
    return new Response(JSON.stringify(notes), {
      status: response.status,
      statusText: response.statusText,
      headers: {"Content-Type":"application/json; charset=utf-8"}
    });
  };

  const markBrazilReproductions = () => {
    document.querySelectorAll('[data-note^="BRL:"] .note-visual').forEach(el => el.classList.add('brl-repro'));
    const title = document.querySelector('#modalBody h2')?.textContent || '';
    if (title.trim().startsWith('R$')) document.querySelectorAll('#modalBody .note-image-button').forEach(el => el.classList.add('brl-repro'));
    const viewerTitle = document.querySelector('#imageViewerTitle')?.textContent || '';
    const stage = document.querySelector('.image-viewer-stage');
    if (stage) stage.classList.toggle('brl-repro', viewerTitle.trim().startsWith('R$'));
  };
  new MutationObserver(markBrazilReproductions).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  document.addEventListener('click',()=>setTimeout(markBrazilReproductions,0));
})();
