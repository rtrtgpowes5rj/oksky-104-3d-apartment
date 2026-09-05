import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PLAN, ROOMS, WALLS, DOORS, FURNITURE } from './plan.js';
import { petBed, bowls, litterBox, catTree, dachshund, beanbag } from './pets.js';

class Batch {
  constructor(mats){this.mats=mats;this.parts=new Map();this.transform=new THREE.Matrix4();}
  at(x,z,a,fn){const save=this.transform.clone();this.transform.multiply(new THREE.Matrix4().makeTranslation(x,0,z)).multiply(new THREE.Matrix4().makeRotationY(a||0));fn();this.transform=save;}
  add(k,g,x=0,y=0,z=0,rx=0,ry=0,rz=0){if(g.index){const original=g;g=g.toNonIndexed();original.dispose();}g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),new THREE.Vector3(1,1,1)));g.applyMatrix4(this.transform);if(!this.parts.has(k))this.parts.set(k,[]);this.parts.get(k).push(g);}
  box(k,w,h,d,x,y,z,r=0,round=0){this.add(k,round?new RoundedBoxGeometry(w,h,d,2,Math.min(round,w/2-.001,h/2-.001,d/2-.001)):new THREE.BoxGeometry(w,h,d),x,y,z,0,r);}
  cyl(k,rt,rb,h,x,y,z,n=24,rx=0){this.add(k,new THREE.CylinderGeometry(rt,rb,h,n),x,y,z,rx);}
  ball(k,x,y,z,sx,sy,sz,ry=0){const g=new THREE.SphereGeometry(1,16,10);g.scale(sx,sy,sz);this.add(k,g,x,y,z,0,ry);}
  tube(k,p,r=.012){this.add(k,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p.map(v=>new THREE.Vector3(...v))),20,r,6,false));}
  flush(parent){for(const [key,parts] of this.parts){const g=mergeGeometries(parts,false);parts.forEach(p=>p.dispose());const m=new THREE.Mesh(g,this.mats[key]);m.castShadow=!['glass','glow','screen','art','mirror'].includes(key);m.receiveShadow=true;m.userData.material=key;parent.add(m);}this.parts.clear();}
}
function materials(renderer){
  const loader=new THREE.TextureLoader(),wood=loader.load('./assets/oak.jpg'),normal=loader.load('./assets/oak-normal.jpg');wood.colorSpace=THREE.SRGBColorSpace;
  for(const t of [wood,normal]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.54,.54);t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}
  const joinery=wood.clone();joinery.repeat.set(.6,.85);joinery.needsUpdate=true;
  const art=loader.load('./assets/art.png');art.colorSpace=THREE.SRGBColorSpace;
  const mat=(color,roughness=.7,other={})=>new THREE.MeshStandardMaterial({color,roughness,...other});
  return {wall:mat(0xe7e1d6,.92),edge:mat(0xc8bdae,.83),skirting:mat(0xe9e4da,.74),floor:mat(0xfff4e3,.65,{map:wood,normalMap:normal,normalScale:new THREE.Vector2(.12,.12)}),oak:mat(0xf4dfbf,.58,{map:joinery}),oakEnd:mat(0xb69875,.62),tile:mat(0xccc7bc,.76),grout:mat(0xb8b2a7,.92),stone:mat(0xe1d8c9,.5),green:mat(0x344d46,.83),blue:mat(0x30495b,.84),clay:mat(0xb17e61,.95),cream:mat(0xe9e3d8,.97),linen:mat(0xc9bca6,.98),rug:mat(0xb6ad99,1),metal:mat(0x292e2c,.37,{metalness:.5}),brass:mat(0xa78653,.3,{metalness:.72}),chrome:mat(0xd1d9d8,.2,{metalness:.92}),ceramic:mat(0xf0efe8,.24),black:mat(0x141b1b,.32),screen:mat(0x15252b,.18,{metalness:.18}),glass:new THREE.MeshPhysicalMaterial({color:0xc6d9d8,roughness:.08,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide}),curtain:mat(0xeee7d9,.97,{side:THREE.DoubleSide}),leaf:mat(0x42684a,.87,{side:THREE.DoubleSide}),leafLight:mat(0x657d52,.9,{side:THREE.DoubleSide}),glow:new THREE.MeshBasicMaterial({color:0xffe6b6}),mirror:mat(0xaabcb9,.08,{metalness:.96}),paper:mat(0xdfdacd,.9),book1:mat(0x7b6957,.9),book2:mat(0x5e7065,.9),art:mat(0xffffff,.92,{map:art})};
}
function seg(b,k,w,h,y=0,t=.12){const dx=w.x2-w.x1,dz=w.z2-w.z1;b.box(k,Math.hypot(dx,dz),h,t,(w.x1+w.x2)/2,y+h/2,(w.z1+w.z2)/2,-Math.atan2(dz,dx));}
function architecture(b,cut){
  const h=cut?1:PLAN.height;
  for(const w of WALLS){const ext=['exterior','window'].includes(w.kind),t=w.kind==='acoustic'?.18:ext?.22:.12;
    if(w.kind==='window'){seg(b,'wall',w,.66,0,t);seg(b,'oakEnd',w,.04,.67,t+.08);if(!cut){seg(b,'wall',w,.33,2.39,t);seg(b,'glass',w,1.70,.68,.016);seg(b,'metal',w,.035,.71,.035);seg(b,'metal',w,.035,2.35,.035);const dx=w.x2-w.x1,dz=w.z2-w.z1,n=Math.ceil(Math.hypot(dx,dz)/.85);for(let i=0;i<=n;i++)b.box('metal',.035,1.64,.05,w.x1+dx*i/n,1.53,w.z1+dz*i/n,-Math.atan2(dz,dx));}}
    else {seg(b,'wall',w,h,0,t);seg(b,'edge',w,.018,h,t+.015);}
    const dx=w.x2-w.x1,dz=w.z2-w.z1,len=Math.hypot(dx,dz);for(const s of [-1,1])b.box('skirting',len,.07,.014,(w.x1+w.x2)/2-s*dz/len*(t/2+.008),.045,(w.z1+w.z2)/2+s*dx/len*(t/2+.008),-Math.atan2(dz,dx));
  }
  for(const d of DOORS.filter(d=>!d.open)){const dx=d.x2-d.x1,dz=d.z2-d.z1,len=Math.hypot(dx,dz);b.at(d.x1,d.z1,-Math.atan2(dz,dx),()=>{for(const x of [0,len])b.box('oakEnd',.034,cut?1:2.23,.15,x,cut?.5:1.115,0);if(!cut){b.box('wall',len,.49,.12,len/2,2.475,0);b.box('oakEnd',len,.035,.15,len/2,2.235,0);}if(d.id==='office'){const dh=cut?.96:2.19;b.box('oak',.045,dh,len-.05,.025,dh/2,-(len-.05)/2);b.box('brass',.025,.025,.12,.06,Math.min(.94,dh-.1),-.7);}});}
  b.box('green',1.75,cut?.98:2.60,.02,9.65,(cut?.98:2.60)/2,2.412);for(let x=8.94;x<10.42;x+=.105)b.box('oakEnd',.035,cut?.96:2.48,.03,x,(cut?.96:2.48)/2,2.205);
}
function floors(b){
  b.box('edge',PLAN.width+.3,.21,PLAN.depth+.3,PLAN.width/2,-.13,PLAN.depth/2,0,.035);
  const shape=new THREE.Shape();shape.moveTo(.01,-.01);shape.lineTo(PLAN.width-.01,-.01);shape.lineTo(PLAN.width-.01,-PLAN.depth+.01);shape.lineTo(.01,-PLAN.depth+.01);shape.closePath();const g=new THREE.ShapeGeometry(shape);g.rotateX(-Math.PI/2);b.add('floor',g,0,.005,0);
  for(const r of ROOMS.filter(r=>['hall','wc','bath','wardrobe1'].includes(r.id))){const s=new THREE.Shape();r.floor.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();const geo=new THREE.ShapeGeometry(s);geo.rotateX(-Math.PI/2);b.add('tile',geo,0,.012,0);}
  for(const r of ROOMS.filter(r=>['wc','bath'].includes(r.id))){const xs=r.floor.map(p=>p[0]),zs=r.floor.map(p=>p[1]);for(let x=Math.min(...xs)+.6;x<Math.max(...xs);x+=.6)b.box('grout',.006,.003,Math.max(...zs)-Math.min(...zs),x,.015,(Math.max(...zs)+Math.min(...zs))/2);for(let z=Math.min(...zs)+.6;z<Math.max(...zs);z+=.6)b.box('grout',Math.max(...xs)-Math.min(...xs),.003,.006,(Math.max(...xs)+Math.min(...xs))/2,.015,z);}
}
function books(b,x,y,z,n=5){for(let i=0;i<n;i++){const h=.19+i%3*.026;b.box(i%3===0?'book2':i%3===1?'paper':'book1',.035,h,.16,x+i*.043,y+h/2,z,0,.003);}}
function vase(b,x,y,z,s=1){b.cyl('ceramic',.07*s,.09*s,.18*s,x,y+.09*s,z);b.cyl('green',.049*s,.05*s,.006,x,y+.181*s,z);}
function plant(b,x,z,s=1,y=0){b.cyl('stone',.16*s,.12*s,.30*s,x,y+.15*s,z,28);b.cyl('oakEnd',.142*s,.14*s,.012,x,y+.297*s,z);for(let i=0;i<11;i++){const a=i*2.399,r=(.18+i%3*.04)*s,top=y+(.50+i%4*.13)*s,ex=x+Math.cos(a)*r,ez=z+Math.sin(a)*r;b.tube('leaf',[[x,y+.28*s,z],[x+Math.cos(a)*r*.35,top-.14*s,z+Math.sin(a)*r*.35],[ex,top,ez]],.007*s);b.ball(i%3?'leaf':'leafLight',ex,top,ez,.10*s,.024*s,.21*s,-a);}}
function lamp(b,x,y,z){b.cyl('brass',.1,.1,.018,x,y+.009,z);b.cyl('brass',.009,.009,.32,x,y+.17,z,12);b.cyl('cream',.1,.18,.18,x,y+.4,z,32);b.cyl('glow',.164,.164,.005,x,y+.313,z,32);}
function chair(b,x,z,a=0,office=false){b.at(x,z,a,()=>{b.box(office?'green':'linen',.47,.115,.47,0,.47,0,0,.055);b.box(office?'green':'linen',.49,.48,.105,0,.74,-.19,0,.06);if(office){b.cyl('metal',.027,.027,.35,0,.24,0,12);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;b.box('metal',.28,.023,.028,Math.sin(a)*.14,.075,Math.cos(a)*.14,Math.PI/2-a,.009);b.ball('black',Math.sin(a)*.27,.05,Math.cos(a)*.27,.036,.036,.022);}for(const s of [-1,1])b.box('metal',.03,.024,.29,s*.27,.66,0,0,.012);}else for(const x of [-.17,.17])for(const z of [-.17,.17])b.box('oakEnd',.028,.41,.028,x,.22,z,0,.008);});}
function sofa(b,w,d,{leftArm=true,rightArm=true}={}){
  b.box('sofa',w-.10,.20,d-.08,0,.18,0,0,.095);
  b.box('sofa',w,.34,d,0,.34,0,0,.16);const n=w>1.6?3:2,cw=(w-.22)/n;
  for(let i=0;i<n;i++){const u=n===1?0:i/(n-1)*2-1,x=-w/2+.11+cw*(i+.5),curve=Math.abs(u)*.035,turn=u*.035;b.box('sofa',cw-.018,.24,d-.19,x,.56,.055+curve,turn,.11);b.box('sofa',cw-.015,.52,.25,x,.80,-d/2+.125+curve,turn,.12);}
  for(const s of [-1,1])if((s<0&&leftArm)||(s>0&&rightArm)){b.ball('sofa',s*(w/2-.105),.57,.01,.17,.25,d*.49,s*.04);b.ball('sofa',s*(w/2-.10),.82,-d*.29,.16,.22,.18,s*.04);}
  for(const [x,k,a] of [[-w*.27,'clay',-.16],[w*.27,'mustard',.18]])b.add(k,new RoundedBoxGeometry(.35,.35,.15,3,.07),x,.84,-d*.14,-.15,0,a);
}
function bed(b,w,d,single=false){for(const x of [-w*.36,w*.36])for(const z of [-d*.36,d*.36])b.cyl('oakEnd',.032,.038,.18,x,.10,z,12);b.box('linen',w+.08,.22,d+.05,0,.25,0,0,.075);b.box('cream',w,.22,d,0,.45,0,0,.075);b.box(single?'clay':'green',w+.12,1.10,.12,0,.64,-d/2-.035,0,.075);const n=single?1:2;for(let i=0;i<n;i++){const x=single?0:(i-.5)*w*.47;b.box('cream',single?w*.76:w*.43,.12,.51,x,.625,-d*.30,.01,.057);b.box('linen',single?w*.60:w*.37,.105,.44,x,.69,-d*.30,-.02,.05);}b.box('cream',w+.01,.09,d*.63,0,.602,d*.16,0,.038);b.box(single?'linen':'clay',w+.05,.025,.48,0,.661,d*.29,0,.012);for(let i=0;i<7;i++)b.box(single?'linen':'clay',.018,.007,.48,-w/2+.08+i*w/7,.678,d*.29);}
function wardrobe(b,w,d,open=false,cut=false){
  const h=cut?1.08:2.36;
  if(open){b.box('book1',w,h,.025,0,h/2,d/2);for(const y of [.1,.54,1.82,2.33].filter(y=>y<h))b.box('oak',w,.025,d,0,y,0);for(const x of [-w/2+.015,w/2-.015])b.box('oak',.03,h,d,x,h/2,0);if(w>.6&&!cut){b.box('metal',w-.1,.022,.022,0,1.65,0);for(let i=0;i<Math.floor(w/.12);i++)b.box(i%3?'linen':'green',.072,.59,d*.65,-w/2+.1+i*.115,1.31,0,0,.012);books(b,-w/2+.12,1.85,0,Math.min(5,Math.floor(w/.06)));}for(let i=0;i<Math.floor(w/.22);i++)b.ball('linen',-w/2+.13+i*.22,.19,-.02,.065,.07,d*.35);}
  else {b.box('oak',w,h,d,0,h/2,0,0,.012);const n=Math.max(1,Math.round(w/.55)),cw=w/n;for(let i=0;i<n;i++){b.box('oak',cw-.012,h-.05,.025,-w/2+cw*(i+.5),h/2,-d/2-.02,0,.005);if(!cut)b.box('brass',.012,.28,.023,-w/2+cw*(i+1)-.07,1.13,-d/2-.04,0,.004);}}
}
function faucet(b,x,y,z){b.tube('chrome',[[x,y,z],[x,y+.24,z],[x,y+.29,z-.06],[x,y+.25,z-.16]],.012);b.box('chrome',.065,.015,.019,x+.055,y+.06,z,0,.004);}
function basin(b,x,y,z,w=.5,d=.35){b.box('ceramic',w,.06,d,x,y,z,0,.026);b.box('stone',w-.065,.008,d-.075,x,y+.032,z,0,.025);for(const s of [-1,1]){b.box('ceramic',w,.08,.026,x,y+.043,z+s*(d/2-.013),0,.009);b.box('ceramic',.026,.08,d,x+s*(w/2-.013),y+.043,z,0,.009);}b.cyl('chrome',.017,.017,.004,x,y+.04,z,14);}
function tubGeometry(w,d){
  const vertices=[],indices=[],uv=[],n=64;
  const rings=[[w/2-.02,d/2-.025,.07],[w/2,d/2,.55],[w/2-.01,d/2-.012,.585],[w/2-.065,d/2-.075,.585],[w/2-.14,d/2-.18,.18]];
  for(const [rx,rz,y] of rings)for(let i=0;i<n;i++){const a=i/n*Math.PI*2,c=Math.cos(a),s=Math.sin(a);vertices.push(Math.sign(c)*Math.pow(Math.abs(c),.43)*rx,y,Math.sign(s)*Math.pow(Math.abs(s),.43)*rz);uv.push(i/n,y);}
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+(i+1)%n,e=(j+1)*n+i;indices.push(a,c,b,a,e,c);}
  const center=vertices.length/3;vertices.push(0,.18,0);uv.push(.5,.5);for(let i=0;i<n;i++)indices.push(center,(rings.length-1)*n+(i+1)%n,(rings.length-1)*n+i);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function bathroom(b,{kind,w,d}){
  if(kind==='sink'){b.box('oak',w,.50,d,0,.41,0,0,.016);b.box('stone',w+.025,.035,d+.025,0,.68,0,0,.012);basin(b,0,.726,-.02,w*.86,d*.80);faucet(b,0,.72,.16);b.box('mirror',w*.9,.88,.02,0,1.42,.22,0,.009);b.box('glow',w*.92,.018,.024,0,1.89,.20);}
  if(kind==='toilet'){b.box('ceramic',.36,.69,.17,0,.39,-.245,0,.035);b.ball('ceramic',0,.30,.04,.205,.14,.26);b.ball('ceramic',0,.15,-.01,.14,.14,.18);const seat=new THREE.TorusGeometry(1,.065,8,40);seat.scale(.18,.245,.25);b.add('ceramic',seat,0,.435,.045,Math.PI/2);b.ball('ceramic',0,.453,.045,.185,.018,.25);b.box('chrome',.07,.008,.03,0,.742,-.245,0,.003);}
  if(kind==='washer'){b.box('ceramic',w,.84,d,0,.44,0,0,.025);b.box('metal',w-.07,.075,.008,0,.775,-d/2-.008);b.cyl('chrome',.19,.19,.025,0,.42,-d/2-.02,32,Math.PI/2);b.cyl('black',.15,.15,.028,0,.42,-d/2-.036,32,Math.PI/2);b.cyl('chrome',.022,.022,.015,-.19,.77,-d/2-.019,16,Math.PI/2);}
  if(kind==='bathtub'){b.add('ceramic',tubGeometry(w,d));b.cyl('chrome',.025,.025,.004,0,.187,-d*.29,18);faucet(b,0,.60,d*.43);b.box('oakEnd',w+.04,.025,.21,0,.605,d*.16,0,.012);vase(b,.1,.62,d*.16,.65);}
}
function kitchen(b,w,d){const mw=w/5;b.box('metal',w-.08,.10,d-.04,0,.08,0);for(let i=0;i<5;i++){const x=-w/2+mw*(i+.5);b.box('blue',mw-.012,.73,d,x,.47,0,0,.012);b.box('brass',mw-.16,.012,.012,x,.76,-d/2-.014,0,.004);}b.box('stone',w+.02,.046,d+.045,0,.862,0,0,.012);b.box('stone',w,.54,.018,0,1.16,d/2+.007);
  const fx=w/2-.30;b.box('oak',.60,2.40,d+.015,fx,1.20,0,0,.013);b.box('oak',.577,1.52,.025,fx,1.60,-d/2-.026,0,.012);b.box('oak',.577,.76,.025,fx,.43,-d/2-.026,0,.012);b.box('metal',.022,.40,.03,fx-.23,1.20,-d/2-.05,0,.005);
  b.box('black',.54,.025,.45,.28,.90,-.015,0,.01);for(const x of [.14,.43])for(const z of [-.13,.1]){b.cyl('metal',.092,.092,.003,x,.915,z,28);b.cyl('black',.082,.082,.004,x,.918,z,28);}b.box('black',.54,.54,.018,.28,.46,-d/2-.018,0,.008);b.box('chrome',.43,.017,.03,.28,.70,-d/2-.041,0,.007);b.box('screen',.41,.30,.022,.28,.43,-d/2-.033,0,.008);basin(b,-.86,.894,-.015,.47,.40);faucet(b,-.86,.90,.20);
  b.box('oakEnd',.18,.30,.026,-.42,1.064,d/2-.05,-.13,.012);vase(b,-.14,.90,.08,.8);
}
function furniture(b,cut=false){
  b.box('rug',1.67,.018,2.67,1.65,.026,2.65,0,.008);b.box('linen',2.45,.018,2.65,4.75,.026,1.86,0,.008);b.box('rug',2.08,.02,2.25,9.28,.027,3.61,0,.009);b.box('linen',2.01,.018,1.34,9.03,.027,1.35,0,.008);
  for(const i of FURNITURE)b.at(i.x,i.z,i.rotation||0,()=>{const {kind,w,d}=i;
    if(kind==='singleBed'||kind==='bed')bed(b,w,d,kind==='singleBed');else if(kind==='sofa')sofa(b,w,d,i.id==='livingSofa'||i.id==='livingChaise'?{rightArm:false}:{});
    else if(kind==='wardrobe'){if(w<d)b.at(0,0,['wardrobe1A','wardrobe2A'].includes(i.id)?-Math.PI/2:Math.PI/2,()=>wardrobe(b,d,w,i.id.startsWith('wardrobe'),cut));else wardrobe(b,w,d,i.id.startsWith('wardrobe'),cut);}
    else if(kind==='desk'){b.box('oak',w,.045,d,0,.755,0,0,.02);for(const x of [-w/2+.08,w/2-.08])for(const z of [-d/2+.06,d/2-.06])b.box('metal',.025,.72,.025,x,.37,z,0,.006);b.box('screen',Math.min(.63,w*.55),.36,.025,0,1.015,-d*.22,0,.012);b.box('metal',.055,.13,.035,0,.83,-d*.22);b.box('metal',.24,.015,.14,0,.779,-d*.18,0,.006);b.box('metal',.33,.012,.11,0,.785,.11,0,.005);b.ball('black',.25,.791,.12,.029,.013,.045);lamp(b,-w*.39,.78,-.1);books(b,w*.31,.78,0,3);}
    else if(kind==='pouf'){b.cyl('green',w*.48,w*.44,.37,0,.23,0,36);b.cyl('green',w*.46,w*.48,.065,0,.44,0,36);}
    else if(kind==='lounge')beanbag(b,w,d);
    else if(kind==='petBed')petBed(b,w,d);
    else if(kind==='catTree')catTree(b);
    else if(kind==='petBowls')bowls(b);
    else if(kind==='litterBox')litterBox(b,w,d);
    else if(kind==='coffee'){b.cyl('stone',w*.5,w*.5,.045,0,.40,0,48);b.cyl('oakEnd',.18,.23,.34,0,.20,0,36);books(b,-.12,.427,-.03,4);vase(b,.16,.427,.09,.7);}
    else if(kind==='dining'){b.box('oak',w,.045,.80,0,.76,0,0,.02);for(const x of [-w*.32,w*.32])b.cyl('oakEnd',.065,.045,.72,x,.38,0,16);for(const x of [-.40,.40])for(const z of [-.60,.60])chair(b,x,z,z<0?0:Math.PI);vase(b,0,.79,0);b.cyl('stone',.16,.16,.012,.31,.791,0,32);}
    else if(kind==='kitchen')kitchen(b,w,d);else if(kind==='media'){b.box('oak',w,.31,d,0,.43,0,0,.018);b.box('screen',.024,.67,d*.91,-w/2-.03,1.25,0,0,.01);}
    else if(kind==='bench'){b.box('oak',w,.32,d,0,.21,0,0,.025);b.box('linen',w,.11,d,0,.42,0,0,.047);}else bathroom(b,i);
  });
  chair(b,8.42,1.10,Math.PI,true);chair(b,1.10,1.02,-Math.PI/2,true);
  for(const z of [.79,3.06]){b.box('oak',.43,.28,.41,3.49,.42,z,0,.022);lamp(b,3.49,.57,z);}
  b.box('oak',.20,.28,1.46,7.35,.44,3.53,0,.018);b.box('screen',.025,.70,1.18,7.465,1.28,3.53,0,.011);
  plant(b,2.64,.51,.78);plant(b,6.42,.57,.85);plant(b,10.01,1.84,.70);
  dachshund(b,8.31,4.46,-.30);
  b.box('metal',.025,.022,.48,7.075,1.13,6.65);b.box('cream',.03,.48,.33,7.05,.94,6.66,0,.012);b.box('metal',.025,.022,.40,3.66,1.1,6.32);b.box('linen',.03,.42,.26,3.68,.91,6.32,0,.012);
}
function details(b){
  b.at(8.90,6.82,0,()=>{const w=2.98,d=.58,cw=(w-.64)/4;for(let i=0;i<4;i++)b.box('oak',cw-.012,.73,.33,-w/2+cw*(i+.5),2.07,d/2-.15,0,.009);b.box('glow',w-.66,.015,.025,-.33,1.695,d/2-.30);});
  for(const [x,z,l] of [[1.65,2.2,2.8],[4.75,1.75,2.5],[8.25,3.95,2.2],[8.50,1.18,1.7]]){b.box('metal',.037,.025,l,x,2.665,z);for(let i=0;i<3;i++){const zz=z-l*.33+i*l*.33;b.cyl('metal',.055,.055,.105,x,2.59,zz,20);b.cyl('glow',.045,.045,.008,x,2.532,zz,20);}}
  for(const [x,z] of [[8.78,5.58],[9.35,5.58]]){b.cyl('metal',.007,.007,.68,x,2.37,z,8);b.cyl('linen',.13,.25,.17,x,1.98,z,40);b.cyl('glow',.22,.22,.007,x,1.897,z,36);}
  for(const [x,w] of [[1.39,1.54],[4.70,2.36],[8.75,2.06]])for(const s of [-1,1])for(let i=0;i<5;i++){const geo=new THREE.PlaneGeometry(.06,2.38,5,8),p=geo.attributes.position;for(let j=0;j<p.count;j++)p.setZ(j,Math.sin(p.getX(j)*110+i)*.022);geo.computeVertexNormals();b.add('curtain',geo,x+s*(w/2-.09)+i*.023,1.27,.19);}
  b.box('oakEnd',1.10,.75,.035,9.63,1.59,2.432,0,.012);b.add('art',new THREE.PlaneGeometry(1.045,.696),9.63,1.59,2.452);
  b.box('oakEnd',.035,.71,1.065,3.115,1.73,1.90);b.add('art',new THREE.PlaneGeometry(1.02,.68),3.136,1.73,1.90,0,Math.PI/2);
}
export function buildScene(scene,renderer){
  const mats=materials(renderer),world=new THREE.Group();scene.add(world);const base=new THREE.Group(),full=new THREE.Group(),low=new THREE.Group(),decor=new THREE.Group();world.add(base,full,low,decor);
  for(const [key,color] of Object.entries({sofa:0x102a43,mustard:0xc69a45,beanbag:0x828582,beanbagSeat:0x777e7c,beanbagSeam:0x666f6c,petFelt:0x6e7881,litterShell:0xb7bab3,litter:0xc9bea8,litterGrain:0x9f927c,sisal:0xc0ad8b,dog:0x382820,dogTan:0xac6b35,cat:0x858984,catLight:0xcecfc6,food:0x755231,water:0x99bac0}))mats[key]=new THREE.MeshStandardMaterial({color,roughness:key==='water'?.22:.88});
  const loader=new THREE.TextureLoader(),fabricNormal=loader.load('./assets/linen-normal.jpg'),wallNormal=loader.load('./assets/plaster-normal.jpg');for(const t of [fabricNormal,wallNormal]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.anisotropy=4;}for(const key of ['cream','linen','rug','green','clay','beanbag','beanbagSeat','petFelt','mustard']){mats[key].normalMap=fabricNormal;mats[key].normalScale.set(.18,.18);}mats.wall.normalMap=wallNormal;mats.wall.normalScale.set(.055,.055);
  const corduroy=loader.load('./assets/corduroy-navy.png');corduroy.colorSpace=THREE.SRGBColorSpace;corduroy.wrapS=corduroy.wrapT=THREE.RepeatWrapping;corduroy.repeat.set(2,2);corduroy.anisotropy=8;mats.sofa.map=corduroy;mats.sofa.color.set(0xffffff);mats.sofa.bumpMap=corduroy;mats.sofa.bumpScale=.0035;mats.sofa.roughness=.92;
  const b=new Batch(mats);floors(b);b.flush(base);const fb=new Batch(mats);architecture(fb,false);furniture(fb,false);fb.flush(full);const lb=new Batch(mats);architecture(lb,true);furniture(lb,true);lb.flush(low);const db=new Batch(mats);details(db);db.flush(decor);
  const ceiling=new THREE.Mesh(new THREE.BoxGeometry(PLAN.width-.01,.04,PLAN.depth-.01),new THREE.MeshStandardMaterial({color:0xf0ebe2,roughness:.96}));ceiling.position.set(PLAN.width/2,2.745,PLAN.depth/2);world.add(ceiling);
  const pmrem=new THREE.PMREMGenerator(renderer),env=new RoomEnvironment(renderer);scene.environment=pmrem.fromScene(env,.04).texture;env.dispose();pmrem.dispose();for(const m of Object.values(mats))if('envMapIntensity' in m)m.envMapIntensity=.32;
  const hemi=new THREE.HemisphereLight(0xffffff,0xc4b6a3,1.65);scene.add(hemi);const sun=new THREE.DirectionalLight(0xfff0d8,2.7);sun.position.set(-3,10,-5);sun.target.position.set(5,0,3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.1,far:30});sun.shadow.normalBias=.018;sun.shadow.bias=-.00015;sun.shadow.radius=3;scene.add(sun,sun.target);const fill=new THREE.DirectionalLight(0xe6efff,.75);fill.position.set(12,6,6);scene.add(fill);
  const lights=[];for(const [x,z] of [[1.5,2.2],[4.8,1.7],[8.7,1.2],[8.4,3.8],[8.6,5.8],[2.4,5.8],[4.2,6],[6.1,6],[4.5,4]]){const l=new THREE.PointLight(0xffd9ad,8,5.5,2);l.position.set(x,2.38,z);scene.add(l);lights.push(l);}
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0xe9e5dd,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.245;ground.receiveShadow=true;scene.add(ground);
  const setCutaway=v=>{low.visible=v;full.visible=!v;decor.visible=!v;ceiling.visible=!v;renderer.shadowMap.needsUpdate=true;};
  const setEvening=v=>{hemi.intensity=v?.75:1.65;sun.intensity=v?.25:2.7;fill.intensity=v?.25:.75;lights.forEach(l=>l.intensity=v?18:8);mats.glow.color.set(v?0xffc581:0xffe6b6);renderer.shadowMap.needsUpdate=true;};
  const setPalette=n=>{const v=n==='contrast';mats.green.color.set(v?0x263f4e:0x52645d);mats.blue.color.set(v?0x102a43:0x173b5e);mats.clay.color.set(v?0xa86a4c:0xb98260);mats.mustard.color.set(v?0xc69a45:0xc8a15b);mats.linen.color.set(v?0xb4b6aa:0xc9bca6);mats.wall.color.set(v?0xdadbd4:0xe7e1d6);};setCutaway(true);
  return {world,ceiling,setCutaway,setEvening,setPalette,materials:mats,meshes:base.children};
}
