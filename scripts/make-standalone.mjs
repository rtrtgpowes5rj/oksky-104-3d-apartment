import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
const path=join(dist,'index.html');
let html=await readFile(path,'utf8');
const script=html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const style=html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if(!script||!style)throw new Error('Vite assets not found');
const asset=value=>join(dist,value.replace(/^[/\\]+/,''));
let [js,css]=await Promise.all([readFile(asset(script[1]),'utf8'),readFile(asset(style[1]),'utf8')]);
// TextureLoader can decode data URLs when the HTML is opened directly from disk.
for(const name of await readdir(join(root,'public','assets'))){
  if(!/\.(png|jpg|jpeg)$/i.test(name))continue;
  const mime=/\.png$/i.test(name)?'image/png':'image/jpeg';
  const bytes=await readFile(join(root,'public','assets',name));
  js=js.replaceAll(`./assets/${name}`,`data:${mime};base64,${bytes.toString('base64')}`);
}
const safe=js.replace(/<\/script/gi,()=>'<\\\\/script');
html=html.replace(script[0],()=>`<script type="module">${safe}</script>`).replace(style[0],()=>`<style>${css}</style>`);
await writeFile(path,html,'utf8');
console.log(`Standalone: ${path}`);
