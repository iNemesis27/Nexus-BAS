// ─── 196 WEST HOUSTON STREET — CLEAN VECTOR FLOOR PLANS ─────────────────────
// Hand-coded SVG from actual room dimensions shown in blueprints.
// Scale: 1 ft ≈ 10px. Building footprint: 22' wide × ~96' deep.
// Each floor is a standalone SVG, exported as a React component map.

const WALL = "#1a1a1a";
const WALL_W = 2.5;
const ROOM_FILL = "#f8f6f2";
const ACCENT = "#0d6efd";
const STAIR_FILL = "#e8e4dc";
const TEXT = "#1a1a1a";
const DIM_TEXT = "#e03030";
const GREEN = "#5a8a5a";

// ─── SHARED HELPERS ────────────────────────────────────────────────────────────
const Rm = ({ x, y, w, h, label, sub, fill = ROOM_FILL, hatch }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={fill} stroke={WALL} strokeWidth={WALL_W} />
    {hatch && (
      <g clipPath={`url(#clip-${label?.replace(/\s/g,"")})`}>
        <defs>
          <clipPath id={`clip-${label?.replace(/\s/g,"")}`}>
            <rect x={x+2} y={y+2} width={w-4} height={h-4}/>
          </clipPath>
        </defs>
        {Array.from({length:30},(_,i)=>(
          <line key={i} x1={x+(i*8)-30} y1={y} x2={x+(i*8)-30+h} y2={y+h}
            stroke="#ccc" strokeWidth="0.7" opacity="0.6"/>
        ))}
      </g>
    )}
    {label && (
      <text x={x + w/2} y={y + h/2 - (sub?6:0)} textAnchor="middle"
        fontSize="8.5" fontWeight="600" fill={TEXT} fontFamily="'JetBrains Mono',monospace"
        letterSpacing="0.3">
        {label}
      </text>
    )}
    {sub && (
      <text x={x + w/2} y={y + h/2 + 8} textAnchor="middle"
        fontSize="6.5" fill={DIM_TEXT} fontFamily="'JetBrains Mono',monospace" fontWeight="500">
        {sub}
      </text>
    )}
  </g>
);

const Wall = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={WALL} strokeWidth={WALL_W + 1} />
);

const Door = ({ x, y, w = 20, dir = "r" }) => {
  // dir: r=opens right, l=opens left, u=opens up, d=opens down
  const arcs = {
    r: `M${x},${y+w} A${w},${w} 0 0,1 ${x+w},${y}`,
    l: `M${x},${y} A${w},${w} 0 0,0 ${x-w},${y+w}`,
    u: `M${x},${y} A${w},${w} 0 0,1 ${x+w},${y-w}`,
    d: `M${x+w},${y} A${w},${w} 0 0,0 ${x},${y+w}`,
  };
  return (
    <g>
      <line x1={dir==="r"?x:dir==="l"?x:x} y1={dir==="r"?y+w:dir==="l"?y:y}
            x2={dir==="r"?x:dir==="l"?x-w:x+w} y2={dir==="r"?y:dir==="l"?y+w:dir==="u"?y-w:y+w}
            stroke={WALL} strokeWidth={1.5}/>
      <path d={arcs[dir]} fill="none" stroke={WALL} strokeWidth={1} strokeDasharray="2,2"/>
    </g>
  );
};

