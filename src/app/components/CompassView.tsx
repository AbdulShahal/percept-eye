import { useState, useEffect } from "react";
import { ChevronRight, RefreshCw, CheckCircle2, XCircle, Clock, Send, Zap } from "lucide-react";
import compassLogoDark from "../../imports/logo-2.png";
import compassLogoLight from "../../imports/logo-2-light.png";
import { useTheme } from "./ThemeProvider";

type TabId = string;
interface Props { navigateTo: (tab: TabId) => void; }

const rewardRules = [
  { endpoint:"POST /issues",     rule:"Verifier accepts JIRA-format payload",   weight:0.30, status:"pass",    verifierNote:"Schema matches expected shape." },
  { endpoint:"GET /search",      rule:"Response completeness ≥ 80%",             weight:0.25, status:"fail",    verifierNote:"Verifier disagrees — result set truncated at 50 items, expected full page." },
  { endpoint:"PUT /issues/{id}", rule:"Idempotency invariant holds",             weight:0.20, status:"pass",    verifierNote:"Duplicate calls return same payload." },
  { endpoint:"GET /myself",      rule:"Auth token scoped correctly",             weight:0.15, status:"working", verifierNote:"Running scope-check verifier…" },
  { endpoint:"POST /bulk",       rule:"Batch size ≤ 100 items",                  weight:0.10, status:"pending", verifierNote:"Awaiting Scout schema confirmation." },
];

const verifiers = [
  { name:"schema-check",       desc:"Validates payload shape against OpenAPI spec",    cases:12, passed:11, status:"fail",    lastRun:"06:54" },
  { name:"format-check",       desc:"Ensures request/response field types are correct", cases:8,  passed:8,  status:"pass",    lastRun:"06:53" },
  { name:"idempotency-check",  desc:"Confirms PUT operations are safe to repeat",       cases:6,  passed:6,  status:"pass",    lastRun:"06:52" },
  { name:"scope-check",        desc:"Validates OAuth token scopes are correctly set",   cases:4,  passed:0,  status:"working", lastRun:"running" },
  { name:"pagination-check",   desc:"Verifies pagination parameters work correctly",    cases:5,  passed:0,  status:"pending", lastRun:"—" },
];

const schemaNodes = [
  { id:"Issues",    x:55,  y:30,  status:"pass" },
  { id:"Search",    x:195, y:30,  status:"fail" },
  { id:"Users",     x:125, y:110, status:"pass" },
  { id:"Projects",  x:35,  y:155, status:"pass" },
  { id:"Sprints",   x:215, y:155, status:"pending" },
  { id:"Boards",    x:125, y:200, status:"pass" },
];

const schemaEdges = [
  ["Issues","Users"],["Issues","Projects"],["Search","Issues"],
  ["Projects","Boards"],["Boards","Sprints"],["Users","Projects"],
];

const revisions = [
  { iter:3, change:"Tightened search completeness threshold 60% → 80%", ts:"06:54", status:"fail" },
  { iter:2, change:"Added idempotency rule for PUT /issues/{id}",        ts:"06:51", status:"pass" },
  { iter:1, change:"Initial rubric from Scout schema handoff",           ts:"06:48", status:"pass" },
];

const statusColor = { pass:"var(--primary)", fail:"#ef4444", working:"#f59e0b", pending:"var(--muted-foreground)" };

const StatusIcon = ({ status }: { status: string }) => {
  if (status==="pass")    return <CheckCircle2 size={14} style={{ color:statusColor.pass }} />;
  if (status==="fail")    return <XCircle size={14} style={{ color:statusColor.fail }} />;
  if (status==="working") return <RefreshCw size={13} className="animate-spin" style={{ color:statusColor.working }} />;
  return <Clock size={13} style={{ color:statusColor.pending, opacity:0.4 }} />;
};

