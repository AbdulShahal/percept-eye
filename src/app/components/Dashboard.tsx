import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Target, TrendingUp, Clock, CheckCircle2, Circle } from "lucide-react";

export function Dashboard() {
  const missions = [
    {
      id: 1,
      title: "Scout",
      subtitle: "Identify & track leads",
      description: "The first agent we built, and a great use case for web scraping and data analysis",
      category: "BUILD",
      status: "active",
    },
    {
      id: 2,
      title: "Compass",
      subtitle: "Goal-based AI assistant",
      description: "A smart guide that helps you define and track goals, breaking them into actionable tasks",
      category: "DESIGN",
      status: "planning",
    },
    {
      id: 3,
      title: "Ranger",
      subtitle: "Background research agent",
      description: "An automated research assistant that gathers and synthesizes information from multiple sources",
      category: "BUILD",
      status: "active",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-foreground mb-2">Welcome back, Srini.</h1>
          <p className="text-muted-foreground">
            Your <span className="text-primary">mission</span> is in flight.
          </p>
          <p className="text-sm text-muted-foreground">
            Here are your highlights. Check it out the way you like the best.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create a project brief
          </Button>
          <Button variant="outline" className="border-border text-foreground">
            Start mission
          </Button>
          <Button variant="ghost" className="text-muted-foreground">
            View timeline
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">24</div>
              <div className="text-sm text-muted-foreground">Active missions</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">87%</div>
              <div className="text-sm text-muted-foreground">Success rate</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">12h</div>
              <div className="text-sm text-muted-foreground">Avg. completion</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">Three agents, working in parallel</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View recent activity →
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {missions.map((mission) => (
              <Card key={mission.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {mission.status === "active" ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-foreground mb-1">{mission.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mission.subtitle}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/10"
                    >
                      {mission.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mission.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${mission.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      <span>{mission.status === 'active' ? 'Active' : 'Planning'}</span>
                    </div>
                    <span>•</span>
                    <span>Updated 2h ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