const Stair = ({ x, y, w, h, steps=8, dir="v" }) => {
  const lines = [];
  for(let i=0;i<=steps;i++){
    if(dir==="v"){
      const yy = y + (h/steps)*i;
      lines.push(<line key={i} x1={x} y1={yy} x2={x+w} y2={yy} stroke="#999" strokeWidth="0.8"/>);
    } else {
      const xx = x + (w/steps)*i;
      lines.push(<line key={i} x1={xx} y1={y} x2={xx} y2={y+h} stroke="#999" strokeWidth="0.8"/>);
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={STAIR_FILL} stroke={WALL} strokeWidth={WALL_W}/>
      {lines}
      <text x={x+w/2} y={y+h/2+3} textAnchor="middle" fontSize="6" fill="#777"
        fontFamily="monospace">STAIR</text>
    </g>
  );
};

const Label = ({ x, y, text, size=7.5, color=TEXT, bold=false }) => (
  <text x={x} y={y} fontSize={size} fill={color} fontFamily="'JetBrains Mono',monospace"
    fontWeight={bold?"700":"500"} letterSpacing="0.2">{text}</text>
);

const DimLine = ({ x1, y1, x2, y2, label, side="top" }) => {
  const mx = (x1+x2)/2, my = (y1+y2)/2;
  const off = side==="top"?-8:side==="bottom"?8:side==="left"?-8:8;
  const isH = y1===y2;
  return (
    <g opacity="0.7">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DIM_TEXT} strokeWidth="0.8" strokeDasharray="3,2"/>
      <text x={isH?mx:mx+off} y={isH?my+off:my} textAnchor="middle" fontSize="6"
        fill={DIM_TEXT} fontFamily="monospace">{label}</text>
    </g>
  );
};

// ─── FLOOR B: LOWER LEVEL / BASEMENT ──────────────────────────────────────────
// Rooms: Mech 15'×13'6", Gym 19'4"×15'5", Storage 13'4"×8'6",
//        Sauna 8'5"×10'2", Laundry, Ele.Mech 11'10"×9'
// Layout: compact side building, ~22' wide × 80' tall on screen
export const FloorB = () => {
  const S = 9; // scale: 1ft = 9px
  const BW = 22*S; // building width = 198px
  // rooms stacked top to bottom
  const mechH = 14*S, gymH = 20*S, storH = 9*S, saunaH = 11*S, laundH = 6*S, elH = 10*S;
  const totalH = mechH + gymH + storH + saunaH + laundH + elH + 20;
  return (
    <svg viewBox={`0 0 ${BW+60} ${totalH+40}`} width="100%" style={{maxWidth:320,display:"block"}}>
      <defs>
        <pattern id="grid-b" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M 9 0 L 0 0 0 9" fill="none" stroke="#e8e4dc" strokeWidth="0.4"/>
        </pattern>
      </defs>
      <rect width={BW+60} height={totalH+40} fill="#f0ede8"/>
      <rect x="20" y="15" width={BW} height={totalH} fill="url(#grid-b)" stroke={WALL} strokeWidth={WALL_W+1}/>

      {/* MECH */}
      <Rm x={20} y={15} w={BW} h={mechH} label="MECH" sub='15′×13′6″'/>
      {/* GYM */}
      <Rm x={20} y={15+mechH} w={BW} h={gymH} label="GYM" sub='19′4″×15′5″'/>
      {/* STORAGE */}
      <Rm x={20} y={15+mechH+gymH} w={BW} h={storH} label="STORAGE" sub='13′4″×8′6″'/>
      {/* SAUNA */}
      <Rm x={20} y={15+mechH+gymH+storH} w={BW*0.5} h={saunaH} label="SAUNA" sub='8′5″×10′2″' fill="#f5f0eb"/>
      {/* LAUNDRY */}
      <Rm x={20+BW*0.5} y={15+mechH+gymH+storH} w={BW*0.5} h={saunaH} label="LAUNDRY" fill="#f5f0eb"/>
      {/* ELE. MECH */}
      <Rm x={20} y={15+mechH+gymH+storH+saunaH} w={BW} h={laundH+elH} label="ELE. MECH" sub='11′10″×9′'/>

      {/* Stairs on right side */}
      <Stair x={20+BW} y={15+mechH+gymH} w={32} h={storH+saunaH} steps={8} dir="v"/>

      {/* Floor label */}
      <rect x={20} y={totalH+18} width={BW} height={14} fill="#1a1a1a" rx="2"/>
      <text x={20+BW/2} y={totalH+28} textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1">LOWER LEVEL</text>
    </svg>
  );
};

