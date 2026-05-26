import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder, Download, GitBranch, Clock } from "lucide-react";

type FileNode = { name: string; type: "file"; ext: string; size: string; modified: string; content: string };
type FolderNode = { name: string; type: "folder"; children: (FileNode | FolderNode)[] };
type TreeNode = FileNode | FolderNode;

const tree: FolderNode = {
  name: "repo-root", type: "folder", children: [
    { name: "tools", type: "folder", children: [
      { name: "episode", type: "folder", children: [
        { name: "ep-001.json", type: "file", ext: "json", size: "4.2 KB", modified: "Today 06:52",
          content: `{\n  "episode_id": "ep-001",\n  "product": "atlassian-jira",\n  "steps": 45,\n  "total_reward": 12.3,\n  "avg_reward": 0.27,\n  "actions": [\n    { "step": 1, "action": "GET /myself", "reward": 0.8 },\n    { "step": 2, "action": "GET /project", "reward": 0.6 },\n    { "step": 3, "action": "POST /issues", "reward": 0.9 }\n  ]\n}` },
        { name: "ep-002.json", type: "file", ext: "json", size: "5.1 KB", modified: "Today 06:53",
          content: `{\n  "episode_id": "ep-002",\n  "product": "atlassian-jira",\n  "steps": 52,\n  "total_reward": 14.8,\n  "avg_reward": 0.28,\n  "novel_actions": 3\n}` },
      ]},
      { name: "rewards", type: "folder", children: [
        { name: "reward-rules.yaml", type: "file", ext: "yaml", size: "1.8 KB", modified: "Today 06:54",
          content: `version: "3"\nproduct: atlassian-jira\niteration: 3\nrules:\n  - endpoint: POST /issues\n    rule: verifier_accepts_jira_format\n    weight: 0.30\n    status: pass\n  - endpoint: GET /search\n    rule: response_completeness_80pct\n    weight: 0.25\n    status: fail\n  - endpoint: PUT /issues/{id}\n    rule: idempotency_invariant\n    weight: 0.20\n    status: pass` },
        { name: "reward-schema.json", type: "file", ext: "json", size: "2.4 KB", modified: "Today 06:51",
          content: `{\n  "schema_version": "1.0",\n  "reward_type": "dense",\n  "normalization": "unit_interval",\n  "aggregation": "weighted_sum"\n}` },
      ]},
      { name: "rules", type: "folder", children: [
        { name: "policy-rules.json", type: "file", ext: "json", size: "3.3 KB", modified: "Today 06:49",
          content: `{\n  "policy_id": "jira-v1",\n  "rules": [\n    { "name": "no_duplicate_writes", "severity": "hard" },\n    { "name": "auth_scoped_correctly", "severity": "hard" },\n    { "name": "pagination_aware", "severity": "soft" }\n  ]\n}` },
      ]},
    ]},
    { name: "policies", type: "folder", children: [
      { name: "policy-v1.pt", type: "file", ext: "pt", size: "142 MB", modified: "Today 06:55",
        content: "Binary PyTorch checkpoint — policy version 1.\nArchitecture: Transformer, 7B params\nCheckpoint step: 0 (initialising)" },
    ]},
    { name: "schemas", type: "folder", children: [
      { name: "jira-openapi.json", type: "file", ext: "json", size: "892 KB", modified: "Today 06:50",
        content: `{\n  "openapi": "3.0.3",\n  "info": { "title": "Atlassian JIRA REST API", "version": "3" },\n  "paths": {\n    "/rest/api/3/issue": { "post": { "summary": "Create issue" } },\n    "/rest/api/3/search": { "get": { "summary": "Search issues (JQL)" } },\n    "/rest/api/3/myself": { "get": { "summary": "Get current user" } }\n  }\n}` },
    ]},
  ],
};

const versions = [
  { v: "v3", ts: "Today 06:54", note: "Tightened search threshold 60%→80%" },
  { v: "v2", ts: "Today 06:51", note: "Added idempotency rule" },
  { v: "v1", ts: "Today 06:48", note: "Initial Scout handoff" },
];

