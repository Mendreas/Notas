#!/usr/bin/env python3
import json, pathlib, re, ssl, sys, time, urllib.parse, urllib.request
from html.parser import HTMLParser

ROOT=pathlib.Path(__file__).resolve().parents[1]
CFG=json.loads((ROOT/'data/banknotews-import.json').read_text(encoding='utf-8'))
OUT=ROOT/'assets/notes/banknotews'
OUT.mkdir(parents=True,exist_ok=True)
CTX=ssl._create_unverified_context()
UA='Notas-do-Mundo/0.10.4 (personal family atlas; banknote.ws scan importer)'

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.images=[]; self._href=None; self._txt=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag.lower()=='a': self._href=d.get('href'); self._txt=[]
        if tag.lower()=='img' and d.get('src'): self.images.append(d['src'])
    def handle_data(self,data):
        if self._href is not None: self._txt.append(data)
    def handle_endtag(self,tag):
        if tag.lower()=='a' and self._href is not None:
            self.links.append((''.join(self._txt).strip(),self._href)); self._href=None; self._txt=[]

def get(url,binary=False):
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Referer':'https://www.banknote.ws/'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req,timeout=45,context=CTX) as r:
                raw=r.read(); ctype=r.headers.get('Content-Type','')
            return raw if binary else raw.decode('latin-1','replace'),ctype
        except Exception:
            if attempt==3: raise
            time.sleep(2*(attempt+1))

def norm(s):
    return re.sub(r'[^A-Z0-9]','',str(s).upper())

def find_page(section_url,pick):
    html,_=get(section_url); p=Parser(); p.feed(html)
    target=norm(pick)
    exact=[]; loose=[]
    for text,href in p.links:
        if not href or '.htm' not in href.lower(): continue
        n=norm(text)
        if n==target: exact.append(href)
        elif target in n or n in target: loose.append(href)
    href=(exact or loose)
    if href: return urllib.parse.urljoin(section_url,href[0])
    # Fallback: inspect href names for Pick digits.
    digits=''.join(re.findall(r'\d+',pick))
    for text,href in p.links:
        if href and digits and digits in href and '.htm' in href.lower():
            return urllib.parse.urljoin(section_url,href)
    raise RuntimeError(f'Pick {pick} not found in {section_url}')

def pair_images(page_url):
    html,_=get(page_url); p=Parser(); p.feed(html)
    urls=[urllib.parse.urljoin(page_url,x) for x in p.images]
    urls=[u for u in urls if re.search(r'\.(?:jpe?g|png)(?:\?|$)',u,re.I)]
    # Prefer pairs whose filenames differ only by obverse/reverse marker.
    for i,u in enumerate(urls):
        fn=urllib.parse.urlparse(u).path.rsplit('/',1)[-1]
        candidates=[]
        if re.search(r'o\.(?:jpe?g|png)$',fn,re.I): candidates.append(re.sub(r'o(\.(?:jpe?g|png))$',r'r\1',fn,flags=re.I))
        if re.search(r'_o\.(?:jpe?g|png)$',fn,re.I): candidates.append(re.sub(r'_o(\.(?:jpe?g|png))$',r'_r\1',fn,flags=re.I))
        for cand in candidates:
            for v in urls:
                if urllib.parse.urlparse(v).path.rsplit('/',1)[-1].lower()==cand.lower(): return u,v
    if len(urls)>=2: return urls[0],urls[1]
    raise RuntimeError(f'No front/back image pair on {page_url}')

def save_image(url,path):
    raw,ctype=get(url,binary=True)
    if not ctype.startswith('image/') or len(raw)<5000:
        raise RuntimeError(f'Invalid image {url}: {ctype} {len(raw)} bytes')
    path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(raw)
    return len(raw)

results={}; failures=[]
for item in CFG['notes']:
    code=item['currency']; value=int(item['value']); pick=item['pick']; section=item['section']
    key=f'{code}:{value}'
    try:
        page=find_page(section,pick)
        front_url,back_url=pair_images(page)
        folder=OUT/code.lower(); fp=folder/f'{value}-front.jpg'; bp=folder/f'{value}-back.jpg'
        fs=save_image(front_url,fp); bs=save_image(back_url,bp)
        results[key]={'currency':code,'value':value,'pick':pick,'page':page,'frontSource':front_url,'backSource':back_url,'front':f'/assets/notes/banknotews/{code.lower()}/{value}-front.jpg','back':f'/assets/notes/banknotews/{code.lower()}/{value}-back.jpg','frontBytes':fs,'backBytes':bs}
        print('OK',key,pick,page,fs,bs)
    except Exception as e:
        failures.append({'key':key,'pick':pick,'error':str(e)}); print('FAIL',key,pick,e,file=sys.stderr)
    time.sleep(.25)

(ROOT/'data/banknotews-sources.json').write_text(json.dumps({'source':'https://www.banknote.ws/','notes':results,'failures':failures},ensure_ascii=False,indent=2),encoding='utf-8')

# Generate a late fetch override. Existing user-supplied currencies are not in the import manifest.
rows=[]
for key,r in results.items():
    rows.append(f"    {json.dumps(key)}:{{front:{json.dumps(r['front'])},back:{json.dumps(r['back'])},imageStatus:'local-reference',imageSource:'Banknote Museum · banknote.ws',imageSourceUrl:{json.dumps(r['page'])}}}")
js="""(() => {\n  const O={\n"""+",\n".join(rows)+"""\n  };\n  const previousFetch=window.fetch.bind(window);\n  window.fetch=async(...args)=>{\n    const req=args[0],url=typeof req==='string'?req:req?.url||'';\n    const response=await previousFetch(...args);\n    if(!url.includes('/data/notes.json')) return response;\n    const data=await response.clone().json();\n    for(const n of data){const x=O[`${n.currency}:${Number(n.value)}`];if(x)Object.assign(n,x);}\n    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});\n  };\n})();\n"""
(ROOT/'banknotews-assets.js').write_text(js,encoding='utf-8')
print('Imported',len(results),'notes; failures',len(failures))
if failures: print(json.dumps(failures,ensure_ascii=False,indent=2))
