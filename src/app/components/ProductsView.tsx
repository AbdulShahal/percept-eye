import { useState } from "react";
import { ChevronRight, Plus, ExternalLink, Clock, CheckCircle2, Zap, X, ChevronDown, ArrowLeft } from "lucide-react";

type TabId = string;
interface Props { navigateTo: (tab: TabId) => void; }

const products = [
  { id:"atlassian-jira", name:"Atlassian JIRA", category:"Project Management",
    description:"Issue tracking, project management and agile workflows",
    status:"live", agents:["Scout","Compass","Ranger"], endpoints:47, lastRun:"Active now",
    color:"#3C8262", icon:"AJ",
    apiType:"REST + GraphQL", baseUrl:"https://api.atlassian.com/", auth:"OAuth 2.0" },
  { id:"github", name:"GitHub", category:"Version Control",
    description:"Code repositories, pull requests, actions and CI/CD",
    status:"queued", agents:["Scout"], endpoints:0, lastRun:"Queued",
    color:"#52a67d", icon:"GH",
    apiType:"REST v3 + GraphQL", baseUrl:"https://api.github.com/", auth:"Bearer Token" },
  { id:"linear", name:"Linear", category:"Project Management",
    description:"Modern project management for software teams",
    status:"draft", agents:[], endpoints:0, lastRun:"Not started",
    color:"#888", icon:"LN",
    apiType:"GraphQL", baseUrl:"https://api.linear.app/", auth:"API Key" },
  { id:"slack", name:"Slack", category:"Communication",
    description:"Team messaging, channels and workflow automation",
    status:"draft", agents:[], endpoints:0, lastRun:"Not started",
    color:"#888", icon:"SL",
    apiType:"REST", baseUrl:"https://slack.com/api/", auth:"OAuth 2.0" },
  { id:"notion", name:"Notion", category:"Knowledge Base",
    description:"Docs, wikis and databases for team knowledge",
    status:"draft", agents:[], endpoints:0, lastRun:"Not started",
    color:"#888", icon:"NO",
    apiType:"REST", baseUrl:"https://api.notion.com/", auth:"Bearer Token" },
];

const statusProps = {
  live:   { label:"Live",   color:"var(--primary)",          bg:"rgba(60,130,98,0.12)" },
  queued: { label:"Queued", color:"#f59e0b",                 bg:"rgba(245,158,11,0.1)" },
  draft:  { label:"Draft",  color:"var(--muted-foreground)", bg:"var(--card-elevated)" },
};

const agentColor: Record<string, string> = { Scout:"#3C8262", Compass:"#52a67d", Ranger:"#2d6249" };
const agentStatus: Record<string, string> = { Scout:"done", Compass:"working", Ranger:"pending" };

