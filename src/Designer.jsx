import { useCallback, useRef, useState } from "react";
import { DEMO, DEVICE_TYPES, FLOOR_DATA, FL, FLAB, PROTOCOLS, STCOL } from "./constants";
import { FLOOR_PLANS } from "./floorPlans";

let _uid = 4000;
const uid = () => `d${++_uid}`;
export default function Designer({ initialFloor, onBack }) {
  const [floor,  setFloor]  = useState(initialFloor||"G");
  const [byFloor,setByFloor]= useState(()=>{
    const i={B:[],G:[],"2":[],"3":[],R:[]};
    DEMO.forEach(d=>{
      const idx=DEMO.filter(x=>x.floor===d.floor).indexOf(d);
      i[d.floor].push({...d,x:36+(idx%4)*105,y:55+Math.floor(idx/4)*95});
    });
    return i;
  });
  const [sel,     setSel]   = useState(null);
  const [drag,    setDrag]  = useState(null);
  const [dragOff, setDragOff]=useState({x:0,y:0});
  const [mode,    setMode]  = useState("select");
  const [placing, setPlace] = useState(null);
  const [sheet,   setSheet] = useState(false);
  const [floorImgs, setFloorImgs] = useState({...FLOOR_PLANS});
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFloorImgs(prev => ({...prev, [floor]: url}));
    e.target.value = "";
  };

  const cur    = FLOOR_DATA[floor];
  const devs   = byFloor[floor]||[];
  const all    = Object.values(byFloor).flat();
  const counts = {
    online:  all.filter(d=>d.status==="online").length,
    warning: all.filter(d=>d.status==="warning").length,
    offline: all.filter(d=>d.status==="offline").length,
  };

  const TELEM={
    bacnet:()=>`> zone_temp: 71.8°F\n> setpoint: 72.0°F\n> valve: 38%`,
    zigbee:(d)=>`> state: ${d.status==="online"?"ON":"OFF"}\n> power: 4.1W\n> rssi: -61dBm`,
    zwave: (d)=>`> state: ${d.status}\n> battery: 84%\n> last_seen: 2s`,
    knx:   ()=>`> dim_level: 78%\n> group: 1.2.4\n> scene: evening`,
    rest:  ()=>`> endpoint: /api/v2\n> last_poll: 1s\n> latency: 11ms`,
    mqtt:  ()=>`> topic: bas/nexus\n> qos: 1\n> retained: true`,
  };

  // ── HOVER TOOLTIP DATA ───────────────────────────────────────────────────
  const [hov, setHov] = useState(null); // { dev, x, y }

  const TOOLTIP = (d) => {
    const on = d.status === "online";
    switch(d.type) {
      case "hvac":     return [["Temp","71.8°F"],["Setpoint","72.0°F"],["Mode","COOLING"],["Valve","38%"],["Status",d.status]];
      case "temp":     return [["Temp","68.4°F"],["Humidity","52%"],["Dew Point","49°F"],["Status",d.status]];
      case "motion":   return [["Motion",on?"DETECTED":"CLEAR"],["Last Trigger","4m ago"],["Battery","84%"],["Status",d.status]];
      case "smoke":    return [["Smoke",on?"CLEAR":"ALARM"],["CO","0 ppm"],["Battery","91%"],["Status",d.status]];
      case "door":     return [["State",on?"CLOSED":"OPEN"],["Last Event","12m ago"],["Battery","77%"],["Status",d.status]];
      case "leak":     return [["Water",on?"DRY":"LEAK!"],["Last Check","1m ago"],["Battery","95%"],["Status",d.status]];
      case "cam":      return [["Feed",on?"LIVE":"OFFLINE"],["Res","1080p"],["Night Vision","ON"],["Status",d.status]];
      case "access":   return [["Lock",on?"SECURED":"OPEN"],["Last Entry","8m ago"],["Method","PIN+Card"],["Status",d.status]];
      case "intercom": return [["Line",on?"ACTIVE":"IDLE"],["Last Call","2h ago"],["Volume","70%"],["Status",d.status]];
      case "dimmer":   return [["Level","78%"],["Scene","Evening"],["Group","1.2.4"],["Status",d.status]];
      case "switch":   return [["State",on?"ON":"OFF"],["Power","4.1W"],["Energy","0.3 kWh"],["Status",d.status]];
      case "shade":    return [["Position","45% open"],["Mode","AUTO"],["Last Move","6m ago"],["Status",d.status]];
      case "valve":    return [["Position","38% open"],["Flow","2.4 gpm"],["Pressure","42 psi"],["Status",d.status]];
      case "relay":    return [["Topic","bas/nexus"],["QoS","Level 1"],["Retained","YES"],["Status",d.status]];
      case "hub":      return [["Devices","15 paired"],["Uptime","4d 6h"],["Signal","-48 dBm"],["Status",d.status]];
      case "elevator": return [["Floor","G (Ground)"],["State",on?"READY":"FAULT"],["Last Call","1m ago"],["Status",d.status]];
      default:         return [["State",on?"ON":"OFF"],["Protocol",d.protocol.toUpperCase()],["Status",d.status]];
    }
  };

  const placeDev = useCallback((e)=>{
    if(mode!=="place"||!placing) return;
    const r=canvasRef.current.getBoundingClientRect();
    const dt=DEVICE_TYPES.find(d=>d.id===placing);
    setByFloor(f=>({...f,[floor]:[...f[floor],{id:uid(),type:placing,label:dt.label,icon:dt.icon,protocol:dt.protocol,x:e.clientX-r.left-16,y:e.clientY-r.top-16,status:"online",floor}]}));
  },[mode,placing,floor]);

  const startDrag=(e,dev)=>{
    if(mode!=="select") return;
    e.stopPropagation();
    const r=canvasRef.current.getBoundingClientRect();
    setDrag(dev.id);
    setDragOff({x:e.clientX-r.left-dev.x,y:e.clientY-r.top-dev.y});
    setSel(dev); setSheet(true);
  };
  const onMove=(e)=>{
    if(!drag) return;
    const r=canvasRef.current.getBoundingClientRect();
    setByFloor(f=>({...f,[floor]:f[floor].map(d=>d.id===drag?{...d,x:e.clientX-r.left-dragOff.x,y:e.clientY-r.top-dragOff.y}:d)}));
  };
  const delDev=(id)=>{ setByFloor(f=>({...f,[floor]:f[floor].filter(d=>d.id!==id)})); setSel(null); setSheet(false); };
  const cycleSt=(id)=>{
    const c={online:"warning",warning:"offline",offline:"online"};
    setByFloor(f=>({...f,[floor]:f[floor].map(d=>d.id===id?{...d,status:c[d.status]}:d)}));
  };

  const liveSel = sel?(devs.find(d=>d.id===sel.id)||sel):null;

  return (
    <div style={{fontFamily:"'JetBrains Mono','Courier New',monospace",background:"#07111e",
      minHeight:"100vh",display:"flex",flexDirection:"column",color:"#c9d4e8",position:"relative"}}>

      {/* TOPBAR */}
      <div style={{position:"sticky",top:0,zIndex:20,background:"#0b1825",borderBottom:"1px solid #1a3050",
        padding:"0 12px",height:50,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button onClick={onBack} style={{padding:"6px 11px",fontSize:9,fontFamily:"inherit",fontWeight:700,
          background:"#060f1b",color:"#00e5ff",border:"1px solid #00e5ff44",borderRadius:6,cursor:"pointer"}}>
          ← HOME
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
          <div style={{width:26,height:26,borderRadius:6,background:"linear-gradient(135deg,#00e5ff,#0055cc)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>⬡</div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0"}}>
              Nexus<span style={{color:"#00e5ff"}}>BAS</span>
              <span style={{color:"#336699",fontWeight:400,fontSize:8}}> · Floor Plan Designer</span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          {[["online","#69ff47"],["warning","#ffb300"],["offline","#ff6e6e"]].map(([k,c])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:c,boxShadow:`0 0 4px ${c}`}}/>
              <span style={{fontSize:9,color:c,fontWeight:700}}>{counts[k]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FLOOR TABS */}
      <div style={{background:"#0b1825",borderBottom:"1px solid #1a3050",display:"flex",alignItems:"center",
        padding:"0 10px",height:40,overflowX:"auto",flexShrink:0,scrollbarWidth:"none"}}>
        <span style={{fontSize:7,color:"#336699",marginRight:6,whiteSpace:"nowrap",flexShrink:0}}>LEVEL</span>
        {FL.map(f=>{
          const cnt=byFloor[f]?.length||0;
          return (
            <button key={f} onClick={()=>setFloor(f)}
              style={{padding:"4px 14px",fontSize:11,fontFamily:"inherit",fontWeight:700,
                background:floor===f?"#122030":"transparent",
                color:floor===f?"#00e5ff":"#336699",
                border:"none",borderBottom:floor===f?"2px solid #00e5ff":"2px solid transparent",
                cursor:"pointer",position:"relative",flexShrink:0}}>
              {f}
              {cnt>0&&<span style={{position:"absolute",top:1,right:1,fontSize:6,background:"#00e5ff",
                color:"#07111e",borderRadius:8,padding:"0 2px",fontWeight:900}}>{cnt}</span>}
            </button>
          );
        })}
        <span style={{fontSize:7.5,color:"#336699",marginLeft:8,whiteSpace:"nowrap"}}>— {cur.label}</span>
      </div>

      {/* DEVICE PICKER STRIP */}
      <div style={{background:"#080f1c",borderBottom:"1px solid #1a3050",
        padding:"6px 10px",display:"flex",gap:5,overflowX:"auto",flexShrink:0,scrollbarWidth:"none"}}>
        <span style={{fontSize:7,color:"#336699",alignSelf:"center",flexShrink:0}}>ADD:</span>
        {DEVICE_TYPES.map(dt=>{
          const p=PROTOCOLS[dt.protocol], a=mode==="place"&&placing===dt.id;
          return (
            <div key={dt.id} onClick={()=>{setMode("place");setPlace(dt.id);}}
              style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"5px 9px",borderRadius:7,
                background:a?p.color+"25":"#0d1e30",
                border:`1px solid ${a?p.color:p.color+"30"}`,cursor:"pointer",transition:"all 0.12s"}}>
              <span style={{fontSize:13}}>{dt.icon}</span>
              <span style={{fontSize:8,color:a?"#e2e8f0":"#7a9ab8",whiteSpace:"nowrap"}}>{dt.label}</span>
            </div>
          );
        })}
        {mode==="place"&&(
          <button onClick={()=>{setMode("select");setPlace(null);}}
            style={{flexShrink:0,padding:"5px 10px",fontSize:8,fontFamily:"inherit",fontWeight:700,
              background:"#1e0a0a",color:"#ff6e6e",border:"1px solid #ff6e6e44",borderRadius:6,cursor:"pointer"}}>
            ESC
          </button>
        )}
      </div>

      {/* PLACE MODE BANNER */}
      {mode==="place"&&(
        <div style={{background:"#001a0a",borderBottom:"1px solid #69ff4733",padding:"5px 12px",
          fontSize:8,color:"#69ff47",letterSpacing:"0.1em",flexShrink:0}}>
          ▸ PLACING: {DEVICE_TYPES.find(d=>d.id===placing)?.label} — tap the floor plan to drop
        </div>
      )}

      {/* CANVAS */}
      <div style={{flex:1,overflow:"auto",background:"#060f1b"}}>

        {/* Upload bar for this floor */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"7px 16px",background:"#080f1c",borderBottom:"1px solid #1a3050"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:8,color:"#336699",letterSpacing:"0.12em"}}>
              FLOOR PLAN · {cur.label.toUpperCase()}
            </span>
            {floorImgs[floor] && (
              <span style={{fontSize:7,color:"#69ff47",letterSpacing:"0.1em"}}>✓ IMAGE LOADED</span>
            )}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>fileInputRef.current.click()}
              style={{padding:"5px 12px",fontSize:8,fontFamily:"inherit",fontWeight:700,
                background: floorImgs[floor]?"#0a2040":"linear-gradient(135deg,#00e5ff22,#0070f322)",
                color:"#00e5ff",border:"1px solid #00e5ff55",borderRadius:6,cursor:"pointer",
                letterSpacing:"0.08em"}}>
              {floorImgs[floor]?"⟳ REPLACE IMAGE":"⬆ UPLOAD FLOOR PLAN"}
            </button>
            {floorImgs[floor] && (
              <button onClick={()=>setFloorImgs(p=>({...p,[floor]:null}))}
                style={{padding:"5px 10px",fontSize:8,fontFamily:"inherit",fontWeight:700,
                  background:"#1e0a0a",color:"#ff6e6e",border:"1px solid #ff6e6e44",
                  borderRadius:6,cursor:"pointer"}}>
                ✕
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf"
            onChange={handleImgUpload} style={{display:"none"}}/>
        </div>

        <div ref={canvasRef} onClick={placeDev} onMouseMove={onMove} onMouseUp={()=>setDrag(null)}
          style={{position:"relative",width:470,height:510,margin:"16px auto",
            cursor:mode==="place"?"crosshair":"default",userSelect:"none"}}>

          {/* Grid — hidden when image loaded */}
          {!floorImgs[floor] && (
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
              <defs><pattern id="gr" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0c1f30" strokeWidth="0.5"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#gr)"/>
            </svg>
          )}

          {/* Floor plan image */}
          {floorImgs[floor] && (
            <img src={floorImgs[floor]} alt={`Floor ${floor} plan`}
              style={{position:"absolute",inset:0,width:"100%",height:"100%",
                objectFit:"contain",objectPosition:"center",
                opacity:0.35,pointerEvents:"none",borderRadius:4}}/>
          )}

          {/* Upload prompt when no image */}
          {!floorImgs[floor] && (
            <div onClick={()=>fileInputRef.current.click()}
              style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",gap:8,
                border:"2px dashed #1a3050",borderRadius:6,margin:4,
                cursor:"pointer",zIndex:0}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#00e5ff44"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#1a3050"}>
              <div style={{fontSize:32,opacity:0.2}}>🗺</div>
              <div style={{fontSize:9,color:"#1e4060",letterSpacing:"0.14em",textAlign:"center"}}>
                UPLOAD FLOOR PLAN<br/>
                <span style={{fontSize:7,color:"#142a40"}}>PNG · JPG · PDF</span>
              </div>
            </div>
          )}

          {/* Room overlays — shown at low opacity when image is loaded */}
          {cur.rooms.map(rm=>(
            <div key={rm.id} style={{position:"absolute",left:rm.x,top:rm.y,width:rm.w,height:rm.h,
              border:`1.5px solid ${floorImgs[floor]?"#00e5ff22":"#1a3a5a"}`,
              background: floorImgs[floor]?"rgba(0,229,255,0.03)":"rgba(12,24,40,0.72)",
              borderRadius:3,boxSizing:"border-box",zIndex:1}}>
              {!floorImgs[floor] && (
                <div style={{position:"absolute",top:5,left:7,fontSize:7,color:"#1e4060",
                  letterSpacing:"0.08em",fontWeight:700,lineHeight:1.5}}>
                  {rm.label}
                  {rm.note&&<><br/><span style={{fontSize:6,color:"#163050",fontWeight:400}}>{rm.note}</span></>}
                </div>
              )}
            </div>
          ))}

          {devs.map(d=>{
            const p=PROTOCOLS[d.protocol], is=liveSel?.id===d.id;
            const isHov = hov?.dev?.id===d.id;
            const tipRows = isHov ? TOOLTIP(d) : [];
            // Clamp tooltip so it doesn't go off right edge (canvas width 470)
            const tipX = Math.min(d.x + 40, 300);
            const tipY = Math.max(d.y - 10, 4);
            return (
              <div key={d.id}
                onMouseDown={e=>startDrag(e,d)}
                onMouseEnter={e=>{ if(mode==="select") setHov({dev:d}); }}
                onMouseLeave={()=>setHov(null)}
                style={{position:"absolute",left:d.x,top:d.y,width:32,height:32,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  background:is?p.color+"28":"#0d1e30",
                  border:`2px solid ${is?p.color:p.color+"70"}`,borderRadius:7,
                  cursor:mode==="select"?"grab":"default",fontSize:14,
                  boxShadow:is?`0 0 14px ${p.color}55`:isHov?`0 0 10px ${p.color}44`:"none",
                  zIndex:isHov||is?20:1,transition:"box-shadow 0.15s"}}>
                {d.icon}
                <div style={{position:"absolute",bottom:-4,right:-4,width:7,height:7,borderRadius:"50%",
                  background:STCOL[d.status],border:"1.5px solid #07111e",boxShadow:`0 0 4px ${STCOL[d.status]}`}}/>
                <div style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",
                  fontSize:6,padding:"1px 3px",borderRadius:2,whiteSpace:"nowrap",
                  background:p.color+"28",color:p.color,border:`1px solid ${p.color}44`,fontWeight:700}}>{p.short}</div>

                {/* ── HOVER TOOLTIP ── */}
                {isHov&&(
                  <div style={{
                    position:"absolute",
                    left:36, top:0,
                    zIndex:50,
                    background:"#08192c",
                    border:`1px solid ${p.color}66`,
                    borderRadius:8,
                    padding:"10px 12px",
                    minWidth:160,
                    boxShadow:`0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px ${p.color}22`,
                    pointerEvents:"none",
                  }}>
                    {/* Header */}
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8,paddingBottom:7,borderBottom:`1px solid ${p.color}22`}}>
                      <span style={{fontSize:16}}>{d.icon}</span>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,color:"#e2e8f0",whiteSpace:"nowrap"}}>{d.label}</div>
                        <div style={{fontSize:7,color:p.color,marginTop:1}}>{p.label}</div>
                      </div>
                    </div>
                    {/* Rows */}
                    {tipRows.map(([k,v],i)=>{
                      const isStatus = k==="Status";
                      const valColor = isStatus ? STCOL[d.status]
                        : (v==="ON"||v==="LIVE"||v==="SECURED"||v==="CLOSED"||v==="DRY"||v==="CLEAR"||v==="ACTIVE"||v==="READY") ? "#69ff47"
                        : (v==="OFF"||v==="OFFLINE"||v==="OPEN"||v==="ALARM"||v==="LEAK!"||v==="FAULT") ? "#ff6e6e"
                        : "#c9d4e8";
                      return (
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                          padding:"3px 0",borderBottom:i<tipRows.length-1?"1px solid #0d2035":"none"}}>
                          <span style={{fontSize:8,color:"#4a7090",letterSpacing:"0.08em"}}>{k}</span>
                          <span style={{fontSize:9,fontWeight:700,color:valColor,marginLeft:12,whiteSpace:"nowrap"}}>{v}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SHEET — device inspector */}
      {sheet&&liveSel&&(()=>{
        const p=PROTOCOLS[liveSel.protocol];
        const lv=devs.find(d=>d.id===liveSel.id)||liveSel;
        return (
          <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40,
            background:"#0b1825",borderTop:"2px solid #00e5ff44",
            borderRadius:"18px 18px 0 0",padding:"18px 16px 24px",
            boxShadow:"0 -12px 48px rgba(0,0,0,0.7)",
            animation:"slideUp 0.22s ease"}}>
            <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
            <div style={{width:36,height:4,borderRadius:2,background:"#1a3050",margin:"0 auto 16px"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:11}}>
                <span style={{fontSize:26}}>{lv.icon}</span>
                <div>
                  <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{lv.label}</div>
                  <div style={{fontSize:8,color:p.color,marginTop:1}}>{p.label} · {FLAB[lv.floor]}</div>
                </div>
              </div>
              <button onClick={()=>setSheet(false)} style={{padding:"5px 11px",fontSize:11,color:"#336699",
                background:"#060f1b",border:"1px solid #1a3050",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {label:"STATUS", val:lv.status.toUpperCase(), color:STCOL[lv.status]},
                {label:"FLOOR",  val:`Level ${lv.floor}`,     color:"#7a9ab8"},
                {label:"ID",     val:lv.id,                   color:"#4a7090"},
              ].map(r=>(
                <div key={r.label} style={{padding:"9px 6px",background:"#060f1b",borderRadius:7,textAlign:"center"}}>
                  <div style={{fontSize:7,color:"#336699",marginBottom:3}}>{r.label}</div>
                  <div style={{fontSize:9,fontWeight:700,color:r.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.val}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#050d17",border:"1px solid #1a3050",borderRadius:7,
              padding:"10px",fontFamily:"monospace",fontSize:8,color:"#69ff47",lineHeight:1.9,whiteSpace:"pre",marginBottom:12}}>
              {(TELEM[lv.protocol]||TELEM.mqtt)(lv)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button onClick={()=>cycleSt(lv.id)} style={{padding:"11px",fontSize:9,fontFamily:"inherit",fontWeight:700,
                background:"#0a1e30",color:"#ffb300",border:"1px solid #ffb30044",borderRadius:7,cursor:"pointer"}}>
                ⟳ CYCLE STATUS
              </button>
              <button onClick={()=>delDev(lv.id)} style={{padding:"11px",fontSize:9,fontFamily:"inherit",fontWeight:700,
                background:"#1e0a0a",color:"#ff6e6e",border:"1px solid #ff6e6e44",borderRadius:7,cursor:"pointer"}}>
                ✕ REMOVE
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
