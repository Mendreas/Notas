(() => {
  const overrides = {
    "JPY:1000": {
      front: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f1000f.png",
      back: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f1000b.png",
      dimensions: "76 × 150 mm",
      imageStatus: "official",
      imageSource: "Bank of Japan",
      imageSourceUrl: "https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"
    },
    "JPY:2000": {
      front: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/bn_2000f_d.jpg",
      back: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/bn_2000b_d.jpg",
      dimensions: "76 × 154 mm",
      imageStatus: "official",
      imageSource: "Bank of Japan",
      imageSourceUrl: "https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"
    },
    "JPY:5000": {
      front: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f5000f.png",
      back: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f5000b.png",
      dimensions: "76 × 156 mm",
      imageStatus: "official",
      imageSource: "Bank of Japan",
      imageSourceUrl: "https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"
    },
    "JPY:10000": {
      front: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f10000f.png",
      back: "https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f10000b.png",
      dimensions: "76 × 160 mm",
      imageStatus: "official",
      imageSource: "Bank of Japan",
      imageSourceUrl: "https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"
    }
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
})();
