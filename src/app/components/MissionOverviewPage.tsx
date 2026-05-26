import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, Users, ChevronRight, Zap, AlertTriangle } from "lucide-react";

type TabId = string;
interface Props { onBack: () => void; navigateTo: (tab: TabId) => void; }

const pendingDecisions = [
  { id: 1, agent: "Compass", type: "Threshold adjustment", desc: "Lower GET /search completeness threshold from 80% to 40%, or introduce pagination-aware verifier.", options: ["Approve", "Override", "Skip"] },
  { id: 2, agent: "Scout",   type: "Endpoint ambiguity", desc: "POST /bulk returns 200 for partial failures. Should this be flagged as a schema defect?", options: ["Flag", "Ignore", "Defer"] },
  { id: 3, agent: "Compass", type: "Reward weight", desc: "Increase weight for idempotency rule from 20% → 30% to discourage duplicate writes.", options: ["Approve", "Adjust", "Skip"] },
  { id: 4, agent: "Ranger",  type: "Training mode", desc: "Switch training from single-step to multi-step rollouts for better long-horizon reward attribution.", options: ["Approve", "Hold", "Skip"] },
];

const timeline = [
  { ts: "06:55", agent: "Compass", msg: "Reward rule violation detected on GET /search — completeness 34%, expected ≥ 80%." },
  { ts: "06:54", agent: "Compass", msg: "Designing reward scaffold for swiftifee 123. Search routes using SQL." },
  { ts: "06:52", agent: "Scout",   msg: "Surfacing 47 endpoints complete. Sending schema to Compass." },
  { ts: "06:51", agent: "Compass", msg: "Received Scout schema. Starting reward rubric construction." },
  { ts: "06:50", agent: "Scout",   msg: "Parsing schema — OpenAPI 3.x detected. GraphQL schema linked." },
  { ts: "06:48", agent: "Scout",   msg: "Received Atlas Forge spec. Starting endpoint discovery." },
];

const agentColor = { Scout: "#3C8262", Compass: "#52a67d", Ranger: "#2d6249" } as const;

export function MissionOverviewPage({ onBack, navigateTo }: Props) {
  const [elapsed, setElapsed] = useState(432);
  const [decisions, setDecisions] = useState<Record<number, string>>({});

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b px-8 py-3 flex items-center justify-between"
        style={{ background: "var(--background)EE", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
            <ArrowLeft size={12} /> Back
          </button>
          <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
            <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
            <span>Missions</span><ChevronRight size={12} className="opacity-40" />
            <span style={{ color: "var(--foreground)" }}>Atlas Forge</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse-glow" style={{ background: "#f59e0b" }} />
          {pendingDecisions.length - Object.keys(decisions).length} decisions pending
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Mission hero */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
                Atlas Forge · Mission Overview
              </div>
              <h1 className="text-4xl font-semibold mb-2" style={{ color: "var(--foreground)", fontSize: "2.5rem" }}>
                Atlassian JIRA
              </h1>
              <p className="text-base leading-relaxed max-w-xl" style={{ color: "var(--muted-foreground)" }}>
                Build a reward signal that teaches an AI agent to effectively navigate Atlassian JIRA's API surface —
                discovering endpoints, testing edge cases, and ranking actions by quality.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "47 endpoints", icon: Zap },
                { label: "12 schemas", icon: CheckCircle2 },
                { label: "3 agents", icon: Users },
                { label: "Pipeline: Scout → Compass → Ranger", icon: ChevronRight },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                  <Icon size={11} style={{ color: "var(--primary)" }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Live status card */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Live Status
            </div>
            {[
              { label: "Status",    value: "RUNNING",          color: "#f59e0b" },
              { label: "Elapsed",   value: fmt(elapsed),        color: "var(--foreground)" },
              { label: "Active",    value: "Compass",           color: "var(--primary)" },
              { label: "Progress",  value: "~60%",              color: "var(--foreground)" },
              { label: "Decisions", value: `${pendingDecisions.length - Object.keys(decisions).length} pending`, color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                <span className="text-xs font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--card-elevated)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: "60%", background: "var(--primary)" }} />
            </div>
          </div>
        </div>

        {/* Agent strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Scout",   status: "Done",    statusColor: "var(--primary)", note: "47 endpoints mapped, 12 schemas parsed", tab: "scout" },
            { name: "Compass", status: "Working", statusColor: "#f59e0b",        note: "Resolving verifier on GET /search",        tab: "compass" },
            { name: "Ranger",  status: "Pending", statusColor: "var(--muted-foreground)", note: "Awaiting Compass reward signal",  tab: "rangers" },
          ].map((a) => (
            <div key={a.name} className="rounded-2xl p-5 flex items-start gap-4"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: agentColor[a.name as keyof typeof agentColor], color: "#fff" }}>
                {a.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{a.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${a.statusColor}22`, color: a.statusColor }}>{a.status}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{a.note}</p>
                <button onClick={() => navigateTo(a.tab as TabId)} className="text-xs mt-2" style={{ color: "var(--primary)" }}>
                  Open {a.name} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pending decisions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--muted-foreground)" }}>
                Pending Decisions
              </div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {pendingDecisions.length - Object.keys(decisions).length} awaiting review
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {pendingDecisions.map((d) => {
              const decided = decisions[d.id];
              return (
                <div key={d.id} className="rounded-2xl p-5 space-y-3 transition-all duration-200"
                  style={{ background: "var(--card)", border: `1px solid ${decided ? "var(--primary)" : "var(--border)"}`, opacity: decided ? 0.65 : 1 }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] px-2 py-0.5 rounded font-medium"
                          style={{ background: `${agentColor[d.agent as keyof typeof agentColor]}22`, color: agentColor[d.agent as keyof typeof agentColor] }}>
                          {d.agent}
                        </span>
                        <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{d.type}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{d.desc}</p>
                    </div>
                    {decided && <span className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--primary)" }}>✓ {decided}</span>}
                  </div>
                  {!decided && (
                    <div className="flex items-center gap-2">
                      {d.options.map((opt) => (
                        <button key={opt} onClick={() => setDecisions(prev => ({ ...prev, [d.id]: opt }))}
                          className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.03]"
                          style={{ background: opt === d.options[0] ? "var(--primary)" : "var(--card-elevated)",
                            color: opt === d.options[0] ? "#fff" : "var(--muted-foreground)",
                            border: "1px solid var(--border)" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity timeline */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
            Activity Timeline
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {timeline.map((e, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-3 border-b last:border-b-0"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <span className="text-[11px] font-mono flex-shrink-0 opacity-40 mt-0.5" style={{ color: "var(--foreground)" }}>{e.ts}</span>
                <span className="text-xs font-semibold flex-shrink-0 w-16"
                  style={{ color: agentColor[e.agent as keyof typeof agentColor] }}>{e.agent}</span>
                <span className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
