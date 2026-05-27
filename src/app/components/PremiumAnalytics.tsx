import { useState } from "react";
import {
  ChevronRight, Search, Clock, Calendar, FileCode2, GitBranch,
  ChevronDown, Layers, Zap, Shield, AlertCircle, CheckCircle2,
  Network, Route, Database, Tag, ExternalLink, Copy,
} from "lucide-react";
import scoutLogoDark from "../../imports/logo-1.png";
import scoutLogoLight from "../../imports/logo-1-light.png";
import { useTheme } from "./ThemeProvider";

// ── shared data ─────────────────────────────────────────────────────────────

const pipelineSteps = [
  { label: "Receiving spec",      sublabel: "from launch · 48s",                              status: "done" },
  { label: "Parsing schema",      sublabel: "OpenAPI 3.x · gPTG · GraphQL · JSON Schema",     status: "done" },
  { label: "Surfacing endpoints", sublabel: "starting first scan",                             status: "working" },
  { label: "Ready for Compass",   sublabel: "",                                                status: "pending" },
];

const discoveredWorkflows = [
  { label: "Find this spec", type: "FIND" },
  { label: "Search this spec", type: "SEARCH" },
];

const historyRuns = [
  { id: "run-001", product: "Atlassian JIRA", mission: "Atlas Forge", endpoints: 47,
    schemas: 12, workflows: 2, duration: "4m 22s", status: "done", ts: "Today 06:48" },
];

const futureQueue = [
  { product: "GitHub",   api: "REST v3 + GraphQL", reason: "Queued after Atlas Forge",  eta: "~2 hours" },
  { product: "Linear",   api: "GraphQL",           reason: "Planned — not yet started",  eta: "TBD" },
  { product: "Slack",    api: "REST",              reason: "Planned — not yet started",  eta: "TBD" },
  { product: "Notion",   api: "REST",              reason: "Planned — not yet started",  eta: "TBD" },
];

// ── spec tab data ────────────────────────────────────────────────────────────

const specMeta = {
  title: "JIRA Cloud REST API",
  version: "v3",
  format: "OpenAPI 3.1",
  specVersion: "3.1.0",
  servers: ["https://your-domain.atlassian.net/rest/api/3"],
  lines: 2847,
  paths: 47,
  schemas: 12,
  securitySchemes: 2,
  tags: 8,
};

const specResources = [
  {
    tag: "Issues",
    paths: [
      { method: "GET",    path: "/rest/api/3/issue/{issueIdOrKey}",        summary: "Get issue" },
      { method: "POST",   path: "/rest/api/3/issue",                        summary: "Create issue" },
      { method: "PUT",    path: "/rest/api/3/issue/{issueIdOrKey}",        summary: "Edit issue" },
      { method: "DELETE", path: "/rest/api/3/issue/{issueIdOrKey}",        summary: "Delete issue" },
      { method: "GET",    path: "/rest/api/3/issue/picker",                 summary: "Get issue picker suggestions" },
    ],
  },
  {
    tag: "Search",
    paths: [
      { method: "GET",  path: "/rest/api/3/search",          summary: "Search for issues using JQL" },
      { method: "POST", path: "/rest/api/3/search",          summary: "Search for issues using JQL (POST)" },
      { method: "GET",  path: "/rest/api/3/jql/autocomplete", summary: "Get field reference data (JQL)" },
    ],
  },
  {
    tag: "Projects",
    paths: [
      { method: "GET",  path: "/rest/api/3/project",              summary: "Get all projects" },
      { method: "POST", path: "/rest/api/3/project",              summary: "Create project" },
      { method: "GET",  path: "/rest/api/3/project/{projectIdOrKey}", summary: "Get project" },
      { method: "PUT",  path: "/rest/api/3/project/{projectIdOrKey}", summary: "Update project" },
    ],
  },
  {
    tag: "Users",
    paths: [
      { method: "GET",  path: "/rest/api/3/user",              summary: "Get user" },
      { method: "GET",  path: "/rest/api/3/users/search",      summary: "Find users" },
      { method: "GET",  path: "/rest/api/3/user/assignable/search", summary: "Find users assignable to issues" },
    ],
  },
  {
    tag: "Boards",
    paths: [
      { method: "GET",  path: "/rest/agile/1.0/board",                    summary: "Get all boards" },
      { method: "GET",  path: "/rest/agile/1.0/board/{boardId}",          summary: "Get board" },
      { method: "GET",  path: "/rest/agile/1.0/board/{boardId}/sprint",   summary: "Get all sprints" },
      { method: "GET",  path: "/rest/agile/1.0/board/{boardId}/backlog",  summary: "Get issues for backlog" },
    ],
  },
  {
    tag: "Comments",
    paths: [
      { method: "GET",    path: "/rest/api/3/issue/{issueIdOrKey}/comment",           summary: "Get comments" },
      { method: "POST",   path: "/rest/api/3/issue/{issueIdOrKey}/comment",           summary: "Add comment" },
      { method: "PUT",    path: "/rest/api/3/issue/{issueIdOrKey}/comment/{id}",      summary: "Update comment" },
      { method: "DELETE", path: "/rest/api/3/issue/{issueIdOrKey}/comment/{id}",      summary: "Delete comment" },
    ],
  },
];

