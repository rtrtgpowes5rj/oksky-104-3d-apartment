import * as THREE from 'three';

export function petBed(b,w,d){
  b.box('petFelt',w,.08,d,0,.07,0,0,.035);b.box('linen',w-.10,.065,d-.10,0,.13,0,0,.03);
  for(const s of [-1,1]){b.box('petFelt',w,.15,.085,0,.13,s*(d/2-.045),0,.04);b.box('petFelt',.085,.15,d,s*(w/2-.045),.13,0,0,.04);}
}
export function bowls(b){
  b.box('petFelt',.40,.012,.78,0,.025,0,0,.005);
  for(const [z,k] of [[-.25,'food'],[0,'water'],[.25,'food']]){
    b.cyl('stone',.095,.115,.06,0,.058,z,28);b.cyl(k,.078,.078,.007,0,.089,z,28);
    const rim=new THREE.TorusGeometry(.086,.012,8,28);b.add('ceramic',rim,0,.092,z,Math.PI/2);
    if(k==='food')for(let i=0;i<9;i++){const a=i*2.4,r=.015+(i%3)*.021;b.ball('food',Math.sin(a)*r,.098,z+Math.cos(a)*r,.009,.007,.009);}
  }
}
export function litterBox(b,w,d){
  b.box('litterShell',w,.055,d,0,.055,0,0,.025);
  b.box('litter',w-.055,.018,d-.055,0,.092,0,0,.018);
  for(const s of [-1,1]){b.box('litterShell',w,.12,.035,0,.12,s*(d/2-.018),0,.016);b.box('litterShell',.035,.12,d,s*(w/2-.018),.12,0,0,.016);}
  for(let i=0;i<14;i++){const a=i*2.399,r=.025+(i%4)*.026;b.ball('litterGrain',Math.sin(a)*r,.108,Math.cos(a)*r,.012,.006,.009,a);}
}
export function catTree(b){
  b.box('oakEnd',.49,.045,.49,0,.04,0,0,.018);
  b.cyl('sisal',.055,.055,.91,0,.51,0,24);
  for(let y=.09;y<.94;y+=.026){const ring=new THREE.TorusGeometry(.056,.003,4,16);b.add('sisal',ring,0,y,0,Math.PI/2);}
  b.box('petFelt',.47,.075,.42,0,1.0,0,0,.035);b.box('linen',.39,.035,.34,0,1.055,0,0,.015);
  b.box('oakEnd',.35,.035,.28,-.065,.48,.08,0,.015);
  cat(b,0,1.08,0,.70);
}
export function cat(b,x,y,z,s=1){
  b.at(x,z,.42,()=>{
    b.ball('cat',0,y+.15*s,0,.13*s,.17*s,.19*s);
    b.ball('cat',0,y+.32*s,-.12*s,.102*s,.093*s,.092*s);
    b.ball('catLight',0,y+.278*s,-.197*s,.065*s,.044*s,.025*s);
    for(const side of [-1,1]){
      b.add('cat',new THREE.ConeGeometry(.044*s,.093*s,3),side*.063*s,y+.411*s,-.123*s,0,side*.2,side*-.15);
      b.ball('black',side*.04*s,y+.342*s,-.199*s,.012*s,.015*s,.006*s);
      b.ball('catLight',side*.07*s,y+.038*s,-.13*s,.046*s,.032*s,.083*s);
    }
    b.ball('clay',0,y+.306*s,-.222*s,.016*s,.009*s,.008*s);
    b.tube('cat',[[.1*s,y+.08*s,.12*s],[.21*s,y+.038*s,.18*s],[.24*s,y+.034*s,-.06*s],[.12*s,y+.037*s,-.16*s]],.029*s);
  });
}
export function dachshund(b,x,z,a=0){
  b.at(x,z,a,()=>{
    b.ball('dog',0,.27,0,.30,.125,.105);
    b.ball('dog',-.24,.32,0,.105,.14,.10);
    b.ball('dog',-.32,.42,0,.105,.092,.078);
    b.ball('dogTan',-.427,.391,0,.094,.047,.056);b.ball('black',-.50,.40,0,.030,.026,.039);
    for(const side of [-1,1]){
      b.ball('dog',-.27,.32,side*.072,.069,.153,.025,side*.10);
      b.ball('black',-.368,.448,side*.063,.012,.014,.009);
      b.ball('dogTan',-.362,.467,side*.057,.022,.008,.012);
      for(const px of [-.20,.21]){b.ball('dog',px,.155,side*.073,.042,.10,.043);b.ball('dogTan',px-.013,.066,side*.078,.058,.038,.043);}
    }
    b.tube('dog',[[.26,.30,0],[.36,.32,0],[.43,.39,.015],[.48,.42,.018]],.019);
    b.box('blue',.038,.09,.205,-.225,.32,0,0,.015);b.cyl('brass',.018,.018,.007,-.247,.278,-.109,14,Math.PI/2);
  });
}
export function beanbag(b,w,d){
  b.ball('beanbag',0,.30,0,w*.51,.28,d*.51);
  b.ball('beanbag',0,.55,-d*.29,w*.43,.42,d*.26);
  for(const s of [-1,1])b.ball('beanbag',s*w*.39,.42,0,w*.15,.20,d*.44);
  b.ball('beanbagSeat',0,.43,d*.055,w*.35,.08,d*.32);
  b.tube('beanbagSeam',[[-w*.36,.21,d*.36],[-w*.47,.38,0],[-w*.31,.81,-d*.29],[0,.93,-d*.29],[w*.31,.81,-d*.29],[w*.47,.38,0],[w*.36,.21,d*.36]],.004);
}
