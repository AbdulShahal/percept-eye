export function OrchestrationViz() {
  // Layout in viewBox 320×590
  // Scout (top center)     cx=160 cy=82
  // Mission Control (mid)  cx=148 cy=296   — larger, hub node
  // Compass (right)        cx=272 cy=296
  // Ranger (bottom center) cx=160 cy=482

  const G = "#3C8262";
  const G2 = "#52a67d";
  const DARK = "#070e0a";
  const DIM = "#0d1810";

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: DARK, fontFamily: "var(--font-family)" }}
    >
      <svg
        viewBox="0 0 320 590"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial glow filters */}
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-md" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-lg" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Connection path definitions (for animateMotion) */}
          <path id="p-scout-mc"  d="M 160 128 L 148 234" />
          <path id="p-mc-compass" d="M 210 296 L 232 296" />
          <path id="p-mc-ranger" d="M 148 358 L 160 436" />
          <path id="p-compass-mc" d="M 232 296 L 210 296" />
          <path id="p-ranger-mc"  d="M 160 436 L 148 358" />

          <style>{`
            @keyframes float-a {
              0%,100% { transform: translateY(0px); }
              50%      { transform: translateY(-5px); }
            }
            @keyframes float-b {
              0%,100% { transform: translateY(-3px); }
              50%      { transform: translateY(3px); }
            }
            @keyframes float-c {
              0%,100% { transform: translateY(-2px); }
              50%      { transform: translateY(4px); }
            }
            @keyframes ring-pulse {
              0%,100% { opacity: 0.5; r: 52; }
              50%      { opacity: 0.15; r: 58; }
            }
            @keyframes ring-pulse-lg {
              0%,100% { opacity: 0.5; r: 70; }
              50%      { opacity: 0.12; r: 78; }
            }
            @keyframes ring-pulse-sm {
              0%,100% { opacity: 0.45; r: 44; }
              50%      { opacity: 0.12; r: 50; }
            }
            @keyframes mc-core {
              0%,100% { r: 20; opacity: 0.9; }
              50%      { r: 24; opacity: 0.6; }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
            @keyframes spin-rev {
              from { transform: rotate(0deg); }
              to   { transform: rotate(-360deg); }
            }
            @keyframes scan-line {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes dot-fade {
              0%   { opacity: 0; }
              20%  { opacity: 1; }
              80%  { opacity: 1; }
              100% { opacity: 0; }
            }

            .node-scout   { animation: float-a 4s ease-in-out infinite; transform-origin: 160px 82px; }
            .node-mc      { animation: float-b 5s ease-in-out infinite; transform-origin: 148px 296px; }
            .node-compass { animation: float-c 4.5s ease-in-out infinite; transform-origin: 272px 296px; }
            .node-ranger  { animation: float-a 4.2s ease-in-out infinite 0.8s; transform-origin: 160px 482px; }
          `}</style>
        </defs>

        {/* ── Background ambient glow ── */}
        <ellipse cx="160" cy="296" rx="130" ry="200" fill={G} opacity="0.03" />

        {/* ══════════════════════════════════
            CONNECTION LINES
        ══════════════════════════════════ */}

        {/* Scout → Mission Control */}
        <line x1="160" y1="128" x2="148" y2="234"
          stroke={G} strokeWidth="1" strokeOpacity="0.25"
          strokeDasharray="4 5" />
        {/* traveling dots down */}
        {[0, 0.35, 0.7].map((offset, i) => (
          <circle key={`s-mc-${i}`} r="2.5" fill={G} filter="url(#glow-sm)">
            <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${offset * 1.8}s`}>
              <mpath href="#p-scout-mc" />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite" begin={`${offset * 1.8}s`} />
          </circle>
        ))}

        {/* Mission Control → Compass */}
        <line x1="210" y1="296" x2="232" y2="296"
          stroke={G} strokeWidth="1" strokeOpacity="0.25"
          strokeDasharray="4 5" />
        {[0, 0.4].map((offset, i) => (
          <circle key={`mc-c-${i}`} r="2.5" fill={G} filter="url(#glow-sm)">
            <animateMotion dur="1.4s" repeatCount="indefinite" begin={`${offset * 1.4}s`}>
              <mpath href="#p-mc-compass" />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" repeatCount="indefinite" begin={`${offset * 1.4}s`} />
          </circle>
        ))}
        {/* return signal Compass → MC */}
        {[0, 0.5].map((offset, i) => (
          <circle key={`c-mc-${i}`} r="1.5" fill={G2} opacity="0.5">
            <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${offset * 2.2 + 0.7}s`}>
              <mpath href="#p-compass-mc" />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.5;0.5;0" dur="2.2s" repeatCount="indefinite" begin={`${offset * 2.2 + 0.7}s`} />
          </circle>
        ))}

        {/* Mission Control → Ranger */}
        <line x1="148" y1="358" x2="160" y2="436"
          stroke={G} strokeWidth="1" strokeOpacity="0.25"
          strokeDasharray="4 5" />
        {[0, 0.38, 0.76].map((offset, i) => (
          <circle key={`mc-r-${i}`} r="2.5" fill={G} filter="url(#glow-sm)">
            <animateMotion dur="1.9s" repeatCount="indefinite" begin={`${offset * 1.9}s`}>
              <mpath href="#p-mc-ranger" />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="1.9s" repeatCount="indefinite" begin={`${offset * 1.9}s`} />
          </circle>
        ))}

        {/* junction dots at connection points */}
        <circle cx="160" cy="128" r="3" fill={G} opacity="0.5" filter="url(#glow-sm)" />
        <circle cx="148" cy="234" r="3" fill={G} opacity="0.5" filter="url(#glow-sm)" />
        <circle cx="210" cy="296" r="3" fill={G} opacity="0.5" filter="url(#glow-sm)" />
        <circle cx="232" cy="296" r="3" fill={G} opacity="0.5" filter="url(#glow-sm)" />
        <circle cx="148" cy="358" r="3" fill={G} opacity="0.5" filter="url(#glow-sm)" />
        <circle cx="160" cy="436" r="3" fill={G} opacity="0.5" filter="url(#glow-sm)" />

        {/* ══════════════════════════════════
            SCOUT NODE  (top center)
        ══════════════════════════════════ */}
        <g className="node-scout">
          {/* outer pulse ring */}
          <circle cx="160" cy="82" fill="none" stroke={G} strokeWidth="0.75" opacity="0.5">
            <animate attributeName="r" values="52;58;52" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.12;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* platform disc glow */}
          <circle cx="160" cy="82" r="46" fill={G} opacity="0.06" filter="url(#glow-md)" />
          {/* segmented dashed ring */}
          <circle cx="160" cy="82" r="46" fill="none" stroke={G} strokeWidth="0.8"
            strokeOpacity="0.4" strokeDasharray="6 4" />
          {/* inner platform */}
          <circle cx="160" cy="82" r="38" fill={DIM} stroke={G} strokeWidth="1" strokeOpacity="0.6" />
          {/* platform grid lines */}
          <circle cx="160" cy="82" r="26" fill="none" stroke={G} strokeWidth="0.5" strokeOpacity="0.25" />
          <circle cx="160" cy="82" r="14" fill="none" stroke={G} strokeWidth="0.5" strokeOpacity="0.2" />
          {/* DRONE ICON — body + 4 rotors */}
          {/* center body */}
          <circle cx="160" cy="82" r="6" fill={G} opacity="0.9" filter="url(#glow-sm)" />
          <circle cx="160" cy="82" r="4" fill={DARK} />
          <circle cx="160" cy="82" r="2" fill={G} opacity="0.8" />
          {/* arms */}
          <line x1="160" y1="82" x2="148" y2="70" stroke={G} strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="160" y1="82" x2="172" y2="70" stroke={G} strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="160" y1="82" x2="148" y2="94" stroke={G} strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="160" y1="82" x2="172" y2="94" stroke={G} strokeWidth="1.2" strokeOpacity="0.7" />
          {/* rotors */}
          {[[-12,-12],[ 12,-12],[-12, 12],[ 12, 12]].map(([dx,dy],i) => (
            <g key={i}>
              <circle cx={160+dx} cy={82+dy} r="5.5" fill="none" stroke={G} strokeWidth="1" strokeOpacity="0.55" />
              <circle cx={160+dx} cy={82+dy} r="1.5" fill={G} opacity="0.7" />
            </g>
          ))}
        </g>
        {/* Scout label */}
        <text x="160" y="140" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="var(--font-family)" opacity="0.9">Scout</text>
        <text x="160" y="153" textAnchor="middle" fill={G} fontSize="9" fontFamily="var(--font-family)" opacity="0.65">Product Discovery</text>

        {/* ══════════════════════════════════
            MISSION CONTROL NODE  (center)
        ══════════════════════════════════ */}
        <g className="node-mc">
          {/* outer pulse rings — double */}
          <circle cx="148" cy="296" fill="none" stroke={G} strokeWidth="0.75">
            <animate attributeName="r" values="70;80;70" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.08;0.4" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="148" cy="296" fill="none" stroke={G} strokeWidth="0.5">
            <animate attributeName="r" values="62;70;62" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          {/* platform glow */}
          <circle cx="148" cy="296" r="60" fill={G} opacity="0.1" filter="url(#glow-lg)" />
          {/* segmented ring */}
          <circle cx="148" cy="296" r="60" fill="none" stroke={G} strokeWidth="0.8"
            strokeOpacity="0.5" strokeDasharray="8 5" />
          {/* inner platform */}
          <circle cx="148" cy="296" r="52" fill={DIM} stroke={G} strokeWidth="1.5" strokeOpacity="0.7" />
          {/* spinning outer detail ring */}
          <g style={{ transformOrigin: "148px 296px", animation: "spin-slow 12s linear infinite" }}>
            <circle cx="148" cy="296" r="44" fill="none" stroke={G} strokeWidth="0.6"
              strokeOpacity="0.3" strokeDasharray="3 6" />
          </g>
          {/* counter-spin inner ring */}
          <g style={{ transformOrigin: "148px 296px", animation: "spin-rev 8s linear infinite" }}>
            <circle cx="148" cy="296" r="34" fill="none" stroke={G} strokeWidth="0.6"
              strokeOpacity="0.25" strokeDasharray="4 8" />
          </g>
          {/* CROSSHAIR — targeting reticle */}
          <circle cx="148" cy="296" r="22" fill="none" stroke={G} strokeWidth="1.5" strokeOpacity="0.8" />
          {/* crosshair lines */}
          <line x1="148" y1="270" x2="148" y2="279" stroke={G} strokeWidth="1.5" strokeOpacity="0.9" />
          <line x1="148" y1="313" x2="148" y2="322" stroke={G} strokeWidth="1.5" strokeOpacity="0.9" />
          <line x1="122" y1="296" x2="131" y2="296" stroke={G} strokeWidth="1.5" strokeOpacity="0.9" />
          <line x1="165" y1="296" x2="174" y2="296" stroke={G} strokeWidth="1.5" strokeOpacity="0.9" />
          {/* inner circle */}
          <circle cx="148" cy="296" r="10" fill="none" stroke={G} strokeWidth="1" strokeOpacity="0.7" />
          {/* pulsing core */}
          <circle cx="148" cy="296" fill={G} filter="url(#glow-md)">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="148" cy="296" r="3" fill={DARK} />
          <circle cx="148" cy="296" r="1.5" fill={G} />
        </g>
        {/* MC label */}
        <text x="148" y="368" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="var(--font-family)" opacity="0.9">Mission Control</text>
        <text x="148" y="381" textAnchor="middle" fill={G} fontSize="9" fontFamily="var(--font-family)" opacity="0.65">Orchestrating</text>

        {/* ══════════════════════════════════
            COMPASS NODE  (right)
        ══════════════════════════════════ */}
        <g className="node-compass">
          {/* outer pulse ring */}
          <circle cx="272" cy="296" fill="none" stroke={G} strokeWidth="0.75">
            <animate attributeName="r" values="44;50;44" dur="4s" repeatCount="indefinite" begin="1s" />
            <animate attributeName="opacity" values="0.45;0.1;0.45" dur="4s" repeatCount="indefinite" begin="1s" />
          </circle>
          {/* platform glow */}
          <circle cx="272" cy="296" r="40" fill={G} opacity="0.07" filter="url(#glow-md)" />
          {/* segmented ring */}
          <circle cx="272" cy="296" r="40" fill="none" stroke={G} strokeWidth="0.8"
            strokeOpacity="0.4" strokeDasharray="5 4" />
          {/* inner platform */}
          <circle cx="272" cy="296" r="33" fill={DIM} stroke={G} strokeWidth="1" strokeOpacity="0.55" />
          <circle cx="272" cy="296" r="22" fill="none" stroke={G} strokeWidth="0.5" strokeOpacity="0.2" />
          {/* COMPASS ROSE */}
          {/* outer circle */}
          <circle cx="272" cy="296" r="18" fill="none" stroke={G} strokeWidth="1" strokeOpacity="0.7" />
          {/* 4 main points */}
          {[[0,-16],[16,0],[0,16],[-16,0]].map(([dx,dy],i) => (
            <polygon key={i}
              points={`${272+dx},${296+dy} ${272+dx*0.35-dy*0.18},${296+dy*0.35+dx*0.18} ${272+dx*0.35+dy*0.18},${296+dy*0.35-dx*0.18}`}
              fill={G} opacity={i === 0 ? 0.95 : 0.7} />
          ))}
          {/* 4 minor points */}
          {[[-11,-11],[11,-11],[11,11],[-11,11]].map(([dx,dy],i) => (
            <polygon key={i}
              points={`${272+dx},${296+dy} ${272+dx*0.4-dy*0.15},${296+dy*0.4+dx*0.15} ${272+dx*0.4+dy*0.15},${296+dy*0.4-dx*0.15}`}
              fill={G} opacity="0.45" />
          ))}
          {/* center */}
          <circle cx="272" cy="296" r="3.5" fill={G} filter="url(#glow-sm)" opacity="0.9" />
          <circle cx="272" cy="296" r="1.5" fill={DARK} />
        </g>
        {/* Compass label */}
        <text x="272" y="347" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="var(--font-family)" opacity="0.9">Compass</text>
        <text x="272" y="360" textAnchor="middle" fill={G} fontSize="9" fontFamily="var(--font-family)" opacity="0.65">Learning Design</text>

        {/* ══════════════════════════════════
            RANGER NODE  (bottom center)
        ══════════════════════════════════ */}
        <g className="node-ranger">
          {/* outer pulse ring */}
          <circle cx="160" cy="482" fill="none" stroke={G} strokeWidth="0.75">
            <animate attributeName="r" values="52;58;52" dur="3.8s" repeatCount="indefinite" begin="1.5s" />
            <animate attributeName="opacity" values="0.5;0.12;0.5" dur="3.8s" repeatCount="indefinite" begin="1.5s" />
          </circle>
          {/* platform glow */}
          <circle cx="160" cy="482" r="46" fill={G} opacity="0.06" filter="url(#glow-md)" />
          {/* segmented ring */}
          <circle cx="160" cy="482" r="46" fill="none" stroke={G} strokeWidth="0.8"
            strokeOpacity="0.4" strokeDasharray="6 4" />
          {/* inner platform */}
          <circle cx="160" cy="482" r="38" fill={DIM} stroke={G} strokeWidth="1" strokeOpacity="0.6" />
          <circle cx="160" cy="482" r="26" fill="none" stroke={G} strokeWidth="0.5" strokeOpacity="0.2" />
          {/* TANK / RANGER ICON */}
          {/* tracks (ovals left+right) */}
          <rect x="142" y="478" width="10" height="16" rx="5" fill="none" stroke={G} strokeWidth="1" strokeOpacity="0.6" />
          <rect x="168" y="478" width="10" height="16" rx="5" fill="none" stroke={G} strokeWidth="1" strokeOpacity="0.6" />
          {/* body */}
          <rect x="147" y="479" width="26" height="13" rx="2.5" fill={G} opacity="0.5" />
          <rect x="147" y="479" width="26" height="13" rx="2.5" fill="none" stroke={G} strokeWidth="1" strokeOpacity="0.8" />
          {/* turret */}
          <rect x="153" y="470" width="14" height="10" rx="3" fill={G} opacity="0.7" />
          {/* barrel */}
          <line x1="160" y1="470" x2="160" y2="462" stroke={G} strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
          {/* center glow */}
          <circle cx="160" cy="482" r="3.5" fill={G} opacity="0.7" filter="url(#glow-sm)" />
        </g>
        {/* Ranger label */}
        <text x="160" y="540" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="var(--font-family)" opacity="0.9">Ranger</text>
        <text x="160" y="553" textAnchor="middle" fill={G} fontSize="9" fontFamily="var(--font-family)" opacity="0.65">Model Training</text>

      </svg>
    </div>
  );
}
