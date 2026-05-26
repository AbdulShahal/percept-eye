import { Home, Target, Users, FolderKanban, BarChart2, Settings, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "missions", icon: Target, label: "Missions", badge: "3" },
    { id: "rangers", icon: Users, label: "Rangers" },
    { id: "projects", icon: FolderKanban, label: "Projects" },
    { id: "scout", icon: BarChart2, label: "Scout" },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">Perceptor</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider">
            Categories
          </div>
          <div className="space-y-1 mt-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="flex-1 text-left">Build</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
              <div className="w-2 h-2 rounded-full bg-chart-2" />
              <span className="flex-1 text-left">Design</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
              <div className="w-2 h-2 rounded-full bg-chart-3" />
              <span className="flex-1 text-left">Research</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <Settings className="w-5 h-5" />
          <span className="flex-1 text-left">Settings</span>
        </button>
      </div>
    </div>
  );
}
