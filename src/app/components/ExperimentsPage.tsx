import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, FlaskConical, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Status = "running" | "done" | "failed";

interface Experiment {
  id: string; name: string; product: string; model: string;
  policy: string; avgReward: number | null; steps: number; status: Status;
  started: string; rewardHistory: { step: number; reward: number }[];
}

const experiments: Experiment[] = [
  { id: "exp-006", name: "reward-v3-search-fix", product: "JIRA", model: "claude-sonnet", policy: "v3",
    avgReward: 0.61, steps: 1200, status: "running", started: "Today 06:54",
    rewardHistory: [0,0.1,0.18,0.25,0.31,0.38,0.44,0.51,0.57,0.61].map((r,i)=>({step:(i+1)*120,reward:r})) },
  { id: "exp-005", name: "reward-v2-full-pass", product: "JIRA", model: "claude-sonnet", policy: "v2",
    avgReward: 0.74, steps: 2400, status: "done", started: "Yesterday 14:20",
    rewardHistory: [0,0.12,0.22,0.34,0.45,0.53,0.61,0.68,0.72,0.74].map((r,i)=>({step:(i+1)*240,reward:r})) },
  { id: "exp-004", name: "reward-v1-issues-only", product: "JIRA", model: "claude-haiku", policy: "v1",
    avgReward: 0.61, steps: 1800, status: "done", started: "Yesterday 09:05",
    rewardHistory: [0,0.08,0.15,0.24,0.33,0.4,0.47,0.54,0.58,0.61].map((r,i)=>({step:(i+1)*180,reward:r})) },
  { id: "exp-003", name: "schema-only-baseline", product: "JIRA", model: "claude-haiku", policy: "v0",
    avgReward: 0.42, steps: 900, status: "done", started: "2 days ago",
    rewardHistory: [0,0.06,0.12,0.19,0.26,0.31,0.36,0.39,0.41,0.42].map((r,i)=>({step:(i+1)*90,reward:r})) },
  { id: "exp-002", name: "random-policy-probe", product: "JIRA", model: "—", policy: "random",
    avgReward: 0.09, steps: 500, status: "done", started: "3 days ago",
    rewardHistory: [0,0.02,0.04,0.06,0.07,0.08,0.08,0.09,0.09,0.09].map((r,i)=>({step:(i+1)*50,reward:r})) },
  { id: "exp-001", name: "sanity-check-env", product: "JIRA", model: "—", policy: "fixed",
    avgReward: null, steps: 120, status: "failed", started: "4 days ago",
    rewardHistory: [] },
];

const statusStyle: Record<Status, { label: string; color: string; bg: string }> = {
  running: { label: "Running", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  done:    { label: "Done",    color: "var(--primary)", bg: "rgba(60,130,98,0.1)" },
  failed:  { label: "Failed",  color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const best = experiments.reduce((b, e) => (e.avgReward ?? -1) > (b.avgReward ?? -1) ? e : b);

export function ExperimentsPage() {
  const [expanded, setExpanded] = useState<string | null>("exp-006");

  const toggle = (id: string) => setExpanded(e => e === id ? null : id);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div className="border-b px-8 py-3 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: "var(--border)" }}>
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color: "var(--foreground)" }}>Experiments</span>
        </div>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
          style={{ background: "var(--primary)", color: "#fff" }}>
          <Plus size={12} /> New experiment
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total", value: String(experiments.length), icon: FlaskConical },
            { label: "Running", value: String(experiments.filter(e=>e.status==="running").length), icon: TrendingUp },
            { label: "Best avg reward", value: best.avgReward ? best.avgReward.toFixed(2) : "—", icon: TrendingUp },
            { label: "Best policy", value: best.policy, icon: FlaskConical },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <Icon size={16} className="mb-3" style={{ color: "var(--primary)" }} />
              <div className="text-2xl font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>{value}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Experiments table */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
            All Experiments
          </div>

          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_100px_80px_80px_90px_80px] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: "var(--muted-foreground)" }}>
            <span>Name</span><span>Model</span><span>Policy</span>
            <span>Avg reward</span><span>Steps</span><span>Started</span><span>Status</span>
          </div>

          {experiments.map((exp) => {
            const ss = statusStyle[exp.status];
            const isExpanded = expanded === exp.id;
            return (
              <div key={exp.id} className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{ background: "var(--card)", border: `1px solid ${isExpanded ? "var(--primary)" : "var(--border)"}` }}>
                <button onClick={() => toggle(exp.id)}
                  className="w-full grid grid-cols-[1fr_100px_100px_80px_80px_90px_80px] gap-4 px-4 py-3.5 items-center text-left">
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown size={12} style={{ color: "var(--primary)" }} /> : <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />}
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{exp.name}</div>
                      <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{exp.id} · {exp.product}</div>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{exp.model}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{exp.policy}</span>
                  <span className="text-sm font-semibold" style={{ color: exp.avgReward ? "var(--primary)" : "var(--muted-foreground)" }}>
                    {exp.avgReward?.toFixed(2) ?? "—"}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{exp.steps.toLocaleString()}</span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{exp.started}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                </button>

                {isExpanded && exp.rewardHistory.length > 0 && (
                  <div className="border-t px-5 py-4" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>
                      Reward Curve
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={exp.rewardHistory}>
                        <XAxis dataKey="step" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                        <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                        <Line type="monotone" dataKey="reward" stroke="#3C8262" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {isExpanded && exp.status === "failed" && (
                  <div className="border-t px-5 py-3" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs" style={{ color: "#ef4444" }}>
                      Environment setup failed — could not initialise reward verifiers. Check schema configuration.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
