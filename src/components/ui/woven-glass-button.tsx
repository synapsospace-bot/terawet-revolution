// @ts-nocheck — the canvas renderer below preserves the original JavaScript implementation.
"use client";

import * as React from "react";

export interface WovenGlassButtonProps {
  className?: string;
  style?: React.CSSProperties;
  onActivate?: () => void;
  label?: string;
}

/** Blue glass capsule → woven sphere on hover → blooming ribbons on click.
 * Procedural WebGL ribbons; no images, network requests or animation dependencies.
 */
export default function WovenGlassButton({className,style,onActivate,label = "AI VOICE"}: WovenGlassButtonProps) {
  const canvasRef=React.useRef<HTMLCanvasElement>(null);
  const buttonRef=React.useRef<HTMLButtonElement>(null);
  const onActivateRef=React.useRef(onActivate);
  React.useEffect(()=>{onActivateRef.current=onActivate},[onActivate]);
  React.useEffect(()=>{
    const canvas=canvasRef.current,button=buttonRef.current;
    if(!canvas||!button)return;
    button.disabled=true;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,t)=>a+(b-a)*t;
const makeCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};

let disposed=false;let renderer=null,phase=0,hover=false,focus=false,playing=false,frame=0,lastState={};
const ctx=canvas.getContext('2d');
function paint(state){
 lastState=state;const ratio=Math.min(window.devicePixelRatio||1,2);ctx.setTransform(ratio,0,0,ratio,0,0);renderer.draw(ctx,state,800,620,label);
 const height=mix(106,214,state.collapse||0);button.style.height=`${height/620*100}%`;button.style.top=`${50-height/620*50}%`;
}
function resize(){const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=800*ratio;canvas.height=620*ratio;if(renderer)paint(lastState)}
function settle(){
 if(!renderer||playing)return;cancelAnimationFrame(frame);
 const from=phase,target=hover||focus?1:0,start=performance.now(),duration=(target?700:540)*Math.max(.25,Math.abs(target-from));
 function tick(now){const t=reduced?1:clamp((now-start)/duration);phase=mix(from,target,ease(t));paint({collapse:phase,open:0});if(t<1)frame=requestAnimationFrame(tick)}
 frame=requestAnimationFrame(tick);
}
function reset(){playing=false;button.removeAttribute('aria-disabled');phase=hover||focus?1:0;paint({collapse:phase});settle()}
function play(){
 if(!renderer||playing)return;playing=true;cancelAnimationFrame(frame);button.setAttribute('aria-disabled','true');
 const start=performance.now(),initial=phase,gatherDuration=phase<.98?Math.max(80,(1-phase)*650):0;
 function tick(now){
  const elapsed=now-start;
  if(reduced){paint({collapse:1,open:1});if(elapsed>=450){reset();return}frame=requestAnimationFrame(tick);return}
  if(elapsed<gatherDuration){phase=mix(initial,1,ease(elapsed/gatherDuration));paint({collapse:phase,open:0});frame=requestAnimationFrame(tick);return}
  const t=elapsed-gatherDuration;
  const unfolding=ease((t-80)/580),rewind=ease((t-940)/280),returning=ease((t-1220)/170);
  const collapse=mix(1,hover||focus?1:0,returning),open=unfolding*(1-rewind);
  paint({collapse,open,press:Math.sin(clamp(t/180)*Math.PI)*(1-unfolding)});
  if(t>=1400){reset();return}frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
}

const controller = new AbortController();
const listen=(target,event,handler)=>target.addEventListener(event,handler,{signal:controller.signal});
listen(button,'click',()=>{if(!playing){play();onActivateRef.current?.()}});
listen(button,'pointerenter',e=>{if(e.pointerType!=='touch'){hover=true;settle()}});
listen(button,'pointerleave',()=>{hover=false;settle()});
listen(button,'pointerdown',()=>{if(renderer&&!playing&&phase>.95){cancelAnimationFrame(frame);paint({collapse:1,press:1})}});
listen(button,'pointerup',()=>{if(!playing)settle()});
listen(button,'pointercancel',settle);
listen(button,'focus',()=>{focus=button.matches(':focus-visible');settle()});
listen(button,'blur',()=>{focus=false;settle()});
listen(window,'resize',resize);

renderer=createWovenRenderer(makeCanvas);button.disabled=false;resize();paint({});

return ()=>{disposed=true;cancelAnimationFrame(frame);controller.abort();renderer.dispose();};

  },[]);
  return (
    <div className={className} data-slot="woven-glass-button" style={{position:'relative',width:'min(800px, 100%)',aspectRatio:'800 / 620',marginInline:'auto',isolation:'isolate',...style}}>
      <style>{`[data-slot="woven-glass-trigger"]:focus-visible{outline:2px solid #38bdf8;outline-offset:8px}[data-slot="woven-glass-trigger"]:disabled{cursor:wait}`}</style>
      <canvas ref={canvasRef} width={800} height={620} aria-hidden="true" style={{display:'block',width:'100%',height:'100%',pointerEvents:'none'}} />
      <button ref={buttonRef} type="button" aria-label="Get started" data-slot="woven-glass-trigger" style={{position:'absolute',left:'28.75%',top:'41.45%',width:'42.5%',height:'17.1%',padding:0,border:0,borderRadius:999,background:'transparent',cursor:'pointer',touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}} />
    </div>
  );
}