function TreeItem({ node, depth, onSelect, selected }: { node: TreeNode; depth: number; onSelect: (n: FileNode) => void; selected: string | null }) {
  const [open, setOpen] = useState(depth < 2);
  const indent = depth * 16;

  if (node.type === "folder") {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs transition-all duration-150 hover:bg-[var(--card-elevated)]"
          style={{ paddingLeft: 12 + indent, color: "var(--muted-foreground)" }}>
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {open ? <FolderOpen size={13} style={{ color: "var(--primary)" }} /> : <Folder size={13} style={{ color: "var(--primary)", opacity: 0.6 }} />}
          <span>{node.name}</span>
        </button>
        {open && node.children.map((child, i) => (
          <TreeItem key={i} node={child} depth={depth + 1} onSelect={onSelect} selected={selected} />
        ))}
      </div>
    );
  }

  const isSelected = selected === node.name;
  const extColor = node.ext === "json" ? "#f59e0b" : node.ext === "yaml" ? "#3C8262" : node.ext === "pt" ? "#8b5cf6" : "#888";
  return (
    <button onClick={() => onSelect(node)} className="w-full flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs transition-all duration-150"
      style={{ paddingLeft: 12 + indent, background: isSelected ? "rgba(60,130,98,0.1)" : "transparent",
        color: isSelected ? "var(--foreground)" : "var(--muted-foreground)",
        border: isSelected ? "1px solid var(--primary)" : "1px solid transparent" }}>
      <FileText size={12} style={{ color: extColor }} />
      <span className="flex-1 text-left truncate">{node.name}</span>
      <span className="text-[9px] uppercase px-1 rounded" style={{ background: `${extColor}22`, color: extColor }}>{node.ext}</span>
    </button>
  );
}

export function ArtifactsPage() {
  const [selected, setSelected] = useState<FileNode | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="border-b px-8 py-3 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: "var(--border)" }}>
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color: "var(--foreground)" }}>Artifacts</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <GitBranch size={12} />
          Atlas Forge · run af-8472
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tree panel */}
        <div className="w-64 flex-shrink-0 border-r overflow-y-auto py-3" style={{ borderColor: "var(--border)" }}>
          <div className="px-4 pb-2 text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
            Artifact Tree
          </div>
          <TreeItem node={tree} depth={0} onSelect={setSelected} selected={selected?.name ?? null} />
        </div>

        {/* Content panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* File header */}
              <div className="border-b px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} style={{ color: "var(--primary)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{selected.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold"
                      style={{ background: "rgba(60,130,98,0.12)", color: "var(--primary)" }}>{selected.ext}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1"><Clock size={10} /> {selected.modified}</span>
                    <span>{selected.size}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                  <Download size={12} /> Download
                </button>
              </div>

              {/* Code content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="rounded-xl overflow-hidden" style={{ background: "#0d1810", border: "1px solid rgba(60,130,98,0.2)" }}>
                  <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(60,130,98,0.15)" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3C8262" }} />
                    <span className="text-[10px] ml-2" style={{ color: "rgba(60,130,98,0.5)" }}>{selected.name}</span>
                  </div>
                  <pre className="px-5 py-4 text-xs leading-relaxed overflow-x-auto"
                    style={{ color: "#a8d5b8", fontFamily: "ui-monospace, monospace" }}>
                    {selected.content}
                  </pre>
                </div>

                {/* Version history */}
                {selected.name.includes("reward") && (
                  <div className="mt-5 space-y-3">
                    <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
                      Version History
                    </div>
                    {versions.map((v) => (
                      <div key={v.v} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={{ background: "rgba(60,130,98,0.12)", color: "var(--primary)" }}>{v.v}</span>
                        <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>{v.note}</span>
                        <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{v.ts}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <FileText size={24} style={{ color: "var(--primary)", opacity: 0.5 }} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>Select a file</div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Click any file in the tree to preview its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
