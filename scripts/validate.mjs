import { validatePlan } from '../src/navigation.js';
import { PLAN, ROOMS } from '../src/plan.js';

const report=validatePlan();
const trace={
  source:PLAN.sourceSize,
  declaredTotal:`${PLAN.totalArea.toFixed(2)} m²`,
  model:`${PLAN.width.toFixed(2)} × ${PLAN.depth.toFixed(2)} m`,
  rooms:ROOMS.map(room=>({id:room.id,area:room.areaM2,walk:[room.walk.x,room.walk.z]})),
};
console.log(JSON.stringify({...report,trace},null,2));
if(!report.ok)process.exitCode=1;
