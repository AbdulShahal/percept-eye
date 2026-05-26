import { CheckCircle, ExternalLink, Plus } from "lucide-react";
import { Diagram } from "./Diagram";

interface PremiumDashboardProps {
  onNewMission: () => void;
  navigateTo: (tab: string) => void;
}

export function PremiumDashboard({ onNewMission, navigateTo }: PremiumDashboardProps) {
  const agents = [
    {
      name: "Scout",
      role: "Discovery & schema mapping",
      initial: "S",
      color: "#3C8262",
      status: "active",
      quote:
        "Since I'm done discovering, Compass takes over with reward design and Ranger trains the policy. I do step one of three.",
    },
    {
      name: "Compass",
      role: "Reward design & alignment",
      initial: "C",
      color: "#52a67d",
      status: "active",
      quote:
        "When something looks wrong — a verifier disagrees with the rubric, the policy starts gaming the schema check — Compass redesigns rewards, Ranger trains the policy.",
    },
    {
      name: "Ranger",
      role: "Policy training & rollout",
      initial: "R",
      color: "#2d6249",
      status: "standby",
      quote:
        "I train directly on the reward signal Compass designs and the environment Scout mapped. When the policy converges, I roll it out.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Breadcrumb + top bar */}
      <div
        className="sticky top-0 z-10 border-b flex items-center justify-between px-8 py-3"
        style={{
          background: "var(--background)EE",
          backdropFilter: "blur(12px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>Workspace</span>
          <span className="mx-1.5 opacity-40">/</span>
          <span style={{ color: "var(--foreground)" }}>Home</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-56 px-4 py-1.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(60,130,98,0.12)", color: "var(--primary)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow inline-block" style={{ background: "var(--primary)" }} />
            All systems live
          </div>
        </div>
      </div>

      <div className="flex min-h-0">
        {/* Left content */}
        <div className="flex-1 px-10 py-10 space-y-10">
          {/* Hero */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>
              AI MISSION CONTROL · MISSION IN FLIGHT
            </div>
            <div>
              <h1 className="text-5xl font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
                Welcome back, Srini.
              </h1>
              <h1 className="text-5xl font-semibold leading-tight" style={{ color: "var(--primary)" }}>
                Your mission is in flight.
              </h1>
            </div>

            {/* Active mission badge */}
            <div
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl mt-2 text-sm"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }}
              />
              <span style={{ color: "var(--muted-foreground)" }} className="text-xs">
                Atlassian JIRA · Atlas Forge · 06:37 is training
              </span>
              <button onClick={() => navigateTo("missions")} className="text-xs" style={{ color: "var(--primary)" }}>
                Open it for the live →
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  boxShadow: "0 0 20px var(--glow-primary)",
                }}
              >
                <CheckCircle size={15} />
                Review 12 pending decisions
              </button>
              <button
                onClick={() => navigateTo("mission-overview")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <ExternalLink size={14} />
                Open Mission
              </button>
              <button
                onClick={onNewMission}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                <Plus size={14} />
                New Mission
              </button>
            </div>
          </div>

          {/* Three agents working in parallel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Active Agents
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  Three agents, working in parallel
                </h3>
              </div>
              <button onClick={() => navigateTo("agent-profiles")} className="text-xs" style={{ color: "var(--primary)" }}>
                View agent profiles →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.name}
                  className="rounded-2xl p-5 space-y-3 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: agent.color, color: "#fff" }}
                    >
                      {agent.initial}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                        {agent.name}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                        {agent.role}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: agent.status === "active" ? "rgba(60,130,98,0.15)" : "var(--card-elevated)",
                          color: agent.status === "active" ? "var(--primary)" : "var(--muted-foreground)",
                        }}
                      >
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    "{agent.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Mission Control Viz */}
        <div
          className="w-80 flex-shrink-0 border-l flex flex-col overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "#070e0a" }}>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: "rgba(60,130,98,0.7)" }}>
                Mission Control
              </div>
              <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                Live Orchestration
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(60,130,98,0.8)" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse-glow" style={{ background: "#3C8262" }} />
              active
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <div className="w-full h-full">
              <Diagram />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