function createWovenRenderer(makeCanvas){
 const pi=Math.PI,clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t;
 const blend=(a,b,t)=>a.map((v,i)=>mix(v,b[i],clamp(t)));
 const norm=v=>{const d=Math.hypot(...v)||1;return v.map(x=>x/d)};
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const profiles=Array.from({length:5},(_,index)=>({index,angle:-108+index*36,length:[190,180,196,182,187][index],spread:[36,40,37,40,36][index],width:[47,45,50,48,46][index],twist:.25+index*.13}));
 function shape(ctx,roundness){
  // The same eight cubic segments continuously change from capsule to circle.
  // Vertical expansion is applied by the caller so the material moves with it.
  const idle=[
   [-116,-53,-67,-53,-35,-53,0,-53],
   [0,-53,35,-53,67,-53,116,-53],
   [116,-53,148,-53,170,-29,170,0],
   [170,0,170,29,148,53,116,53],
   [116,53,67,53,35,53,0,53],
   [0,53,-35,53,-67,53,-116,53],
   [-116,53,-148,53,-170,29,-170,0],
   [-170,0,-170,-29,-148,-53,-116,-53]
  ];
  const handle=4/3*Math.tan(pi/16),rx=108,ry=53;
  ctx.beginPath();
  idle.forEach((segment,i)=>{
   const a=(-135+i*45)*pi/180,b=a+pi/4;
   const circle=[rx*Math.cos(a),ry*Math.sin(a),rx*(Math.cos(a)-handle*Math.sin(a)),ry*(Math.sin(a)+handle*Math.cos(a)),rx*(Math.cos(b)+handle*Math.sin(b)),ry*(Math.sin(b)-handle*Math.cos(b)),rx*Math.cos(b),ry*Math.sin(b)];
   const points=segment.map((value,k)=>mix(value,circle[k],roundness));
   if(i===0)ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));
  });ctx.closePath();
 }
 function ellipseGlow(ctx,x,y,rx,ry,stops){
  ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);const g=ctx.createRadialGradient(0,0,0,0,0,1);stops.forEach(s=>g.addColorStop(...s));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,pi*2);ctx.fill();ctx.restore();
 }
 function capsule(ctx,pinch,alpha){
  if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;
  shape(ctx,pinch);const base=ctx.createLinearGradient(0,-54,0,54);
  [[0,'#86ddff'],[.12,'#22baff'],[.36,'#0796ed'],[.68,'#0476d5'],[.88,'#188eeb'],[1,'#79d8ff']].forEach(s=>base.addColorStop(...s));
  ctx.fillStyle=base;ctx.fill();ctx.save();shape(ctx,pinch);ctx.clip();ctx.scale(1-pinch*.3,1);
  ellipseGlow(ctx,-64,10,128,74,[[0,'rgba(0,68,178,.76)'],[.53,'rgba(0,89,196,.41)'],[1,'rgba(0,128,224,0)']]);
  ellipseGlow(ctx,104,23,115,88,[[0,'rgba(0,81,183,.59)'],[.5,'rgba(0,107,213,.2)'],[1,'rgba(0,107,213,0)']]);
  ellipseGlow(ctx,83,-53,130,65,[[0,'rgba(214,253,255,.95)'],[.27,'rgba(129,226,255,.72)'],[.63,'rgba(67,198,255,.16)'],[1,'rgba(67,198,255,0)']]);
  ellipseGlow(ctx,-143,-29,49,51,[[0,'rgba(138,240,255,.63)'],[.45,'rgba(14,196,255,.27)'],[1,'rgba(14,196,255,0)']]);
  ellipseGlow(ctx,0,64,175,30,[[0,'rgba(122,233,255,.81)'],[.6,'rgba(35,179,255,.17)'],[1,'rgba(35,179,255,0)']]);
  ctx.save();
  ctx.globalCompositeOperation='screen';
  [[-128,-33,43,16],[118,-37,39,13],[-110,40,43,10],[123,37,34,14]].forEach(([x,y,rx,ry])=>ellipseGlow(ctx,x,y,rx,ry,[[0,'rgba(229,255,255,.94)'],[.36,'rgba(132,213,255,.52)'],[1,'rgba(132,213,255,0)']]));
  ctx.restore();
  ctx.restore();
  const edge=ctx.createLinearGradient(0,-54,0,54);[[0,'#a8f0ff'],[.2,'#46d8ff'],[.6,'#008be6'],[1,'#74d9ff']].forEach(s=>edge.addColorStop(...s));ctx.strokeStyle=edge;ctx.lineWidth=2;shape(ctx,pinch);ctx.stroke();
  ctx.save();ctx.scale(.982,.947);shape(ctx,pinch);const inner=ctx.createLinearGradient(0,-54,0,54);inner.addColorStop(0,'rgba(238,255,255,.65)');inner.addColorStop(.34,'rgba(177,240,255,.03)');inner.addColorStop(.84,'rgba(75,184,255,.01)');inner.addColorStop(1,'rgba(112,220,255,.7)');ctx.strokeStyle=inner;ctx.lineWidth=1;ctx.stroke();ctx.restore();
  ctx.restore();
 }
 function ribbon(profile,turn,open,gather=1){
  const index=profile.index+(turn?5:0),theta=(profile.angle+turn)*pi/180,cs=Math.cos(theta),sn=Math.sin(theta);
  const R=profile.length,S=profile.spread,N=64,M=12,grid=[];
  const angle=turn?1.02:-.62;
  const axis=norm([Math.cos(angle)*.83,Math.sin(angle)*.83,turn?.59:.36]);
  const beltLatitude=Math.asin([-.68,-.34,0,.34,.68][profile.index]);
  const U=norm(cross(axis,[0,1,0])),V=cross(axis,U);
  function rotate(point){const [x,y,z]=point,c=Math.cos(-.55),s=Math.sin(-.55),xx=x*c-y*s,yy=x*s+y*c;return [xx,yy*Math.cos(.24)-z*Math.sin(.24),yy*Math.sin(.24)+z*Math.cos(.24)]}
  for(let i=0;i<=N;i++){
   const t=i/N,a=pi*t,sa=Math.sin(a),radius=R*Math.pow(sa,.94),y=S*Math.sin(2*a)*Math.pow(sa,.35)+R*.23*sa*sa;
   const center=[radius,y,48*sa+32*Math.sin(2*a)*sa+(profile.index%2?15:-8)*sa];
   const dt=.0001,ta=Math.max(.00001,t-dt),tb=Math.min(.99999,t+dt);
   const X=t=>R*Math.pow(Math.sin(pi*t),.94),Y=t=>S*Math.sin(2*pi*t)*Math.pow(Math.sin(pi*t),.35)+R*.23*Math.sin(pi*t)**2;
   const tangent=norm([X(tb)-X(ta),Y(tb)-Y(ta),0]),twist=a*1.3+profile.twist;
   const width=profile.width*Math.pow(sa,.52),row=[];
   const orbit=t*2*pi+index*.24,r=100+2*Math.sin(orbit*4+index);
   const onRing=U.map((value,k)=>value*Math.cos(orbit)+V[k]*Math.sin(orbit));
   for(let j=0;j<=M;j++){
    const u=j/M*2-1,latitude=beltLatitude+u*13.5/r;
    let closed=rotate(onRing.map((value,k)=>(r+5*(1-u*u))*(value*Math.cos(latitude)+axis[k]*Math.sin(latitude))));
    if(gather<1){
     const delay=(profile.index%3)*.035,q=clamp((gather-delay)/(1-delay));
     const travel=q*q*(3-2*q),lift=Math.sin(pi*travel);
     const flat=[closed[0]*1.65,closed[1]*.5,closed[2]*.52];
     const moving=closed.map((value,k)=>mix(flat[k],value,travel));
     // Every strip peels outward, makes half a turn, then settles into its belt.
     const bulge=1+lift*(.22+.19*Math.sin(orbit+index)**2);
     const angle=(turn?-1:1)*pi*(1-travel),ca=Math.cos(angle),sa=Math.sin(angle);
     const x=moving[0]*bulge,y=moving[1]*bulge,z=moving[2]+lift*22*Math.sin(orbit*2+index);
     const tilt=lift*.45,yy=y*Math.cos(tilt)-z*Math.sin(tilt),zz=y*Math.sin(tilt)+z*Math.cos(tilt);
     closed=[x*ca-yy*sa,x*sa+yy*ca,zz];
    }
    const x=center[0]-tangent[1]*u*width*Math.cos(twist),yy=center[1]+tangent[0]*u*width*Math.cos(twist),z=center[2]+u*width*Math.sin(twist)+8*Math.pow(1-u*u,1.15)*sa;
    const px=x*cs-yy*sn,py=x*sn+yy*cs;
    const opened=[px,py*Math.cos(.15)-z*Math.sin(.15),py*Math.sin(.15)+z*Math.cos(.15)];
    const blended=closed.map((value,k)=>mix(value,opened[k],open)),length=Math.hypot(...blended)||1,targetLength=mix(Math.hypot(...closed),Math.hypot(...opened),open);
    row.push(blended.map(value=>value*targetLength/length));
   }grid.push(row);
  }
  const faces=[];
  for(let i=0;i<N;i++)for(let j=0;j<M;j++){
   const v=[grid[i][j],grid[i+1][j],grid[i+1][j+1],grid[i][j+1]];
   const a=v[1].map((x,k)=>x-v[0][k]),b=v[3].map((x,k)=>x-v[0][k]),normal=norm(cross(a,b));
   const mid=v[0].map((_,k)=>v.reduce((s,p)=>s+p[k],0)/4);
   const facing=Math.abs(normal[2]);let n=normal;if(n[2]<0)n=n.map(x=>-x);
   const reflection=[2*n[2]*n[0],2*n[2]*n[1],2*n[2]*n[2]-1];
   const sky=mix(Math.exp(-Math.pow((reflection[1]+.42)/.29,2)),Math.exp(-Math.pow((reflection[1]+.38)/.24,6)),open);
   const narrow=mix(Math.exp(-Math.pow((reflection[0]-.55)/.13,2)),Math.exp(-Math.pow((reflection[0]-.42)/.2,4)),open)*Math.exp(-Math.pow((reflection[1]+.1)/.75,2));
   const rim=Math.pow(1-facing,3);
   let color=blend([0,108,204],[24,180,249],.3+.3*Math.sin(i/N*pi*2+profile.twist));
   if(normal[2]<0)color=blend(color,[113,211,250],.28);
   color=blend(color,[232,250,255],Math.min(.95,sky*.95+narrow*.9+rim*.7));
   const alpha=1;
   v.forEach(point=>{point.rgb=point.rgb||[0,0,0,0];color.forEach((value,k)=>point.rgb[k]+=value);point.rgb[3]++});
   faces.push({v,z:mid[2],color:`rgba(${color.map(x=>Math.round(x)).join(',')},${alpha.toFixed(3)})`});
  }
  grid.forEach(row=>row.forEach(point=>{if(point.rgb)point.rgb=point.rgb.slice(0,3).map(value=>value/point.rgb[3])}));
  return {faces,edges:[grid.map(r=>r[0]),grid.map(r=>r[M])]};
 }
 const surface=makeCanvas(784,728);
 const gl=surface.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:true});
 if(!gl)throw new Error('WebGL is unavailable');
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
 const program=gl.createProgram();
 const vertex=shader(gl.VERTEX_SHADER,`attribute vec3 position;attribute vec3 color;varying vec3 tint;void main(){float perspective=680.0/(680.0-position.z);gl_Position=vec4(position.x*perspective/280.0,-position.y*perspective/260.0,-position.z/400.0,1.0);tint=color/255.0;}`);
 const fragment=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 tint;void main(){gl_FragColor=vec4(tint,1.0);}`);
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
 gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.viewport(0,0,784,728);
 const positionLocation=gl.getAttribLocation(program,'position'),colorLocation=gl.getAttribLocation(program,'color');
 gl.enableVertexAttribArray(positionLocation);gl.enableVertexAttribArray(colorLocation);
 const meshCache=new Map();
 function petals(ctx,open,alpha,gather=1){
  if(alpha<=0)return;
  const openStep=Math.round(open*40),gatherStep=Math.round(gather*32),key=openStep+':'+gatherStep;
  let mesh=meshCache.get(key);
  if(!mesh){
   const meshes=profiles.flatMap(profile=>[0,180].map(turn=>ribbon(profile,turn,openStep/40,gatherStep/32)));
   const data=new Float32Array(meshes.reduce((sum,m)=>sum+m.faces.length,0)*36);let offset=0;
   for(const m of meshes)for(const face of m.faces)for(const index of [0,1,2,0,2,3]){const p=face.v[index];data.set([p[0],p[1],p[2],...p.rgb],offset);offset+=6}
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
   mesh={buffer,count:data.length/6};meshCache.set(key,mesh);
  }
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(colorLocation,3,gl.FLOAT,false,24,12);
  gl.drawArrays(gl.TRIANGLES,0,mesh.count);
  ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(surface,-280,-260,560,520);ctx.restore();
 }
 function gathering(ctx,progress,alpha){petals(ctx,0,alpha,progress)}
 function dispose(){for(const mesh of meshCache.values())gl.deleteBuffer(mesh.buffer);meshCache.clear();gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);gl.getExtension('WEBGL_lose_context')?.loseContext()}
 function draw(ctx,state={},w=800,h=620,labelText='AI VOICE'){
  const {collapse=0,open=0,press=0,alpha=1}=state;
  ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w/2,h/2);ctx.scale(w/800,w/800);
  ellipseGlow(ctx,0,100,150+open*20,42,[[0,'rgba(46,131,234,.23)'],[.53,'rgba(64,149,245,.1)'],[1,'rgba(64,149,245,0)']]);
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const skin=1-smooth((collapse-.08)/.34),weave=smooth(collapse/.22);
  // The capsule stays elongated while the strips lift away from it.
  ctx.save();ctx.scale(1-collapse*.12,1);capsule(ctx,0,skin);ctx.restore();
  if(collapse>0){
   ctx.save();const pressScale=1-press*.085;ctx.scale(pressScale,pressScale);
   if(collapse<.9999)gathering(ctx,collapse,weave*alpha);
   else petals(ctx,open,alpha);
   ctx.restore();
  }
  if(open>.2)ellipseGlow(ctx,0,0,28,28,[[0,`rgba(255,255,255,${Math.min(1,open*1.1)*alpha})`],[.4,`rgba(208,243,255,${open*.25*alpha})`],[1,'rgba(178,230,255,0)']]);
  if(collapse<.55){ctx.save();ctx.globalAlpha=1-smooth(collapse/.55);ctx.fillStyle='#fff';ctx.font='500 27px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,59,147,.28)';ctx.shadowBlur=3;ctx.shadowOffsetY=1;ctx.fillText(labelText || 'AI VOICE',-16,1);ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='#fff';ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(92,0);ctx.lineTo(115,0);ctx.moveTo(106,-9);ctx.lineTo(115,0);ctx.lineTo(106,9);ctx.stroke();ctx.restore()}
  ctx.restore();
 }
 return {draw,dispose};
}

export { WovenGlassButton };
