import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const url='https://canada-high-tech-solutions.vercel.app';
const results=[];
for(const asset of ['index.html','app.mjs','core.mjs','style.css','studio.ttf','favicon.svg','og.png','robots.txt','sitemap.xml']){
 const response=await fetch(`${url}/${asset==='index.html'?'':asset}`);
 assert.equal(response.status,200,asset);
 const remote=Buffer.from(await response.arrayBuffer());
 const local=await readFile(`public/${asset}`);
 const sha256=createHash('sha256').update(remote).digest('hex');
 assert.equal(sha256,createHash('sha256').update(local).digest('hex'),asset);
 results.push({asset,http:response.status,bytes:remote.length,sha256,sourceMatches:true});
}
await writeFile('evidence/production-assets.json',JSON.stringify({url,results},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
