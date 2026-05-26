import { useState } from "react";
import {
  Home,
  Target,
  Box,
  Layers,
  Eye,
  Compass,
  Shield,
  Archive,
  FlaskConical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import logo from "../../imports/logo.png";

interface PremiumNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewMission: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  home: Home,
  missions: Target,
  products: Box,
  "cross-product": Layers,
  scout: Eye,
  compass: Compass,
  rangers: Shield,
  artifacts: Archive,
  experiments: FlaskConical,
};

export function PremiumNavigation({ activeTab, setActiveTab, onNewMission }: PremiumNavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const isActive = (tab: string) => activeTab === tab;

  /* ── Collapsed icon button ── */
  const IconBtn = ({
    tab,
    label,
    dot,
  }: {
    tab: string;
    label: string;
    dot?: "green" | "amber";
  }) => {
    const Icon = ICON_MAP[tab] ?? Home;
    const active = isActive(tab);
    return (
      <button
        title={label}
        onClick={() => setActiveTab(tab)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{
          background: active ? "var(--sidebar-accent)" : "transparent",
          color: active ? "var(--primary)" : "var(--muted-foreground)",
        }}
      >
        <Icon size={16} strokeWidth={active ? 2.5 : 2} />
        {dot && (
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: dot === "green" ? "var(--primary)" : "#f59e0b" }}
          />
        )}
      </button>
    );
  };

  /* ── Expanded text item ── */
  const NavItem = ({
    label,
    tab,
    indent = false,
    badge,
    dot,
  }: {
    label: string;
    tab: string;
    indent?: boolean;
    badge?: string;
    dot?: "green" | "amber";
  }) => {
    const active = isActive(tab);
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center gap-2 rounded-lg text-sm transition-all duration-200 ${indent ? "pl-5 pr-3 py-1.5" : "px-3 py-1.5"}`}
        style={{
          background: active ? "var(--sidebar-accent)" : "transparent",
          color: active ? "var(--foreground)" : "var(--muted-foreground)",
          fontWeight: active ? 500 : 400,
        }}
      >
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: dot === "green" ? "var(--primary)" : "#f59e0b", opacity: active ? 1 : 0.5 }}
          />
        )}
        <span className="flex-1 text-left truncate">{label}</span>
        {badge && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
            style={{ background: "rgba(60,130,98,0.18)", color: "var(--primary)" }}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <div
      className="px-3 pt-4 pb-0.5 text-[10px] font-semibold uppercase tracking-widest"
      style={{ color: "var(--muted-foreground)", opacity: 0.45 }}
    >
      {label}
    </div>
  );

  /* ────────────── collapsed sidebar ────────────── */
  if (collapsed) {
    return (
      <div
        className="flex-shrink-0 flex flex-col items-center border-r transition-all duration-300 py-4"
        style={{
          width: 56,
          background: "var(--sidebar)",
          borderColor: "var(--sidebar-border)",
        }}
      >
        {/* Logo */}
        <img src={logo} alt="logo" className="w-8 h-8 object-contain mb-6 flex-shrink-0" />

        {/* Icons */}
        <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
          <IconBtn tab="home" label="Home" />

          {/* Missions group */}
          <div className="w-full flex flex-col items-center">
            <IconBtn tab="missions" label="Missions" dot="amber" />
          </div>

          <div className="w-full h-px my-1 opacity-20" style={{ background: "var(--border)" }} />
          <IconBtn tab="products" label="Products" />
          <IconBtn tab="cross-product" label="Cross-product" />
          <div className="w-full h-px my-1 opacity-20" style={{ background: "var(--border)" }} />
          <IconBtn tab="scout" label="Scout" />
          <IconBtn tab="compass" label="Compass" dot="green" />
          <IconBtn tab="rangers" label="Ranger" />
          <div className="w-full h-px my-1 opacity-20" style={{ background: "var(--border)" }} />
          <IconBtn tab="artifacts" label="Artifacts" />
          <IconBtn tab="experiments" label="Experiments" />
        </div>

        {/* Bottom: theme toggle + expand */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ color: "var(--muted-foreground)", background: "transparent" }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            title="Expand sidebar"
            onClick={() => setCollapsed(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ color: "var(--muted-foreground)", background: "var(--sidebar-accent)" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  /* ────────────── expanded sidebar ────────────── */
  return (
    <div
      className="flex-shrink-0 flex flex-col border-r transition-all duration-300"
      style={{
        width: 208,
        background: "var(--sidebar)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      {/* Logo + collapse toggle */}
      <div
        className="px-4 py-4 flex items-center gap-2.5 border-b"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <img src={logo} alt="logo" className="w-7 h-7 object-contain flex-shrink-0" />
        {/* <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #3C8262 0%, #2d6249 100%)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="3" stroke="white" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
          </svg>
        </div> */}
        <span className="text-sm font-semibold flex-1" style={{ color: "var(--foreground)" }}>
          PerceptEye
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ color: "var(--muted-foreground)" }}
          title="Collapse sidebar"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <SectionLabel label="Workspace" />

        <NavItem label="Home" tab="home" />

        {/* Missions collapsible */}
        <div>
          <button
            onClick={() => {
              if (!missionsOpen) {
                setMissionsOpen(true);
                setActiveTab("missions");
              } else {
                setMissionsOpen((o) => !o);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
            style={{
              background: isActive("missions") && !missionsOpen ? "var(--sidebar-accent)" : "transparent",
              color: "var(--muted-foreground)",
            }}
          >
            <span className="flex-1 text-left">Missions</span>
            <ChevronDown
              size={13}
              className="transition-transform duration-200 flex-shrink-0"
              style={{ transform: missionsOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
            />
          </button>

          {missionsOpen && (
            <div className="mt-0.5 space-y-0.5">
              <NavItem label="Atlas Forge" tab="missions" indent dot="amber" badge="live" />
              <button
                onClick={onNewMission}
                className="w-full flex items-center gap-2 pl-5 pr-3 py-1.5 rounded-lg text-sm transition-all duration-200 opacity-60 hover:opacity-100"
                style={{ color: "var(--muted-foreground)" }}
              >
                <Plus size={12} className="flex-shrink-0" />
                <span>New Mission</span>
              </button>
            </div>
          )}
        </div>

        <NavItem label="Products" tab="products" />
        <NavItem label="Cross-product" tab="cross-product" />

        <SectionLabel label="Your Team" />
        <NavItem label="Scout" tab="scout" />
        <NavItem label="Compass" tab="compass" badge="live" />
        <NavItem label="Ranger" tab="rangers" />

        <SectionLabel label="Artifacts" />
        <NavItem label="Artifacts" tab="artifacts" />
        <NavItem label="Experiments" tab="experiments" />
      </div>

      {/* User + theme */}
      <div
        className="px-3 py-3 border-t flex items-center gap-2.5"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          S
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
            Srini
          </div>
          <div className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
            Annambhotla
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{ color: "var(--muted-foreground)", background: "var(--sidebar-accent)" }}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </div>
  );
}
