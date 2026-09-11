#!/usr/bin/env python3
"""Locally extract conservative, directed mentions; never publish book text.
Usage: python3 scripts/extract-book-relations.py /path/to/A_Pattern_Language_text.pdf
The supplied edition must match data/book-source.json. Page order is taken from
our reviewed metadata; chapter boundaries remain provisional.
"""
import hashlib,json,re,subprocess,sys,tempfile
from pathlib import Path
root=Path(__file__).resolve().parent.parent
pdf=Path(sys.argv[1]);source=json.loads((root/'data/book-source.json').read_text())
if hashlib.sha256(pdf.read_bytes()).hexdigest()!=source['sha256']:
 raise SystemExit('PDF fingerprint differs; review pagination before extracting.')
catalog=json.loads((root/'data/catalog.json').read_text());index=json.loads((root/'data/book-index.json').read_text())
names={p['id']:re.sub('[^a-z]','',p['name'].lower()) for p in catalog};edges=set()
with tempfile.TemporaryDirectory(prefix='pwe-apl-private-') as temp:
 text=Path(temp)/'book.txt'
 subprocess.run(['pdftotext','-layout',str(pdf),str(text)],check=True)
 pages=text.read_text().split('\f')
 for p in index['patterns']:
  body='\n'.join(pages[n-1] for n in p['pdfPages'])
  for match in re.finditer(r'\(\s*(\d{1,3})\s*\)',body):
   target=int(match[1]);prefix=re.sub('[^a-z]','',body[max(0,match.start()-220):match.start()].lower())
   if target in names and target!=p['id'] and prefix.endswith(names[target]):edges.add((p['id'],target))
result={'basis':'Book text mentions matched by both English pattern title and parenthesized number; directed, not exhaustive and not automatic dependencies.','edges':[list(e) for e in sorted(edges)]}
(root/'data/book-relations.json').write_text(json.dumps(result,indent=2)+'\n')
print(f'{len(edges)} directed references; source text stayed in a temporary directory.')