// ─── FLOOR G: GARDEN FLOOR ────────────────────────────────────────────────────
// Garden 25'×29' (top), Great Room 22'×35'6" (ceil 11'8"), 22'4"×22' (middle),
// Garage 17'×30'10" (ceil 9'10"), Entry/Foyer 6'2"×8', Stairs
export const FloorG = () => {
  const S = 8.5;
  const BW = Math.round(22*S); // ~187px
  // Heights (ft → px)
  const gardenH = Math.round(29*S);
  const greatH   = Math.round(36*S);
  const midH     = Math.round(22*S);
  const garageH  = Math.round(31*S);
  const foyerH   = Math.round(8*S);
  const totalH = gardenH + greatH + midH + garageH + foyerH + 30;
  return (
    <svg viewBox={`0 0 ${BW+60} ${totalH+50}`} width="100%" style={{maxWidth:340,display:"block"}}>
      <defs>
        <pattern id="grid-g" width="8.5" height="8.5" patternUnits="userSpaceOnUse">
          <path d="M 8.5 0 L 0 0 0 8.5" fill="none" stroke="#e8e4dc" strokeWidth="0.4"/>
        </pattern>
        <pattern id="hatch-garden" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke={GREEN} strokeWidth="0.8" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width={BW+60} height={totalH+50} fill="#f0ede8"/>

      {/* GARDEN */}
      <rect x={20} y={15} width={BW} height={gardenH} fill="#d4e8c8" stroke={WALL} strokeWidth={WALL_W+1}/>
      <rect x={20} y={15} width={BW} height={gardenH} fill="url(#hatch-garden)" opacity="0.4"/>
      <text x={20+BW/2} y={15+gardenH/2-6} textAnchor="middle" fontSize="9" fontWeight="700"
        fill="#2d5a2d" fontFamily="'JetBrains Mono',monospace">GARDEN</text>
      <text x={20+BW/2} y={15+gardenH/2+8} textAnchor="middle" fontSize="7" fill="#2d5a2d"
        fontFamily="monospace">25′×29′</text>

      {/* GREAT ROOM */}
      <Rm x={20} y={15+gardenH} w={BW} h={greatH} label="GREAT ROOM" sub="22′×35′6″ · Ceil 11′8″" fill="#fafaf7"/>

      {/* 22'4" × 22' mid section */}
      <Rm x={20} y={15+gardenH+greatH} w={BW} h={midH} label="22′4″×22′" fill="#f8f6f2"/>

      {/* GARAGE */}
      <Rm x={20} y={15+gardenH+greatH+midH} w={Math.round(17*S)} h={garageH}
        label="2-CAR GARAGE" sub="17′×30′10″ · Ceil 9′10″" fill="#f0ece4"/>

      {/* ENTRY / FOYER beside garage bottom */}
      <Rm x={20} y={15+gardenH+greatH+midH+garageH} w={BW} h={foyerH}
        label="ENTRY / FOYER" sub="6′2″×8′" fill="#f5f1ec"/>

      {/* Stairs */}
      <Stair x={20} y={15+gardenH+greatH+midH-30} w={BW*0.4} h={30} steps={6} dir="h"/>

      {/* Floor label */}
      <rect x={20} y={totalH+18} width={BW} height={14} fill="#1a1a1a" rx="2"/>
      <text x={20+BW/2} y={totalH+28} textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1">GARDEN FLOOR</text>
    </svg>
  );
};

