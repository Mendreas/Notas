(() => {
  const overrides = {
    "JPY:1000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f1000f.png",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f1000b.png",dimensions:"76 × 150 mm",imageStatus:"official",imageSource:"Bank of Japan",imageSourceUrl:"https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"},
    "JPY:2000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/bn_2000f_d.jpg",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/bn_2000b_d.jpg",dimensions:"76 × 154 mm",imageStatus:"official",imageSource:"Bank of Japan",imageSourceUrl:"https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"},
    "JPY:5000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f5000f.png",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f5000b.png",dimensions:"76 × 156 mm",imageStatus:"official",imageSource:"Bank of Japan",imageSourceUrl:"https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"},
    "JPY:10000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f10000f.png",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f10000b.png",dimensions:"76 × 160 mm",imageStatus:"official",imageSource:"Bank of Japan",imageSourceUrl:"https://www.boj.or.jp/en/note_tfjgs/note/valid/issue.htm"},

    "USD:1": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2021_%241_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2021_%241_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:Obverse_of_the_series_2021_$1_Federal_Reserve_Note.jpg"},
    "USD:2": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/US_%242_bill_obverse_series_2003_A.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/US_%242_bill_reverse_series_2003_A.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. Bureau of Engraving and Printing scan / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:US_$2_bill_obverse_series_2003_A.jpg"},
    "USD:5": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2021_%245_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2021_%245_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:Obverse_of_the_series_2021_$5_Federal_Reserve_Note.jpg"},
    "USD:10": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2021_%2410_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2021_%2410_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:Obverse_of_the_series_2021_$10_Federal_Reserve_Note.jpg"},
    "USD:20": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2017A_%2420_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2017A_%2420_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:Obverse_of_the_series_2017A_$20_Federal_Reserve_Note.jpg"},
    "USD:50": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/50_USD_Series_2004_Note_Front.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/50_USD_Series_2004_Note_Back.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. Treasury / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:50_USD_Series_2004_Note_Front.jpg"},
    "USD:100": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Series_2013_%24100_bill_front.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Series_2013_%24100_bill_back.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency scan / Wikimedia Commons",imageSourceUrl:"https://commons.wikimedia.org/wiki/File:Series_2013_$100_bill_front.jpg"}
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
    return new Response(JSON.stringify(notes), {status:response.status,statusText:response.statusText,headers:{"Content-Type":"application/json; charset=utf-8"}});
  };
})();
