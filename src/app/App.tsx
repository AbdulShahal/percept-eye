import { useState, useCallback } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { PremiumNavigation } from "./components/PremiumNavigation";
import { PremiumDashboard } from "./components/PremiumDashboard";
import { PremiumMissions } from "./components/PremiumMissions";
import { PremiumAgents } from "./components/PremiumAgents";
import { PremiumAnalytics } from "./components/PremiumAnalytics";
import { CompassView } from "./components/CompassView";
import { ProductsView } from "./components/ProductsView";
import { CrossProductView } from "./components/CrossProductView";
import { ArtifactsPage } from "./components/ArtifactsPage";
import { ExperimentsPage } from "./components/ExperimentsPage";
import { MissionOverviewPage } from "./components/MissionOverviewPage";
import { AgentProfilesPage } from "./components/AgentProfilesPage";
import { NewMissionModal } from "./components/NewMissionModal";

// ── navigation types ─────────────────────────────────────────────
type TabId =
  | "home" | "missions" | "scout" | "compass" | "rangers"
  | "products" | "cross-product" | "artifacts" | "experiments"
  | "mission-overview" | "agent-profiles";

// ── helpers ──────────────────────────────────────────────────────
function PlaceholderView({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted-foreground)" }}>
      <div className="text-center space-y-2">
        <div className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{label}</div>
        <div className="text-sm">Coming soon</div>
      </div>
    </div>
  );
}

// ── app ──────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [prevTab, setPrevTab] = useState<TabId>("home");
  const [showNewMission, setShowNewMission] = useState(false);

  const navigateTo = useCallback((tab: TabId) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  }, [activeTab]);

  const goBack = useCallback(() => {
    setActiveTab(prevTab);
  }, [prevTab]);

  const commonProps = { navigateTo };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="size-full flex transition-colors duration-300 overflow-hidden" style={{ background: "var(--background)" }}>
        <PremiumNavigation
          activeTab={activeTab}
          setActiveTab={(t) => navigateTo(t as TabId)}
          onNewMission={() => setShowNewMission(true)}
        />

        {activeTab === "home"            && <PremiumDashboard onNewMission={() => setShowNewMission(true)} navigateTo={navigateTo} />}
        {activeTab === "missions"        && <PremiumMissions navigateTo={navigateTo} />}
        {activeTab === "scout"           && <PremiumAnalytics />}
        {activeTab === "compass"         && <CompassView navigateTo={navigateTo} />}
        {activeTab === "rangers"         && <PremiumAgents />}
        {activeTab === "products"        && <ProductsView navigateTo={navigateTo} />}
        {activeTab === "cross-product"   && <CrossProductView />}
        {activeTab === "artifacts"       && <ArtifactsPage />}
        {activeTab === "experiments"     && <ExperimentsPage />}
        {activeTab === "mission-overview" && <MissionOverviewPage onBack={goBack} navigateTo={navigateTo} />}
        {activeTab === "agent-profiles"  && <AgentProfilesPage onBack={goBack} navigateTo={navigateTo} />}

        {!["home","missions","scout","compass","rangers","products","cross-product",
           "artifacts","experiments","mission-overview","agent-profiles"].includes(activeTab) && (
          <PlaceholderView label={activeTab} />
        )}

        <NewMissionModal isOpen={showNewMission} onClose={() => setShowNewMission(false)} />
      </div>
    </ThemeProvider>
  );
}
