// 글 파일(content/posts/*.md)을 모아 data/all.json 으로 만드는 파일 (Netlify가 자동 실행)
const fs=require('fs'),path=require('path'),dir='content/posts';let posts=[];
function unq(v){v=v.trim();try{if(/^'.*'$/.test(v))return v.slice(1,-1).replace(/''/g,"'");if(/^".*"$/.test(v))return JSON.parse(v)}catch(e){}return v}
if(fs.existsSync(dir))for(const f of fs.readdirSync(dir).sort()){if(!f.endsWith('.md'))continue;
const t=fs.readFileSync(path.join(dir,f),'utf8').replace(/\r/g,''),m=t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);if(!m)continue;
const p={file:f,body:m[2].trim()};
m[1].split('\n').forEach(l=>{const i=l.indexOf(':');if(i<1)return;let v=unq(l.slice(i+1));if(v==='true')v=true;else if(v==='false')v=false;p[l.slice(0,i).trim()]=v});
if(p.date)p.date=String(p.date).slice(0,10);posts.push(p)}
try{JSON.parse(fs.readFileSync('data/posts.json','utf8')).posts.forEach((p,i)=>posts.push({...p,file:'old'+i}))}catch(e){}
fs.mkdirSync('data',{recursive:true});fs.writeFileSync('data/all.json',JSON.stringify({posts}));
console.log(posts.length+'개의 글을 모았어요');
