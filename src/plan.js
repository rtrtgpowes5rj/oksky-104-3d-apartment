export const PLAN=Object.freeze({
  width:10.60,
  depth:7.20,
  height:2.72,
  wall:0.12,
  exterior:0.22,
  eye:1.66,
  radius:0.19,
  totalArea:62.49,
  sourceSize:[1536,1024],
});

const rect=(x1,z1,x2,z2)=>[[x1,z1],[x2,z1],[x2,z2],[x1,z2]];

export const ROOMS=[
  {id:'hall',index:'01',name:'Прихожая',area:'5,20 м²',areaM2:5.20,fill:'#c8c1b6',floor:[[1.59,4.50],[3.50,4.50],[3.50,4.67],[7.08,4.67],[7.08,5.06],[3.50,5.06],[3.50,7.08],[1.59,7.08]],center:[2.58,5.90],walk:{x:2.72,z:4.76,yaw:-Math.PI/2},overview:{target:[3.50,0,5.52],offset:[5.4,5.9,5.7]}},
  {id:'living',index:'02',name:'Кухня-гостиная',shortName:'Гостиная',area:'14,20 м²',areaM2:14.20,fill:'#b6a993',floor:rect(7.18,2.37,10.48,6.68),center:[8.83,4.65],walk:{x:7.65,z:4.18,yaw:-Math.PI/2},overview:{target:[8.83,0,4.62],offset:[4.5,5.7,5.6]}},
  {id:'child',index:'03',name:'Детская',area:'12,18 м²',areaM2:12.18,fill:'#c9bca9',floor:rect(.12,.12,2.98,4.38),center:[1.55,2.25],walk:{x:1.75,z:3.85,yaw:0},overview:{target:[1.55,0,2.25],offset:[4.3,5.2,5.0]}},
  {id:'master',index:'04',name:'Мастер-спальня',shortName:'Спальня',area:'12,85 м²',areaM2:12.85,fill:'#c0b29f',floor:rect(3.10,.12,6.85,3.55),center:[4.98,1.84],walk:{x:5.10,z:3.18,yaw:0},overview:{target:[4.98,0,1.84],offset:[4.5,5.4,5.1]}},
  {id:'office',index:'05',name:'Кабинет / лаунж',shortName:'Кабинет',area:'7,02 м²',areaM2:7.02,fill:'#a99f8f',floor:rect(7.18,.12,10.48,2.25),center:[8.83,1.18],walk:{x:8.18,z:1.72,yaw:Math.PI},overview:{target:[8.83,0,1.18],offset:[4.0,4.6,4.4]}},
  {id:'wardrobe2',index:'06',name:'Гардеробная 2',shortName:'Гард. 2',area:'2,60 м²',areaM2:2.60,fill:'#928a7e',floor:rect(3.10,3.55,6.00,4.45),center:[4.55,4.00],walk:{x:5.72,z:3.88,yaw:Math.PI/2},overview:{target:[4.55,0,4.00],offset:[3.8,4.4,4.1]}},
  {id:'wardrobe1',index:'07',name:'Гардеробная 1',shortName:'Гард. 1',area:'2,80 м²',areaM2:2.80,fill:'#91897c',floor:rect(.12,5.00,1.47,7.08),center:[.80,6.04],walk:{x:1.08,z:6.04,yaw:Math.PI/2},overview:{target:[.80,0,6.04],offset:[3.4,4.2,4.0]}},
  {id:'wc',index:'08',name:'Санузел 1',area:'2,58 м²',areaM2:2.58,fill:'#a8afaa',floor:rect(3.62,5.00,4.86,7.08),center:[4.24,6.04],walk:{x:4.08,z:5.48,yaw:Math.PI},overview:{target:[4.24,0,6.04],offset:[3.4,4.2,4.0]}},
  {id:'bath',index:'09',name:'Санузел 2',shortName:'Ванная',area:'4,58 м²',areaM2:4.58,fill:'#a0aaa6',floor:rect(4.98,5.00,7.18,7.08),center:[6.08,6.04],walk:{x:5.44,z:5.48,yaw:-Math.PI/2},overview:{target:[6.08,0,6.04],offset:[3.6,4.4,4.2]}},
];

const wall=(x1,z1,x2,z2,kind='interior')=>({x1,z1,x2,z2,kind});

