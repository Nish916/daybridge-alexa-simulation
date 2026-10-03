import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json'};
const server = http.createServer(async (req,res) => {
  try {
    const raw = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const relative = raw === '/' ? 'index.html' : raw.replace(/^\//,'');
    const target = path.resolve(root,relative);
    if (!target.startsWith(root + path.sep) || relative.startsWith('.')) {res.writeHead(403); return res.end('Forbidden');}
    const data = await readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
    res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT || 4173),'127.0.0.1',()=>console.log('DayBridge ready at http://127.0.0.1:' + server.address().port));