// ── Schema Map SVG ───────────────────────────────────────────────
function SchemaMap() {
  const nc = { pass:"var(--primary)", fail:"#ef4444", working:"#f59e0b", pending:"var(--muted-foreground)" };
  const nodePos: Record<string, {x:number;y:number}> = {};
  schemaNodes.forEach(n => { nodePos[n.id] = {x:n.x+36,y:n.y+14}; });
  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ color:"var(--muted-foreground)" }}>
        JIRA API entity graph — nodes coloured by verifier status.
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#070e0a", border:"1px solid rgba(60,130,98,0.2)", height:260 }}>
        <svg viewBox="0 0 280 240" className="w-full h-full">
          <defs>
            <filter id="node-glow"><feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          {schemaEdges.map(([a,b],i)=>{
            const p1=nodePos[a], p2=nodePos[b];
            if(!p1||!p2) return null;
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3C8262" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />;
          })}
          {schemaNodes.map(n=>(
            <g key={n.id} filter="url(#node-glow)">
              <rect x={n.x} y={n.y} width={72} height={28} rx={6}
                fill="#0d1810" stroke={nc[n.status as keyof typeof nc]} strokeWidth="1" />
              <text x={n.x+36} y={n.y+18} textAnchor="middle" fontSize={10} fontWeight={500}
                fill={nc[n.status as keyof typeof nc]} fontFamily="var(--font-family)">{n.id}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center gap-4 text-xs" style={{ color:"var(--muted-foreground)" }}>
        {Object.entries({ pass:"Verified", fail:"Failing", working:"Checking", pending:"Pending" }).map(([k,v])=>(
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background:nc[k as keyof typeof nc] }} />
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export function CompassView({ navigateTo }: Props) {
  const [elapsed, setElapsed] = useState(55);
  const [activeTab, setActiveTab] = useState("Rubric");
  const [activeRule, setActiveRule] = useState(1);
  const [redesignState, setRedesignState] = useState<"idle"|"sending"|"sent">("idle");
  const { theme } = useTheme();
  const compassLogo = theme === "light" ? compassLogoLight : compassLogoDark;

  useEffect(() => {
    const id = setInterval(()=>setElapsed(e=>e+1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => `${Math.floor(s/60)}m ${s%60}s`;
  const failCount = rewardRules.filter(r=>r.status==="fail").length;
  const passCount = rewardRules.filter(r=>r.status==="pass").length;
  const tabs = ["Rubric","Verifiers","Schema Map","History"];

  const handleRedesign = () => {
    setRedesignState("sending");
    setTimeout(()=>setRedesignState("sent"), 1600);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b px-8 py-3 flex items-center justify-between"
        style={{ background:"var(--background)EE", backdropFilter:"blur(12px)", borderColor:"var(--border)" }}>
        <div className="text-xs flex items-center gap-1.5" style={{ color:"var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color:"var(--foreground)" }}>Compass</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ background:"rgba(245,158,11,0.12)", color:"#f59e0b" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow inline-block" style={{ background:"#f59e0b" }} />
            {failCount} verifier disagreement{failCount!==1?"s":""}
          </div>
          <button onClick={handleRedesign} disabled={redesignState!=="idle"}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
            style={{ background:"var(--primary)", color:"#fff" }}>
            Redesign reward
          </button>
        </div>
      </div>

      {/* Compass header */}
      <div className="px-8 py-6 border-b" style={{ borderColor:"var(--border)" }}>
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <img src={compassLogo} alt="Compass" className="w-11 h-11 object-contain" draggable={false} key={compassLogo} />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"var(--muted-foreground)" }}>Reward Design &amp; Alignment</div>
            <h2 className="text-4xl font-semibold mb-1.5" style={{ color:"var(--foreground)" }}>Compass</h2>
            <p className="text-base italic" style={{ color:"var(--muted-foreground)" }}>
              "Redesigning reward rubric for GET /search — verifier disagrees on result completeness."
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8 mt-5">
          {[{ label:"STATUS", value:"RUNNING", color:"#f59e0b" },
            { label:"ELAPSED", value:fmt(elapsed), color:"var(--foreground)" },
            { label:"ITERATION", value:"3 / 5", color:"var(--foreground)" },
            { label:"PASS", value:String(passCount), color:"var(--primary)" },
            { label:"FAIL", value:String(failCount), color:"#ef4444" }
          ].map(({label,value,color})=>(
            <div key={label}>
              <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color:"var(--muted-foreground)" }}>{label}</div>
              <div className="text-sm font-semibold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-4">
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ background:activeTab===tab?"var(--card)":"transparent",
                color:activeTab===tab?"var(--foreground)":"var(--muted-foreground)",
                border:activeTab===tab?"1px solid var(--border)":"1px solid transparent" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Rubric tab ── */}
      {activeTab==="Rubric" && (
        <div className="flex-1 grid grid-cols-3" style={{ borderTop:"1px solid var(--border)" }}>
          {/* Left: rules */}
          <div className="p-6 space-y-3 border-r overflow-y-auto" style={{ borderColor:"var(--border)" }}>
            <div className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color:"var(--muted-foreground)" }}>Reward Rules</div>
            {rewardRules.map((rule,i)=>(
              <button key={i} onClick={()=>setActiveRule(i)}
                className="w-full text-left rounded-xl p-4 space-y-2 transition-all duration-200 hover:scale-[1.01]"
                style={{ background:activeRule===i?"rgba(60,130,98,0.07)":"var(--card)",
                  border:`1px solid ${activeRule===i?"var(--primary)":"var(--border)"}` }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background:"var(--card-elevated)", color:"var(--muted-foreground)" }}>
                    {rule.endpoint}
                  </span>
                  <StatusIcon status={rule.status} />
                </div>
                <div className="text-xs font-medium" style={{ color:"var(--foreground)" }}>{rule.rule}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color:"var(--muted-foreground)" }}>weight</span>
                  <div className="flex items-center gap-2 flex-1 mx-3">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background:"var(--card-elevated)" }}>
                      <div className="h-full rounded-full" style={{ width:`${rule.weight*100}%`,
                        background:rule.status==="fail"?"#ef4444":"var(--primary)", opacity:rule.status==="pending"?0.3:1 }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-medium" style={{ color:"var(--muted-foreground)" }}>{(rule.weight*100).toFixed(0)}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Center: verifier feedback */}
          <div className="p-6 space-y-5 border-r overflow-y-auto" style={{ borderColor:"var(--border)" }}>
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color:"var(--muted-foreground)" }}>Verifier Feedback</div>
            {(()=>{
              const rule = rewardRules[activeRule];
              return (
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ background:rule.status==="fail"?"rgba(239,68,68,0.07)":"rgba(60,130,98,0.07)",
                    border:`1px solid ${rule.status==="fail"?"rgba(239,68,68,0.3)":"var(--primary)"}` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon status={rule.status} />
                      <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color:statusColor[rule.status as keyof typeof statusColor] }}>{rule.status}</span>
                      <span className="text-xs font-mono ml-auto" style={{ color:"var(--muted-foreground)" }}>{rule.endpoint}</span>
                    </div>
                    <p className="text-sm font-medium mb-2" style={{ color:"var(--foreground)" }}>{rule.rule}</p>
                    <p className="text-xs leading-relaxed" style={{ color:"var(--muted-foreground)" }}>{rule.verifierNote}</p>
                  </div>

                  {rule.status==="fail" && (
                    <div className="rounded-lg p-3 space-y-1.5 text-xs font-mono"
                      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                      <div style={{ color:"var(--primary)" }}>{">"} schema_check(GET /search)</div>
                      <div style={{ color:"var(--muted-foreground)" }}>  total_results: 147</div>
                      <div style={{ color:"var(--muted-foreground)" }}>  returned: 50</div>
                      <div style={{ color:"#ef4444" }}>  completeness: 34% ← below threshold (80%)</div>
                      <div style={{ color:"#ef4444" }}>  FAIL: reward rubric not satisfied</div>
                    </div>
                  )}
                  {rule.status==="pass" && (
                    <div className="rounded-lg p-3 space-y-1.5 text-xs font-mono" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                      <div style={{ color:"var(--primary)" }}>{">"} schema_check({rule.endpoint})</div>
                      <div style={{ color:"var(--muted-foreground)" }}>  verifier: OK</div>
                      <div style={{ color:"var(--primary)" }}>  PASS ✓</div>
                    </div>
                  )}
                  {rule.status==="working" && (
                    <div className="rounded-lg p-3 space-y-1.5 text-xs font-mono" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                      <div style={{ color:"#f59e0b" }}>{">"} scope_check({rule.endpoint})</div>
                      <div style={{ color:"var(--muted-foreground)" }}>  running verifier…</div>
                    </div>
                  )}
                  {rule.status==="pending" && (
                    <div className="rounded-lg py-6 flex items-center justify-center" style={{ background:"var(--card)", border:"1px dashed var(--border)" }}>
                      <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>Waiting for Scout schema…</span>
                    </div>
                  )}

                  {/* Apply redesign button — shown for fail rule */}
                  {rule.status==="fail" && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold" style={{ color:"var(--muted-foreground)" }}>Redesign suggestion</div>
                      <div className="rounded-xl p-4 text-xs leading-relaxed"
                        style={{ background:"rgba(60,130,98,0.08)", border:"1px solid var(--primary)", color:"var(--foreground)" }}>
                        Lower completeness threshold to <strong>40%</strong> or add a pagination-aware verifier that sums across all pages.
                      </div>

                      {redesignState==="idle" && (
                        <button onClick={handleRedesign}
                          className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01]"
                          style={{ background:"var(--primary)", color:"#fff" }}>
                          <Send size={12} /> Apply redesign → send to Ranger
                        </button>
                      )}
                      {redesignState==="sending" && (
                        <div className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                          style={{ background:"rgba(245,158,11,0.15)", color:"#f59e0b", border:"1px solid #f59e0b" }}>
                          <RefreshCw size={12} className="animate-spin" /> Sending reward redesign to Ranger…
                        </div>
                      )}
                      {redesignState==="sent" && (
                        <div className="space-y-2">
                          <div className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                            style={{ background:"rgba(60,130,98,0.12)", color:"var(--primary)", border:"1px solid var(--primary)" }}>
                            <CheckCircle2 size={12} /> Redesign sent — Ranger initialising training loop
                          </div>
                          <div className="rounded-xl p-3 text-xs space-y-1 font-mono"
                            style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                            <div style={{ color:"var(--primary)" }}>{">"} ranger.receive(reward_signal_v4)</div>
                            <div style={{ color:"var(--muted-foreground)" }}>  loading policy: jira-v1</div>
                            <div style={{ color:"var(--muted-foreground)" }}>  initialising GRPO trainer…</div>
                            <div style={{ color:"var(--primary)" }}>  training_loop: started ✓</div>
                          </div>
                          <button onClick={() => navigateTo("rangers")} className="w-full py-2 rounded-xl text-xs font-medium"
                            style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--foreground)" }}>
                            Open Ranger to monitor training →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Right: revision history */}
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color:"var(--muted-foreground)" }}>Revision History</div>
            <div className="space-y-3">
              {[...revisions, ...(redesignState==="sent"?[{ iter:4, change:"Applied redesign — pagination-aware completeness verifier", ts:"06:56", status:"working" }]:[])].map((rev,i)=>(
                <div key={i} className="rounded-xl p-4 space-y-2" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background:rev.status==="pass"?"rgba(60,130,98,0.15)":rev.status==="working"?"rgba(245,158,11,0.12)":"rgba(239,68,68,0.1)",
                        color:rev.status==="pass"?"var(--primary)":rev.status==="working"?"#f59e0b":"#ef4444" }}>
                      iter {rev.iter}
                    </span>
                    <span className="text-[11px] font-mono" style={{ color:"var(--muted-foreground)" }}>{rev.ts}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color:"var(--foreground)" }}>{rev.change}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 mt-2 space-y-2" style={{ background:"rgba(60,130,98,0.07)", border:"1px solid var(--primary)" }}>
              <div className="text-xs font-semibold" style={{ color:"var(--primary)" }}>Next — handoff to Ranger</div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--muted-foreground)" }}>
                Once GET /search verifier passes, Compass finalises the reward signal and triggers Ranger's training loop.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Verifiers tab ── */}
      {activeTab==="Verifiers" && (
        <div className="flex-1 p-8 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"var(--muted-foreground)" }}>Configured Verifiers</div>
            <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>{verifiers.length} verifiers · {verifiers.filter(v=>v.status==="pass").length} passing</p>
          </div>
          <div className="space-y-3">
            {verifiers.map((v,i)=>{
              const vc = { pass:"var(--primary)", fail:"#ef4444", working:"#f59e0b", pending:"var(--muted-foreground)" };
              return (
                <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background:"var(--card)", border:`1px solid ${v.status==="fail"?"rgba(239,68,68,0.3)":v.status==="working"?"rgba(245,158,11,0.3)":"var(--border)"}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={v.status} />
                      <code className="text-sm font-semibold" style={{ color:"var(--foreground)" }}>{v.name}</code>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color:"var(--muted-foreground)" }}>
                      <span>{v.passed}/{v.cases} cases pass</span>
                      <span>last run: {v.lastRun}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background:`${vc[v.status as keyof typeof vc]}22`, color:vc[v.status as keyof typeof vc] }}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color:"var(--muted-foreground)" }}>{v.desc}</p>
                  {/* Case bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"var(--card-elevated)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width:`${v.cases>0?(v.passed/v.cases)*100:0}%`, background:vc[v.status as keyof typeof vc] }} />
                    </div>
                    <span className="text-[10px]" style={{ color:"var(--muted-foreground)" }}>{v.cases} test cases</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Schema Map tab ── */}
      {activeTab==="Schema Map" && (
        <div className="flex-1 p-8">
          <SchemaMap />
        </div>
      )}

      {/* ── History tab ── */}
      {activeTab==="History" && (
        <div className="flex-1 p-8 space-y-5">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"var(--muted-foreground)" }}>Compass History</div>
            <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>All reward design iterations for this mission.</p>
          </div>
          <div className="space-y-4">
            {[...revisions, ...(redesignState==="sent"?[{ iter:4, change:"Applied redesign — pagination-aware completeness verifier", ts:"06:56", status:"working" }]:[])].map((rev,i,arr)=>(
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background:rev.status==="pass"?"var(--primary)":rev.status==="working"?"#f59e0b":"#ef4444", color:"#fff" }}>
                    {rev.iter}
                  </div>
                  {i<arr.length-1 && <div className="w-px flex-1 min-h-[24px] opacity-20 mt-1" style={{ background:"var(--foreground)" }} />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="rounded-xl p-4" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color:"var(--foreground)" }}>Iteration {rev.iter}</span>
                      <span className="text-[11px] font-mono" style={{ color:"var(--muted-foreground)" }}>{rev.ts}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color:"var(--muted-foreground)" }}>{rev.change}</p>
                    <div className="mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background:rev.status==="pass"?"rgba(60,130,98,0.12)":rev.status==="working"?"rgba(245,158,11,0.1)":"rgba(239,68,68,0.1)",
                          color:rev.status==="pass"?"var(--primary)":rev.status==="working"?"#f59e0b":"#ef4444" }}>
                        {rev.status==="pass"?"✓ passed":rev.status==="working"?"in progress":"✗ verifier failed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
