import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const brandStyleVersion=createHash('sha256').update(await readFile(resolve(root,'assets/brand-social.css'))).digest('hex').slice(0,12);
const pages=['index.html','menu.html','karaoke.html','access.html','404.html'];
const docs=new Map(await Promise.all(pages.map(async name=>[name,await readFile(resolve(root,name),'utf8')])));
const assets=new Set();
const base=process.argv[2];
for(const [name,html] of docs){
 assert.match(html,/居酒屋カラオケ玉の家/);assert.match(html,/<html lang="ja">/);
 assert.match(html,/name="viewport"/);assert.match(html,/rel="icon"/);assert.match(html,/assets\/pages.css/);
 assert.ok(html.includes('assets/brand-social.css'),name+': store-name and social styles');
 assert.ok(html.includes(`assets/brand-social.css?v=${brandStyleVersion}`),name+': current logo stylesheet version');
 assert.ok(html.includes('assets/brand-rounded-700.ttf'),name+': locally hosted rounded font');
 assert.ok(html.includes('https://maps.app.goo.gl/GoVsk32LAZ3YRfVz6?g_st=il'),name+': supplied Google Maps URL');
 assert.ok(html.includes('https://www.facebook.com/share/1FUNmEGgBb/?mibextid=wwXIfr'),name+': supplied Facebook URL');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,name+': h1');
 assert.doesNotMatch(html,/TODO|Lorem ipsum|localhost|README|undefined|NaN|串揚げと魚|ろはん|わび助/);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=m[1];if(/^(https?:|tel:|data:)/.test(url))continue;
  assert.ok(!url.startsWith('/'),name+': project path must be portable');
  const [pathname,hash]=url.split('#');const path=pathname.split('?')[0];const target=path||name;
  assert.ok((await stat(resolve(root,target))).size>0,name+': '+url);
  if(hash)assert.ok(docs.get(target)?.includes(`id="${hash}"`),name+': missing anchor '+url);
  if(path&&!path.endsWith('.html'))assets.add(path);
 }
 for(const m of html.matchAll(/srcset="([^"]+)"/g))for(const item of m[1].split(',')){
  const file=item.trim().split(' ')[0];assert.ok((await stat(resolve(root,file))).size>0);assets.add(file);
 }
 for(const m of html.matchAll(/<img[^>]*>/g)){assert.match(m[0],/alt="[^"]*"/);assert.match(m[0],/width="\d+"/);assert.match(m[0],/height="\d+"/);}
 for(const m of html.matchAll(/<a[^>]*target="_blank"[^>]*>/g))assert.match(m[0],/noopener/);
 assert.ok([...html.matchAll(/href="(tel:[^"]+)"/g)].every(m=>m[1]==='tel:09052381332'));
 if(base){const res=await fetch(new URL(name==='index.html'?'':name,base));assert.ok(res.ok);assert.equal(await res.text(),html,name+': served version mismatch');}
}
for(const phrase of ['高田駅から徒歩10分','月曜日・木曜日','17:00–24:00','最大16名様','たかな橋荘 101','090-5238-1332'])assert.ok(docs.get('access.html').includes(phrase),phrase);
assert.match(docs.get('index.html'),/2018年7月24日/);assert.match(docs.get('karaoke.html'),/料金などの詳しいご案内/);
assert.match(docs.get('menu.html'),/晩酌セット/);assert.match(docs.get('menu.html'),/カマンベールチーズ追加/);
assert.match(docs.get('index.html'),/https:\/\/www.instagram.com\/tamayama_junko\//);
for(const page of ['index.html','access.html']){
 assert.ok((docs.get(page).match(/https:\/\/www.facebook.com\/share\/1FUNmEGgBb\//g)||[]).length>=2,page+': body and footer Facebook links');
}
if(base)for(const file of assets){const r=await fetch(new URL(file,base));assert.ok(r.ok,file+': HTTP error');const actual=Buffer.from(await r.arrayBuffer());const expected=await readFile(resolve(root,file));assert.ok(actual.equals(expected),file+': served asset mismatch');}
let bytes=0;for(const file of await readdir(resolve(root,'assets')))bytes+=(await stat(resolve(root,'assets',file))).size;
console.log(`PASS: ${pages.length} HTML files, ${assets.size} referenced assets, internal links, source identity and core facts. Asset total: ${(bytes/1024/1024).toFixed(2)} MiB.`);