const specSchemas = [
  { name: "IssueBean",         fields: 42, refs: 18, description: "Represents a JIRA issue" },
  { name: "SearchResults",     fields: 8,  refs: 4,  description: "Paginated issue search response" },
  { name: "Project",           fields: 31, refs: 12, description: "JIRA project configuration" },
  { name: "User",              fields: 19, refs: 7,  description: "User account details" },
  { name: "Comment",           fields: 14, refs: 5,  description: "Issue comment body and metadata" },
  { name: "Sprint",            fields: 11, refs: 3,  description: "Agile sprint configuration" },
  { name: "PageBeanIssue",     fields: 6,  refs: 2,  description: "Paginated issue listing" },
  { name: "ErrorCollection",   fields: 3,  refs: 0,  description: "API error response envelope" },
  { name: "Worklog",           fields: 17, refs: 5,  description: "Time-tracking worklog entry" },
  { name: "Attachment",        fields: 12, refs: 3,  description: "Issue file attachment" },
  { name: "IssueTransition",   fields: 8,  refs: 6,  description: "Workflow transition definition" },
  { name: "FieldMetadata",     fields: 10, refs: 4,  description: "Custom field descriptor" },
];

const specWarnings = [
  { level: "warn",  message: "3 paths missing operationId — auto-generated IDs used" },
  { level: "info",  message: "Deprecated field `fields` on IssueBean — use `renderedFields`" },
  { level: "warn",  message: "Circular reference detected in FieldMetadata → FieldMetadata" },
  { level: "info",  message: "OAuth2 scopes not fully enumerated on 6 endpoints" },
];

// ── discoveries tab data ─────────────────────────────────────────────────────

const discoveryStats = [
  { label: "Endpoints Mapped", value: "47", sub: "across 8 resource groups", icon: Route },
  { label: "Schemas Parsed",   value: "12", sub: "1,284 total fields",        icon: Database },
  { label: "Patterns Detected", value: "9", sub: "pagination · filters · errors", icon: Layers },
  { label: "Workflow Candidates", value: "14", sub: "3 high-confidence",     icon: GitBranch },
];

