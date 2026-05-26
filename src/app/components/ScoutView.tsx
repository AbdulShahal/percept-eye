import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Target, Users, TrendingUp, Activity } from "lucide-react";

export function ScoutView() {
  const metrics = [
    { label: "Starting run", value: "125", icon: Target },
    { label: "Successful", value: "108", icon: TrendingUp },
    { label: "Converted", value: "24", icon: Users },
    { label: "Engagement", value: "68%", icon: Activity },
  ];

  const tasks = [
    { name: "Research leads", status: "complete" },
    { name: "Territory focus", status: "complete" },
    { name: "Activity metrics", status: "complete" },
    { name: "Messaging setup", status: "pending" },
  ];

  const activities = [
    { type: "Structured outreach", status: "complete" },
    { type: "Follow-up sequence", status: "in-progress" },
    { type: "Data enrichment", status: "complete" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                ← BACK TO MISSION OVERVIEW
              </Button>
            </div>
            <h1 className="text-foreground mb-2">Scout</h1>
            <p className="text-muted-foreground">
              Helping research <span className="text-primary">data</span> and track leads.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
              Executing
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">
              Automated
            </Badge>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">STARTING</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  <div className="text-3xl font-semibold text-foreground">{metric.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.status === "complete" ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    />
                    <span className="text-sm text-foreground">{task.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {task.status === "complete" ? "Complete" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Structured outreach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        activity.status === "complete"
                          ? "bg-primary"
                          : activity.status === "in-progress"
                          ? "bg-chart-2"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{activity.type}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.status === "complete"
                          ? "Completed"
                          : activity.status === "in-progress"
                          ? "In Progress"
                          : "Queued"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Live activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground">New lead identified</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Target className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground">Outreach sequence initiated</div>
                    <div className="text-xs text-muted-foreground">15 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
