(() => {
  const overrides = {
    "EUR:5": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EUR_5_obverse_(2013_issue).png",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EUR_5_reverse_(2013_issue).png",dimensions:"120 × 62 mm",imageStatus:"official-reproduction",imageSource:"BCE / Europa series",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},
    "EUR:10": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EUR_10_obverse_(2014_issue).png",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EUR_10_reverse_(2014_issue).png",dimensions:"127 × 67 mm",imageStatus:"official-reproduction",imageSource:"BCE / Europa series",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},
    "EUR:20": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_20_%E2%82%AC_obverse_side.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_20_%E2%82%AC_reverse_side.jpg",dimensions:"133 × 72 mm",imageStatus:"official-reproduction",imageSource:"BCE / Europa series",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},
    "EUR:50": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_50_%E2%82%AC_obverse_side.png",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_50_%E2%82%AC_reverse_side.png",dimensions:"140 × 77 mm",imageStatus:"official-reproduction",imageSource:"BCE / Europa series",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},
    "EUR:100": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_100_%E2%82%AC_obverse_side.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_100_%E2%82%AC_reverse_side.jpg",dimensions:"147 × 77 mm",imageStatus:"official-reproduction",imageSource:"BCE / Europa series",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},
    "EUR:200": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_200_%E2%82%AC_obverse_side.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Europa_series_200_%E2%82%AC_reverse_side.jpg",dimensions:"153 × 77 mm",imageStatus:"official-reproduction",imageSource:"BCE / Europa series",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},
    "EUR:500": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EUR_500_obverse_(2002_issue).jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/EUR_500_reverse_(2002_issue).jpg",dimensions:"160 × 82 mm",imageStatus:"official-reproduction",imageSource:"BCE / primeira série",imageSourceUrl:"https://www.ecb.europa.eu/euro/banknotes/images/html/index.pt.html"},

    "JPY:1000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f1000f.png",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f1000b.png",dimensions:"76 × 150 mm",imageStatus:"official",imageSource:"Bank of Japan"},
    "JPY:2000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/bn_2000f_d.jpg",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/bn_2000b_d.jpg",dimensions:"76 × 154 mm",imageStatus:"official",imageSource:"Bank of Japan"},
    "JPY:5000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f5000f.png",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f5000b.png",dimensions:"76 × 156 mm",imageStatus:"official",imageSource:"Bank of Japan"},
    "JPY:10000": {front:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f10000f.png",back:"https://www.boj.or.jp/en/note_tfjgs/note/valid/img/f10000b.png",dimensions:"76 × 160 mm",imageStatus:"official",imageSource:"Bank of Japan"},

    "USD:1": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2021_%241_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2021_%241_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons"},
    "USD:2": {front:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/US_%242_bill_obverse_series_2003_A.jpg/960px-US_%242_bill_obverse_series_2003_A.jpg",back:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/US_%242_bill_reverse_series_2003_A.jpg/960px-US_%242_bill_reverse_series_2003_A.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. Treasury / Wikimedia Commons"},
    "USD:5": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2021_%245_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2021_%245_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons"},
    "USD:10": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2021_%2410_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2021_%2410_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons"},
    "USD:20": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Obverse_of_the_series_2017A_%2420_Federal_Reserve_Note.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Reverse_of_the_series_2017A_%2420_Federal_Reserve_Note.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons"},
    "USD:50": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/50_USD_Series_2004_Note_Front.jpg",back:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/50_USD_Series_2004_Note_Back.jpg/960px-50_USD_Series_2004_Note_Back.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. Treasury / Wikimedia Commons"},
    "USD:100": {front:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Series_2013_%24100_bill_front.jpg",back:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Series_2013_%24100_bill_back.jpg",dimensions:"156 × 66 mm",imageStatus:"public-domain",imageSource:"U.S. currency / Wikimedia Commons"},

    "AUD:5": {front:"https://www.banknotes.rba.gov.au/banknote-features/images/new-five/new-five-banknote.jpg",back:"https://www.banknotes.rba.gov.au/banknote-features/images/new-five/new-five-banknote-flipped.jpg",dimensions:"130 × 65 mm",imageStatus:"official",imageSource:"Reserve Bank of Australia"},
    "AUD:10": {front:"https://www.banknotes.rba.gov.au/banknote-features/images/new-ten/new-ten-banknote.jpg",back:"https://www.banknotes.rba.gov.au/banknote-features/images/new-ten/new-ten-banknote-flipped.jpg",dimensions:"137 × 65 mm",imageStatus:"official",imageSource:"Reserve Bank of Australia"},
    "AUD:20": {front:"https://www.banknotes.rba.gov.au/banknote-features/images/new-twenty/new-twenty-banknote.jpg",back:"https://www.banknotes.rba.gov.au/banknote-features/images/new-twenty/new-twenty-banknote-flipped.jpg",dimensions:"144 × 65 mm",imageStatus:"official",imageSource:"Reserve Bank of Australia"},
    "AUD:50": {front:"https://www.banknotes.rba.gov.au/banknote-features/images/new-fifty/new-fifty-banknote.jpg",back:"https://www.banknotes.rba.gov.au/banknote-features/images/new-fifty/new-fifty-banknote-flipped.jpg",dimensions:"151 × 65 mm",imageStatus:"official",imageSource:"Reserve Bank of Australia"},
    "AUD:100": {front:"https://www.banknotes.rba.gov.au/banknote-features/images/new-hundred/new-hundred-banknote.jpg",back:"https://www.banknotes.rba.gov.au/banknote-features/images/new-hundred/new-hundred-banknote-flipped.jpg",dimensions:"158 × 65 mm",imageStatus:"official",imageSource:"Reserve Bank of Australia"}
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
      if (overrides[key]) Object.assign(note,overrides[key]);
    }
    return new Response(JSON.stringify(notes), {
      status: response.status,
      statusText: response.statusText,
      headers: {"Content-Type":"application/json; charset=utf-8"}
    });
  };
})();