const endpointGroups = [
  { name: "Issues",   count: 5,  coverage: 100, methods: { GET: 2, POST: 1, PUT: 1, DELETE: 1 }, status: "complete" },
  { name: "Search",   count: 3,  coverage: 100, methods: { GET: 2, POST: 1 },                     status: "complete" },
  { name: "Projects", count: 4,  coverage: 100, methods: { GET: 2, POST: 1, PUT: 1 },             status: "complete" },
  { name: "Users",    count: 3,  coverage: 100, methods: { GET: 3 },                               status: "complete" },
  { name: "Boards",   count: 4,  coverage: 100, methods: { GET: 4 },                               status: "complete" },
  { name: "Comments", count: 4,  coverage: 100, methods: { GET: 1, POST: 1, PUT: 1, DELETE: 1 },  status: "complete" },
  { name: "Sprints",  count: 6,  coverage: 83,  methods: { GET: 4, POST: 1, PUT: 1 },             status: "partial" },
  { name: "Worklogs", count: 5,  coverage: 60,  methods: { GET: 3, POST: 1, DELETE: 1 },          status: "partial" },
];

const detectedPatterns = [
  {
    name: "Cursor Pagination",
    confidence: 98,
    description: "startAt + maxResults + total fields on all list responses. Consistent across Issues, Projects, Search.",
    affected: ["GET /issue", "GET /search", "GET /project", "GET /users/search"],
    tag: "PAGINATION",
  },
  {
    name: "JQL Filter Language",
    confidence: 95,
    description: "Dedicated query DSL for issue filtering. POST variant exists for large queries avoiding URL length limits.",
    affected: ["GET /search", "POST /search"],
    tag: "QUERY",
  },
  {
    name: "Uniform Error Envelope",
    confidence: 100,
    description: "All 4xx/5xx responses use ErrorCollection schema: { errorMessages: string[], errors: {} }.",
    affected: ["All endpoints"],
    tag: "ERROR",
  },
  {
    name: "ADF Rich Text",
    confidence: 91,
    description: "Atlassian Document Format used for description/comment bodies — structured JSON, not plain strings.",
    affected: ["POST /issue", "POST /comment", "PUT /issue"],
    tag: "CONTENT",
  },
  {
    name: "Expand Parameter",
    confidence: 88,
    description: "?expand= query param controls which fields are inlined vs. lazy-loaded (renderedFields, transitions, etc.).",
    affected: ["GET /issue/{id}", "GET /project/{id}"],
    tag: "PERF",
  },
  {
    name: "Transition Workflow",
    confidence: 84,
    description: "Issues move between statuses via POST /issue/{id}/transitions — available transitions are dynamic per issue.",
    affected: ["GET /issue/{id}/transitions", "POST /issue/{id}/transitions"],
    tag: "WORKFLOW",
  },
];

const workflowCandidates = [
  { name: "Find issue by JQL query",       confidence: 97, steps: 2, type: "SEARCH",   agents: ["Scout", "Compass"] },
  { name: "Create issue with attachments", confidence: 91, steps: 4, type: "CREATE",   agents: ["Scout"] },
  { name: "Transition issue status",       confidence: 88, steps: 3, type: "WORKFLOW",  agents: ["Scout", "Compass"] },
  { name: "Add comment to issue",          confidence: 95, steps: 2, type: "COMMENT",  agents: ["Scout"] },
  { name: "Get sprint issues for board",   confidence: 82, steps: 3, type: "LIST",     agents: ["Scout"] },
  { name: "Assign issue to user",          confidence: 90, steps: 2, type: "UPDATE",   agents: ["Scout"] },
  { name: "Log work on issue",             confidence: 78, steps: 3, type: "WORKLOG",  agents: ["Scout", "Compass"] },
  { name: "Create project with board",     confidence: 71, steps: 5, type: "CREATE",   agents: ["Scout", "Compass", "Ranger"] },
];

// ── helpers ──────────────────────────────────────────────────────────────────

