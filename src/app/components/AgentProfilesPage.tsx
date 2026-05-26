import { ArrowLeft, ChevronRight, CheckCircle2, Clock, Zap, Brain, Search, Target, Shield } from "lucide-react";

type TabId = string;
interface Props { onBack: () => void; navigateTo: (tab: TabId) => void; }

const agents = [
  {
    id: "scout",
    tab: "scout",
    name: "Scout",
    role: "Discovery & Schema Mapping",
    color: "#3C8262",
    bgGlow: "rgba(60,130,98,0.1)",
    status: "done",
    statusLabel: "Done ✓",
    statusColor: "var(--primary)",
    headline: "Autonomous endpoint discovery agent that maps API surfaces, parses schemas, and surfaces ambiguities for Compass.",
    currentTask: "47 endpoints surfaced across JIRA's REST + GraphQL surface. Schema handed off to Compass.",
    metrics: [
      { label: "Endpoints found", value: "47" },
      { label: "Schemas parsed", value: "12" },
      { label: "Workflows mapped", value: "2" },
      { label: "Accuracy", value: "96%" },
    ],
    capabilities: ["OpenAPI / GraphQL / gRPC parsing", "Endpoint deduplication", "Schema conflict detection", "Workflow pattern recognition", "Compass handoff protocol"],
    icon: Search,
  },
  {
    id: "compass",
    tab: "compass",
    name: "Compass",
    role: "Reward Design & Alignment",
    color: "#52a67d",
    bgGlow: "rgba(82,166,125,0.1)",
    status: "working",
    statusLabel: "Working…",
    statusColor: "#f59e0b",
    headline: "Designs and iterates reward functions that align the policy with desired API behaviour. Runs verifiers to detect misalignment.",
    currentTask: "Resolving verifier disagreement on GET /search — completeness 34%, expected ≥ 80%. Iteration 3 of 5.",
    metrics: [
      { label: "Reward rules", value: "5" },
      { label: "Pass / Fail", value: "3 / 1" },
      { label: "Iterations", value: "3" },
      { label: "Redesigns", value: "1" },
    ],
    capabilities: ["Reward rubric construction", "Verifier orchestration", "Schema-conditional rewards", "Multi-criteria alignment", "Ranger handoff protocol"],
    icon: Brain,
  },
  {
    id: "rangers",
    tab: "rangers",
    name: "Ranger",
    role: "Policy Training & Rollout",
    color: "#2d6249",
    bgGlow: "rgba(45,98,73,0.1)",
    status: "pending",
    statusLabel: "Pending ⏳",
    statusColor: "var(--muted-foreground)",
    headline: "Trains RL policies on the reward signal Compass designs. Monitors convergence, runs rollouts, and deploys the final policy.",
    currentTask: "Awaiting Compass reward signal. Policy initialisation queued.",
    metrics: [
      { label: "Policy version", value: "—" },
      { label: "Training steps", value: "—" },
      { label: "Avg reward", value: "—" },
      { label: "Convergence", value: "—" },
    ],
    capabilities: ["PPO / GRPO policy training", "Multi-step rollouts", "Reward variance tracking", "Checkpoint management", "Live policy deployment"],
    icon: Shield,
  },
];

export function AgentProfilesPage({ onBack, navigateTo }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b px-8 py-3 flex items-center gap-3"
        style={{ background: "var(--background)EE", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
          <ArrowLeft size={12} /> Back
        </button>
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color: "var(--foreground)" }}>Agent Profiles</span>
        </div>
      </div>

      <div className="px-8 py-8 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
            Your Team
          </div>
          <h2 className="text-3xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Agent Profiles</h2>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            The three agents behind every PerceptEye mission.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.id} className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.005]"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                {/* Card header */}
                <div className="px-6 pt-6 pb-4" style={{ background: agent.bgGlow }}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: agent.color, color: "#fff" }}>
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>{agent.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{agent.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${agent.statusColor}22`, color: agent.statusColor }}>
                    {agent.statusLabel}
                  </span>
                </div>

                <div className="px-6 py-5 flex flex-col flex-1 space-y-5">
                  {/* Headline */}
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{agent.headline}</p>

                  {/* Current task */}
                  <div className="rounded-xl p-3" style={{ background: "var(--card-elevated)", border: "1px solid var(--border)" }}>
                    <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
                      Current task
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{agent.currentTask}</p>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {agent.metrics.map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-3" style={{ background: "var(--card-elevated)" }}>
                        <div className="text-lg font-semibold" style={{ color: value === "—" ? "var(--muted-foreground)" : "var(--foreground)", opacity: value === "—" ? 0.35 : 1 }}>
                          {value}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Capabilities */}
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>
                      Capabilities
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.capabilities.map((cap) => (
                        <span key={cap} className="text-[10px] px-2 py-1 rounded-lg"
                          style={{ background: "var(--card-elevated)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Open button */}
                  <button onClick={() => navigateTo(agent.tab as TabId)}
                    className="mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: agent.color, color: "#fff" }}>
                    Open {agent.name} page →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
