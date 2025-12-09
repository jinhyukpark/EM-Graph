import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowRight, BarChart3, Clock, Database, FileText, Play, Plus, ShieldAlert, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import generatedImage from "@assets/generated_images/clean_white_data_network_background.png";

const DATA_INGESTION = [
  { name: "Mon", value: 240 },
  { name: "Tue", value: 139 },
  { name: "Wed", value: 980 },
  { name: "Thu", value: 390 },
  { name: "Fri", value: 480 },
  { name: "Sat", value: 380 },
  { name: "Sun", value: 430 },
];

const RECENT_ACTIVITY = [
  { id: 1, title: "New Anomaly Detected", desc: "Crime Analysis 2024", time: "10m ago", icon: ShieldAlert, type: "alert" },
  { id: 2, title: "Data Import Completed", desc: "Supply Chain Alpha", time: "1h ago", icon: Database, type: "success" },
  { id: 3, title: "Query Execution", desc: "User John Doe ran complex analysis", time: "2h ago", icon: Play, type: "info" },
  { id: 4, title: "Report Generated", desc: "Q1 Risk Assessment", time: "4h ago", icon: FileText, type: "default" },
];

export default function Home() {
  return (
    <Layout>
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <img 
          src={generatedImage} 
          className="w-full h-full object-cover mix-blend-multiply"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Overview</h1>
            <p className="text-muted-foreground">System status and recent intelligence updates.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/database">
               <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur">
                 <Database className="w-4 h-4" />
                 Data Sources
               </Button>
             </Link>
             <Link href="/create">
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                New Analysis
              </Button>
             </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Active Nodes", value: "3,420", change: "+12%", icon: Activity, color: "text-primary" },
            { label: "Relationships Mapped", value: "12,850", change: "+8%", icon: Zap, color: "text-accent" },
            { label: "Resource Usage", value: "3.2 GB", change: "64%", icon: Database, color: "text-muted-foreground" },
            { label: "Anomalies Detected", value: "24", change: "+2", icon: ShieldAlert, color: "text-destructive" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-background border border-border ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-[10px]">{stat.change}</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Data Ingestion Volume
              </CardTitle>
              <CardDescription>Processed records over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_INGESTION}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="bg-card/50 backdrop-blur border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {RECENT_ACTIVITY.map((item) => (
                  <div key={item.id} className="flex gap-4 relative">
                    <div className={`mt-1 relative z-10 w-2 h-2 rounded-full ring-4 ring-background ${
                      item.type === 'alert' ? 'bg-destructive' : 
                      item.type === 'success' ? 'bg-emerald-500' : 
                      item.type === 'info' ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                    {/* Connecting line */}
                    <div className="absolute left-[3px] top-3 bottom-[-24px] w-px bg-border last:hidden" />
                    
                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium leading-none mb-1">{item.title}</h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                View All History <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