// ── Add Product modal ─────────────────────────────────────────────
function AddProductModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [apiType, setApiType] = useState("REST");
  const [baseUrl, setBaseUrl] = useState("");
  const [auth, setAuth] = useState("API Key");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAdd = () => {
    if (!name.trim() || !baseUrl.trim()) return;
    setSubmitted(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background:"var(--card)", border:"1px solid var(--border)",
          animation:"modal-in 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <style>{`@keyframes modal-in{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {submitted ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background:"rgba(60,130,98,0.15)", border:"1px solid var(--primary)" }}>
              <CheckCircle2 size={24} style={{ color:"var(--primary)" }} />
            </div>
            <div className="text-center">
              <div className="text-base font-semibold mb-1" style={{ color:"var(--foreground)" }}>Product added</div>
              <p className="text-xs" style={{ color:"var(--muted-foreground)" }}>Scout will begin schema discovery on the next mission run.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor:"var(--border)" }}>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color:"var(--muted-foreground)" }}>Add Product</div>
                <div className="text-base font-semibold" style={{ color:"var(--foreground)" }}>Connect a new API</div>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--card-elevated)", color:"var(--muted-foreground)" }}><X size={14} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[{ label:"Product name", value:name, setter:setName, ph:"e.g. GitHub, Salesforce", type:"text" },
                { label:"Base URL", value:baseUrl, setter:setBaseUrl, ph:"https://api.example.com/", type:"text" },
                { label:"Description", value:description, setter:setDescription, ph:"What does this API do?", type:"text" },
              ].map(({label,value,setter,ph})=>(
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-medium normal-case tracking-normal" style={{ color:"var(--muted-foreground)" }}>{label}</label>
                  <input type="text" value={value} onChange={e=>setter(e.target.value)} placeholder={ph}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background:"var(--background)", border:`1px solid ${value?"var(--primary)":"var(--border)"}`, color:"var(--foreground)" }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[{ label:"API type", value:apiType, setter:setApiType, options:["REST","GraphQL","gRPC","REST + GraphQL"] },
                  { label:"Auth method", value:auth, setter:setAuth, options:["API Key","OAuth 2.0","Bearer Token","Basic Auth"] }
                ].map(({label,value,setter,options})=>(
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs font-medium normal-case tracking-normal" style={{ color:"var(--muted-foreground)" }}>{label}</label>
                    <div className="relative">
                      <select value={value} onChange={e=>setter(e.target.value)}
                        className="w-full appearance-none px-3 py-2.5 rounded-xl text-sm outline-none pr-8"
                        style={{ background:"var(--background)", border:"1px solid var(--border)", color:"var(--foreground)" }}>
                        {options.map(o=><option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"var(--muted-foreground)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor:"var(--border)" }}>
              <button onClick={onClose} className="px-4 py-2 text-sm" style={{ color:"var(--muted-foreground)" }}>Cancel</button>
              <button onClick={handleAdd} disabled={!name.trim()||!baseUrl.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-40"
                style={{ background:"var(--primary)", color:"#fff" }}>
                <Plus size={14} /> Add product
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Start Mission inline page ────────────────────────────────────
function StartMissionPage({ product, onBack, navigateTo }: { product: typeof products[0]; onBack: () => void; navigateTo: (t:TabId)=>void }) {
  const [name, setName] = useState(`${product.name} — Mission ${new Date().toLocaleDateString()}`);
  const [goal, setGoal] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["scout","compass","ranger"]);
  const [mode, setMode] = useState("Training");
  const [launching, setLaunching] = useState(false);

  const toggleAgent = (id: string) => setSelectedAgents(p => p.includes(id) ? p.filter(a=>a!==id) : [...p,id]);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => navigateTo("missions"), 1800);
  };

  if (launching) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background:"rgba(60,130,98,0.15)", border:"1px solid var(--primary)", animation:"spin-slow 2s linear infinite" }}>
        <style>{`@keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <Zap size={28} style={{ color:"var(--primary)" }} />
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold mb-1" style={{ color:"var(--foreground)" }}>Launching mission…</div>
        <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>Scout is initialising discovery for {product.name}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 space-y-6 max-w-2xl">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--muted-foreground)" }}>
          <ArrowLeft size={12} /> Back to products
        </button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ background:product.color, color:"#fff" }}>{product.icon}</div>
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color:"var(--muted-foreground)" }}>Start Mission</div>
              <h2 className="text-2xl font-semibold" style={{ color:"var(--foreground)" }}>{product.name}</h2>
            </div>
          </div>
          <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>{product.description} · {product.apiType} · {product.auth}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium normal-case tracking-normal" style={{ color:"var(--muted-foreground)" }}>Mission name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background:"var(--background)", border:`1px solid ${name?"var(--primary)":"var(--border)"}`, color:"var(--foreground)" }} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium normal-case tracking-normal" style={{ color:"var(--muted-foreground)" }}>Goal <span style={{ opacity:0.5 }}>(optional)</span></label>
            <textarea value={goal} onChange={e=>setGoal(e.target.value)} rows={2} placeholder="What should this mission accomplish?"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background:"var(--background)", border:"1px solid var(--border)", color:"var(--foreground)" }} />
          </div>

          {/* Agents */}
          <div className="space-y-2">
            <label className="text-xs font-medium normal-case tracking-normal" style={{ color:"var(--muted-foreground)" }}>Agents</label>
            {[{ id:"scout",   name:"Scout",   role:"Discovery & schema mapping",    color:"#3C8262" },
              { id:"compass", name:"Compass", role:"Reward design & alignment",     color:"#52a67d" },
              { id:"ranger",  name:"Ranger",  role:"Policy training & rollout",      color:"#2d6249" }].map(agent=>{
              const active = selectedAgents.includes(agent.id);
              return (
                <button key={agent.id} onClick={()=>toggleAgent(agent.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                  style={{ background:active?"rgba(60,130,98,0.07)":"var(--background)", border:`1px solid ${active?"var(--primary)":"var(--border)"}` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background:active?agent.color:"var(--card-elevated)", color:active?"#fff":"var(--muted-foreground)" }}>
                    {agent.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium" style={{ color:active?"var(--foreground)":"var(--muted-foreground)" }}>{agent.name}</div>
                    <div className="text-[11px]" style={{ color:"var(--muted-foreground)" }}>{agent.role}</div>
                  </div>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background:active?"var(--primary)":"transparent", border:`1.5px solid ${active?"var(--primary)":"var(--border)"}` }}>
                    {active && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium normal-case tracking-normal" style={{ color:"var(--muted-foreground)" }}>Mode</label>
            <div className="flex items-center gap-2">
              {["Training","Evaluation","Exploration"].map(m=>(
                <button key={m} onClick={()=>setMode(m)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ background:mode===m?"var(--primary)":"var(--background)", color:mode===m?"#fff":"var(--muted-foreground)", border:`1px solid ${mode===m?"var(--primary)":"var(--border)"}` }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleLaunch} disabled={!name.trim()||selectedAgents.length===0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-[1.01] disabled:opacity-40"
            style={{ background:"var(--primary)", color:"#fff", boxShadow:name.trim()?"0 0 20px var(--glow-primary)":"none" }}>
            <Zap size={15} /> Launch mission for {product.name}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Products view ────────────────────────────────────────────────
export function ProductsView({ navigateTo }: Props) {
  const [selected, setSelected] = useState<string>("atlassian-jira");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [startingMission, setStartingMission] = useState(false);

  const selectedProduct = products.find(p=>p.id===selected) ?? products[0];

  if (startingMission) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="border-b px-8 py-3 flex items-center justify-between"
          style={{ borderColor:"var(--border)" }}>
          <div className="text-xs flex items-center gap-1.5" style={{ color:"var(--muted-foreground)" }}>
            <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
            <span>Products</span><ChevronRight size={12} className="opacity-40" />
            <span style={{ color:"var(--foreground)" }}>Start Mission</span>
          </div>
        </div>
        <StartMissionPage product={selectedProduct} onBack={()=>setStartingMission(false)} navigateTo={navigateTo} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div className="border-b px-8 py-3 flex items-center justify-between flex-shrink-0"
        style={{ borderColor:"var(--border)" }}>
        <div className="text-xs flex items-center gap-1.5" style={{ color:"var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color:"var(--foreground)" }}>Products</span>
        </div>
        <button onClick={()=>setShowAddProduct(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
          style={{ background:"var(--primary)", color:"#fff" }}>
          <Plus size={12} /> Add product
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Product list */}
        <div className="w-64 flex-shrink-0 border-r overflow-y-auto p-4 space-y-2" style={{ borderColor:"var(--border)" }}>
          <div className="text-xs uppercase tracking-widest font-semibold px-2 mb-3" style={{ color:"var(--muted-foreground)" }}>
            {products.length} products
          </div>
          {products.map(p=>{
            const sp = statusProps[p.status as keyof typeof statusProps];
            return (
              <button key={p.id} onClick={()=>{ setSelected(p.id); setStartingMission(false); }}
                className="w-full text-left rounded-xl p-3.5 space-y-2 transition-all duration-200 hover:scale-[1.01]"
                style={{ background:selected===p.id?"rgba(60,130,98,0.07)":"var(--card)",
                  border:`1px solid ${selected===p.id?"var(--primary)":"var(--border)"}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background:p.color, color:"#fff", opacity:p.status==="draft"?0.5:1 }}>{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color:"var(--foreground)" }}>{p.name}</div>
                    <div className="text-[11px]" style={{ color:"var(--muted-foreground)" }}>{p.category}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ background:sp.bg, color:sp.color }}>{sp.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Product detail */}
        <div className="flex-1 p-8 space-y-7 overflow-y-auto">
          {(()=>{
            const p = selectedProduct;
            const sp = statusProps[p.status as keyof typeof statusProps];
            return (
              <>
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                    style={{ background:p.color, color:"#fff", opacity:p.status==="draft"?0.5:1 }}>{p.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl font-semibold" style={{ color:"var(--foreground)" }}>{p.name}</h2>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background:sp.bg, color:sp.color }}>{sp.label}</span>
                    </div>
                    <div className="text-sm" style={{ color:"var(--muted-foreground)" }}>{p.category} · {p.description}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color:"var(--muted-foreground)" }}>
                      <span>{p.apiType}</span>
                      <span className="font-mono">{p.baseUrl}</span>
                      <span>{p.auth}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status==="live" && (
                      <button onClick={()=>navigateTo("missions")}
                        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium"
                        style={{ background:"var(--primary)", color:"#fff" }}>
                        <ExternalLink size={12} /> Open mission
                      </button>
                    )}
                    {p.status!=="live" && (
                      <button onClick={()=>setStartingMission(true)}
                        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium"
                        style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--foreground)" }}>
                        <Zap size={12} /> Start mission
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[{ label:"Endpoints discovered", value:p.endpoints>0?String(p.endpoints):"—", icon:Zap },
                    { label:"Agents assigned", value:p.agents.length>0?p.agents.join(", "):"None", icon:CheckCircle2 },
                    { label:"Last activity", value:p.lastRun, icon:Clock }
                  ].map(({label,value,icon:Icon})=>(
                    <div key={label} className="rounded-2xl p-5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                      <Icon size={16} className="mb-3" style={{ color:"var(--primary)", opacity:p.status==="draft"?0.3:1 }} />
                      <div className="text-lg font-semibold mb-1" style={{ color:"var(--foreground)", opacity:p.status==="draft"?0.4:1 }}>{value}</div>
                      <div className="text-xs uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Active agents or CTA */}
                {p.status==="live" ? (
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-widest font-semibold" style={{ color:"var(--muted-foreground)" }}>Active Agents</div>
                    <div className="flex items-center gap-3">
                      {p.agents.map(a=>(
                        <div key={a} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                          style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold"
                            style={{ background:agentColor[a], color:"#fff" }}>{a[0]}</div>
                          <span className="text-sm font-medium" style={{ color:"var(--foreground)" }}>{a}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background:"rgba(60,130,98,0.12)", color:"var(--primary)" }}>{agentStatus[a]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center"
                    style={{ background:"var(--card)", border:"1px dashed var(--border)" }}>
                    <div className="text-sm font-medium" style={{ color:"var(--foreground)" }}>
                      {p.status==="queued" ? "Queued for next mission" : "Not yet configured"}
                    </div>
                    <p className="text-xs max-w-xs" style={{ color:"var(--muted-foreground)" }}>
                      {p.status==="queued"
                        ? "Scout will start endpoint discovery once the Atlassian JIRA mission completes."
                        : "Launch a mission for this product to have Scout, Compass and Ranger start working on it."}
                    </p>
                    <button onClick={()=>setStartingMission(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background:"var(--primary)", color:"#fff" }}>
                      <Plus size={14} /> Start mission
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {showAddProduct && <AddProductModal onClose={()=>setShowAddProduct(false)} />}
    </div>
  );
}
