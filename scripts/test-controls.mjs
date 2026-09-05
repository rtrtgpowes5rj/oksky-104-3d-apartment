import assert from 'node:assert/strict';
import * as THREE from 'three';
globalThis.document={addEventListener(){},body:{classList:{toggle(){}}}};
const {WalkControls}=await import('../src/controls.js');
const c=new WalkControls(new THREE.PerspectiveCamera(),{addEventListener(){}});
c.enable();
for(const [key,yaw,axis,sign] of [['KeyW',0,'z',-1],['KeyS',0,'z',1],['KeyD',0,'x',1],['KeyA',0,'x',-1],['KeyW',Math.PI/2,'x',-1],['KeyD',Math.PI/2,'z',-1]]){
  assert(c.enter({x:7.8,z:4.8,yaw}));
  const before=c.position[axis];c.setKey(key,true);c.update(.04);c.setKey(key,false);
  assert((c.position[axis]-before)*sign>0,`${key} yaw ${yaw}`);
}
c.wheel({preventDefault(){},deltaY:-10000});assert.equal(c.camera.fov,48);
c.wheel({preventDefault(){},deltaY:10000});assert.equal(c.camera.fov,78);
c.down({code:'KeyW',preventDefault(){}});c.up({code:'KeyW'});assert.equal(c.keys.size,0);
console.log('PASS: WASD in camera coordinates, rotated camera, zoom limits, key release');
