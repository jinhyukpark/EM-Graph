import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Send, 
  Paperclip, 
  Bot, 
  Database, 
  Globe, 
  FileText, 
  RefreshCw, 
  Share2, 
  Copy, 
  Trash2, 
  ChevronDown, 
  Sparkles,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AICopilotPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500 fill-purple-500 animate-pulse" />
          <h3 className="font-semibold text-sm">AI Copilot</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-border bg-secondary/5">
        <div className="flex items-center gap-2">
            <div className="flex p-1 bg-secondary/50 rounded-lg">
                <Button variant="secondary" size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                    Patent Analysis
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                    Legal Review
                </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-muted-foreground">
                <Plus className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          
          {/* User Message 1 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
              <span className="font-bold">ME</span>
              <span>Today</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg text-sm text-foreground">
              Summarize the key patents in this document.
            </div>
          </div>

          {/* AI Response 1 */}
          <div className="space-y-2">
             <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
              <span className="font-bold text-purple-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NEXUS AI
              </span>
            </div>
            
            {/* Tool Executions */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 rounded border border-border bg-card/50 text-xs">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-muted-foreground">MCP Tool</span>
                    <span className="font-medium bg-secondary px-1.5 py-0.5 rounded text-[10px]">Patent_search</span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded border border-border bg-card/50 text-xs hover:bg-secondary/30 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-foreground">News Results 10</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                </div>

                <div className="flex items-center justify-between p-2 rounded border border-border bg-card/50 text-xs hover:bg-secondary/30 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-foreground">Source 3</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                </div>
            </div>

            {/* AI Text Content */}
            <div className="text-sm leading-relaxed text-muted-foreground/90 pl-1">
                Based on the recent patent trends analysis of LG Energy Solution and SK Innovation, both companies are focusing on developing technology to improve battery safety and lifespan. LG Energy Solution is particularly prominent in patent applications related to high-nickel cathode materials and silicon anode materials, while SK Innovation is identified as securing numerous patents related to separator technology and battery recycling technology. Competition is also intensifying to secure next-generation battery technologies such as solid-state batteries. This document suggests changes in market share and potential technical disputes based on these technological trends.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 pt-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                    <RefreshCw className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                    <Share2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                    <Copy className="w-3 h-3" />
                </Button>
                 <div className="flex-1" />
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
          </div>

          {/* User Message 2 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
              <span className="font-bold">ME</span>
              <span>Today</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg text-sm text-foreground">
              Find related cases in the US market.
            </div>
          </div>

          {/* AI Response 2 (Loading/Streaming) */}
          <div className="space-y-2">
             <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
              <span className="font-bold text-purple-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NEXUS AI
              </span>
            </div>
            
             <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 rounded border border-border bg-card/50 text-xs">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-muted-foreground">MCP Tool</span>
                    <span className="font-medium bg-secondary px-1.5 py-0.5 rounded text-[10px]">Legal_search</span>
                </div>
                <div className="text-sm text-muted-foreground pl-1 animate-pulse">
                    Searching for related lawsuits in US District Courts...
                </div>
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="relative rounded-xl border border-primary/20 bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <textarea 
                className="w-full bg-transparent p-3 text-sm resize-none focus:outline-none min-h-[60px]"
                placeholder="Ask anything..."
            />
            
            <div className="flex items-center justify-between px-2 pb-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground font-normal hover:text-foreground hover:bg-secondary/50">
                    Sonnet 4.5 <ChevronDown className="w-3 h-3" />
                </Button>
                
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Paperclip className="w-4 h-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Bot className="w-4 h-4" />
                    </Button>
                    <Button size="icon" className="h-7 w-7 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 ml-1 rounded-lg">
                        <Send className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}