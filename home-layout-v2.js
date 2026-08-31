(() => {
  showHome = function(fromBack=false){
    if(!fromBack && state.currentKind) rememberLocation();
    state.currentKind="home";
    state.currentId=null;
    state.continent=null;
    crumbs.textContent="Mundo";
    setActive("home");

    view.innerHTML=`
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

    $$("[data-currency]").forEach(x=>x.onclick=()=>showCurrency(x.dataset.currency));
    $$("[data-continent]").forEach(x=>x.onclick=()=>showContinent(x.dataset.continent));
    renderWorldMap();
  };
})();