// ─── FLOOR 2: PARLOR / SECOND FLOOR ───────────────────────────────────────────
// Terrace 22'6"×28'4" (outdoor), Living Room 22'7"×18'9" (ceil 9'3"),
// Kitchen/Dining 22'7"×20'2" (ceil 10'1")
export const Floor2 = () => {
  const S = 9;
  const BW = Math.round(22*S); // 198
  const terrH = Math.round(28*S);
  const livH  = Math.round(19*S);
  const kitH  = Math.round(20*S);
  const totalH = terrH + livH + kitH + 30;
  return (
    <svg viewBox={`0 0 ${BW+60} ${totalH+50}`} width="100%" style={{maxWidth:340,display:"block"}}>
      <defs>
        <pattern id="grid-2" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M 9 0 L 0 0 0 9" fill="none" stroke="#e8e4dc" strokeWidth="0.4"/>
        </pattern>
        <pattern id="hatch-terr" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="10" x2="10" y2="0" stroke="#bbb" strokeWidth="0.7"/>
        </pattern>
      </defs>
      <rect width={BW+60} height={totalH+50} fill="#f0ede8"/>

      {/* TERRACE - outdoor hatch */}
      <rect x={20} y={15} width={BW} height={terrH} fill="#e8e4d8" stroke={WALL} strokeWidth={WALL_W+1}/>
      <rect x={20} y={15} width={BW} height={terrH} fill="url(#hatch-terr)" opacity="0.5"/>
      <text x={20+BW/2} y={15+terrH/2-6} textAnchor="middle" fontSize="9" fontWeight="700"
        fill="#5a5a4a" fontFamily="'JetBrains Mono',monospace">TERRACE</text>
      <text x={20+BW/2} y={15+terrH/2+8} textAnchor="middle" fontSize="7" fill="#5a5a4a"
        fontFamily="monospace">22′6″×28′4″</text>

      {/* LIVING ROOM */}
      <Rm x={20} y={15+terrH} w={BW} h={livH} label="LIVING ROOM" sub="22′7″×18′9″ · Ceil 9′3″" fill="#fafaf7"/>

      {/* Stairs in living room area */}
      <Stair x={20+BW*0.55} y={15+terrH+8} w={BW*0.35} h={livH-16} steps={9} dir="v"/>

      {/* KITCHEN / DINING */}
      <Rm x={20} y={15+terrH+livH} w={BW} h={kitH} label="KITCHEN / DINING" sub="22′7″×20′2″ · Ceil 10′1″" fill="#fafaf5"/>

      {/* Floor label */}
      <rect x={20} y={totalH+18} width={BW} height={14} fill="#1a1a1a" rx="2"/>
      <text x={20+BW/2} y={totalH+28} textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1">PARLOR / 2ND FLOOR</text>
    </svg>
  );
};

// ─── FLOOR 3: THIRD FLOOR ─────────────────────────────────────────────────────
// Master Bedroom 13'11"×13'8" (ceil 13'1"), WIC 7'10"×7'4",
// Sitting Room 14'7"×10'2" (ceil 13'9"), WIC 8'5"×4'5",
// Bedroom 10'11"×15'3", Bedroom 11'7"×15'3"
export const Floor3 = () => {
  const S = 9;
  const BW = Math.round(22*S); // 198
  // Upper section: Master + WIC side by side
  const masterW = Math.round(15*S), masterH = Math.round(14*S);
  const wicW = BW - masterW, wicH = masterH;
  // Sitting + WIC2
  const sitH = Math.round(11*S);
  // Lower: two bedrooms side by side
  const bedH = Math.round(16*S);
  const bed1W = Math.round(11*S), bed2W = BW - bed1W;

  const totalH = masterH + sitH + bedH + 30;
  return (
    <svg viewBox={`0 0 ${BW+60} ${totalH+50}`} width="100%" style={{maxWidth:340,display:"block"}}>
      <defs>
        <pattern id="grid-3" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M 9 0 L 0 0 0 9" fill="none" stroke="#e8e4dc" strokeWidth="0.4"/>
        </pattern>
      </defs>
      <rect width={BW+60} height={totalH+50} fill="#f0ede8"/>
      <rect x={20} y={15} width={BW} height={totalH} fill="url(#grid-3)" stroke={WALL} strokeWidth={WALL_W+1}/>

      {/* MASTER BEDROOM */}
      <Rm x={20} y={15} w={masterW} h={masterH} label="MASTER BED" sub="13′11″×13′8″ · Ceil 13′1″" fill="#faf8f5"/>
      {/* WIC */}
      <Rm x={20+masterW} y={15} w={wicW} h={wicH} label="WIC" sub="7′10″×7′4″" fill="#f2efe8"/>

      {/* Stairs */}
      <Stair x={20+masterW} y={15+wicH} w={wicW} h={sitH*0.6} steps={7} dir="v"/>

      {/* SITTING ROOM */}
      <Rm x={20} y={15+masterH} w={masterW} h={sitH} label="SITTING ROOM" sub="14′7″×10′2″ · Ceil 13′9″" fill="#faf8f5"/>
      {/* WIC 2 beside sitting */}
      <Rm x={20+masterW} y={15+masterH+sitH*0.6} w={wicW} h={sitH*0.4} label="WIC" sub="8′5″×4′5″" fill="#f2efe8"/>

      {/* BEDROOM 1 */}
      <Rm x={20} y={15+masterH+sitH} w={bed1W} h={bedH} label="BEDROOM" sub="10′11″×15′3″" fill="#fafaf7"/>
      {/* BEDROOM 2 */}
      <Rm x={20+bed1W} y={15+masterH+sitH} w={bed2W} h={bedH} label="BEDROOM" sub="11′7″×15′3″" fill="#fafaf7"/>

      {/* Floor label */}
      <rect x={20} y={totalH+18} width={BW} height={14} fill="#1a1a1a" rx="2"/>
      <text x={20+BW/2} y={totalH+28} textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1">THIRD FLOOR</text>
    </svg>
  );
};

