#!/usr/bin/env python3
import json,re,ssl,time,urllib.request,html,pathlib,os
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
SRC=ROOT/'data/banknotews-sources.json'; OUT=ROOT/'data/banknote-context-raw.json'
CTX=ssl._create_unverified_context(); UA='Notas-do-Mundo/0.12 context audit'
LIMIT=int(os.environ.get('CONTEXT_LIMIT','0') or 0);DEBUG=os.environ.get('CONTEXT_DEBUG','0')=='1'
TARGET_MANIFEST=os.environ.get('CONTEXT_TARGET_MANIFEST','').strip()
class TextParser(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,d):
        d=' '.join(d.split())
        if d:self.parts.append(d)
def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Referer':'https://www.banknote.ws/'})
    with urllib.request.urlopen(req,timeout=45,context=CTX) as r:return r.read().decode('latin-1','replace')
def clean_markup(s):
    s=re.sub(r'<br\s*/?>','; ',s,flags=re.I);s=re.sub(r'<[^>]+>',' ',s);s=html.unescape(s).replace('\xa0',' ');return re.sub(r'\s+',' ',s).strip(' ;:-')
def image_family(src):
    fn=src.rsplit('/',1)[-1].split('?',1)[0]
    m=re.match(r'^(.*?)(?:[_-]?)([or])(?:[sS]?)(\.(?:jpe?g|png))$',fn,re.I)
    return (m.group(1).lower(),m.group(2).lower()) if m else None
def extract_table_captions(raw,n):
    rows=re.findall(r'<tr\b[^>]*>(.*?)</tr\s*>',raw,re.I|re.S)
    wanted=image_family(n.get('frontSource',''))
    candidates=[]
    for i,row in enumerate(rows[:-1]):
        imgs=re.findall(r'<img\b[^>]*\bsrc\s*=\s*["\']([^"\']+)["\']',row,re.I|re.S)
        fams=[image_family(x) for x in imgs]
        of=[(j,f) for j,f in enumerate(fams) if f and f[1]=='o']; rf=[(j,f) for j,f in enumerate(fams) if f and f[1]=='r']
        if not of or not rf:continue
        cells=re.findall(r'<td\b[^>]*>(.*?)</td\s*>',rows[i+1],re.I|re.S)
        if len(cells)<2:continue
        front=clean_markup(cells[0]);back=clean_markup(cells[1])
        if not (3<len(front)<1200 and 3<len(back)<1200):continue
        score=0
        if wanted:
            bases=[f[1][0] for f in of+rf]
            if wanted[0] in bases:score+=100
            root=re.sub(r'[-_]?(?:19|20)\d{2}.*$','',wanted[0])
            if root and any(b.startswith(root) for b in bases):score+=50
        if re.search(r'[A-Za-z]{3,}',front) and re.search(r'[A-Za-z]{3,}',back):score+=20
        if re.fullmatch(r'[PW]?[-W]?\d+[A-Z]?',front,re.I):score-=100
        candidates.append((score,front,back))
    if not candidates:return {}
    candidates.sort(key=lambda x:x[0],reverse=True)
    return {'front':candidates[0][1],'back':candidates[0][2]}

payload=json.loads(SRC.read_text(encoding='utf-8'))
source_notes=payload.get('notes',{})
selected_keys=None
if TARGET_MANIFEST:
    mp=ROOT/TARGET_MANIFEST
    target=json.loads(mp.read_text(encoding='utf-8'))
    selected_keys=set()
    for n in target.get('notes',[]):
        v=n.get('value')
        try:
            fv=float(v); vs=str(int(fv)) if fv.is_integer() else str(fv)
        except Exception: vs=str(v)
        selected_keys.add(f"{n.get('currency')}:{vs}")
items=[(k,v) for k,v in source_notes.items() if selected_keys is None or k in selected_keys]
items=items[:LIMIT] if LIMIT else items
existing={}
if OUT.exists():
    try: existing=json.loads(OUT.read_text(encoding='utf-8')).get('notes',{})
    except Exception: existing={}
rows=dict(existing) if selected_keys is not None else {}
fails=[]
for i,(key,n) in enumerate(items,1):
    page=n.get('page')
    if not page:continue
    try:
        raw=get(page);sides=extract_table_captions(raw,n)
        rows[key]={'currency':n.get('currency'),'value':n.get('value'),'pick':n.get('pick'),'page':page,**sides}
        if not sides.get('front') or not sides.get('back'):
            fails.append({'key':key,'page':page,'found':list(sides)})
            if DEBUG:print('DEBUG',key,clean_markup(raw[:4500]))
        print(f'{i}: {key}:','front' in sides,'back' in sides, sides.get('front','')[:80],'|',sides.get('back','')[:80])
    except Exception as e:fails.append({'key':key,'page':page,'error':str(e)});print('FAIL',key,e)
    time.sleep(.15)
OUT.write_text(json.dumps({'source':'Banknote Museum · banknote.ws','notes':rows,'failures':fails,'targeted':bool(TARGET_MANIFEST)},ensure_ascii=False,indent=2),encoding='utf-8')
print('pages updated',len(items),'catalog rows',len(rows),'incomplete',len(fails))
