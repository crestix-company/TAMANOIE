import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,relative,extname} from 'node:path';
import {spawn} from 'node:child_process';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const prefix='/TAMANOIE/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp'};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!pathname.startsWith(prefix)){res.writeHead(404).end();return;}
  const file=resolve(root,pathname.slice(prefix.length)||'index.html');
  if(relative(root,file).startsWith('..')){res.writeHead(404).end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(data);
 }catch{res.writeHead(404).end();}
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
try{
 const url=`http://127.0.0.1:${server.address().port}${prefix}`;
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,[fileURLToPath(new URL('./verify.mjs',import.meta.url)),url],{stdio:'inherit'});
  child.once('error',reject);child.once('exit',resolve);
 });
 if(code!==0)throw new Error('GitHub Pages path validation failed');
 console.log(`PASS: website and exact asset bytes served correctly beneath ${prefix}`);
}finally{await new Promise(resolve=>server.close(resolve));}