// ─── FLOOR R: ROOF ────────────────────────────────────────────────────────────
// Roof Terrace 24'1"×36'9"
export const FloorR = () => {
  const S = 9;
  const terrW = Math.round(25*S), terrH = Math.round(37*S);
  const mechW = Math.round(8*S), mechH = Math.round(6*S);
  const totalW = terrW + mechW + 20;
  const totalH = terrH + 30;
  return (
    <svg viewBox={`0 0 ${totalW+40} ${totalH+50}`} width="100%" style={{maxWidth:380,display:"block"}}>
      <defs>
        <pattern id="hatch-roof" width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="12" x2="12" y2="0" stroke="#aaa" strokeWidth="0.8"/>
          <line x1="0" y1="6" x2="6" y2="0" stroke="#aaa" strokeWidth="0.5"/>
        </pattern>
        <pattern id="hatch-green" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke={GREEN} strokeWidth="0.9" opacity="0.6"/>
        </pattern>
      </defs>
      <rect width={totalW+40} height={totalH+50} fill="#f0ede8"/>

      {/* ROOF TERRACE - main area */}
      <rect x={20} y={15} width={terrW} height={terrH} fill="#e2ddd4" stroke={WALL} strokeWidth={WALL_W+1}/>
      <rect x={20} y={15} width={terrW} height={terrH} fill="url(#hatch-roof)" opacity="0.45"/>

      {/* Green strip top-right of terrace */}
      <rect x={20+terrW-30} y={15} width={30} height={60} fill="url(#hatch-green)" stroke="none" opacity="0.6"/>

      <text x={20+terrW/2} y={15+terrH/2-8} textAnchor="middle" fontSize="10" fontWeight="700"
        fill="#4a4a3a" fontFamily="'JetBrains Mono',monospace">ROOF TERRACE</text>
      <text x={20+terrW/2} y={15+terrH/2+8} textAnchor="middle" fontSize="7.5" fill="#4a4a3a"
        fontFamily="monospace">24′1″×36′9″</text>

      {/* MECH box */}
      <Rm x={20+terrW+10} y={15} w={mechW} h={mechH} label="MECH" fill="#e8e4dc"/>

      {/* Floor label */}
      <rect x={20} y={totalH+18} width={terrW} height={14} fill="#1a1a1a" rx="2"/>
      <text x={20+terrW/2} y={totalH+28} textAnchor="middle" fontSize="7.5" fill="white"
        fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1">ROOF</text>
    </svg>
  );
};

// ─── MASTER COMPONENT — floor switcher with all plans ─────────────────────────
import { useState } from "react";

