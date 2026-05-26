import { ChevronRight } from "lucide-react";

const convergenceMetrics = [
  { label: "Reward saturation", value: "—" },
  { label: "Reward variance", value: "—" },
  { label: "Proto pie-rate", value: "—" },
  { label: "Quality score", value: "—" },
  { label: "Avg reward", value: "—" },
  { label: "Σ reward", value: "—" },
];

const capabilities = [
  "Train policies on selection ranking",
  "Manage GPU pools & checkpoint cadence",
  "Add tiers of compose or reward divergence",
  "Surface & fix thru, throughput",
  "Run rollouts efficiently across hardware",
];

function RLFlowDiagram() {
  const nodeStyle = (color = "var(--card)"): React.CSSProperties => ({
    background: color,
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--foreground)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap" as const,
  });

  const dot = (color: string) => (
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 360 }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
        {/* Edges - approximated for a static layout */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--border)" />
          </marker>
        </defs>
        {/* Reward Function → Agent Actions */}
        <line x1="25%" y1="22%" x2="52%" y2="22%" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrow)" />
        {/* Agent Actions → Environment */}
        <line x1="68%" y1="22%" x2="78%" y2="38%" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrow)" />
        {/* Environment → Metrics */}
        <line x1="75%" y1="52%" x2="60%" y2="62%" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrow)" />
        {/* Metrics → Policy */}
        <line x1="45%" y1="65%" x2="35%" y2="52%" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#arrow)" strokeOpacity="0.7" />
        {/* Policy → Agent Actions */}
        <line x1="30%" y1="38%" x2="55%" y2="28%" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrow)" />
        {/* Mock Tools → Policy */}
        <line x1="20%" y1="45%" x2="25%" y2="50%" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrow)" />
        {/* Personas → Metrics */}
        <line x1="20%" y1="68%" x2="42%" y2="65%" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrow)" />
      </svg>

      {/* Reward function - top left */}
      <div className="absolute" style={{ top: "12%", left: "8%" }}>
        <div style={nodeStyle()}>
          {dot("#3C8262")}
          Reward function
          <span className="text-[10px] ml-1 opacity-50">verified · pass</span>
        </div>
      </div>

      {/* Agent Actions - top center */}
      <div className="absolute" style={{ top: "12%", left: "43%" }}>
        <div style={nodeStyle()}>
          {dot("#52a67d")}
          Agent Actions
          <span className="text-[10px] ml-1 opacity-50">last Call: Scout</span>
        </div>
      </div>

      {/* Environment - right */}
      <div className="absolute" style={{ top: "35%", right: "6%" }}>
        <div style={nodeStyle()}>
          {dot("#2d6249")}
          Environment
          <span className="text-[10px] ml-1 opacity-50">Compass.env</span>
        </div>
      </div>

      {/* Mock Tools - left middle */}
      <div className="absolute" style={{ top: "38%", left: "4%" }}>
        <div style={nodeStyle()}>
          {dot("#888")}
          Mock Tools
          <span className="text-[10px] ml-1 opacity-50">last Call: Scout</span>
        </div>
      </div>

      {/* Policy - center left */}
      <div className="absolute" style={{ top: "44%", left: "20%" }}>
        <div style={nodeStyle("var(--card-elevated)")}>
          {dot("#3C8262")}
          Policy
          <span className="text-[10px] ml-1 opacity-50">base model</span>
        </div>
      </div>

      {/* Metrics - center (highlighted) */}
      <div className="absolute" style={{ top: "56%", left: "40%" }}>
        <div
          style={{
            ...nodeStyle(),
            background: "rgba(60,130,98,0.15)",
            border: "1.5px solid var(--primary)",
            color: "var(--primary)",
          }}
        >
          {dot("var(--primary)")}
          Metrics
          <span className="text-[10px] ml-1" style={{ color: "var(--primary)", opacity: 0.7 }}>
            reward · investigation
          </span>
        </div>
      </div>

      {/* Personas - bottom left */}
      <div className="absolute" style={{ top: "62%", left: "4%" }}>
        <div style={nodeStyle()}>
          {dot("#888")}
          Personas
        </div>
      </div>
    </div>
  );
}

export function PremiumAgents() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 border-b px-8 py-3 flex items-center justify-between"
        style={{ background: "var(--background)EE", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}
      >
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <span>Your Team</span>
          <ChevronRight size={12} className="opacity-40" />
          <span style={{ color: "var(--foreground)" }}>Ranger</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-3 py-1 rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
            UNIT: rlsys · group: rl_plan · role: rl_inspector
          </div>
          <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--primary)", color: "#fff" }}>
            Introspect
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main area: flow diagram + iteration trace + capabilities */}
        <div className="flex-1 flex flex-col">
          {/* Ranger header */}
          <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
              UNIT: rlsys · group: rl_plan · role: rl_inspector
            </div>
            <h2 className="text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
              Ranger
            </h2>
          </div>

          {/* RL Flow Diagram */}
          <div
            className="mx-8 my-6 rounded-2xl relative overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)", height: 380 }}
          >
            <RLFlowDiagram />
          </div>

          {/* Iteration trace */}
          <div className="px-8 pb-4 space-y-3">
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Iteration Trace
            </div>
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl font-semibold"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              8
            </div>
          </div>

          {/* What Ranger can do */}
          <div className="px-8 pb-8 space-y-3">
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
              What Ranger can do
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar: Convergence metrics */}
        <div
          className="w-56 flex-shrink-0 border-l p-6 space-y-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
            Convergence
          </div>

          <div className="space-y-3">
            {convergenceMetrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {metric.label}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination hint */}
          <div className="pt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            1 / 16
          </div>
        </div>
      </div>
    </div>
  );
}
