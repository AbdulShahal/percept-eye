import { ChevronRight, ArrowRight, GitMerge, Layers, AlertTriangle, CheckCircle2 } from "lucide-react";

const initiatives = [
  {
    id: "auth-unification",
    name: "Auth Token Unification",
    status: "active",
    description: "Harmonise OAuth scopes across Atlassian JIRA and GitHub so a single bearer token works across both products.",
    products: ["Atlassian JIRA", "GitHub"],
    progress: 60,
    agents: ["Scout", "Compass"],
    insight: "Scout found 3 scope mismatches between JIRA and GitHub token formats. Compass is designing a normalisation layer.",
  },
  {
    id: "schema-overlap",
    name: "Schema Overlap Detection",
    status: "active",
    description: "Find duplicate or conflicting entity schemas across products to prevent Ranger training on contradictory reward signals.",
    products: ["Atlassian JIRA", "Linear", "GitHub"],
    progress: 30,
    agents: ["Scout"],
    insight: "Issue entity appears in JIRA, Linear and GitHub with conflicting field names (id vs issueId vs number).",
  },
  {
    id: "workflow-bridge",
    name: "Workflow Bridge",
    status: "planned",
    description: "Enable missions to span two products in a single run — e.g. create a JIRA issue from a GitHub PR merge event.",
    products: ["Atlassian JIRA", "GitHub"],
    progress: 0,
    agents: [],
    insight: "Blocked on Auth Token Unification completing first.",
  },
  {
    id: "novelty-corpus",
    name: "Shared Novelty Corpus",
    status: "planned",
    description: "Pool exploration signals from all product missions into one novelty store so Ranger avoids duplicate investigations.",
    products: ["All products"],
    progress: 0,
    agents: [],
    insight: "Design phase — waiting for first multi-product mission to complete.",
  },
];

const statusProps = {
  active: { label: "Active", color: "var(--primary)", bg: "rgba(60,130,98,0.12)" },
  planned: { label: "Planned", color: "var(--muted-foreground)", bg: "var(--card-elevated)" },
};

const agents = [
  { name: "Scout", role: "Schema discovery", color: "#3C8262" },
  { name: "Compass", role: "Reward alignment", color: "#52a67d" },
  { name: "Ranger", role: "Policy training", color: "#2d6249" },
];

export function CrossProductView() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 border-b px-8 py-3 flex items-center justify-between"
        style={{ background: "var(--background)EE", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}
      >
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <span>Workspace</span>
          <ChevronRight size={12} className="opacity-40" />
          <span style={{ color: "var(--foreground)" }}>Cross-product</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(60,130,98,0.12)", color: "var(--primary)" }}>
          <Layers size={11} />
          2 active initiatives
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
            Cross-product
          </div>
          <h2 className="text-3xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Multi-product Initiatives
          </h2>
          <p className="text-sm max-w-xl" style={{ color: "var(--muted-foreground)" }}>
            Work that spans more than one product — schema harmonisation, shared reward signals, and cross-product workflow bridges.
          </p>
        </div>

        {/* Agent involvement map */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--muted-foreground)" }}>
            Agent coverage across products
          </div>
          <div className="flex items-center gap-6">
            {agents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                  style={{ background: agent.color, color: "#fff" }}
                >
                  {agent.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {agent.name}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    {agent.role}
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: "var(--border)", opacity: 0.5 }} />
              </div>
            ))}
            <div className="flex-1 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>
              <GitMerge size={14} className="inline mr-1.5" />
              All agents share a unified observation space
            </div>
          </div>
        </div>

        {/* Initiative list */}
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
            Initiatives
          </div>

          {initiatives.map((init) => {
            const sp = statusProps[init.status as keyof typeof statusProps];
            return (
              <div
                key={init.id}
                className="rounded-2xl p-6 space-y-4 transition-all duration-200 hover:scale-[1.005] cursor-pointer"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                {/* Row 1: name + status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h4 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                        {init.name}
                      </h4>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: sp.bg, color: sp.color }}
                      >
                        {sp.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      {init.description}
                    </p>
                  </div>
                  {init.status === "active" && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-semibold" style={{ color: "var(--primary)" }}>
                        {init.progress}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                        complete
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {init.status === "active" && (
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--card-elevated)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${init.progress}%`, background: "var(--primary)" }}
                    />
                  </div>
                )}

                {/* Row 2: products + agents + insight */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Products */}
                  <div className="flex items-center gap-1.5">
                    {init.products.map((p) => (
                      <span
                        key={p}
                        className="text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: "var(--card-elevated)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {init.agents.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {init.agents.map((a) => (
                        <div
                          key={a}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                          style={{ background: "rgba(60,130,98,0.1)", color: "var(--primary)" }}
                        >
                          <CheckCircle2 size={10} />
                          {a}
                        </div>
                      ))}
                    </div>
                  )}

                  {init.status === "planned" && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <AlertTriangle size={11} />
                      {init.insight}
                    </div>
                  )}
                </div>

                {/* Insight callout for active */}
                {init.status === "active" && (
                  <div
                    className="rounded-xl px-4 py-3 text-xs leading-relaxed"
                    style={{ background: "rgba(60,130,98,0.07)", border: "1px solid var(--primary)", color: "var(--foreground)" }}
                  >
                    <span style={{ color: "var(--primary)", fontWeight: 500 }}>Insight: </span>
                    {init.insight}
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
