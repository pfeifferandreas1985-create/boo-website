// Boos Gesicht: Neon-Grid-Augen3 mit Regenbogen-Raster (Designer, 07.10.2026), Quelle firmware-hardware/animationen/roboter-augen/
// Neon-Grid-Augen3.quelle.html. Tabellen und Zeichnen 1:1 aus dem Entwurf (erzeugt von einem Skript, nicht von Hand
// aendern: erst den Entwurf, dann neu erzeugen). Hier als Klasse ohne DC-Rahmen: mehrere Gesichter, Farbe je Charakter.
// Jedes der 22 Emojis aus den Prompts hat einen eigenen Ausdruck mit Mund, Toenung und Effekten.
//
//   const g = new BooGesicht(canvas, { farbe: '#3ff0ff' });
//   g.farbe('#ff5aa8'); g.emotion('laughing'); g.geste('wink'); g.ende();
// emotion() nimmt die Namen des Entwurfs (grin, cry ...), die xiaozhi-Emotionen (laughing, crying ...) und die alten
// Namen aus Neon-Grid-Augen2 (happy, sad ...).
(() => {
  'use strict';
const BASE={x:0,y:0,w:74,h:62,rot:0,n:2.2,lt:0,la:0,lb:0,hv:0,br:1,cl:0,ir:.68};
const RED=[255,42,61],PINK=[255,77,196],HOTC=[255,110,40];
const EMO={
 neutral:{e:'•',label:'Neutral',L:{},B:{}},
 think:{tint:[255,196,60],M:{w:26,up:-1,lo:-1,r:.5,sk:5},e:'🤔',label:'Nachdenklich',L:{lt:.3,la:4,h:56},R:{w:78,h:68,y:-4},gx:-14,gy:-14,tilt:-6,B:{L:{y:6,a:12},R:{y:-14,a:-6,c:-4}}},
 relieved:{tint:[255,196,60],M:{w:30,up:5,lo:5,r:.6},e:'😌',label:'Erleichtert',L:{gk:'down'},gy:4,B:{y:-4,a:-8,c:-2}},
 smile:{tint:[255,196,60],M:{w:40,up:9,lo:9,r:.6},e:'🙂',label:'Lächeln',L:{lb:.3,w:76},B:{y:-3,a:-3,c:-2}},
 pensive:{tint:[255,196,60],M:{w:24,up:-4,lo:-4,r:.6},e:'😔',label:'Bedrückt',L:{gk:'down',w:66},gy:12,B:{y:0,a:-20}},
 wink:{tint:[255,196,60],M:{w:42,up:7,lo:13,r:.6,sk:2},e:'😉',label:'Zwinkern',L:{lb:.35,w:78,h:64},R:{gk:'up'},B:{L:{y:-4,a:-4,c:-3},R:{y:4,a:6}}},
 angry:{full:1,M:{w:34,up:-7,lo:-7,r:.6},e:'😠',label:'Wütend',L:{lt:.38,la:26,h:56,n:2.8},tint:RED,B:{y:8,a:26,c:1}},
 smirk:{tint:[0,190,215],M:{w:34,up:2,lo:2,r:.5,sk:7},e:'😏',label:'Grinsen',L:{lt:.42,la:-4,lb:.12,h:58},gx:18,gy:-2,tilt:4,B:{L:{y:4,a:4},R:{y:-10,a:-6,c:-3}}},
 flushed:{tint:[255,196,60],M:{w:20,up:0,lo:0,r:.5,wv:1},e:'😳',label:'Verlegen',L:{w:68,h:76,n:2,ir:.32},fx:['blush'],B:{y:-12,a:-12,c:-2}},
 cool:{tint:[255,196,60],M:{w:36,up:7,lo:7,r:.5,sk:3},e:'😎',label:'Cool',L:{lb:.2},fx:['shades'],B:{y:-8,a:4}},
 astonished:{tint:[255,196,60],M:{w:20,up:-12,lo:14,r:1},e:'😲',label:'Erstaunt',L:{w:86,h:90,n:2,y:-4,ir:.4},B:{y:-18,a:-2,c:-5}},
 grin:{tint:[255,196,60],M:{w:50,up:0,lo:28,r:.85},e:'😆',label:'Lachen',L:{gk:'chev'},bob:.8,B:{y:-8,a:-4,c:-4}},
 blank:{tint:[255,196,60],e:'😶',label:'Sprachlos',L:{w:44,h:54,n:2,ir:.5},B:{hide:1}},
 scream:{tint:[255,196,60],M:{w:22,up:-16,lo:24,r:1},e:'😱',label:'Schreck',L:{w:78,h:92,n:2,ir:.22,y:-4},tremble:1,fx:['sweat'],B:{y:-16,a:-22,c:-2}},
 love:{tint:PINK,M:{w:46,up:2,lo:22,r:.8},e:'😍',label:'Verliebt',L:{hv:1,w:80,h:72},bob:.6,B:{y:-6,a:-10,c:-3}},
 roll:{tint:[255,196,60],M:{w:26,up:0,lo:0,r:.5,sk:3},e:'🙄',label:'Augenrollen',L:{lb:.32,h:60},gx:10,gy:-24,tilt:4,B:{y:-8,a:6}},
 tongue:{tint:[255,196,60],M:{w:46,up:4,lo:16,r:.7,tg:1},e:'😜',label:'Albern',L:{w:86,h:84,n:2,y:-4},R:{gk:'chev'},tilt:-8,bob:.6,B:{L:{y:-14,a:-4,c:-4},R:{y:4,a:10}}},
 cry:{tint:[70,150,255],M:{w:44,up:-8,lo:18,r:.8},e:'😭',label:'Weinen',L:{gk:'down',w:70},tremble:1,fx:['tears'],B:{y:2,a:-24}},
 joy:{tint:[255,196,60],M:{w:54,up:0,lo:28,r:.85},e:'😂',label:'Tränen lachen',L:{gk:'up',w:80},bob:1.2,tilt:-6,fx:['joyTears'],B:{y:-6,a:-12,c:-3}},
 drool:{tint:[40,130,255],M:{w:40,up:5,lo:12,r:.6,sk:-3},e:'🤤',label:'Sabbern',L:{lt:.45,la:-8,lb:.15,h:56},gx:-6,gy:-10,tilt:6,fx:['drool'],B:{y:-6,a:-10,c:-2}},
 sleep:{tint:[255,196,60],M:{w:12,up:-5,lo:5,r:1},e:'😴',label:'Schlafen',L:{gk:'down',w:66},gy:6,fx:['zzz'],B:{y:4,a:-4}},
 kiss:{full:1,M:{w:11,up:-5,lo:5,r:1,ox:6},e:'😘',label:'Küsschen',L:{lb:.3,w:76},R:{gk:'up'},tint:PINK,fx:['heart','blush'],B:{L:{y:-4,a:-6,c:-2},R:{y:2,a:4}}},
 hot:{full:1,M:{w:40,up:2,lo:20,r:.8,tg:1,wv:.5},e:'🥵',label:'Heiß',L:{lt:.32,la:-14,lb:.1,h:54},tint:HOTC,tremble:1,fx:['sweat','steam'],B:{y:-4,a:-18}}
};
const MB={w:30,up:0,lo:0,r:.6,sk:0,tg:0,wv:0,ox:0,a:0};
const FX=['tears','joyTears','blush','sweat','drool','zzz','heart','steam','shades'];
const sm=u=>u*u*(3-2*u);
function k(t,p){if(t<=p[0][0])return p[0][1];for(let i=1;i<p.length;i++){if(t<=p[i][0]){const[a,v0]=p[i-1],[b,v1]=p[i];return v0+(v1-v0)*sm((t-a)/(b-a));}}return p[p.length-1][1];}
function blinkC(t,c=150,h=60,o=150){if(t<0||t>c+h+o)return 1;if(t<c)return 1-.94*sm(t/c);if(t<c+h)return .06;return .06+.94*sm((t-c-h)/o);}
const boot=t=>({sy:t<300?.04:k(t,[[300,.04],[700,1.15],[900,.92],[1050,1]]),br:t<300?((t%120)<60?.35:0):1});
const G={
 blink:{label:'Blinzeln',d:420,f:t=>({sy:blinkC(t)})},
 wink:{label:'Zwinkern',d:900,f:t=>({emo:'wink'})},
 lookAround:{label:'Umschauen',d:2400,f:t=>({dx:k(t,[[0,0],[220,-32],[850,-32],[1100,32],[1700,32],[1950,0]]),dy:k(t,[[0,0],[220,4],[850,4],[1100,-6],[1700,-6],[1950,0]]),sy:blinkC(t-1000,90,30,110)})},
 nod:{label:'Ja nicken',d:1300,f:t=>({emo:'smile',dy:13*Math.sin(t/1300*Math.PI*6)*(1-t/1300)})},
 shake:{label:'Nein schütteln',d:1300,f:t=>({L:{lt:.28},R:{lt:.28},dx:22*Math.sin(t/1300*Math.PI*6)*(1-t/1300)})},
 laugh:{label:'Lachen',d:1700,f:t=>({emo:'grin',dy:-Math.abs(Math.sin(t/1700*Math.PI*6))*8*(1-t/2200)})},
 heart:{label:'Herzklopfen',d:1800,f:t=>{const p=t%600;return{emo:'love',sc:1+.14*(Math.exp(-p/70)*(p<120?1:0)+Math.exp(-Math.max(0,p-160)/80)*(p>160&&p<320?.8:0))};}},
 dizzy:{label:'Schwindelig',d:2600,f:t=>{const a=t/380*Math.PI*2,e=Math.min(1,t/300)*(1-sm(Math.max(0,t-1900)/700));return{emo:'think',Ld:{x:Math.cos(a)*14*e,y:Math.sin(a)*10*e},Rd:{x:Math.cos(-a)*14*e,y:Math.sin(-a)*10*e}};}},
 scan:{label:'Scannen',d:2600,f:t=>({emo:'neutral',L:{lt:.3,la:8,h:44,n:3.2},R:{lt:.3,la:8,h:44,n:3.2},dx:k(t,[[0,0],[300,-34],[900,34],[1500,-34],[2100,34],[2500,0]])})},
 eyeRoll:{label:'Augenrollen',d:1600,f:t=>{const a=Math.PI*(1-sm(Math.min(1,Math.max(0,(t-250)/900)))),e=k(t,[[0,0],[250,1],[1150,1],[1500,0]]);return{emo:'roll',dx:Math.cos(a)*28*e,dy:-Math.sin(a)*18*e+24*e};}},
 doubleTake:{label:'Doppelter Blick',d:1900,f:t=>t<650?{dx:k(t,[[0,0],[180,30],[420,30],[560,0]])}:{emo:'astonished',sc:k(t,[[650,1],[760,1.1],[900,1]])}},
 sigh:{label:'Seufzen',d:2300,f:t=>({emo:'pensive',dy:k(t,[[0,0],[800,7],[1400,7],[2100,0]])})},
 glitch:{label:'Störung',d:900,f:t=>({glitch:1,dx:(Math.random()-.5)*(t<700?10:0),br:Math.random()<.15?.3:1})},
 shutdown:{label:'Aus & Neustart',d:3800,f:t=>t<2000?{emo:'sleep',sy:k(t,[[0,1],[600,.04]]),br:k(t,[[600,1],[1000,0]])}:boot(t-2000)},
 boop:{label:'Anstupsen',d:1000,hidden:1,f:t=>t<420?{emo:'astonished',sc:k(t,[[0,.85],[140,1.12],[300,1]])}:{emo:'smile',sy:blinkC(t-600,90,20,110)}}
};
function hexRgb(h){h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function se(c,w,h,n){const a=w/2,b=h/2;c.beginPath();for(let i=0;i<=180;i++){const t=i/180*Math.PI*2,co=Math.cos(t),si=Math.sin(t);const x=a*Math.sign(co)*Math.pow(Math.abs(co),2/n),y=b*Math.sign(si)*Math.pow(Math.abs(si),2/n);i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
function heartP(c,w,h){const s=w/2;c.beginPath();c.moveTo(0,h*.42);c.bezierCurveTo(-s*1.25,-h*.02,-s*.7,-h*.72,0,-h*.26);c.bezierCurveTo(s*.7,-h*.72,s*1.25,-h*.02,0,h*.42);c.closePath();}
function heartPts(w,h,N){const s=w/2,H2=N/2,P=[];const bz=(p0,p1,p2,p3,u)=>{const v=1-u;return{x:v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],y:v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]};};
 for(let i=0;i<H2;i++)P.push(bz([0,-h*.26],[s*.7,-h*.72],[s*1.25,-h*.02],[0,h*.42],i/H2));
 for(let i=0;i<H2;i++)P.push(bz([0,h*.42],[-s*1.25,-h*.02],[-s*.7,-h*.72],[0,-h*.26],i/H2));return P;}
function eyePoly(e,W,H,m){const N=120,P=[],hs=.6+.4*e.hv,hp=e.hv>.01?heartPts(W*hs,H*hs*1.05,N):null,a=W/2,b=H/2;
 for(let i=0;i<N;i++){const t=-Math.PI/2+i/N*Math.PI*2,co=Math.cos(t),si=Math.sin(t);let x=a*Math.sign(co)*Math.pow(Math.abs(co),2/e.n),y=b*Math.sign(si)*Math.pow(Math.abs(si),2/e.n);if(hp){x+=(hp[i].x-x)*e.hv;y+=(hp[i].y-y)*e.hv;}P.push({x,y});}
 if(e.lt>.005){const an=e.la*m*Math.PI/180,ca=Math.cos(an),sa=Math.sin(an),ly=-H/2+e.lt*H;for(const p of P){const qx=p.x*ca+p.y*sa;let qy=-p.x*sa+p.y*ca;if(qy<ly)qy=ly;p.x=qx*ca-qy*sa;p.y=qx*sa+qy*ca;}}
 if(e.lb>.005){const ry=H*.75,rx=W*.8,cyE=H/2+ry-e.lb*H*1.1;for(const p of P){if(Math.abs(p.x)<rx){const ye=cyE-ry*Math.sqrt(1-(p.x/rx)**2);if(p.y>ye)p.y=ye;}}}
 return P;}

  // xiaozhi-Emotion (Server) -> Ausdruck; Emoji wie in den Prompts (FACIAL EXPRESSIONS)
  const XIAOZHI = { neutral: 'neutral', happy: 'smile', laughing: 'grin', funny: 'joy', sad: 'pensive', crying: 'cry',
    angry: 'angry', loving: 'love', embarrassed: 'flushed', surprised: 'astonished', shocked: 'scream',
    thinking: 'think', winking: 'wink', cool: 'cool', relaxed: 'relieved', delicious: 'drool', kissy: 'kiss',
    confident: 'smirk', sleepy: 'sleep', silly: 'tongue', confused: 'roll', hot: 'hot' };
  // alte Namen (Neon-Grid-Augen2), damit bestehende Aufrufe weiter passen
  const ALT = { joy: 'joy', excited: 'grin', love: 'love', scared: 'scream', skeptical: 'smirk', suspicious: 'smirk',
    curious: 'think', focused: 'neutral', bored: 'roll', shy: 'flushed' };
  const name = e => EMO[e] ? e : (XIAOZHI[e] || ALT[e] || null);

  class BooGesicht {
    constructor(canvas, opt = {}) {
      this.cv = canvas;
      this.opt = { farbe: '#3ff0ff', glow: 12, grid: true, regenbogen: false, horizont: false, brows: true, mund: true, idle: true, aus: false, ...opt };
      this.emo = name(opt.emotion) || 'neutral'; this.g = null; this.sac = { x: 0, y: 0 }; this.nextSac = 0;
      this.nextBlink = 1500; this.blinkAt = -1e4; this.blink2 = 0; this.last = 0; this.cur = null; this.bl = null;
      this.fx = {}; this.mo = { ...MB }; this.mouthPt = { x: 120, y: 176 };
      this.lauf = true;
      this.loop = this.loop.bind(this);
      this.raf = requestAnimationFrame(this.loop);
      if (opt.boot !== false) setTimeout(() => this.geste('boot'), 120);
    }
    farbe(f) { this.opt.farbe = f || '#3ff0ff'; }
    emotion(e) { const n = name(e); if (n) this.emo = n; if (e === 'confused') this.geste('eyeRoll'); }
    geste(n) { const def = n === 'boot' ? { d: 1100, f: boot } : G[n]; if (def) this.g = { def, name: n, start: performance.now() }; }
    aus(an) { this.opt.aus = !!an; }
    ende() { this.lauf = false; cancelAnimationFrame(this.raf); }
 target(emoName,patch){const E=EMO[emoName]||EMO.neutral;const L={...BASE,...E.L,...(patch&&patch.L)},R={...BASE,...(E.R||E.L),...(patch&&patch.R)};return{L,R,gx:E.gx||0,gy:E.gy||0,tilt:E.tilt||0,bob:E.bob||0,tremble:E.tremble||0};}
 loop(ts){if(!this.lauf)return;if(!this.cv.isConnected){this.ende();return;}this.raf=requestAnimationFrame(this.loop);if(!this.cv.offsetWidth)return;if(this.opt.nurWenn&&!this.opt.nurWenn())return;const dt=Math.min(.05,(ts-(this.last||ts))/1000);this.last=ts;
  let p={};if(this.g){const el=ts-this.g.start;if(el>this.g.def.d){this.g=null;}else p=this.g.def.f(el)||{};}
  this.curEmo=p.emo||this.emo;const T=this.target(this.curEmo,p);
  if(ts>this.nextSac){this.nextSac=ts+700+Math.random()*2600;this.sac=Math.random()<.35?{x:0,y:0}:{x:(Math.random()-.5)*36,y:(Math.random()-.5)*20};}
  let gx=T.gx,gy=T.gy;if(this.opt.idle&&!this.g){gx+=this.sac.x*.6;gy+=this.sac.y*.6;}
  if(!this.g&&ts>this.nextBlink){this.blinkAt=ts;this.nextBlink=ts+1800+Math.random()*4500;this.blink2=Math.random()<.2?ts+380:0;}
  if(this.blink2&&ts>this.blink2){this.blinkAt=ts;this.blink2=0;}
  if(!this.cur){this.cur={L:{...BASE,gk:null},R:{...BASE,gk:null},gx,gy,tilt:T.tilt,bob:T.bob};}
  const c=this.cur,a=1-Math.exp(-dt*12),ag=1-Math.exp(-dt*16);
  for(const s of['L','R']){const tg=T[s].gk||null,cs=c[s];let tcl=tg?1:0;if(tg&&cs.gk!==tg){if(!cs.gk||cs.cl<.05)cs.gk=tg;else tcl=0;}T[s].cl=tcl;
   for(const key in BASE)cs[key]+=(T[s][key]-cs[key])*a;}
  c.gx+=(gx-c.gx)*ag;c.gy+=(gy-c.gy)*ag;c.tilt+=(T.tilt-c.tilt)*a;c.bob+=(T.bob-c.bob)*a;
  const bl=blinkC(ts-this.blinkAt),breath=1-.018*(.5+.5*Math.sin(ts/3600*Math.PI*2));
  const sy=(p.sy??1)*bl*breath;
  this.draw(ts,c,{syL:sy*(p.syL??1),syR:sy*(p.syR??1),dx:(p.dx||0)+(T.tremble?(Math.random()-.5)*2.2:0),dy:(p.dy||0)+Math.sin(ts/260)*3*c.bob+(T.tremble?(Math.random()-.5)*1.6:0),sc:p.sc||1,br:this.opt.aus?0:(p.br??1),glitch:p.glitch,Ld:p.Ld,Rd:p.Rd});

 }
 draw(ts,c,d){const cv=this.cv;if(!cv)return;const ctx=cv.getContext('2d');
  const res=Math.max(120,Math.round(cv.clientWidth*(window.devicePixelRatio||1)));if(cv.width!==res){cv.width=cv.height=res;}const f=res/240;
  const EM=EMO[this.curEmo]||EMO.neutral;
  for(const q of FX)this.fx[q]=(this.fx[q]||0)+(((EM.fx||[]).includes(q)?1:0)-(this.fx[q]||0))*.1;
  const col=hexRgb(this.opt.farbe),lv=Math.max(0,Math.min(1,(c.L.hv+c.R.hv)/2));
  const tgt=EM.full?EM.tint:col,atg=EM.tint||col;this.tcc=(this.tcc||tgt.slice()).map((v,i)=>v+(tgt[i]-v)*.07);this.acc=(this.acc||atg.slice()).map((v,i)=>v+(atg[i]-v)*.07);const ecol=this.tcc.map((v,i)=>Math.round(v+(PINK[i]-v)*lv)),acol=this.acc.map(Math.round);const AC=al=>`rgba(${acol.join(',')},${al})`,ACh=`rgba(${acol.map(v=>Math.round(v+(255-v)*.75)).join(',')},1)`;
  const EC=al=>`rgba(${ecol.join(',')},${al})`,Ehot=`rgba(${ecol.map(v=>Math.round(v+(255-v)*.75)).join(',')},1)`;
  const C=al=>`rgba(${col.join(',')},${al})`,br=Math.max(0,d.br),P2=Math.PI*2,glow=this.opt.glow;
  const PK=al=>`rgba(255,77,196,${al})`,PKh='rgba(255,205,238,1)';
  const neon=(fn,lw,cf=EC,hf=Ehot)=>{ctx.shadowColor=cf(.95);ctx.shadowBlur=glow*f;fn();ctx.strokeStyle=cf(1);ctx.lineWidth=lw;ctx.stroke();ctx.shadowBlur=glow*.4*f;ctx.strokeStyle=hf;ctx.lineWidth=Math.max(1,lw*.4);ctx.stroke();ctx.shadowBlur=0;};
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#02040a';ctx.fillRect(0,0,res,res);
  ctx.setTransform(f,0,0,f,0,0);ctx.lineCap='round';ctx.lineJoin='round';
  if(this.opt.grid){const hz=150,vx=120+c.gx*.4,rb=this.opt.regenbogen===true,RG=al=>{if(!rb)return C(al);const g=ctx.createLinearGradient(0,0,240,0),o=ts/40;for(let i=0;i<=6;i++)g.addColorStop(i/6,`hsla(${(o+i*60)%360},100%,62%,${al})`);return g;};ctx.save();ctx.beginPath();ctx.rect(0,hz,240,90);ctx.clip();ctx.strokeStyle=this.opt.regenbogen?RG(.42*br):C(.28*br);ctx.lineWidth=.8;ctx.beginPath();
   for(let i=-10;i<=10;i++){ctx.moveTo(vx+i*6,hz);ctx.lineTo(vx+i*60,240+60);}
   const sc=(ts/1400)%1;for(let n=0;n<9;n++){const z=(n+sc)/9,y=hz+Math.pow(z,2.2)*110;ctx.moveTo(0,y);ctx.lineTo(240,y);}ctx.stroke();
   const hg=ctx.createLinearGradient(0,hz,0,hz+40);hg.addColorStop(0,'rgba(2,4,10,.9)');hg.addColorStop(1,'rgba(2,4,10,0)');ctx.fillStyle=hg;ctx.fillRect(0,hz,240,40);ctx.restore();
   if(this.opt.horizont){ctx.strokeStyle=C(.55*br);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,hz);ctx.lineTo(240,hz);ctx.stroke();}}
  ctx.save();ctx.translate(120,120);const RC=d.glitch?(al=>(ts%180)<90?`rgba(255,42,61,${Math.min(1,al*1.3)})`:`rgba(255,42,61,${al*.15})`):C;ctx.shadowColor=RC(.9);ctx.shadowBlur=6*f;
  const rot=ts/5200;ctx.strokeStyle=RC(.75*br);ctx.lineWidth=2.5;for(let i=0;i<12;i++){if(i%4===3)continue;const a0=rot+i/12*P2;ctx.beginPath();ctx.arc(0,0,111,a0,a0+P2/12*.72);ctx.stroke();}
  ctx.strokeStyle=RC(.35*br);ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<72;i++){const a0=-rot*1.6+i/72*P2,r0=i%6?101:97;ctx.moveTo(Math.cos(a0)*r0,Math.sin(a0)*r0);ctx.lineTo(Math.cos(a0)*104,Math.sin(a0)*104);}ctx.stroke();
  ctx.restore();ctx.shadowBlur=0;
  const tilt=c.tilt*Math.PI/180,ct=Math.cos(tilt),st=Math.sin(tilt);
  const eyes=[];
  for(const s of[-1,1]){const e=s<0?c.L:c.R,m=s<0?1:-1,dd=(s<0?d.Ld:d.Rd)||{x:0,y:0};const persp=1+s*(c.gx+d.dx)/420,sc=d.sc*persp,W=e.w*sc,H=e.h*sc*(s<0?d.syL:d.syR)*(1-e.cl*.85);const cx=120+s*(48+e.x)+c.gx+d.dx+dd.x,cy=120+e.y+c.gy+d.dy+dd.y;
   const pts=eyePoly(e,W,H,m),ro=e.rot*m*Math.PI/180,cr=Math.cos(ro),sr=Math.sin(ro),gj=d.glitch?(Math.random()-.5)*8:0;
   const tf=(q,kk)=>{const x=(q.x*kk)*cr-(q.y*kk)*sr+cx-120+gj,y=(q.x*kk)*sr+(q.y*kk)*cr+cy-120;return{x:120+x*ct-y*st,y:120+x*st+y*ct};};
   eyes.push({s,e,m,ro,W,H,h0:e.h*sc,cx,cy,o:pts.map(q=>tf(q,1)),i:pts.map(q=>tf(q,e.ir)),p:tf({x:0,y:0},1)});}
  const path=P=>{ctx.beginPath();P.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();};
  for(const E of eyes){const op=1-E.e.cl,bo=br*op;
   if(op>.01){ctx.save();path(E.o);ctx.fillStyle=EC(.1*bo);ctx.fill();ctx.clip();
    const sy=E.cy+Math.sin(ts/700+E.cx)*E.H*.4;const g=ctx.createLinearGradient(0,sy-8,0,sy+8);g.addColorStop(0,EC(0));g.addColorStop(.5,EC(.35*bo));g.addColorStop(1,EC(0));ctx.fillStyle=g;ctx.fillRect(0,sy-8,240,16);
    ctx.strokeStyle=EC(.12*bo);ctx.lineWidth=.7;ctx.beginPath();for(let y=0;y<240;y+=4){ctx.moveTo(0,y);ctx.lineTo(240,y);}ctx.stroke();ctx.restore();
    ctx.globalAlpha=bo;neon(()=>path(E.o),4);ctx.globalAlpha=bo*.6;ctx.shadowColor=EC(.95);ctx.shadowBlur=glow*.5*f;ctx.shadowColor=AC(.95);path(E.i);ctx.strokeStyle=AC(1);ctx.lineWidth=1.4;ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;}
   const gk=E.e.gk;if(E.e.cl>.01&&gk){ctx.save();ctx.globalAlpha=br*E.e.cl;ctx.translate(E.p.x,E.p.y);ctx.rotate(tilt+E.ro);const W=E.W,gh=W*.36,m=E.m;
    neon(()=>{ctx.beginPath();if(gk==='up'){ctx.moveTo(-W*.42,gh*.45);ctx.quadraticCurveTo(0,-gh*1.1,W*.42,gh*.45);}else if(gk==='down'){ctx.moveTo(-W*.42,-gh*.3);ctx.quadraticCurveTo(0,gh*1.0,W*.42,-gh*.3);}else{ctx.moveTo(-W*.3*m,-gh*.8);ctx.lineTo(W*.3*m,0);ctx.lineTo(-W*.3*m,gh*.8);}},4.5);
    ctx.restore();}}
  const fa=q=>this.fx[q]>.01?this.fx[q]:0,Le=eyes[0],Re=eyes[1];let a;
  if(a=fa('shades')){ctx.save();ctx.globalAlpha=br*a;for(const E of eyes){ctx.save();ctx.translate(E.p.x,E.p.y-2);ctx.rotate(tilt);se(ctx,86,54,3.4);ctx.fillStyle='#02040a';ctx.fill();neon(()=>se(ctx,86,54,3.4),3);
    ctx.globalAlpha=br*a*.55;ctx.beginPath();ctx.moveTo(-28,10);ctx.lineTo(-8,-16);ctx.moveTo(-16,14);ctx.lineTo(-2,-4);ctx.strokeStyle=EC(1);ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=br*a;ctx.restore();}
   neon(()=>{ctx.beginPath();ctx.moveTo(Le.p.x+42,Le.p.y-12);ctx.quadraticCurveTo((Le.p.x+Re.p.x)/2,(Le.p.y+Re.p.y)/2-20,Re.p.x-42,Re.p.y-12);},3);ctx.restore();}
  if(this.opt.brows){const B=EM.B||{},bl=this.bl||(this.bl={L:{y:0,a:0,c:0,al:1},R:{y:0,a:0,c:0,al:1}});
   for(const k2 of['L','R']){const src=(B.L||B.R)?(B[k2]||{}):B,tg={y:0,a:0,c:0,al:B.hide?0:1,...src};for(const q in bl[k2])bl[k2][q]+=(tg[q]-bl[k2][q])*.14;}
   ctx.save();ctx.translate(120,120);ctx.rotate(tilt);ctx.translate(-120,-120);
   for(const s2 of[-1,1]){const e=s2<0?c.L:c.R,m=s2<0?1:-1,b2=s2<0?bl.L:bl.R,dd=(s2<0?d.Ld:d.Rd)||{x:0,y:0},sc=d.sc*(1+s2*(c.gx+d.dx)/420);if(b2.al<.01)continue;
    const bx=120+s2*(48+e.x)+c.gx+d.dx+dd.x,by=120+e.y+c.gy+d.dy+dd.y-e.h*sc/2*(1-e.cl*.4)-13+b2.y+e.lt*7;
    ctx.save();ctx.globalAlpha=br*b2.al;ctx.translate(bx,by);ctx.rotate(b2.a*m*Math.PI/180);neon(()=>{ctx.beginPath();ctx.moveTo(-22,0);ctx.quadraticCurveTo(0,b2.c*2,22,0);},4);ctx.restore();}
   ctx.restore();}
  {const MT={...MB,...(EM.M||{}),a:EM.M&&(this.opt.mund!==false)?1:0},mo=this.mo;for(const q in MB)mo[q]+=(MT[q]-mo[q])*.14;
   const mx=120+c.gx*.5+d.dx*.6+mo.ox,my=176+c.gy*.35+d.dy*.6;this.mouthPt={x:mx+mo.w/2-2,y:my+mo.sk*.2};
   if(mo.a>.01){ctx.save();ctx.translate(120,120);ctx.rotate(tilt);ctx.translate(mx-120,my-120);ctx.globalAlpha=br*mo.a;const w2=mo.w/2,r=mo.r,yl=mo.sk*.2,yr=-mo.sk,op=mo.lo-mo.up>3;
    const lip=(u0,u1,yc,dir)=>{const N=16;for(let i=1;i<=N;i++){const t=i/N,u=dir>0?t:1-t,v=1-u,xa=-w2,xb=-w2*r,xc=w2*r,xd=w2;const x=v*v*v*xa+3*v*v*u*xb+3*v*u*u*xc+u*u*u*xd,y=v*v*v*yl+3*v*v*u*yc+3*v*u*u*yc+u*u*u*yr+(mo.wv?Math.sin(u*Math.PI*4+ts/160)*1.6*mo.wv:0);ctx.lineTo(x,y);}};
    const mp=()=>{ctx.beginPath();ctx.moveTo(-w2,yl);lip(0,1,mo.up*1.33,1);if(op){lip(1,0,mo.lo*1.33,-1);ctx.closePath();}};
    if(op){mp();ctx.fillStyle='#02040a';ctx.fill();ctx.fillStyle=EC(.12);ctx.fill();}
    if(mo.tg>.01){const ty=Math.max(mo.lo*.75,4),tx=w2*.25;ctx.globalAlpha=br*mo.a*mo.tg;ctx.beginPath();ctx.moveTo(tx-8,ty-4);ctx.lineTo(tx-8,ty+6);ctx.arc(tx,ty+6,8,Math.PI,0,true);ctx.lineTo(tx+8,ty-4);ctx.fillStyle='#02040a';ctx.fill();ctx.fillStyle=PK(.25);ctx.fill();neon(()=>{ctx.beginPath();ctx.moveTo(tx-8,ty-4);ctx.lineTo(tx-8,ty+6);ctx.arc(tx,ty+6,8,Math.PI,0,true);ctx.lineTo(tx+8,ty-4);ctx.moveTo(tx,ty+2);ctx.lineTo(tx,ty+8);},2.4,PK,PKh);ctx.globalAlpha=br*mo.a;}
    neon(mp,3.5);ctx.restore();}}
  const drop=(x,y,s)=>{ctx.beginPath();ctx.moveTo(x,y-s*2.2);ctx.quadraticCurveTo(x+s*1.1,y-s*.7,x+s,y);ctx.arc(x,y,s,0,Math.PI);ctx.quadraticCurveTo(x-s*1.1,y-s*.7,x,y-s*2.2);ctx.closePath();};
  ctx.save();
  if(a=fa('tears')){ctx.globalAlpha=br*a;ctx.setLineDash([9,7]);ctx.lineDashOffset=-ts/25;for(const E of eyes){const x=E.p.x+E.s*E.W*.22;neon(()=>{ctx.beginPath();ctx.moveTo(x,E.p.y+8);ctx.bezierCurveTo(x+E.s*4,E.p.y+40,x-E.s*2,E.p.y+62,x+E.s*3,204);},3.5,AC,ACh);}ctx.setLineDash([]);}
  if(a=fa('joyTears')){for(const E of eyes)for(let j=0;j<2;j++){const u=((ts/1000)+j*.5+(E.s>0?.25:0))%1,x=E.p.x+E.s*(E.W*.5+u*30),y=E.p.y-6-u*18+u*u*70;ctx.globalAlpha=br*a*(1-u)*Math.min(1,u*8);ctx.fillStyle=AC(.35);drop(x,y,3.5+(1-u)*1.5);ctx.fill();neon(()=>drop(x,y,3.5+(1-u)*1.5),2.2,AC,ACh);}}
  if(a=fa('blush')){ctx.globalAlpha=br*a;for(const E of eyes){const y=E.p.y+E.h0*.5+14;for(let i=-1;i<=1;i++){const x=E.p.x+i*10+E.s*4;neon(()=>{ctx.beginPath();ctx.moveTo(x-3,y+4);ctx.lineTo(x+3,y-4);},2.5,PK,PKh);}}}
  if(a=fa('sweat')){for(const [x,ph] of [[188,0],[52,.5]]){const u=((ts/2200)+ph)%1,y=60+u*26;ctx.globalAlpha=br*a*Math.sin(u*Math.PI);ctx.fillStyle=AC(.3);drop(x,y,5);ctx.fill();neon(()=>drop(x,y,5),2.4,AC,ACh);}}
  if(a=fa('drool')){const u=(ts/2000)%1,len=6+sm(Math.min(1,u*1.4))*22,x=this.mouthPt.x,y0=this.mouthPt.y+2;ctx.globalAlpha=br*a*(u>.85?(1-u)/.15:1);neon(()=>{ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y0+len-5);},2.5,AC,ACh);ctx.fillStyle=AC(.35);drop(x,y0+len,3.5,AC,ACh);ctx.fill();neon(()=>drop(x,y0+len,3.5),2.4,AC,ACh);}
  if(a=fa('zzz')){for(let i=0;i<3;i++){const u=((ts/2800)+i/3)%1,x=170+u*28,y=80-u*44,s=5+u*7;ctx.globalAlpha=br*a*Math.sin(u*Math.PI);neon(()=>{ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.lineTo(x+s,y+s);},2.5,AC,ACh);}}
  if(a=fa('heart')){const u=(ts/1700)%1,x=Re.p.x+10+u*16,y=Re.p.y-30-u*30,s=12+u*8;ctx.globalAlpha=br*a*(1-u)*Math.min(1,u*6);ctx.save();ctx.translate(x,y);ctx.rotate(.3);ctx.fillStyle=PK(.3);heartP(ctx,s,s);ctx.fill();neon(()=>heartP(ctx,s,s),2.5,PK,PKh);ctx.restore();}
  if(a=fa('steam')){for(let i=0;i<3;i++){const u=((ts/1800)+i/3)%1,xb=96+i*24,yb=70-u*22;ctx.globalAlpha=br*a*Math.sin(u*Math.PI)*.9;neon(()=>{ctx.beginPath();for(let q=0;q<=12;q++){const y=yb-q*1.6,x=xb+Math.sin(q*.7+ts/180+i)*3;q?ctx.lineTo(x,y):ctx.moveTo(x,y);}},2,AC,ACh);}}
  ctx.restore();ctx.globalAlpha=1;
 }
  }
  BooGesicht.EMOTIONEN = Object.keys(EMO);
  BooGesicht.GESTEN = Object.keys(G);
  BooGesicht.XIAOZHI = XIAOZHI;
  BooGesicht.EMOJI = Object.fromEntries(Object.entries(EMO).map(([k, v]) => [k, v.e]));
  window.BooGesicht = BooGesicht;
})();
