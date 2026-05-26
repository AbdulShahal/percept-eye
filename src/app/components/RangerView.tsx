import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, User, MapPin } from "lucide-react";

export function RangerView() {
  const agents = [
    { name: "Scout Agent", status: "Active", role: "Lead generation" },
    { name: "Work Scout", status: "Active", role: "Task tracking" },
    { name: "Marketing", status: "Idle", role: "Campaign analysis" },
    { name: "Compass", status: "Active", role: "Goal planning" },
  ];

  const activities = [
    { title: "Agent Activity", items: ["Completed: 45 tasks", "In Progress: 12 tasks", "Queued: 8 tasks"] },
    { title: "Background", items: ["Research leads", "Data enrichment", "Report generation"] },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" className="text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 mb-3">
            AGENTS
          </Badge>
          <h1 className="text-foreground mb-2">Ranger</h1>
          <p className="text-muted-foreground">
            Monitor and manage your autonomous agents
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agents.map((agent, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-foreground">{agent.name}</div>
                        <div className="text-xs text-muted-foreground">{agent.role}</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        agent.status === "Active"
                          ? "border-primary/30 text-primary bg-primary/10"
                          : "border-border text-muted-foreground"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Agent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed tasks</span>
                  <span className="text-lg text-foreground font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In progress</span>
                  <span className="text-lg text-foreground font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Queued</span>
                  <span className="text-lg text-foreground font-semibold">8</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success rate</span>
                    <span className="text-lg text-primary font-semibold">94%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Background Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Territory Focus</span>
                </div>
                <div className="text-sm text-foreground">North America</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Primary Objective</div>
                <div className="text-sm text-foreground">Lead Generation & Tracking</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Next Review</div>
                <div className="text-sm text-foreground">May 25, 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div className="flex-1">
                  <div className="text-sm text-foreground">Scout Agent completed research task</div>
                  <div className="text-xs text-muted-foreground">5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-chart-2 mt-1.5" />
                <div className="flex-1">
                  <div className="text-sm text-foreground">Compass Agent started goal planning</div>
                  <div className="text-xs text-muted-foreground">12 minutes ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div className="flex-1">
                  <div className="text-sm text-foreground">Work Scout analyzed project timeline</div>
                  <div className="text-xs text-muted-foreground">1 hour ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
