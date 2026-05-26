import { useState, useEffect } from "react";
import { Copy, ChevronRight, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type TabId = string;
interface Props { navigateTo: (tab: TabId) => void; }

const agentSteps = {
  Scout: [
    { label: "Fetched OpenAPI spec", status: "done" },
    { label: "Parsed 47 endpoints", status: "done" },
    { label: "Identified 12 schemas", status: "done" },
    { label: "Surfaced ambiguities → Compass", status: "done" },
  ],
  Compass: [
    { label: "Received Scout schema", status: "done" },
    { label: "Designed reward rubric", status: "done" },
    { label: "swiftifee 123 two-mode rule", status: "working" },
    { label: "Compass settings", status: "pending" },
    { label: "Compass Action Against Policy", status: "pending" },
  ],
  Ranger: [
    { label: "Awaiting Compass reward signal", status: "pending" },
    { label: "Policy initialisation", status: "pending" },
    { label: "Training loop", status: "pending" },
    { label: "Convergence check", status: "pending" },
  ],
};

const activityLog = [
  { time: "06:55", agent: "Compass", msg: "swiftifee 123 loss two-made role" },
  { time: "06:54", agent: "Compass", msg: "All designing reward scaffold for swiftifee 123. Search routes using SQL." },
  { time: "06:52", agent: "Scout",   msg: "Surfacing 47 endpoints complete. Sending schema to Compass." },
  { time: "06:50", agent: "Scout",   msg: "Parsing schema — OpenAPI 3.x detected. GraphQL schema linked." },
  { time: "06:48", agent: "Scout",   msg: "Received Atlas Forge spec. Starting endpoint discovery." },
];

const agentTabMap: Record<string, TabId> = { Scout: "scout", Compass: "compass", Ranger: "rangers" };
const agentColor: Record<string, string> = { Scout: "#3C8262", Compass: "#52a67d", Ranger: "#2d6249" };
const stepColor = (s: string) => s === "done" ? "var(--primary)" : s === "working" ? "#f59e0b" : "var(--border)";

// ── Artifact tab content ─────────────────────────────────────────

const workflowData = [
  { id: "wf-01", name: "Create & close issue", steps: 4, status: "validated", reward: 0.87 },
  { id: "wf-02", name: "Search by JQL",        steps: 2, status: "failing",   reward: 0.23 },
  { id: "wf-03", name: "Assign issue to user",  steps: 3, status: "validated", reward: 0.79 },
  { id: "wf-04", name: "Bulk update labels",    steps: 2, status: "pending",   reward: null },
];

const rewardTableRows = [
  { endpoint: "POST /issues",      action: "Create issue",     reward: 0.87, verifier: "pass" },
  { endpoint: "GET /search",       action: "Search (JQL)",     reward: 0.23, verifier: "fail" },
  { endpoint: "PUT /issues/{id}",  action: "Update issue",     reward: 0.79, verifier: "pass" },
  { endpoint: "GET /myself",       action: "Auth check",       reward: 0.70, verifier: "working" },
  { endpoint: "POST /bulk",        action: "Bulk update",      reward: null,  verifier: "pending" },
];

const episodeRows = [
  { id: "ep-001", steps: 45, totalReward: 12.3, avgReward: 0.27, novel: 2, status: "done" },
  { id: "ep-002", steps: 52, totalReward: 14.8, avgReward: 0.28, novel: 3, status: "done" },
  { id: "ep-003", steps: 38, totalReward: 8.7,  avgReward: 0.23, novel: 1, status: "running" },
];

const noveltyData = [1,3,2,5,4,7,6,8,7,9,8,10].map((v,i)=>({ ep: `ep-${String(i+1).padStart(3,"0")}`, novelty: v * 0.08 }));

const modelInfo = {
  id: "jira-policy-v1",
  arch: "Transformer (claude-sonnet base)",
  params: "7B",
  context: "8 192 tokens",
  trainMode: "GRPO",
  lr: "1e-5",
  batchSize: 16,
  step: 0,
  maxSteps: 5000,
  status: "Awaiting Compass reward signal",
};

const modelRewardCurve = [0,0.05,0.09,0.14,0.19,0.24].map((r,i)=>({ step: i*200, reward: r }));

function ArtifactWorkflows() {
  const wfColor = { validated:"var(--primary)", failing:"#ef4444", pending:"var(--muted-foreground)" };
  return (
    <div className="space-y-3">
      {workflowData.map(wf => (
        <div key={wf.id} className="rounded-xl p-4 flex items-center justify-between"
          style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
              style={{ background:"var(--card-elevated)", color:"var(--muted-foreground)" }}>{wf.steps}</div>
            <div>
              <div className="text-sm font-medium" style={{ color:"var(--foreground)" }}>{wf.name}</div>
              <div className="text-[11px]" style={{ color:"var(--muted-foreground)" }}>{wf.steps} steps · {wf.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold" style={{ color: wf.reward ? "var(--primary)" : "var(--muted-foreground)" }}>
              {wf.reward?.toFixed(2) ?? "—"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background:`${wfColor[wf.status as keyof typeof wfColor]}22`, color:wfColor[wf.status as keyof typeof wfColor] }}>
              {wf.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArtifactRewardTables() {
  const vc = { pass:"var(--primary)", fail:"#ef4444", working:"#f59e0b", pending:"var(--muted-foreground)" };
  return (
    <div className="rounded-xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
      <div className="grid grid-cols-[1.5fr_1.5fr_80px_70px] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest font-semibold"
        style={{ background:"var(--card-elevated)", color:"var(--muted-foreground)" }}>
        <span>Endpoint</span><span>Action</span><span>Reward</span><span>Verifier</span>
      </div>
      {rewardTableRows.map((r,i) => (
        <div key={i} className="grid grid-cols-[1.5fr_1.5fr_80px_70px] gap-4 px-4 py-3 border-t"
          style={{ background:"var(--card)", borderColor:"var(--border)" }}>
          <span className="text-xs font-mono" style={{ color:"var(--muted-foreground)" }}>{r.endpoint}</span>
          <span className="text-xs" style={{ color:"var(--foreground)" }}>{r.action}</span>
          <span className="text-sm font-semibold" style={{ color: r.reward ? "var(--primary)" : "var(--muted-foreground)" }}>
            {r.reward?.toFixed(2) ?? "—"}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium w-fit"
            style={{ background:`${vc[r.verifier as keyof typeof vc]}22`, color:vc[r.verifier as keyof typeof vc] }}>
            {r.verifier}
          </span>
        </div>
      ))}
    </div>
  );
}

function ArtifactEpisodes() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
      <div className="grid grid-cols-[80px_1fr_1fr_1fr_60px_80px] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest font-semibold"
        style={{ background:"var(--card-elevated)", color:"var(--muted-foreground)" }}>
        <span>Episode</span><span>Steps</span><span>Total reward</span><span>Avg reward</span><span>Novel</span><span>Status</span>
      </div>
      {episodeRows.map((e,i) => (
        <div key={i} className="grid grid-cols-[80px_1fr_1fr_1fr_60px_80px] gap-4 px-4 py-3 border-t items-center"
          style={{ background:"var(--card)", borderColor:"var(--border)" }}>
          <span className="text-xs font-mono" style={{ color:"var(--muted-foreground)" }}>{e.id}</span>
          <span className="text-xs" style={{ color:"var(--foreground)" }}>{e.steps}</span>
          <span className="text-sm font-semibold" style={{ color:"var(--primary)" }}>{e.totalReward}</span>
          <span className="text-sm font-semibold" style={{ color:"var(--foreground)" }}>{e.avgReward}</span>
          <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>{e.novel}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: e.status==="running"?"rgba(245,158,11,0.1)":"rgba(60,130,98,0.1)", color: e.status==="running"?"#f59e0b":"var(--primary)" }}>
            {e.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ArtifactNoveltyReward() {
  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>
        Novelty bonus awarded when an agent takes an action in a state it has not visited before. Higher novelty → more exploration.
      </p>
      <div className="rounded-2xl p-5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color:"var(--muted-foreground)" }}>
          Novelty Bonus per Episode
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={noveltyData}>
            <XAxis dataKey="ep" tick={{ fontSize:9, fill:"var(--muted-foreground)" }} />
            <YAxis domain={[0,1]} tick={{ fontSize:9, fill:"var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, fontSize:11 }} />
            <Line type="monotone" dataKey="novelty" stroke="#52a67d" strokeWidth={2} dot={{ r:3, fill:"#52a67d" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ArtifactModel() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries({ "Model ID":modelInfo.id, "Architecture":modelInfo.arch, "Parameters":modelInfo.params,
          "Context window":modelInfo.context, "Training mode":modelInfo.trainMode, "Learning rate":modelInfo.lr,
          "Batch size":String(modelInfo.batchSize), "Status":modelInfo.status }).map(([k,v]) => (
          <div key={k} className="rounded-xl p-4" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color:"var(--muted-foreground)" }}>{k}</div>
            <div className="text-sm font-medium" style={{ color:"var(--foreground)" }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color:"var(--muted-foreground)" }}>
            Training Progress
          </div>
          <div className="text-xs" style={{ color:"var(--muted-foreground)" }}>
            Step {modelInfo.step} / {modelInfo.maxSteps}
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background:"var(--card-elevated)" }}>
          <div className="h-full rounded-full" style={{ width:`${(modelInfo.step/modelInfo.maxSteps)*100}%`, background:"var(--primary)", minWidth:4 }} />
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={modelRewardCurve}>
            <XAxis dataKey="step" tick={{ fontSize:9, fill:"var(--muted-foreground)" }} />
            <YAxis domain={[0,1]} tick={{ fontSize:9, fill:"var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, fontSize:11 }} />
            <Line type="monotone" dataKey="reward" stroke="#3C8262" strokeWidth={2} dot={false} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2 text-center" style={{ color:"var(--muted-foreground)" }}>
          Projected curve — training begins once Compass finalises the reward signal.
        </p>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export function PremiumMissions({ navigateTo }: Props) {
  const [elapsed, setElapsed] = useState(55);
  const [activeAgentPill, setActiveAgentPill] = useState<"Scout"|"Compass"|"Ranger">("Compass");
  const [artifactTab, setArtifactTab] = useState("Workflows");
  const artifactTabs = ["Workflows","Reward Tables","Episodes","Novelty Reward","Model"];

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => `${Math.floor(s/60)}m ${s%60}s`;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b px-8 py-3 flex items-center justify-between"
        style={{ background:"var(--background)EE", backdropFilter:"blur(12px)", borderColor:"var(--border)" }}>
        <div className="text-xs flex items-center gap-1.5" style={{ color:"var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span>Mission</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color:"var(--foreground)" }}>live-run</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color:"var(--muted-foreground)" }}>ATLAS FORGE · 06:57</span>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
            style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--muted-foreground)" }}>
            <Copy size={11} /> Copy run ID
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 flex-1 flex flex-col">
        {/* Mission header */}
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"var(--muted-foreground)" }}>Atlas Forge · 06:57</div>
          <h2 className="text-3xl font-semibold mb-1.5" style={{ color:"var(--foreground)" }}>Atlassian JIRA</h2>
          <p className="text-sm max-w-xl" style={{ color:"var(--muted-foreground)" }}>
            Live: Scout discovers endpoints, Compass designs rewards, Ranger trains the policy.
          </p>
        </div>

        {/* Agent pills */}
        <div className="flex items-center gap-2">
          {(["Scout","Compass","Ranger"] as const).map(a => (
            <button key={a} onClick={() => setActiveAgentPill(a)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{ background:activeAgentPill===a?"var(--primary)":"var(--card)",
                color:activeAgentPill===a?"#fff":"var(--muted-foreground)", border:"1px solid var(--border)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:agentColor[a] }} />
              {a}
            </button>
          ))}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ background:"var(--card)", color:"var(--muted-foreground)", border:"1px solid var(--border)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#888" }} />
            Model
          </button>
        </div>

        {/* Status bar */}
        <div className="rounded-2xl px-6 py-4 grid grid-cols-3 gap-8"
          style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
          {[{ label:"STATUS", value:"RUNNING", color:"#f59e0b" },
            { label:"ELAPSED", value:fmt(elapsed), color:"var(--foreground)" },
            { label:"ACTIVE",  value:"COMPASS",  color:"var(--primary)" }
          ].map(({label,value,color}) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color:"var(--muted-foreground)" }}>{label}</div>
              <div className="text-lg font-semibold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Agent columns */}
        <div className="grid grid-cols-3 gap-4">
          {(["Scout","Compass","Ranger"] as const).map(name => {
            const isWorking = name==="Compass", isDone = name==="Scout";
            const statusLabel = isDone?"DONE":isWorking?"WORKING":"PENDING";
            const statusColor = isDone?"var(--primary)":isWorking?"#f59e0b":"var(--muted-foreground)";
            return (
              <div key={name} className="rounded-2xl p-5 space-y-4 flex flex-col"
                style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background:agentColor[name], color:"#fff" }}>{name[0]}</div>
                    <span className="text-sm font-semibold" style={{ color:"var(--foreground)" }}>{name}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background:`${statusColor}22`, color:statusColor }}>{statusLabel}</span>
                </div>
                <div className="space-y-2.5">
                  {agentSteps[name].map((step,i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background:stepColor(step.status) }} />
                      <span className="text-xs leading-relaxed"
                        style={{ color:step.status==="done"?"var(--foreground)":step.status==="working"?"#f59e0b":"var(--muted-foreground)",
                          opacity:step.status==="pending"?0.5:1 }}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigateTo(agentTabMap[name] as TabId)}
                  className="text-xs mt-auto pt-2 text-left transition-all duration-200 hover:opacity-70"
                  style={{ color:"var(--primary)" }}>
                  Open {name} page →
                </button>
              </div>
            );
          })}
        </div>

        {/* Artifact section */}
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor:"var(--border)", background:"var(--card)" }}>
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color:"var(--muted-foreground)" }}>
              Artifact Image · Repo root → Tools → Episode → Rewards → Rules
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {artifactTabs.map(tab => (
                <button key={tab} onClick={() => setArtifactTab(tab)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{ background:artifactTab===tab?"var(--primary)":"var(--card-elevated)",
                    color:artifactTab===tab?"#fff":"var(--muted-foreground)" }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5" style={{ background:"var(--card)" }}>
            {artifactTab==="Workflows"    && <ArtifactWorkflows />}
            {artifactTab==="Reward Tables" && <ArtifactRewardTables />}
            {artifactTab==="Episodes"     && <ArtifactEpisodes />}
            {artifactTab==="Novelty Reward" && <ArtifactNoveltyReward />}
            {artifactTab==="Model"        && <ArtifactModel />}
          </div>
        </div>

        {/* Activity log */}
        <div className="rounded-2xl px-5 py-4" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
          <div className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color:"var(--muted-foreground)" }}>
            Activity Log
          </div>
          <div className="space-y-2">
            {activityLog.map((entry,i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className="font-mono opacity-40 flex-shrink-0" style={{ color:"var(--foreground)" }}>{entry.time}</span>
                <span className="flex-shrink-0 font-medium" style={{ color:agentColor[entry.agent] }}>{entry.agent}</span>
                <span style={{ color:"var(--muted-foreground)" }}>{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
