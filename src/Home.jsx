import { useEffect, useState } from "react";
import { DEMO, FL, FLAB, PROTOCOLS, STCOL } from "./constants";

function IsoBuilding({ onFloorClick, activeFloor }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n+1), 50);
    return () => clearInterval(id);
  }, []);

  const VW=340, VH=390;
  const cx=170, cy=292;
  const hw=75,  hh=38, fh=46;

  const iso = (gx, gy, gz) => ({
    x: cx + (gx-gy)*hw,
    y: cy + (gx+gy)*hh - gz*fh,
  });

  const pts  = p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  const face = (gz) => {
    const b=[iso(0,0,gz),iso(1,0,gz),iso(1,1,gz),iso(0,1,gz)];
    const t=[iso(0,0,gz+1),iso(1,0,gz+1),iso(1,1,gz+1),iso(0,1,gz+1)];
    return {
      top:   [t[0],t[1],t[2],t[3]].map(pts).join(" "),
      left:  [t[0],t[3],b[3],b[0]].map(pts).join(" "),
      right: [t[1],t[2],b[2],b[1]].map(pts).join(" "),
      lbl:   iso(0.06, 0.74, gz+0.46),
      badge: iso(0.78, 0.08, gz+1.05),
    };
  };

  const shades = [
    {top:"#0f2a3e",left:"#071c2c",right:"#0a2234"},
    {top:"#113248",left:"#082036",right:"#0b2a3e"},
    {top:"#133a52",left:"#09263e",right:"#0d3248"},
    {top:"#15425c",left:"#0a2c46",right:"#0f3a52"},
    {top:"#174a66",left:"#0b324e",right:"#11425c"},
  ];

  const pulseDevs = DEMO.filter(d=>d.status==="online").map((d,i)=>{
    const gz = FL.indexOf(d.floor);
    const gx = 0.12 + (i%4)*0.19;
    const gy = 0.12 + (Math.floor(i/4)%3)*0.30;
    const p  = iso(gx, gy, gz+1);
    return {...d, px:p.x, py:p.y, ph:i*1.4};
  });

  const pv = (ph) => Math.sin(tick*0.06+ph)*0.5+0.5;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="auto"
      style={{display:"block",maxWidth:860,margin:"0 auto",overflow:"visible"}}>
      <defs>
        <filter id="glo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {FL.map((fl,gi)=>{
        const f=face(gi), c=shades[gi], ia=activeFloor===fl;
        const dc=DEMO.filter(d=>d.floor===fl).length;
        return (
          <g key={fl} onClick={()=>onFloorClick(fl)} style={{cursor:"pointer"}}>
            <polygon points={f.left}  fill={c.left}  stroke={ia?"#00e5ff":"#0d2c44"} strokeWidth={ia?1.5:0.7}/>
            <polygon points={f.right} fill={c.right} stroke={ia?"#00e5ff":"#0d2c44"} strokeWidth={ia?1.5:0.7}/>
            <polygon points={f.top}   fill={c.top}   stroke={ia?"#00e5ff":"#0d2c44"} strokeWidth={ia?1.5:0.7}/>
            {ia&&<polygon points={f.top} fill="#00e5ff0e" stroke="#00e5ff" strokeWidth="1"/>}
            {[0.28,0.58].map((t,wi)=>{
              const w=iso(1,t,gi+0.62);
              return <circle key={wi} cx={w.x} cy={w.y} r={2} fill="#091c2e" stroke="#00e5ff28" strokeWidth="0.5"/>;
            })}
            <text x={f.lbl.x} y={f.lbl.y} fontSize="8" fill={ia?"#00e5ff":"#1e5272"}
              fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="0.6">
              {fl} · {FLAB[fl].toUpperCase()}
            </text>
            {dc>0&&<>
              <circle cx={f.badge.x} cy={f.badge.y} r={10} fill="#00e5ff18" stroke="#00e5ff" strokeWidth="0.8"/>
              <text x={f.badge.x} y={f.badge.y+3.5} textAnchor="middle" fontSize="8.5"
                fill="#00e5ff" fontFamily="monospace" fontWeight="900">{dc}</text>
            </>}
          </g>
        );
      })}

      {(()=>{
        const hub=pulseDevs.find(d=>d.type==="hub");
        if(!hub) return null;
        return pulseDevs.filter(d=>d.id!==hub.id).slice(0,10).map(d=>{
          const p=PROTOCOLS[d.protocol];
          return <line key={d.id} x1={hub.px} y1={hub.py} x2={d.px} y2={d.py}
            stroke={p.color} strokeWidth="0.5" strokeDasharray="3 4" opacity={0.1+pv(d.ph)*0.22}/>;
        });
      })()}

      {pulseDevs.map(d=>{
        const p=PROTOCOLS[d.protocol], r=3+pv(d.ph)*2.5;
        return (
          <g key={d.id} filter="url(#glo)">
            <circle cx={d.px} cy={d.py} r={r*2} fill={p.color+"10"}/>
            <circle cx={d.px} cy={d.py} r={r}   fill={p.color+"b0"} stroke={p.color} strokeWidth="0.7"/>
          </g>
        );
      })}

      {(()=>{
        const base=iso(0.5,0.5,FL.length+0.05);
        const tip =iso(0.5,0.5,FL.length+0.80);
        const r=2+pv(0)*3.5;
        return <>
          <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke="#00e5ff" strokeWidth="1.2" opacity="0.75"/>
          <circle cx={tip.x} cy={tip.y} r={r} fill="#00e5ff12" stroke="#00e5ff" strokeWidth="0.7"/>
          <circle cx={tip.x} cy={tip.y} r={2} fill="#00e5ff"/>
        </>;
      })()}
    </svg>
  );
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function Ticker({ onDeviceClick }) {
  const [off, setOff] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setOff(o=>o+0.45),16);
    return ()=>clearInterval(t);
  },[]);
  const W = 160;
  const items = [...DEMO,...DEMO,...DEMO];
  const loopW = DEMO.length*W;
  return (
    <div style={{width:"100%",overflow:"hidden",position:"relative",height:64,background:"#030912",borderTop:"1px solid #0e2840"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:40,background:"linear-gradient(to right,#030912,transparent)",zIndex:2,pointerEvents:"none"}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:40,background:"linear-gradient(to left,#030912,transparent)",zIndex:2,pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",position:"absolute",top:0,left:0,height:"100%",
        transform:`translateX(${-(off%loopW)}px)`,willChange:"transform"}}>
        {items.map((d,i)=>{
          const p=PROTOCOLS[d.protocol];
          return (
            <div key={`${d.id}-${i}`} onClick={()=>onDeviceClick(d)}
              style={{minWidth:W,height:"100%",display:"flex",alignItems:"center",gap:8,padding:"0 12px",
                cursor:"pointer",borderRight:"1px solid #0d2035"}}
              onMouseEnter={e=>e.currentTarget.style.background="#0d2035"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:32,height:32,borderRadius:7,background:p.color+"18",border:`1.5px solid ${p.color}55`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,position:"relative"}}>
                {d.icon}
                <div style={{position:"absolute",bottom:-3,right:-3,width:7,height:7,borderRadius:"50%",
                  background:STCOL[d.status],border:"1.5px solid #030912",boxShadow:`0 0 4px ${STCOL[d.status]}`}}/>
              </div>
              <div style={{overflow:"hidden"}}>
                <div style={{fontSize:9,color:"#c9d4e8",fontWeight:700,whiteSpace:"nowrap"}}>{d.label}</div>
                <div style={{fontSize:7,color:p.color,marginTop:1}}>{p.short} · {FLAB[d.floor]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
export default function Home({ onEnter, onFloor, onPortal }) {
  const [active, setActive] = useState(null);
  const [in_, setIn]        = useState(false);
  useEffect(()=>{ setTimeout(()=>setIn(true),80); },[]);

  const online  = DEMO.filter(d=>d.status==="online").length;
  const warning = DEMO.filter(d=>d.status==="warning").length;
  const offline = DEMO.filter(d=>d.status==="offline").length;

  const fade = (d=0) => ({
    opacity: in_?1:0,
    transform: in_?"translateY(0)":"translateY(14px)",
    transition:`opacity 0.55s ease ${d}s,transform 0.55s ease ${d}s`,
  });

  return (
    <div style={{background:"#04090f",minHeight:"100vh",display:"flex",flexDirection:"column",
      fontFamily:"'JetBrains Mono','Courier New',monospace",color:"#c9d4e8",
      backgroundImage:"linear-gradient(rgba(0,229,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.02) 1px,transparent 1px)",
      backgroundSize:"32px 32px"}}>

      {/* ── HEADER ── */}
      <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(4,9,15,0.94)",backdropFilter:"blur(12px)",
        borderBottom:"1px solid #0d2540",padding:"0 16px",height:54,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,
            background:"linear-gradient(135deg,#00e5ff 0%,#0070f3 100%)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⬡</div>
          <div>
            <div style={{fontSize:14,fontWeight:900,letterSpacing:"0.04em",color:"#e2e8f0",lineHeight:1.2}}>
              Nexus<span style={{color:"#00e5ff"}}>BAS</span>
            </div>
            <div style={{fontSize:7,color:"#1e5070",letterSpacing:"0.14em"}}>BUILDING AUTOMATION</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",gap:10}}>
            {[[online,"#69ff47"],[warning,"#ffb300"],[offline,"#ff6e6e"]].map(([v,c],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:3}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:c,boxShadow:`0 0 6px ${c}`}}/>
                <span style={{fontSize:12,fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={onPortal} style={{padding:"8px 14px",fontSize:9,fontWeight:700,letterSpacing:"0.08em",
            background:"#081521",color:"#00e5ff",border:"1px solid #00e5ff33",
            borderRadius:7,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            PORTAL
          </button>
          <button onClick={onEnter} style={{padding:"8px 14px",fontSize:9,fontWeight:700,letterSpacing:"0.08em",
            background:"linear-gradient(135deg,#00e5ff,#0070f3)",color:"#04090f",
            border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            OPEN →
          </button>
        </div>
      </div>

      {/* ── SCROLL BODY ── */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",alignItems:"center"}}>

        {/* Hero */}
        <div style={{...fade(0),textAlign:"center",padding:"40px 20px 8px",width:"100%",maxWidth:900,alignSelf:"center",boxSizing:"border-box"}}>
          <div style={{fontSize:10,letterSpacing:"0.26em",color:"#00e5ff40",marginBottom:10}}>
            196 W HOUSTON ST · WEST VILLAGE · NYC
          </div>
          <div style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:900,color:"#e2e8f0",lineHeight:1.05,letterSpacing:"0.02em"}}>
            SMART BUILDING<br/>
            <span style={{color:"#00e5ff"}}>CONTROL CENTER</span>
          </div>
          <div style={{fontSize:11,color:"#2a5070",marginTop:12,letterSpacing:"0.12em"}}>
            7,200 SF · 5 LEVELS · {DEMO.length} DEVICES · ELEVATOR · 2-CAR GARAGE
          </div>
        </div>

        {/* ── 3D BUILDING ── */}
        <div style={{...fade(0.08),width:"100%",maxWidth:900,alignSelf:"center",padding:"16px 24px 8px",boxSizing:"border-box"}}>
          <IsoBuilding
            onFloorClick={fl=>{ setActive(fl); onFloor(fl); }}
            activeFloor={active}
          />
        </div>

        {/* Click hint */}
        <div style={{...fade(0.12),fontSize:8,color:"#1e4060",letterSpacing:"0.14em",marginBottom:8,textAlign:"center"}}>
          TAP A FLOOR TO JUMP TO THAT LEVEL
        </div>

        {/* ── FLOOR CARDS ── */}
        <div style={{...fade(0.15),display:"flex",gap:10,padding:"0 24px 16px",
          flexWrap:"wrap",justifyContent:"center",width:"100%",maxWidth:900,alignSelf:"center",boxSizing:"border-box"}}>
          {FL.map(fl=>{
            const devs=DEMO.filter(d=>d.floor===fl);
            const on=devs.filter(d=>d.status==="online").length;
            const wa=devs.filter(d=>d.status==="warning").length;
            const of=devs.filter(d=>d.status==="offline").length;
            const ia=active===fl;
            return (
              <div key={fl} onClick={()=>{ setActive(fl); onFloor(fl); }}
                style={{flexShrink:0,padding:"14px 20px",borderRadius:9,cursor:"pointer",
                  background:ia?"#0d2540":"#080f1c",
                  border:`1px solid ${ia?"#00e5ff":"#0e2840"}`,
                  transition:"all 0.15s",minWidth:100,flex:1,textAlign:"center",
                  boxShadow:ia?`0 0 16px #00e5ff33`:"none"}}>
                <div style={{fontSize:18,fontWeight:700,color:ia?"#00e5ff":"#e2e8f0",marginBottom:3}}>{fl}</div>
                <div style={{fontSize:9,color:"#336699",marginBottom:8}}>{FLAB[fl]}</div>
                <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                  {on>0  && <span style={{fontSize:10,color:"#69ff47"}}>●{on}</span>}
                  {wa>0  && <span style={{fontSize:10,color:"#ffb300"}}>●{wa}</span>}
                  {of>0  && <span style={{fontSize:10,color:"#ff6e6e"}}>●{of}</span>}
                  {devs.length===0 && <span style={{fontSize:10,color:"#1e4060"}}>—</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── PROTOCOL GRID ── */}
        <div style={{...fade(0.2),display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,
          padding:"0 24px 16px",width:"100%",maxWidth:900,alignSelf:"center",boxSizing:"border-box"}}>
          {Object.entries(PROTOCOLS).map(([k,p])=>{
            const cnt=DEMO.filter(d=>d.protocol===k).length;
            return (
              <div key={k} style={{display:"flex",alignItems:"center",gap:8,
                padding:"9px 11px",borderRadius:8,background:"#080f1c",
                border:`1px solid ${p.color}22`}}>
                <div style={{width:10,height:10,borderRadius:3,background:p.color,
                  boxShadow:`0 0 7px ${p.color}88`,flexShrink:0}}/>
                <span style={{fontSize:11,color:"#7a9ab8",flex:1}}>{p.label}</span>
                <span style={{fontSize:14,color:p.color,fontWeight:700}}>{cnt}</span>
              </div>
            );
          })}
        </div>

        {/* ── STAT TILES ── */}
        <div style={{...fade(0.25),display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,
          padding:"0 24px 20px",width:"100%",maxWidth:900,alignSelf:"center",boxSizing:"border-box"}}>
          {[
            {label:"DEVICES",val:DEMO.length,    color:"#00e5ff"},
            {label:"ONLINE", val:online,          color:"#69ff47"},
            {label:"ALERTS", val:warning+offline, color:"#ffb300"},
          ].map(s=>(
            <div key={s.label} style={{padding:"20px 12px",background:"#080f1c",borderRadius:9,
              border:`1px solid ${s.color}1a`,textAlign:"center"}}>
              <div style={{fontSize:"clamp(28px,3vw,48px)",fontWeight:900,color:s.color,lineHeight:1,
                filter:`drop-shadow(0 0 10px ${s.color}55)`}}>{s.val}</div>
              <div style={{fontSize:10,color:s.color+"66",marginTop:6,letterSpacing:"0.1em"}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FULL-WIDTH CTA ── */}
        <div style={{...fade(0.3),padding:"0 24px 32px",width:"100%",maxWidth:900,alignSelf:"center",boxSizing:"border-box"}}>
          <button onClick={onEnter} style={{width:"100%",padding:"15px",fontSize:11,fontWeight:700,
            letterSpacing:"0.12em",background:"linear-gradient(135deg,#00e5ff,#0070f3)",color:"#04090f",
            border:"none",borderRadius:9,cursor:"pointer",fontFamily:"inherit",
            boxShadow:"0 4px 24px #00e5ff33"}}>
            OPEN FLOOR PLAN DESIGNER →
          </button>
        </div>

      </div>

      {/* ── TICKER ── */}
      <div style={{flexShrink:0}}>
        <div style={{fontSize:7,color:"#1a3a5a",letterSpacing:"0.18em",textAlign:"center",
          padding:"5px 0 2px",background:"#030912"}}>
          ▸ LIVE DEVICE FEED · TAP TO INSPECT
        </div>
        <Ticker onDeviceClick={d=>onFloor(d.floor)}/>
      </div>
    </div>
  );
}
