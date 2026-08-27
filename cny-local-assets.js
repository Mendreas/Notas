(() => {
  const overrides = {
    "CNY:1":   {front:"/assets/notes/cny/cny-1-front.png",back:"/assets/notes/cny/cny-1-back.jpg",dimensions:"130 × 63 mm",imageStatus:"local",imageSource:"ChinaTours.com · asset local"},
    "CNY:5":   {front:"/assets/notes/cny/cny-5-front.png",back:"/assets/notes/cny/cny-5-back.jpg",dimensions:"135 × 63 mm",imageStatus:"local",imageSource:"ChinaTours.com · asset local"},
    "CNY:10":  {front:"/assets/notes/cny/cny-10-front.png",back:"/assets/notes/cny/cny-10-back.jpg",dimensions:"140 × 70 mm",imageStatus:"local",imageSource:"ChinaTours.com · asset local"},
    "CNY:20":  {front:"/assets/notes/cny/cny-20-front.png",back:"/assets/notes/cny/cny-20-back.jpg",dimensions:"145 × 70 mm",imageStatus:"local",imageSource:"ChinaTours.com · asset local"},
    "CNY:50":  {front:"/assets/notes/cny/cny-50-front.png",back:"/assets/notes/cny/cny-50-back.jpg",dimensions:"150 × 70 mm",imageStatus:"local",imageSource:"ChinaTours.com · asset local"},
    "CNY:100": {front:"/assets/notes/cny/cny-100-front.png",back:"/assets/notes/cny/cny-100-back.jpg",dimensions:"155 × 77 mm",imageStatus:"local",imageSource:"ChinaTours.com · asset local"}
  };

  const previousFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const request = args[0];
    const url = typeof request === "string" ? request : request?.url || "";
    const response = await previousFetch(...args);
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
})();
