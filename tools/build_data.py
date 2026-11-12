"""Sinh data/kanji.js và data/vocab.js từ dữ liệu mở.
Nguồn (tải về thư mục RAW trước khi chạy):
  - kanji.json      github.com/davidluzgouveia/kanji-data (MIT; dữ liệu gốc KANJIDIC + danh sách JLPT của Jonathan Waller)
  - KANJIS.json     npm kanjidic2-json (KANJIDIC2, EDRDG, CC BY-SA 4.0) -> âm Hán-Việt (reading type "vietnam")
  - n5..n1.csv      github.com/jamsinclair/open-anki-jlpt-decks (MIT; gốc tanos.co.uk, CC BY)
Chạy: python3 tools/build_data.py RAW_DIR
"""
import csv, json, sys, re, os
RAW = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'data')

def kata(s):
    return ''.join(chr(ord(c) + 96) if 'ぁ' <= c <= 'ゖ' else c for c in s)

kd = json.load(open(os.path.join(RAW, 'kanji.json')))
k2 = {e['literal']: e for e in json.load(open(os.path.join(RAW, 'KANJIS.json')))}

def vn_readings(ch):
    e = k2.get(ch)
    if not e: return []
    out = []
    for grp in (e.get('readingMeaning') or {}).get('groups', []) if isinstance(e.get('readingMeaning'), dict) else []:
        for r in grp.get('readings', []):
            if r.get('type') == 'vietnam': out.append(r['value'])
    if not out:
        rv = json.dumps(e, ensure_ascii=False)
        m = re.search(r'"vietnam":\s*\[([^\]]*)\]', rv)
        if m: out = [x.strip().strip('"') for x in m.group(1).split(',') if x.strip()]
    return [x.lower() for x in out]

OVR = json.load(open(os.path.join(os.path.dirname(__file__), 'hv_overrides.json')))
HV = {}
kanji = []
for ch, v in kd.items():
    lv = v.get('jlpt_new')
    hv = vn_readings(ch)
    if ch in OVR: hv = [OVR[ch]] + [x for x in hv if x != OVR[ch]]
    if hv: HV[ch] = hv[0]
    if not lv: continue
    on = [kata(x) for x in (v.get('readings_on') or [])][:3]
    kun = (v.get('readings_kun') or [])[:3]
    m = [x for x in (v.get('meanings') or []) if 'radical' not in x.lower()][:3]
    kanji.append({'c': ch, 'lv': lv, 'hv': ', '.join(hv[:2]), 'on': '・'.join(on), 'kun': '・'.join(kun).replace('.', ''), 'en': ', '.join(m), 'f': v.get('freq') or 9999, 's': v.get('strokes') or 0})
kanji.sort(key=lambda k: (-k['lv'], k['f'], k['s']))

def hv_of(word):
    ks = [c for c in word if '一' <= c <= '鿿' or c == '々']
    if not ks: return ''
    parts = []
    prev = None
    for c in ks:
        if c == '々': c = prev
        prev = c
        if c not in HV: return ''
        parts.append(HV[c])
    return ' '.join(parts)

seen = set(); vocab = []
for lv in (5, 4, 3, 2, 1):
    with open(os.path.join(RAW, f'n{lv}.csv'), newline='') as f:
        for row in csv.DictReader(f):
            w, r, en = row['expression'].strip(), row['reading'].strip(), row['meaning'].strip()
            key = w + '|' + r
            if not w or key in seen: continue
            seen.add(key)
            vocab.append({'w': w, 'r': r if r != w else '', 'en': en, 'hv': hv_of(w), 'lv': lv})

os.makedirs(OUT, exist_ok=True)
hdr = '/* Sinh tự động bởi tools/build_data.py. Nguồn: KANJIDIC2 (EDRDG, CC BY-SA 4.0), kanji-data (MIT), open-anki-jlpt-decks (MIT), danh sách JLPT của Jonathan Waller (tanos.co.uk, CC BY). */\n'
cols_k = ['c', 'lv', 'hv', 'on', 'kun', 'en']
cols_v = ['w', 'r', 'en', 'hv', 'lv']
open(os.path.join(OUT, 'kanji.js'), 'w').write(hdr + 'const KJ_COLS=' + json.dumps(cols_k) + ';const KJ=' + json.dumps([[k[c] for c in cols_k] for k in kanji], ensure_ascii=False, separators=(',', ':')) + ';\n')
open(os.path.join(OUT, 'vocab.js'), 'w').write(hdr + 'const VB_COLS=' + json.dumps(cols_v) + ';const VB=' + json.dumps([[v[c] for c in cols_v] for v in vocab], ensure_ascii=False, separators=(',', ':')) + ';\n')
from collections import Counter
print('kanji', len(kanji), Counter(k['lv'] for k in kanji), 'with hv', sum(1 for k in kanji if k['hv']))
print('vocab', len(vocab), Counter(v['lv'] for v in vocab), 'with hv', sum(1 for v in vocab if v['hv']))
