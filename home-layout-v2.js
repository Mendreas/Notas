(() => {
  if(!document.querySelector('link[data-home-layout-v2]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/home-layout-v2.css?v=127';
    link.dataset.homeLayoutV2='1';
    document.head.appendChild(link);
  }

  function randomTen(){
    const pool=[...DB.notes].filter(n=>n && n.front && n.back);
    for(let i=pool.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [pool[i],pool[j]]=[pool[j],pool[i]];
    }
    return pool.slice(0,10);
  }

  function renderRandomTen(){
    const box=document.querySelector('#homeRandomNotes');
    if(!box)return;
    const picks=randomTen();
    box.innerHTML=`<div class="section-head home-random-head"><div><h2>10 notas aleatórias</h2><p>Uma seleção diferente de cada vez.</p></div></div><div class="note-grid">${picks.map(noteCard).join('')}</div>`;
    bindNoteCards();
    box.scrollIntoView({behavior:'smooth',block:'start'});
  }

  showHome = function(fromBack=false){
    if(!fromBack && state.currentKind) rememberLocation();
    state.currentKind="home";
    state.currentId=null;
    state.continent=null;
    crumbs.textContent="Mundo";
    setActive("home");

    view.innerHTML=`
      <div class="home-title-row">
        <div>
          <h1>Explorar as notas do mundo</h1>
          <p>Navegue pelo mapa, por país, moeda ou denominação.</p>
        </div>
        <button class="primary-btn home-random-btn" id="homeRandomBtn">⤨ <span>10 notas aleatórias</span></button>
      </div>
      <div id="homeRandomNotes"></div>
      <div class="map-card home-map-card">
        <svg id="worldMap"></svg>
        <div class="map-toolbar">
          <button id="zoomIn">+</button>
          <button id="zoomOut">−</button>
          <button id="resetMap">⌂</button>
        </div>
      </div>
      <div class="section-head"><div><h2>10 moedas globais em destaque</h2><p>Seleção editorial baseada em relevância internacional, liquidez, reservas e comércio — não no valor nominal de 1 unidade.</p></div></div>
      <div class="currency-band">${TOP10.map(currencyCard).join("")}</div>
      <div class="section-head"><div><h2>Continentes</h2><p>Explore por país e consulte a moeda usada em cada território.</p></div></div>
      <div class="grid">${Object.entries(CONTINENTS).map(([k,c])=>`<div class="card" data-continent="${k}"><div class="card-topline"><h3>${c.name}</h3><span class="mini-badge">${DB.countries.filter(x=>x.continent===k).length} países</span></div><p>Abrir continente</p></div>`).join("")}</div>`;

    $("#homeRandomBtn").onclick=renderRandomTen;
    $$("[data-currency]").forEach(x=>x.onclick=()=>showCurrency(x.dataset.currency));
    $$("[data-continent]").forEach(x=>x.onclick=()=>showContinent(x.dataset.continent));
    renderWorldMap();
  };
})();
