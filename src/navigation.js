import { PLAN, WALLS, FURNITURE, ROOMS, DOORS, START_ROOM, roomById } from './plan.js';

const thick=wall=>wall.kind==='acoustic'?.18:['exterior','brick','window'].includes(wall.kind)?PLAN.exterior:PLAN.wall;

export function wallRect(wall){
  const h=thick(wall)/2;
  return {minX:Math.min(wall.x1,wall.x2)-h,maxX:Math.max(wall.x1,wall.x2)+h,minZ:Math.min(wall.z1,wall.z2)-h,maxZ:Math.max(wall.z1,wall.z2)+h,source:wall};
}

export function furnitureRect(item){
  let {w,d}=item;
  if(Math.abs(Math.sin(item.rotation||0))>.7)[w,d]=[d,w];
  return {minX:item.x-w/2,maxX:item.x+w/2,minZ:item.z-d/2,maxZ:item.z+d/2,source:item};
}

export const WALL_RECTS=WALLS.map(wallRect);
export const OBSTACLE_RECTS=FURNITURE.filter(item=>item.blocking).map(furnitureRect);

export function circleRect(x,z,r,rect){
  const cx=Math.max(rect.minX,Math.min(x,rect.maxX));
  const cz=Math.max(rect.minZ,Math.min(z,rect.maxZ));
  const dx=x-cx,dz=z-cz;
  return dx*dx+dz*dz<r*r-1e-8;
}

export function isBlocked(x,z,r=PLAN.radius,withFurniture=true){
  if(x<r||x>PLAN.width-r||z<r||z>PLAN.depth-r)return true;
  if(WALL_RECTS.some(rect=>circleRect(x,z,r,rect)))return true;
  return withFurniture&&OBSTACLE_RECTS.some(rect=>circleRect(x,z,r,rect));
}

export function moveWithCollisions(position,dx,dz,r=PLAN.radius){
  const distance=Math.hypot(dx,dz);
  const steps=Math.max(1,Math.ceil(distance/(r*.32)));
  const sx=dx/steps,sz=dz/steps;
  for(let i=0;i<steps;i++){
    if(!isBlocked(position.x+sx,position.z,r,true))position.x+=sx;
    if(!isBlocked(position.x,position.z+sz,r,true))position.z+=sz;
  }
  return position;
}

function nearestFree(point,res,cols,rows,blocked){
  const bx=Math.round(point.x/res),bz=Math.round(point.z/res);
  for(let radius=0;radius<16;radius++)for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
    const x=bx+dx,z=bz+dz;
    if(x>=0&&z>=0&&x<cols&&z<rows&&!blocked[z*cols+x])return z*cols+x;
  }
  return -1;
}

export function validatePlan({resolution=.075,radius=PLAN.radius}={}){
  const cols=Math.floor(PLAN.width/resolution)+1,rows=Math.floor(PLAN.depth/resolution)+1;
  const blocked=new Uint8Array(cols*rows);
  for(let z=0;z<rows;z++)for(let x=0;x<cols;x++)blocked[z*cols+x]=isBlocked(x*resolution,z*resolution,radius,true)?1:0;
  const start=nearestFree(roomById(START_ROOM).walk,resolution,cols,rows,blocked);
  const visited=new Uint8Array(blocked.length),queue=new Int32Array(blocked.length);
  let head=0,tail=0;
  if(start>=0){visited[start]=1;queue[tail++]=start;}
  while(head<tail){
    const i=queue[head++],x=i%cols,z=Math.floor(i/cols);
    for(const [nx,nz] of [[x+1,z],[x-1,z],[x,z+1],[x,z-1]]){
      if(nx<0||nz<0||nx>=cols||nz>=rows)continue;
      const n=nz*cols+nx;
      if(!blocked[n]&&!visited[n]){visited[n]=1;queue[tail++]=n;}
    }
  }
  const status=point=>{const cell=nearestFree(point,resolution,cols,rows,blocked);return cell>=0&&visited[cell]===1};
  const reachable=ROOMS.filter(room=>status(room.walk)).map(room=>room.id);
  const unreachable=ROOMS.filter(room=>!status(room.walk)).map(room=>room.id);
  const blockedViewpoints=ROOMS.filter(room=>isBlocked(room.walk.x,room.walk.z,radius,true)).map(room=>room.id);
  const blockedDoors=DOORS.filter(door=>door.id!=='entry'&&!door.open&&isBlocked((door.x1+door.x2)/2,(door.z1+door.z2)/2,radius,false)).map(door=>door.id);
  return {ok:unreachable.length===0&&blockedViewpoints.length===0&&blockedDoors.length===0,reachable,unreachable,blockedViewpoints,blockedDoors,visitedCells:tail,freeCells:blocked.length-blocked.reduce((a,b)=>a+b,0)};
}
