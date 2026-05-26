import { useState, useEffect } from "react";
import { X, ChevronDown, Zap } from "lucide-react";

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const products = ["Atlassian JIRA", "GitHub", "Linear", "Slack", "Notion", "Salesforce", "Other / Custom API"];
const agentOptions = [
  { id: "scout", name: "Scout", role: "Discovery & schema mapping", color: "#3C8262" },
  { id: "compass", name: "Compass", role: "Reward design & alignment", color: "#52a67d" },
  { id: "ranger", name: "Ranger", role: "Policy training & rollout", color: "#2d6249" },
];
const modes = ["Training", "Evaluation", "Exploration"] as const;

export function NewMissionModal({ isOpen, onClose }: NewMissionModalProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [product, setProduct] = useState(products[0]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["scout", "compass", "ranger"]);
  const [mode, setMode] = useState<typeof modes[number]>("Training");
  const [step, setStep] = useState<"form" | "launching">("form");

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setName("");
        setGoal("");
        setProduct(products[0]);
        setSelectedAgents(["scout", "compass", "ranger"]);
        setMode("Training");
        setStep("form");
      }, 300);
    }
  }, [isOpen]);

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleLaunch = () => {
    if (!name.trim()) return;
    setStep("launching");
    setTimeout(() => onClose(), 1800);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px var(--border)",
          animation: "modal-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <style>{`
          @keyframes modal-in {
            from { opacity: 0; transform: scale(0.92) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {step === "launching" ? (
          /* ── Launching state ── */
          <div className="py-20 flex flex-col items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(60,130,98,0.15)",
                border: "1px solid var(--primary)",
                animation: "spin-slow 2s linear infinite",
              }}
            >
              <Zap size={28} style={{ color: "var(--primary)" }} />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                Launching mission…
              </div>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Scout is initialising endpoint discovery for {product}
              </div>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Header */}
            <div
              className="px-7 py-5 flex items-center justify-between border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--muted-foreground)" }}>
                  New Mission
                </div>
                <div className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  Configure &amp; launch
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "var(--card-elevated)", color: "var(--muted-foreground)" }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5">
              {/* Mission name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium normal-case tracking-normal" style={{ color: "var(--muted-foreground)" }}>
                  Mission name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Atlassian JIRA — reward iteration 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--background)",
                    border: `1px solid ${name ? "var(--primary)" : "var(--border)"}`,
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium normal-case tracking-normal" style={{ color: "var(--muted-foreground)" }}>
                  Goal <span style={{ opacity: 0.5 }}>(optional)</span>
                </label>
                <textarea
                  placeholder="What should this mission accomplish?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Product */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium normal-case tracking-normal" style={{ color: "var(--muted-foreground)" }}>
                  Target product / API
                </label>
                <div className="relative">
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 pr-9"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    {products.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </div>

              {/* Agents */}
              <div className="space-y-2">
                <label className="text-xs font-medium normal-case tracking-normal" style={{ color: "var(--muted-foreground)" }}>
                  Agents
                </label>
                <div className="space-y-2">
                  {agentOptions.map((agent) => {
                    const active = selectedAgents.includes(agent.id);
                    return (
                      <button
                        key={agent.id}
                        onClick={() => toggleAgent(agent.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                        style={{
                          background: active ? "rgba(60,130,98,0.07)" : "var(--background)",
                          border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: active ? agent.color : "var(--card-elevated)", color: active ? "#fff" : "var(--muted-foreground)" }}
                        >
                          {agent.name[0]}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium" style={{ color: active ? "var(--foreground)" : "var(--muted-foreground)" }}>
                            {agent.name}
                          </div>
                          <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                            {agent.role}
                          </div>
                        </div>
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: active ? "var(--primary)" : "transparent",
                            border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                          }}
                        >
                          {active && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode */}
              <div className="space-y-2">
                <label className="text-xs font-medium normal-case tracking-normal" style={{ color: "var(--muted-foreground)" }}>
                  Mode
                </label>
                <div className="flex items-center gap-2">
                  {modes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: mode === m ? "var(--primary)" : "var(--background)",
                        color: mode === m ? "#fff" : "var(--muted-foreground)",
                        border: `1px solid ${mode === m ? "var(--primary)" : "var(--border)"}`,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-7 py-4 border-t flex items-center justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm transition-all duration-200"
                style={{ color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                disabled={!name.trim() || selectedAgents.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  boxShadow: name.trim() ? "0 0 20px var(--glow-primary)" : "none",
                }}
              >
                <Zap size={14} />
                Launch mission
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
