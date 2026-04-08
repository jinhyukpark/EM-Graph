import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/lib/i18n";

export default function CreateProject() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const { t } = useLanguage();

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; type: string; description: string }) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setLocation(`/project/${project.id}/setup`);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type) return;
    createMutation.mutate({ title, type, description });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-20 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border bg-card shadow-xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-widest">{t("newProject")}</span>
              </div>
              <CardTitle className="text-3xl">{t("initializeNetwork")}</CardTitle>
              <CardDescription>
                {t("initializeNetworkDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("projectTitle")}</Label>
                  <Input 
                    id="title" 
                    placeholder={t("projectTitlePlaceholder")} 
                    className="text-lg py-6 bg-background" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="input-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">{t("dataDomain")}</Label>
                  <Select required value={type} onValueChange={setType}>
                    <SelectTrigger className="py-6 bg-background" data-testid="select-type">
                      <SelectValue placeholder={t("selectDomainType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crime">{t("crimeAnalysis")}</SelectItem>
                      <SelectItem value="supply">{t("supplyChainLogistics")}</SelectItem>
                      <SelectItem value="social">{t("socialNetworkAnalysis")}</SelectItem>
                      <SelectItem value="financial">{t("financialTransactionGraph")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">{t("description")}</Label>
                  <Textarea 
                    id="desc" 
                    placeholder={t("descriptionPlaceholder")} 
                    className="min-h-[120px] resize-none bg-background"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    data-testid="input-description"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" className="gap-2 text-md px-8" disabled={createMutation.isPending} data-testid="button-submit">
                    {createMutation.isPending ? t("creating") : t("continueToSchema")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