export default function FloorPlans196Houston() {
  const [active, setActive] = useState("G");
  const floors = {
    B: { label: "Lower Level", component: <FloorB /> },
    G: { label: "Garden Floor", component: <FloorG /> },
    "2": { label: "2nd / Parlor", component: <Floor2 /> },
    "3": { label: "3rd Floor", component: <Floor3 /> },
    R:  { label: "Roof", component: <FloorR /> },
  };

  return (
    <div style={{
      fontFamily:"'JetBrains Mono','Courier New',monospace",
      background:"#f0ede8", minHeight:"100vh", padding:"24px 20px",
    }}>
      {/* Header */}
      <div style={{textAlign:"center", marginBottom:24}}>
        <div style={{fontSize:10, letterSpacing:"0.3em", color:"#888", marginBottom:4}}>
          196 WEST HOUSTON STREET · WEST VILLAGE · NEW YORK
        </div>
        <div style={{fontSize:18, fontWeight:900, color:"#1a1a1a", letterSpacing:"0.04em"}}>
          FLOOR PLAN DRAWINGS
        </div>
        <div style={{fontSize:8, color:"#aaa", marginTop:4, letterSpacing:"0.15em"}}>
          7,200 SF · 5 LEVELS · HAND-DRAWN VECTOR PLANS
        </div>
      </div>

      {/* Floor tabs */}
      <div style={{display:"flex", gap:6, justifyContent:"center", marginBottom:24, flexWrap:"wrap"}}>
        {Object.entries(floors).map(([k,v]) => (
          <button key={k} onClick={() => setActive(k)} style={{
            padding:"8px 16px", fontSize:9, fontFamily:"inherit", fontWeight:700,
            background: active===k ? "#1a1a1a" : "#e8e4dc",
            color: active===k ? "#fff" : "#444",
            border: active===k ? "2px solid #1a1a1a" : "2px solid #ccc",
            borderRadius:4, cursor:"pointer", letterSpacing:"0.1em",
            transition:"all 0.15s",
          }}>
            {k} · {v.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Floor plan display */}
      <div style={{
        maxWidth:500, margin:"0 auto",
        background:"white",
        border:"1.5px solid #ccc",
        borderRadius:6,
        padding:"24px 20px",
        boxShadow:"0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Floor title */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          marginBottom:16, paddingBottom:12, borderBottom:"1px solid #e8e4dc",
        }}>
          <div>
            <div style={{fontSize:12, fontWeight:700, color:"#1a1a1a"}}>
              LEVEL {active} — {floors[active].label.toUpperCase()}
            </div>
            <div style={{fontSize:8, color:"#888", marginTop:2}}>
              196 W Houston St · Scale approx. 1ft = 9px
            </div>
          </div>
          <div style={{fontSize:8, color:"#bbb", textAlign:"right"}}>
            <div style={{display:"flex", gap:12}}>
              {[["#fafaf7","Living"],["#e8e4d8","Outdoor"],["#d4e8c8","Garden"],["#f0ece4","Garage"]].map(([c,l])=>(
                <div key={l} style={{display:"flex", alignItems:"center", gap:4}}>
                  <div style={{width:10,height:10,background:c,border:"1px solid #ccc",borderRadius:1}}/>
                  <span style={{fontSize:6,color:"#888"}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SVG floor plan */}
        <div style={{display:"flex", justifyContent:"center"}}>
          {floors[active].component}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        maxWidth:500, margin:"16px auto 0",
        display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8,
      }}>
        {[
          ["━━", "#1a1a1a", "Exterior Wall"],
          ["─ ─", "#999", "Interior Wall"],
          ["⌒⌒", "#666", "Door Arc"],
          ["▣", "#e8e4dc", "Staircase"],
          ["░░", "#aaa", "Hatch = Outdoor"],
          ["⊞", "#d4e8c8", "Garden/Green"],
        ].map(([sym,c,l]) => (
          <div key={l} style={{
            padding:"6px 8px", background:"white", borderRadius:4,
            border:"1px solid #e0ddd8", fontSize:7, color:"#666",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <span style={{fontSize:10, color:c}}>{sym}</span>
            <span style={{letterSpacing:"0.08em"}}>{l}</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{textAlign:"center", marginTop:20, fontSize:7, color:"#aaa", letterSpacing:"0.12em"}}>
        VECTOR FLOOR PLANS · REDRAWN FROM ORIGINAL BLUEPRINTS · FOR DEVICE PLANNING ONLY
      </div>
    </div>
  );
}
