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

export default function CreateProject() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setLocation("/project/new/setup");
    }, 1000);
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
                <span className="text-sm font-semibold uppercase tracking-widest">New Project</span>
              </div>
              <CardTitle className="text-3xl">Initialize Network</CardTitle>
              <CardDescription>
                Start by defining the core metadata for your relationship graph.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" placeholder="e.g. Q1 Supply Chain Risk Analysis" className="text-lg py-6 bg-background" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Data Domain</Label>
                  <Select required>
                    <SelectTrigger className="py-6 bg-background">
                      <SelectValue placeholder="Select domain type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crime">Crime & Security Analysis</SelectItem>
                      <SelectItem value="supply">Supply Chain Logistics</SelectItem>
                      <SelectItem value="social">Social Network Analysis</SelectItem>
                      <SelectItem value="financial">Financial Transaction Graph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea 
                    id="desc" 
                    placeholder="Briefly describe the goals of this analysis..." 
                    className="min-h-[120px] resize-none bg-background" 
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" className="gap-2 text-md px-8" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Continue to Schema Setup"}
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
