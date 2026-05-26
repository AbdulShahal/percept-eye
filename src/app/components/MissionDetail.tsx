import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function MissionDetail() {
  const tasks = [
    { id: 1, title: "Update documentation", status: "IN PROGRESS", priority: "HIGH" },
    { id: 2, title: "Review pull requests", status: "TODO", priority: "MEDIUM" },
    { id: 3, title: "Design system updates", status: "DONE", priority: "LOW" },
  ];

  const activities = [
    { action: "Updated task #124", time: "2 hours ago" },
    { action: "Commented on design review", time: "4 hours ago" },
    { action: "Completed sprint planning", time: "1 day ago" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" className="text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Missions
        </Button>

        <div>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 mb-3">
            DEVELOPMENT • SPRINT 12
          </Badge>
          <h1 className="text-foreground mb-2">Atlassian JIRA</h1>
          <p className="text-muted-foreground">
            Track progress, manage sprints, and collaborate on development tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Active</Badge>
          <Badge variant="outline" className="border-border text-muted-foreground">
            Development
          </Badge>
          <Badge variant="outline" className="border-border text-muted-foreground">
            Urgent
          </Badge>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Activity log</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Active tasks</CardTitle>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Add task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div>
                          <div className="text-sm text-foreground">{task.title}</div>
                          <div className="text-xs text-muted-foreground">Task #{task.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            task.status === "DONE"
                              ? "border-primary/30 text-primary bg-primary/10"
                              : task.status === "IN PROGRESS"
                              ? "border-chart-2/30 text-chart-2 bg-chart-2/10"
                              : "border-border text-muted-foreground"
                          }
                        >
                          {task.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            task.priority === "HIGH"
                              ? "border-red-500/30 text-red-500 bg-red-500/10"
                              : task.priority === "MEDIUM"
                              ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/10"
                              : "border-border text-muted-foreground"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Within timeframe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">Complete authentication flow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">Update API documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">Fix responsive layouts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm text-foreground">Database migration</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                      1 task overdue by 2 days
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <div className="text-sm text-foreground">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
