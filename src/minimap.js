import { PLAN, ROOMS, WALLS, DOORS, FURNITURE } from './plan.js';

const NS='http://www.w3.org/2000/svg',S=100;
const el=(name,attrs={})=>{const node=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);return node;};
const points=poly=>poly.map(([x,z])=>`${x*S},${z*S}`).join(' ');

export function createMinimap(svg,{onRoom=()=>{}}={}){
  svg.replaceChildren();
  for(const room of ROOMS){
    const g=el('g',{class:'room-hit',role:'button','aria-label':room.name,tabindex:'0'});
    g.append(el('polygon',{class:'room-shape',points:points(room.floor),fill:room.fill}));
    const name=el('text',{class:'label',x:room.center[0]*S,y:room.center[1]*S-5});name.textContent=room.shortName||room.name;g.append(name);
    const area=el('text',{class:'area',x:room.center[0]*S,y:room.center[1]*S+22});area.textContent=room.area.replace(' м²','');g.append(area);
    g.addEventListener('click',()=>onRoom(room.id));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onRoom(room.id);}});svg.append(g);
  }
  for(const item of FURNITURE){
    const r=el('rect',{class:'furniture',x:(item.x-item.w/2)*S,y:(item.z-item.d/2)*S,width:item.w*S,height:item.d*S,rx:3,transform:`rotate(${(item.rotation||0)*180/Math.PI} ${item.x*S} ${item.z*S})`});svg.append(r);
  }
  for(const wall of WALLS){
    const cls=wall.kind==='window'?'window':'wall';
    const width=(['exterior','brick','window'].includes(wall.kind)?PLAN.exterior:PLAN.wall)*S;
    svg.append(el('line',{class:cls,x1:wall.x1*S,y1:wall.z1*S,x2:wall.x2*S,y2:wall.z2*S,'stroke-width':width}));
  }
  for(const door of DOORS)svg.append(el('line',{class:'door',x1:door.x1*S,y1:door.z1*S,x2:door.x2*S,y2:door.z2*S}));
  const ray=el('line',{class:'camera-ray'}),dot=el('circle',{class:'camera-dot',r:12});svg.append(ray,dot);
  const update=(x,z,yaw)=>{
    const px=x*S,pz=z*S,dx=-Math.sin(yaw)*28,dz=-Math.cos(yaw)*28;
    dot.setAttribute('cx',px);dot.setAttribute('cy',pz);ray.setAttribute('x1',px);ray.setAttribute('y1',pz);ray.setAttribute('x2',px+dx);ray.setAttribute('y2',pz+dz);
  };
  return {update};
}