export const WALLS=[
  // Наружный контур и оконные полосы.
  wall(0,0,.62,0,'exterior'),wall(.62,0,2.16,0,'window'),wall(2.16,0,3.52,0,'exterior'),wall(3.52,0,5.88,0,'window'),wall(5.88,0,7.72,0,'exterior'),wall(7.72,0,9.78,0,'window'),wall(9.78,0,10.60,0,'exterior'),
  wall(0,0,0,7.20,'exterior'),wall(10.60,0,10.60,1.10,'exterior'),wall(10.60,1.10,10.60,2.05,'window'),wall(10.60,2.05,10.60,2.86,'exterior'),wall(10.60,2.86,10.60,6.28,'window'),wall(10.60,6.28,10.60,7.20,'exterior'),
  wall(0,7.20,1.55,7.20,'exterior'),wall(2.53,7.20,10.60,7.20,'exterior'),

  // Детская и мастер-спальня.
  wall(3.04,0,3.04,4.42,'interior'),
  wall(0,4.44,2.22,4.44,'interior'),wall(3.04,4.44,3.10,4.44,'interior'),
  wall(6.91,0,6.91,3.55,'interior'),

  // Гардеробная 2 под мастер-спальней.
  wall(3.04,3.55,3.58,3.55,'interior'),wall(4.38,3.55,5.95,3.55,'interior'),
  wall(3.04,4.45,5.10,4.45,'interior'),wall(6.00,4.45,6.06,4.45,'interior'),wall(3.04,3.55,3.04,4.45,'interior'),

  // Кабинет: полностью глухая акустическая стена, без стекла.
  wall(7.12,0,7.12,2.31,'interior'),
  wall(7.12,2.31,7.82,2.31,'acoustic'),wall(8.72,2.31,10.60,2.31,'acoustic'),

  // Гардеробная 1 и нижний санитарный блок.
  wall(0,5.08,1.53,5.08,'interior'),wall(1.53,5.08,1.53,5.38,'interior'),wall(1.53,6.22,1.53,7.20,'interior'),
  wall(3.56,5.08,4.92,5.08,'interior'),wall(3.56,5.08,3.56,5.38,'interior'),wall(3.56,6.22,3.56,7.20,'interior'),
  wall(4.92,5.08,4.92,7.20,'interior'),
  wall(4.92,5.08,5.50,5.08,'interior'),wall(6.38,5.08,7.18,5.08,'interior'),wall(7.18,5.08,7.18,7.20,'interior'),
];

export const DOORS=[
  {id:'entry',room:'hall',x1:1.55,z1:7.20,x2:2.53,z2:7.20},
  {id:'child',room:'child',x1:2.22,z1:4.44,x2:3.04,z2:4.44},
  {id:'master',room:'master',x1:5.95,z1:3.55,x2:6.85,z2:3.55},
  {id:'wardrobe2in',room:'wardrobe2',x1:3.58,z1:3.55,x2:4.38,z2:3.55},
  {id:'wardrobe2out',room:'wardrobe2',x1:5.10,z1:4.45,x2:6.00,z2:4.45},
  {id:'office',room:'office',x1:7.82,z1:2.31,x2:8.72,z2:2.31,solid:true},
  {id:'wardrobe1',room:'wardrobe1',x1:1.53,z1:5.38,x2:1.53,z2:6.22},
  {id:'wc',room:'wc',x1:3.56,z1:5.38,x2:3.56,z2:6.22},
  {id:'bath',room:'bath',x1:5.50,z1:5.08,x2:6.38,z2:5.08},
  {id:'living',room:'living',x1:7.12,z1:3.28,x2:7.12,z2:4.66,open:true},
];