const methodColor: Record<string, { bg: string; color: string }> = {
  GET:    { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
  POST:   { bg: "rgba(60,130,98,0.12)",  color: "var(--primary)" },
  PUT:    { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  DELETE: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
  PATCH:  { bg: "rgba(168,85,247,0.12)", color: "#c084fc" },
};

const tagColor: Record<string, { bg: string; color: string }> = {
  PAGINATION: { bg: "rgba(59,130,246,0.1)",  color: "#60a5fa" },
  QUERY:      { bg: "rgba(168,85,247,0.1)", color: "#c084fc" },
  ERROR:      { bg: "rgba(239,68,68,0.1)",  color: "#f87171" },
  CONTENT:    { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  PERF:       { bg: "rgba(20,184,166,0.1)", color: "#2dd4bf" },
  WORKFLOW:   { bg: "rgba(60,130,98,0.1)",  color: "var(--primary)" },
  SEARCH:     { bg: "rgba(59,130,246,0.1)",  color: "#60a5fa" },
  CREATE:     { bg: "rgba(60,130,98,0.1)",   color: "var(--primary)" },
  COMMENT:    { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  LIST:       { bg: "rgba(168,85,247,0.1)", color: "#c084fc" },
  UPDATE:     { bg: "rgba(20,184,166,0.1)", color: "#2dd4bf" },
  WORKLOG:    { bg: "rgba(239,68,68,0.1)",  color: "#f87171" },
};

// ── sub-components ───────────────────────────────────────────────────────────

function SpecTab() {
  const [openTag, setOpenTag] = useState<string | null>("Issues");
  const [selectedSchema, setSelectedSchema] = useState<string | null>("IssueBean");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Spec meta banner */}
      <div className="px-8 py-4 border-b flex items-center gap-6 flex-wrap"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <div className="flex items-center gap-2">
          <FileCode2 size={14} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{specMeta.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(60,130,98,0.12)", color: "var(--primary)" }}>{specMeta.version}</span>
        </div>
        <div className="h-4 w-px opacity-20" style={{ background: "var(--foreground)" }} />
        {[
          { label: "Format", value: specMeta.format },
          { label: "Paths", value: String(specMeta.paths) },
          { label: "Schemas", value: String(specMeta.schemas) },
          { label: "Tags", value: String(specMeta.tags) },
          { label: "Lines", value: specMeta.lines.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs">
            <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>{value}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-3">
          {specWarnings.map((w, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px]"
              style={{ color: w.level === "warn" ? "#f59e0b" : "var(--muted-foreground)" }}>
              <AlertCircle size={10} />
              {w.level === "warn" ? "Warning" : "Info"}
            </div>
          ))}
        </div>
      </div>

      {/* Three column layout */}
      <div className="flex-1 grid grid-cols-[260px_1fr_280px] overflow-hidden">

        {/* Col 1: Path tree */}
        <div className="border-r overflow-y-auto" style={{ borderColor: "var(--border)" }}>
          <div className="px-4 py-3 border-b sticky top-0 z-10"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}>
            <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Paths · {specMeta.paths}
            </div>
          </div>
          <div className="py-1">
            {specResources.map((res) => {
              const isOpen = openTag === res.tag;
              return (
                <div key={res.tag}>
                  <button
                    onClick={() => setOpenTag(isOpen ? null : res.tag)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left transition-colors hover:opacity-80"
                    style={{ background: isOpen ? "rgba(60,130,98,0.06)" : "transparent" }}>
                    <ChevronDown size={12}
                      style={{ color: "var(--muted-foreground)", transform: isOpen ? "rotate(0)" : "rotate(-90deg)", transition: "transform 0.15s" }} />
                    <Tag size={12} style={{ color: isOpen ? "var(--primary)" : "var(--muted-foreground)" }} />
                    <span className="text-sm font-medium flex-1"
                      style={{ color: isOpen ? "var(--foreground)" : "var(--muted-foreground)" }}>{res.tag}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: "var(--card-elevated)", color: "var(--muted-foreground)" }}>{res.paths.length}</span>
                  </button>
                  {isOpen && res.paths.map((p, pi) => {
                    const mc = methodColor[p.method] ?? methodColor.GET;
                    return (
                      <div key={pi} className="flex items-start gap-2 pl-8 pr-4 py-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 w-[42px] text-center"
                          style={{ background: mc.bg, color: mc.color }}>{p.method}</span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono truncate" style={{ color: "var(--foreground)" }}>
                            {p.path.replace("/rest/api/3", "").replace("/rest/agile/1.0", "")}
                          </div>
                          <div className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>{p.summary}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 2: Raw spec viewer */}
        <div className="overflow-y-auto flex flex-col">
          <div className="px-5 py-3 border-b flex items-center justify-between sticky top-0 z-10"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}>
            <div className="flex items-center gap-2">
              <FileCode2 size={13} style={{ color: "var(--primary)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>openapi.json</span>
              <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>2,847 lines · OpenAPI 3.1.0</span>
            </div>
            <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
              <Copy size={10} /> Copy
            </button>
          </div>
          <div className="flex-1 p-5 font-mono text-[11px] leading-5 overflow-x-auto"
            style={{ background: "#0d1810", color: "#a8d5b8" }}>
            <pre style={{ margin: 0 }}>{`{
  "openapi": "3.1.0",
  "info": {
    "title": "JIRA Cloud REST API",
    "version": "1001.0.0-SNAPSHOT",
    "description": "Jira Cloud platform REST API",
    "termsOfService": "http://atlassian.com/terms",
    "contact": { "url": "https://developer.atlassian.com" },
    "license": {
      "name": "Apache 2.0",
      "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  "servers": [
    {
      "url": "https://your-domain.atlassian.net",
      "description": "Your Atlassian Cloud instance"
    }
  ],
  "paths": {
    "/rest/api/3/issue/{issueIdOrKey}": {
      "get": {
        "operationId": "getIssue",
        "summary": "Get issue",
        "tags": ["Issues"],
        "parameters": [
          {
            "name": "issueIdOrKey",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          },
          {
            "name": "expand",
            "in": "query",
            "schema": { "type": "string" },
            "description": "renderedFields,transitions..."
          }
        ],
        "responses": {
          "200": {
            "description": "Returned if the request is successful.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/IssueBean" }
              }
            }
          },
          "401": { "description": "Returned if authentication fails." },
          "403": { "description": "Returned if the user does not have permission." },
          "404": { "description": "Returned if the issue is not found." }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "IssueBean": {
        "type": "object",
        "properties": {
          "id":     { "type": "string" },
          "key":    { "type": "string" },
          "self":   { "type": "string", "format": "uri" },
          "fields": { "$ref": "#/components/schemas/Fields" }
        }
      }
    }
  }
}`}</pre>
          </div>

          {/* Warnings strip */}
          <div className="border-t px-5 py-3 space-y-1.5" style={{ borderColor: "var(--border)" }}>
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>
              Parse Notices
            </div>
            {specWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <AlertCircle size={11} className="flex-shrink-0 mt-0.5"
                  style={{ color: w.level === "warn" ? "#f59e0b" : "var(--muted-foreground)" }} />
                <span style={{ color: w.level === "warn" ? "#f59e0b" : "var(--muted-foreground)" }}>{w.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Schema browser */}
        <div className="border-l overflow-y-auto" style={{ borderColor: "var(--border)" }}>
          <div className="px-4 py-3 border-b sticky top-0 z-10"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}>
            <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Schemas · {specMeta.schemas}
            </div>
          </div>
          <div className="p-3 space-y-1.5">
            {specSchemas.map((s) => {
              const isSelected = selectedSchema === s.name;
              return (
                <button key={s.name}
                  onClick={() => setSelectedSchema(isSelected ? null : s.name)}
                  className="w-full text-left rounded-xl p-3 transition-all duration-150"
                  style={{
                    background: isSelected ? "rgba(60,130,98,0.08)" : "var(--card)",
                    border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                  }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Database size={11} style={{ color: isSelected ? "var(--primary)" : "var(--muted-foreground)" }} />
                    <span className="text-xs font-semibold font-mono" style={{ color: "var(--foreground)" }}>{s.name}</span>
                  </div>
                  <div className="text-[10px] mb-1.5" style={{ color: "var(--muted-foreground)" }}>{s.description}</div>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    <span>{s.fields} fields</span>
                    <span>{s.refs} $refs</span>
                  </div>
                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
                      {["id: string", "key: string", "self: uri", "fields: Fields", "renderedFields?: Fields"].slice(0, 4).map((f) => (
                        <div key={f} className="text-[10px] font-mono" style={{ color: "#a8d5b8" }}>{f}</div>
                      ))}
                      <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>+{s.fields - 4} more fields</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoveriesTab() {
  const [expandedPattern, setExpandedPattern] = useState<string | null>("Cursor Pagination");

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {discoveryStats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <Icon size={16} className="mb-3" style={{ color: "var(--primary)" }} />
            <div className="text-3xl font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>{value}</div>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">

          {/* Endpoint coverage map */}
          <div className="rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div>
                <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
                  Endpoint Coverage
                </div>
                <div className="text-sm font-medium mt-0.5" style={{ color: "var(--foreground)" }}>
                  Resource groups mapped by Scout
                </div>
              </div>
              <div className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(60,130,98,0.1)", color: "var(--primary)" }}>
                {endpointGroups.filter(g => g.status === "complete").length}/{endpointGroups.length} complete
              </div>
            </div>
            <div className="p-4 space-y-2">
              {endpointGroups.map((g) => (
                <div key={g.name} className="flex items-center gap-4 px-3 py-2.5 rounded-xl"
                  style={{ background: "var(--card-elevated)" }}>
                  <div className="w-24 text-sm font-medium flex-shrink-0" style={{ color: "var(--foreground)" }}>{g.name}</div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {Object.entries(g.methods).map(([m, cnt]) => {
                      const mc = methodColor[m] ?? methodColor.GET;
                      return Array.from({ length: cnt as number }).map((_, i) => (
                        <span key={`${m}-${i}`} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: mc.bg, color: mc.color }}>{m}</span>
                      ));
                    })}
                  </div>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${g.coverage}%`, background: g.coverage === 100 ? "var(--primary)" : "#f59e0b" }} />
                  </div>
                  <div className="text-[11px] w-8 text-right flex-shrink-0"
                    style={{ color: g.coverage === 100 ? "var(--primary)" : "#f59e0b" }}>
                    {g.coverage}%
                  </div>
                  <div className="flex-shrink-0">
                    {g.status === "complete"
                      ? <CheckCircle2 size={13} style={{ color: "var(--primary)" }} />
                      : <AlertCircle size={13} style={{ color: "#f59e0b" }} />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected patterns */}
          <div className="rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
                Detected API Patterns
              </div>
              <div className="text-sm font-medium mt-0.5" style={{ color: "var(--foreground)" }}>
                Structural patterns Scout identified across the spec
              </div>
            </div>
            <div className="p-4 space-y-2">
              {detectedPatterns.map((p) => {
                const isOpen = expandedPattern === p.name;
                const tc = tagColor[p.tag] ?? tagColor.WORKFLOW;
                return (
                  <div key={p.name} className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${isOpen ? "var(--primary)" : "var(--border)"}` }}>
                    <button
                      onClick={() => setExpandedPattern(isOpen ? null : p.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left">
                      <ChevronDown size={12} style={{ color: "var(--muted-foreground)", transform: isOpen ? "rotate(0)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }} />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                        style={{ background: tc.bg, color: tc.color }}>{p.tag}</span>
                      <span className="text-sm font-medium flex-1" style={{ color: "var(--foreground)" }}>{p.name}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, background: p.confidence >= 90 ? "var(--primary)" : "#f59e0b" }} />
                        </div>
                        <span className="text-[11px] w-8" style={{ color: "var(--muted-foreground)" }}>{p.confidence}%</span>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs mt-3 mb-2 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{p.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.affected.map((ep) => (
                            <span key={ep} className="text-[10px] px-2 py-0.5 rounded font-mono"
                              style={{ background: "var(--card-elevated)", color: "var(--foreground)" }}>{ep}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right col: workflow candidates */}
        <div className="space-y-4">
          <div className="rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>
                Workflow Candidates
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {workflowCandidates.filter(w => w.confidence >= 90).length} high-confidence · {workflowCandidates.length} total
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              {workflowCandidates.map((wf) => {
                const tc = tagColor[wf.type] ?? tagColor.WORKFLOW;
                const isHigh = wf.confidence >= 90;
                return (
                  <div key={wf.name} className="rounded-xl px-4 py-3"
                    style={{ background: "var(--card-elevated)", border: `1px solid ${isHigh ? "var(--primary)" : "var(--border)"}`, opacity: wf.confidence < 75 ? 0.65 : 1 }}>
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                        style={{ background: tc.bg, color: tc.color }}>{wf.type}</span>
                      <span className="text-xs font-medium leading-snug" style={{ color: "var(--foreground)" }}>{wf.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      <span>{wf.steps} steps</span>
                      <span>→ {wf.agents.join(", ")}</span>
                      <span className="ml-auto font-semibold"
                        style={{ color: isHigh ? "var(--primary)" : wf.confidence >= 80 ? "#f59e0b" : "var(--muted-foreground)" }}>
                        {wf.confidence}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auth schemes */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <Shield size={13} style={{ color: "var(--primary)" }} />
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>Auth Schemes</div>
            </div>
            {[
              { name: "OAuth 2.0", scopes: 14, type: "oauth2" },
              { name: "Basic Auth", scopes: 0, type: "http" },
            ].map((auth) => (
              <div key={auth.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: "var(--card-elevated)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(60,130,98,0.12)" }}>
                  <Shield size={12} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{auth.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    {auth.scopes > 0 ? `${auth.scopes} scopes defined` : auth.type}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send to Compass */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: "rgba(60,130,98,0.06)", border: "1px solid var(--primary)" }}>
            <div className="flex items-center gap-2">
              <Network size={13} style={{ color: "var(--primary)" }} />
              <div className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Ready for Compass</div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Scout has mapped {specMeta.paths} endpoints and {workflowCandidates.length} workflow candidates.
              Compass can now begin reward design.
            </p>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: "var(--primary)", color: "#fff" }}>
              <ExternalLink size={11} /> Open Compass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function PremiumAnalytics() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Spec", "Discoveries", "History", "Future"];
  const { theme } = useTheme();
  const scoutLogo = theme === "light" ? scoutLogoLight : scoutLogoDark;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b px-8 py-3 flex items-center justify-between"
        style={{ background: "var(--background)EE", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <span>Workspace</span><ChevronRight size={12} className="opacity-40" />
          <span style={{ color: "var(--foreground)" }}>Scout</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
          <Search size={12} /> Search...
        </div>
      </div>

      {/* Scout header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <img src={scoutLogo} alt="Scout" className="w-11 h-11 object-contain" draggable={false} key={scoutLogo} />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
              Discovery &amp; Schema Mapping
            </div>
            <h2 className="text-4xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>Scout</h2>
            <p className="text-base italic" style={{ color: "var(--muted-foreground)" }}>
              "Making Atlassian JIRA's API surface..."
            </p>
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-8 mt-5">
          {[{ label: "STATUS",     value: "STARTING", accent: true  },
            { label: "PROPOSALS",  value: "—",        accent: false },
            { label: "WORKFLOWS",  value: "—",        accent: false },
            { label: "CANDIDATES", value: "—",        accent: false },
          ].map(({ label, value, accent }) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--muted-foreground)" }}>{label}</div>
              <div className="text-sm font-semibold" style={{ color: accent ? "var(--primary)" : "var(--foreground)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === tab ? "var(--card)" : "transparent",
                color: activeTab === tab ? "var(--foreground)" : "var(--muted-foreground)",
                border: activeTab === tab ? "1px solid var(--border)" : "1px solid transparent",
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === "Overview" && (
        <div className="flex-1 grid grid-cols-3" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Pipeline */}
          <div className="p-6 space-y-1 border-r" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>Pipeline</div>
            {pipelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: step.status === "done" ? "var(--primary)" : step.status === "working" ? "#f59e0b" : "var(--border)" }} />
                  {i < pipelineSteps.length - 1 && <div className="w-px flex-1 min-h-[28px] opacity-15" style={{ background: "var(--foreground)" }} />}
                </div>
                <div className="rounded-xl p-3 mb-1 flex-1"
                  style={{
                    background: step.status === "working" ? "rgba(60,130,98,0.07)" : "var(--card)",
                    border: `1px solid ${step.status === "working" ? "var(--primary)" : "var(--border)"}`,
                  }}>
                  <div className="text-sm font-medium"
                    style={{ color: step.status === "done" ? "var(--foreground)" : step.status === "working" ? "#f59e0b" : "var(--muted-foreground)" }}>
                    {step.label}
                  </div>
                  {step.sublabel && <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{step.sublabel}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Discovered Workflows */}
          <div className="p-6 space-y-4 border-r" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>Discovered Workflows</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>0 discovered · 0 done</div>
            <div className="flex items-center gap-2">
              {["Find", "History", "Future"].map(t => (
                <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: t === "Find" ? "var(--primary)" : "var(--card)", color: t === "Find" ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {discoveredWorkflows.map((wf, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: "rgba(60,130,98,0.15)", color: "var(--primary)" }}>{wf.type}</span>
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>{wf.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 py-10 flex items-center justify-center rounded-xl" style={{ border: "1px dashed var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Awaiting full workflow...</span>
            </div>
          </div>

          {/* Live Activity */}
          <div className="p-6 space-y-4">
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--muted-foreground)" }}>Live Activity</div>
            <div className="py-14 flex items-center justify-center rounded-xl" style={{ border: "1px dashed var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Waiting for Scout to begin.</span>
            </div>
          </div>
        </div>
      )}

      {/* Spec tab */}
      {activeTab === "Spec" && <SpecTab />}

      {/* Discoveries tab */}
      {activeTab === "Discoveries" && <DiscoveriesTab />}

      {/* History tab */}
      {activeTab === "History" && (
        <div className="flex-1 p-8 space-y-5">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Discovery History</div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Past Scout discovery runs across all products.</p>
          </div>
          {historyRuns.map((run, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-base" style={{ color: "var(--foreground)" }}>{run.product}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(60,130,98,0.12)", color: "var(--primary)" }}>
                      {run.mission}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(60,130,98,0.1)", color: "var(--primary)" }}>✓ Done</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <Clock size={11} />{run.ts} · {run.duration}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: "Endpoints", value: run.endpoints },
                  { label: "Schemas",   value: run.schemas   },
                  { label: "Workflows", value: run.workflows  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ background: "var(--card-elevated)" }}>
                    <div className="text-xl font-semibold" style={{ color: "var(--primary)" }}>{value}</div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="py-8 rounded-2xl flex items-center justify-center" style={{ border: "1px dashed var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>More runs will appear here as Scout completes future missions.</span>
          </div>
        </div>
      )}

      {/* Future tab */}
      {activeTab === "Future" && (
        <div className="flex-1 p-8 space-y-5">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Upcoming Discoveries</div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Products queued for Scout's next discovery run.</p>
          </div>
          {futureQueue.map((item, i) => {
            const isQueued = item.reason.startsWith("Queued");
            return (
              <div key={i} className="rounded-2xl p-5 flex items-center gap-5"
                style={{ background: "var(--card)", border: `1px solid ${isQueued ? "var(--primary)" : "var(--border)"}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: isQueued ? "var(--primary)" : "var(--card-elevated)", color: isQueued ? "#fff" : "var(--muted-foreground)" }}>
                  {item.product[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{item.product}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: isQueued ? "rgba(245,158,11,0.1)" : "var(--card-elevated)", color: isQueued ? "#f59e0b" : "var(--muted-foreground)" }}>
                      {isQueued ? "Queued" : "Planned"}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.api} · {item.reason}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  <Calendar size={11} />{item.eta}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
