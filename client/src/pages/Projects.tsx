import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Network, Calendar, MoreVertical, ArrowRight } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mockData";
import generatedImage from "../assets/generated_images/clean_white_data_network_background.png";

export default function Projects() {
  return (
    <Layout>
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <img 
          src={generatedImage} 
          className="w-full h-full object-cover mix-blend-multiply"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage your relationship intelligence projects.</p>
          </div>
          <Link href="/create">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hidden md:flex">
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project) => (
            <Link key={project.id} href={`/project/${project.id}/view`}>
              <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-card/80 backdrop-blur-sm border-border cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Network className="w-6 h-6" />
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {project.lastModified}
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                       {project.nodes} Nodes
                     </span>
                     <Button variant="ghost" size="sm" className="h-7 gap-1 hover:text-primary hover:bg-primary/10 -mr-2">
                        Open <ArrowRight className="w-3 h-3" />
                     </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}

          {/* Empty State Card / Create New Placeholder */}
          <Link href="/create">
            <div className="h-full min-h-[280px] rounded-xl border border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer gap-4 group">
              <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-medium">Create New Project</span>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
