import * as T from 'three';
import {vehicleProfile as v} from './vehicle-profile.js';

// Dimensions follow the V2 LR catalogue; all surface sections are visual approximations.
export function createT10F(parent){
 const shell=new T.Group();parent.add(shell);const wheels=[],glasses=[],materials=[];
 function material(color,opacity=1){const m=new T.MeshStandardMaterial({color,metalness:.48,roughness:.29,transparent:true,opacity,side:T.DoubleSide,depthWrite:opacity===1});m.userData.solidOpacity=opacity;materials.push(m);return m;}
 const paint=material('#5c9daf'),glass=material('#1b303b',.94),chrome=material('#b9c6cf'),black=material('#182027'),rubber=material('#23282b'),white=material('#e5fcff'),red=material('#d93347');
 white.emissive.set('#b6e6f5');white.emissiveIntensity=.65;red.emissive.set('#d62438');red.emissiveIntensity=.45;
 function mesh(geo,mat,pos=[0,0,0],group=shell){const m=new T.Mesh(geo,mat);m.position.set(...pos);group.add(m);return m;}
 function tube(points,mat,r=.01,group=shell){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,6,false),mat,[0,0,0],group);}
 function panel(points,mat){const g=new T.BufferGeometry(),verts=[];for(let i=1;i<points.length-1;i++)verts.push(...points[0],...points[i],...points[i+1]);g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.computeVertexNormals();return mesh(g,mat);}
 const front=-v.lengthM/2,rear=v.lengthM/2,axles=[front+v.frontOverhangM,front+v.frontOverhangM+v.wheelbaseM];
 const p=new T.Shape();p.moveTo(front,.29);p.lineTo(front,.76);p.quadraticCurveTo(-2.28,.94,-1.1,1.03);p.lineTo(.95,1.045);p.quadraticCurveTo(1.85,1.05,rear,.94);p.lineTo(rear,.29);
 for(const x of [...axles].reverse()){p.lineTo(x+.405,.29);p.lineTo(x+.405,.36);p.absarc(x,.36,.405,0,Math.PI,false);p.lineTo(x-.405,.29);}p.closePath();
 const bodyGeo=new T.ExtrudeGeometry(p,{depth:v.widthM-.04,bevelEnabled:true,bevelSize:.018,bevelThickness:.02,bevelSegments:3,steps:1,curveSegments:24});bodyGeo.translate(0,0,-(v.widthM-.04)/2);
 const positions=bodyGeo.attributes.position;for(let i=0;i<positions.count;i++){const x=positions.getX(i),taper=1-.09*Math.pow(Math.abs(x)/(v.lengthM/2),4);positions.setZ(i,positions.getZ(i)*taper);}bodyGeo.computeVertexNormals();mesh(bodyGeo,paint);
 // Glazed roof and fastback: lofted transverse sections, independent of the lower body.
 const sections=[[-1.13,1.025,.81],[-.54,1.47,.68],[-.24,1.548,.66],[.36,1.55,.66],[.85,1.45,.68],[1.4,1.22,.73],[1.95,1.035,.77]];
 for(let i=0;i<sections.length-1;i++){const [x,y,z]=sections[i],[a,b,c]=sections[i+1];panel([[x,y,-z],[x,y,z],[a,b,c],[a,b,-c]],glass);}
 for(const sign of [-1,1]){
  const edge=sections.map(([x,y,z])=>[x,y,sign*z]);tube(edge,chrome,.014);tube([[-1.13,1.025,sign*.815],[.3,1.04,sign*.845],[1.48,1.06,sign*.81]],chrome,.012);
  const frontWindow=panel([[-1.1,1.035,sign*.815],[-.52,1.455,sign*.686],[.12,1.515,sign*.675],[.12,1.047,sign*.839]],glass);glasses.push(frontWindow);
  panel([[.18,1.047,sign*.839],[.18,1.52,sign*.674],[.82,1.427,sign*.687],[1.39,1.08,sign*.81]],glass);
  tube([[.145,1.046,sign*.844],[.145,1.52,sign*.68]],black,.025);
  panel([[1.39,1.08,sign*.81],[.82,1.427,sign*.687],[1.4,1.22,sign*.73],[1.95,1.035,sign*.77]],paint);
  tube([[-1.1,.99,sign*.932],[-1.08,.35,sign*.932],[.18,.32,sign*.939],[.17,1.02,sign*.94]],black,.003);
  tube([[.18,.32,sign*.939],[.85,.33,sign*.929],[1.1,.73,sign*.924],[1.19,1.02,sign*.923]],black,.003);
  for(const x of [-.04,.99])mesh(new T.BoxGeometry(.16,.027,.026),black,[x,.916,sign*.936]);
  tube([[-1.07,.32,sign*.932],[.12,.32,sign*.935],[.91,.34,sign*.921]],black,.027);
  const mirror=mesh(new T.SphereGeometry(1,18,12),black,[-.92,1.105,sign*1.002]);mirror.scale.set(.16,.068,.095);
  tube([[-1.03,1.045,sign*.85],[-.95,1.09,sign*.985]],black,.021);
  tube([[-2.37,.82,sign*.47],[-2.30,.84,sign*.7],[-2.11,.855,sign*.87]],black,.049);
  tube([[-2.391,.79,sign*.53],[-2.335,.79,sign*.76],[-2.32,.7,sign*.805]],white,.012);
  tube([[-2.388,.665,sign*.64],[-2.39,.655,sign*.77],[-2.375,.4,sign*.78]],white,.014);
  tube([[2.398,.89,sign*.4],[2.354,.895,sign*.74],[2.1,.895,sign*.865]],red,.019);
 }
 tube([[2.418,.892,-.7],[2.435,.892,0],[2.418,.892,.7]],red,.012);
 mesh(new T.BoxGeometry(.035,.17,1.18),black,[-2.408,.57,0]);
 for(let z=-.51;z<=.52;z+=.085)tube([[-2.432,.49,z],[-2.433,.635,z+.033]],chrome,.008);
 mesh(new T.BoxGeometry(.03,.074,.29),black,[-2.438,.425,0]);mesh(new T.BoxGeometry(.03,.074,.29),black,[2.438,.51,0]);
 tube([[-2.32,.965,-.5],[-1.54,1.02,-.51],[-1.13,1.043,-.55]],chrome,.003);
 tube([[-2.32,.965,.5],[-1.54,1.02,.51],[-1.13,1.043,.55]],chrome,.003);
 for(let a=0;a<2;a++)for(const sign of [-1,1]){
  const g=new T.Group();g.position.set(axles[a],.36,sign*(a?.81:.8));shell.add(g);wheels.push(g);
  const tyre=mesh(new T.CylinderGeometry(.36,.36,.235,48),rubber,[0,0,0],g);tyre.rotation.x=Math.PI/2;
  const rim=mesh(new T.CylinderGeometry(.24,.24,.242,48),black,[0,0,0],g);rim.rotation.x=Math.PI/2;
  const lip=mesh(new T.TorusGeometry(.242,.012,8,48),chrome,[0,0,sign*.125],g);
  for(let i=0;i<10;i++){const angle=i*Math.PI/5;for(const offset of [-.055,.055]){const spoke=mesh(new T.BoxGeometry(.017,.2,.017),chrome,[Math.sin(angle+offset)*.139,Math.cos(angle+offset)*.139,sign*.128],g);spoke.rotation.z=-angle-offset;}}
  const hub=mesh(new T.CylinderGeometry(.052,.052,.26,24),chrome,[0,0,0],g);hub.rotation.x=Math.PI/2;
 }
 const wiper=tube([[-1.09,1.073,-.45],[-.91,1.235,.05]],black,.009);
 function setExterior(on){materials.forEach(m=>{m.opacity=on?m.userData.solidOpacity:m===paint?.13:m===glass?.055:m===rubber?.4:.48;m.depthWrite=on&&m.opacity===1;});}
 setExterior(false);
 return {shell,wheels,glasses,wiper,setExterior,dimensions:{length:v.lengthM,width:v.widthM,height:v.heightM,wheelbase:axles[1]-axles[0]}};
}
