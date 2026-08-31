#!/usr/bin/env python3
import json,re,ssl,time,urllib.request,html,pathlib,os
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
SRC=ROOT/'data/banknotews-sources.json'; OUT=ROOT/'data/banknote-context-raw.json'
CTX=ssl._create_unverified_context(); UA='Notas-do-Mundo/0.10.32 context audit'
LIMIT=int(os.environ.get('CONTEXT_LIMIT','0') or 0)
DEBUG=os.environ.get('CONTEXT_DEBUG','0')=='1'
class TextParser(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,d):
        d=' '.join(d.split())
        if d:self.parts.append(d)
def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Referer':'https://www.banknote.ws/'})
    with urllib.request.urlopen(req,timeout=45,context=CTX) as r:return r.read().decode('latin-1','replace')
def clean(s):
    s=html.unescape(s).replace('\xa0',' ');return re.sub(r'\s+',' ',s).strip(' ;:-')
def extract(text):
    pats=[(r'(?:Obverse|Front)\s*[:\-]\s*(.*?)(?=(?:Reverse|Back)\s*[:\-]|Watermark\s*[:\-]|Security|Size|Printer|$)','front'),(r'(?:Reverse|Back)\s*[:\-]\s*(.*?)(?=(?:Watermark|Security|Size|Printer|Date|$))','back')]
    out={}
    for pat,key in pats:
        m=re.search(pat,text,re.I|re.S)
        if m:
            v=clean(m.group(1))
            if 8<len(v)<1200:out[key]=v
    if 'front' not in out:
        m=re.search(r'\b(?:Obverse|Front)\b\s+(.*?)(?=\b(?:Reverse|Back|Watermark|Security|Size)\b)',text,re.I|re.S)
        if m:out['front']=clean(m.group(1))[:1000]
    if 'back' not in out:
        m=re.search(r'\b(?:Reverse|Back)\b\s+(.*?)(?=\b(?:Watermark|Security|Size|Printer|Date)\b|$)',text,re.I|re.S)
        if m:out['back']=clean(m.group(1))[:1000]
    return out
payload=json.loads(SRC.read_text(encoding='utf-8')); rows={}; fails=[]
items=list(payload.get('notes',{}).items());items=items[:LIMIT] if LIMIT else items
for i,(key,n) in enumerate(items,1):
    page=n.get('page')
    if not page:continue
    try:
        raw=get(page);p=TextParser();p.feed(raw);text=' '.join(p.parts);sides=extract(text)
        rows[key]={'currency':n.get('currency'),'value':n.get('value'),'pick':n.get('pick'),'page':page,**sides}
        if not sides.get('front') or not sides.get('back'):
            fails.append({'key':key,'page':page,'found':list(sides)})
            if DEBUG:
                pos=max(text.lower().find('reverse'),text.lower().find('back'))
                print('DEBUG',key,clean(text[max(0,pos-1300):pos+1600] if pos>=0 else text[:3000]))
        print(f'{i}: {key}:','front' in sides,'back' in sides)
    except Exception as e:fails.append({'key':key,'page':page,'error':str(e)});print('FAIL',key,e)
    time.sleep(.18)
OUT.write_text(json.dumps({'source':'Banknote Museum · banknote.ws','notes':rows,'failures':fails},ensure_ascii=False,indent=2),encoding='utf-8');print('pages',len(rows),'incomplete',len(fails))
