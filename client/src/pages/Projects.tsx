import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Network, Calendar, MoreVertical, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import generatedImage from "../assets/generated_images/clean_white_data_network_background.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/lib/i18n";

export default function Projects() {
  const { t } = useLanguage();
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

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
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground" data-testid="text-page-title">{t("projects")}</h1>
            <p className="text-muted-foreground">{t("manageProjects")}</p>
          </div>
          <Link href="/create">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hidden md:flex" data-testid="button-new-project">
              <Plus className="w-5 h-5" />
              {t("newGraph")}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}/view`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-card/80 backdrop-blur-sm border-border cursor-pointer h-full" data-testid={`card-project-${project.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Network className="w-6 h-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" data-testid={`button-menu-${project.id}`}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteMutation.mutate(project.id);
                            }}
                            data-testid={`button-delete-${project.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors" data-testid={`text-project-title-${project.id}`}>
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
                      {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                         {project.nodes} {t("nodes")}
                       </span>
                       <Button variant="ghost" size="sm" className="h-7 gap-1 hover:text-primary hover:bg-primary/10 -mr-2">
                          {t("open")} <ArrowRight className="w-3 h-3" />
                       </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}

            <Link href="/create">
              <div className="h-full min-h-[280px] rounded-xl border border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer gap-4 group" data-testid="button-create-project-card">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-medium">{t("createNewProject")}</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
