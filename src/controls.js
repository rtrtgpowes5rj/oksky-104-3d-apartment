import * as THREE from 'three';
import { PLAN } from './plan.js';
import { isBlocked, moveWithCollisions } from './navigation.js';

export class WalkControls{
  constructor(camera,element,{onLock=()=>{},onChange=()=>{}}={}){
    this.camera=camera;this.element=element;this.onLock=onLock;this.onChange=onChange;
    this.position=new THREE.Vector3(2.80,PLAN.eye,4.90);this.yaw=-Math.PI/2;this.pitch=0;
    this.active=false;this.locked=false;this.keys=new Set();this.touch=null;this.moveInput={x:0,y:0};this.speed=2.05;
    camera.rotation.order='YXZ';
    this.down=this.down.bind(this);this.up=this.up.bind(this);this.mouse=this.mouse.bind(this);this.lockChange=this.lockChange.bind(this);this.wheel=this.wheel.bind(this);this.pointerDown=this.pointerDown.bind(this);this.pointerMove=this.pointerMove.bind(this);this.pointerUp=this.pointerUp.bind(this);
    document.addEventListener('keydown',this.down);document.addEventListener('keyup',this.up);document.addEventListener('mousemove',this.mouse);document.addEventListener('pointerlockchange',this.lockChange);
    element.addEventListener('wheel',this.wheel,{passive:false});element.addEventListener('pointerdown',this.pointerDown);element.addEventListener('pointermove',this.pointerMove);element.addEventListener('pointerup',this.pointerUp);element.addEventListener('pointercancel',this.pointerUp);
    element.addEventListener('dblclick',()=>{if(this.active&&!this.locked){const request=element.requestPointerLock?.();request?.catch?.(()=>{});}});
  }
  enable(){this.active=true;this.sync();}
  disable(){this.active=false;this.keys.clear();this.touch=null;this.setMoveVector(0,0);if(document.pointerLockElement===this.element)document.exitPointerLock();}
  enter(view){
    if(isBlocked(view.x,view.z,PLAN.radius,true))return false;
    this.position.set(view.x,PLAN.eye,view.z);this.yaw=view.yaw||0;this.pitch=view.pitch||0;this.sync();this.onChange(this.position,this.yaw);return true;
  }
  down(event){if(!this.active)return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(event.code)){event.preventDefault();this.keys.add(event.code);}}
  up(event){this.keys.delete(event.code);}
  setKey(code,value){value?this.keys.add(code):this.keys.delete(code);}
  setMoveVector(x,y){const length=Math.hypot(x,y)||1,scale=Math.min(1,1/length);this.moveInput.x=x*scale;this.moveInput.y=y*scale;}
  mouse(event){if(!this.active||!this.locked)return;this.yaw-=event.movementX*.00215;this.pitch=THREE.MathUtils.clamp(this.pitch-event.movementY*.0018,-1.16,1.16);this.sync();this.onChange(this.position,this.yaw);}
  lockChange(){this.locked=document.pointerLockElement===this.element;document.body.classList.toggle('pointer-locked',this.locked);this.onLock(this.locked);if(!this.locked)this.keys.clear();}
  wheel(event){if(!this.active)return;event.preventDefault();this.camera.fov=THREE.MathUtils.clamp(this.camera.fov+event.deltaY*.016,48,78);this.camera.updateProjectionMatrix();this.onChange(this.position,this.yaw);}
  pointerDown(event){
    if(!this.active)return;
    if(this.locked||(event.pointerType==='mouse'&&event.button!==0))return;
    this.touch={id:event.pointerId,x:event.clientX,y:event.clientY};this.element.setPointerCapture?.(event.pointerId);
  }
  pointerMove(event){
    if(!this.active||!this.touch||event.pointerId!==this.touch.id)return;
    this.yaw-=(event.clientX-this.touch.x)*.0048;this.pitch=THREE.MathUtils.clamp(this.pitch-(event.clientY-this.touch.y)*.0037,-1.16,1.16);this.touch.x=event.clientX;this.touch.y=event.clientY;this.sync();this.onChange(this.position,this.yaw);
  }
  pointerUp(event){if(this.touch?.id===event.pointerId)this.touch=null;}
  update(delta){
    if(!this.active)return false;
    let forward=this.moveInput.y,side=this.moveInput.x;
    if(this.keys.has('KeyW')||this.keys.has('ArrowUp'))forward++;
    if(this.keys.has('KeyS')||this.keys.has('ArrowDown'))forward--;
    if(this.keys.has('KeyD')||this.keys.has('ArrowRight'))side++;
    if(this.keys.has('KeyA')||this.keys.has('ArrowLeft'))side--;
    if(!forward&&!side){this.sync();return false;}
    const len=Math.hypot(forward,side);if(len>1){forward/=len;side/=len;}
    const speed=this.speed*(this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')?1.55:1)*Math.min(delta,.045);
    const sin=Math.sin(this.yaw),cos=Math.cos(this.yaw);
    moveWithCollisions(this.position,(-sin*forward+cos*side)*speed,(-cos*forward-sin*side)*speed,PLAN.radius);
    this.sync();this.onChange(this.position,this.yaw);return true;
  }
  sync(){this.camera.position.copy(this.position);this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch;}
}