export const FURNITURE=[
  {id:'childBed',kind:'singleBed',x:.72,z:3.28,w:.90,d:2.02,blocking:true,map:'#8b8177'},
  {id:'childDesk',kind:'desk',x:.48,z:1.05,w:1.45,d:.58,rotation:Math.PI/2,blocking:true,map:'#9a704b'},
  {id:'childLounge',kind:'pouf',x:1.73,z:2.12,w:.68,d:.68,blocking:false,map:'#6e8078'},
  {id:'childStorage',kind:'wardrobe',x:2.72,z:1.66,w:.48,d:1.72,blocking:true,map:'#555c59'},
  {id:'masterBed',kind:'bed',x:4.68,z:1.92,w:1.78,d:2.05,rotation:Math.PI/2,blocking:true,map:'#817974'},
  {id:'masterConsole',kind:'media',x:6.38,z:2.18,w:.36,d:1.28,blocking:false,map:'#404946'},
  {id:'wardrobe2A',kind:'wardrobe',x:3.38,z:4.02,w:.50,d:.66,blocking:true,map:'#555c59'},
  {id:'wardrobe2B',kind:'wardrobe',x:4.55,z:4.27,w:1.75,d:.28,blocking:true,map:'#555c59'},
  {id:'officeDesk',kind:'desk',x:8.45,z:.55,w:2.10,d:.62,blocking:true,map:'#926846'},
  {id:'officeChair',kind:'lounge',x:9.65,z:1.48,w:.80,d:.82,rotation:.78,blocking:true,map:'#687268'},
  {id:'officeShelves',kind:'wardrobe',x:10.22,z:.98,w:.48,d:1.35,blocking:true,map:'#555c59'},
  {id:'livingSofa',kind:'sofa',x:10.00,z:3.68,w:2.20,d:.86,rotation:-Math.PI/2,blocking:true,map:'#68635e'},
  {id:'livingChaise',kind:'sofa',x:9.38,z:2.82,w:1.36,d:.86,blocking:true,map:'#68635e'},
  {id:'coffee',kind:'coffee',x:8.96,z:4.00,w:.78,d:.78,blocking:true,map:'#9a704b'},
  {id:'dining',kind:'dining',x:9.04,z:5.58,w:1.34,d:1.38,blocking:true,map:'#9a704b'},
  {id:'kitchen',kind:'kitchen',x:8.90,z:6.82,w:2.98,d:.58,blocking:true,map:'#3d4744'},
  {id:'wardrobe1A',kind:'wardrobe',x:.40,z:6.04,w:.50,d:1.84,blocking:true,map:'#555c59'},
  {id:'hallBench',kind:'bench',x:3.02,z:6.88,w:.72,d:.28,blocking:false,map:'#9a704b'},
  {id:'wcVanity',kind:'sink',x:3.92,z:6.78,w:.58,d:.42,blocking:false,map:'#deded8'},
  {id:'wcToilet',kind:'toilet',x:4.50,z:6.20,w:.50,d:.70,rotation:-Math.PI/2,blocking:true,map:'#deded8'},
  {id:'washer',kind:'washer',x:4.50,z:5.48,w:.60,d:.60,rotation:Math.PI/2,blocking:true,map:'#747b78'},
  {id:'bathTub',kind:'bathtub',x:6.70,z:6.02,w:.76,d:1.62,blocking:true,map:'#deded8'},
  {id:'bathToilet',kind:'toilet',x:5.36,z:6.70,w:.50,d:.70,rotation:Math.PI,blocking:true,map:'#deded8'},
  {id:'bathSink',kind:'sink',x:5.98,z:6.81,w:.58,d:.42,blocking:true,map:'#deded8'},
  {id:'dogBed',kind:'petBed',x:10.02,z:5.02,w:.68,d:.48,rotation:Math.PI/2,blocking:false,map:'#798878'},
  {id:'catLitter',kind:'litterBox',x:3.84,z:5.24,w:.36,d:.26,blocking:false,map:'#8b8f88'},
  {id:'catTree',kind:'catTree',x:2.64,z:3.36,w:.50,d:.50,blocking:true,map:'#a8997f'},
  {id:'petBowls',kind:'petBowls',x:7.70,z:6.04,w:.40,d:.78,blocking:false,map:'#95a28f'},
];

// Slight downward pitch gives the natural interior framing used in architectural photography.
for(const room of ROOMS)room.walk.pitch=-.13;
ROOMS.find(r=>r.id==='office').walk.yaw=0;
ROOMS.find(r=>r.id==='master').walk.yaw=.32;
ROOMS.find(r=>r.id==='wc').walk.x=3.98;
ROOMS.find(r=>r.id==='wc').walk.z=5.83;
export const START_ROOM='hall';
export const roomById=id=>ROOMS.find(room=>room.id===id);
export function pointInPolygon(x,z,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,zi]=poly[i],[xj,zj]=poly[j];if(((zi>z)!==(zj>z))&&(x<(xj-xi)*(z-zi)/(zj-zi+1e-9)+xi))inside=!inside;}return inside;}
export const roomAt=(x,z)=>ROOMS.find(room=>pointInPolygon(x,z,room.floor))||null;
