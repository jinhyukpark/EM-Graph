import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, Connection, Edge, BackgroundVariant, Node, Handle, Position, ReactFlowProvider, useReactFlow, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Database, Filter, ArrowRightLeft, Merge, FileInput, Save, Play, Trash2, Plus, ArrowRight, Table as TableIcon, GitMerge, ListFilter, Layers, X, Spline, Activity, Type, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/i18n";

// Mock Data for Preview
const PREVIEW_DATA: Record<string, any[]> = {
  'crime_incidents_2024': Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    type: ["Theft", "Assault", "Vandalism", "Burglary"][i % 4],
    location: ["Downtown", "Sector 4", "North Park", "West End"][i % 4],
    time: `2024-03-${10 + (i % 20)}`,
    severity: (i % 10) + 1
  })),
  'suspect_profiles': Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Suspect ${i + 1}`,
    age: 20 + (i % 30),
    history: ["Major Theft", "Minor Theft", "Assault", "None"][i % 4]
  })),
  'default': Array.from({ length: 50 }, (_, i) => ({
    col1: `Value ${i * 3 + 1}`,
    col2: `Value ${i * 3 + 2}`,
    col3: `Value ${i * 3 + 3}`
  }))
};

// ... Node Components (SourceNode, OperationNode, DestinationNode) ...
// Interactive Node Components
const SourceNode = ({ data }: any) => {
  const { t } = useLanguage();
  return (
    <div className="bg-card border-2 border-primary/20 rounded-lg shadow-sm min-w-[180px] overflow-hidden">
      <Handle type="source" position={Position.Right} className="!bg-primary" />
      <div className="bg-primary/5 px-2 py-1.5 border-b border-primary/10 flex items-center gap-2">
        <TableIcon className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{t("tableSource")}</span>
      </div>
      <div className="p-2 space-y-2">
        <div className="space-y-1">
          <Label className="text-[9px] text-muted-foreground uppercase">{t("selectTable")}</Label>
          <Select defaultValue={data.label}>
            <SelectTrigger className="h-7 text-[10px] bg-background">
              <SelectValue placeholder={t("selectTable")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crime_incidents_2024" className="text-xs">crime_incidents_2024</SelectItem>
              <SelectItem value="suspect_profiles" className="text-xs">suspect_profiles</SelectItem>
              <SelectItem value="location_hotspots" className="text-xs">location_hotspots</SelectItem>
              <SelectItem value="supply_chain_nodes" className="text-xs">supply_chain_nodes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground bg-secondary/20 p-1 rounded">
          <span>{t("rows")}:</span>
          <span className="font-mono">{data.rowCount}</span>
        </div>
      </div>
    </div>
  );
};

const OperationNode = ({ data, id }: any) => {
  const { setNodes } = useReactFlow();
  const { t } = useLanguage();
  
  // Ensure we have valid data defaults
  const sources = data.sources || [];
  const joinKeys = data.joinKeys || [{ id: 'default', leftKey: 'id', rightKey: 'id' }];
  
  const updateJoinKeys = (newKeys: any[]) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, joinKeys: newKeys } };
      }
      return n;
    }));
  };

  const addKeyPair = () => {
    updateJoinKeys([...joinKeys, { id: Date.now().toString(), leftKey: 'id', rightKey: 'id' }]);
  };

  const removeKeyPair = (keyId: string) => {
    if (joinKeys.length <= 1) return; 
    updateJoinKeys(joinKeys.filter((k: any) => k.id !== keyId));
  };

  const updateKey = (keyId: string, field: 'leftKey' | 'rightKey', value: string) => {
    updateJoinKeys(joinKeys.map((k: any) => k.id === keyId ? { ...k, [field]: value } : k));
  };

  return (
    <div className="bg-card border-2 border-indigo-500/20 rounded-lg shadow-sm min-w-[240px] overflow-hidden">
      <Handle type="target" position={Position.Left} className="!bg-indigo-500" />
      <Handle type="source" position={Position.Right} className="!bg-indigo-500" />
      
      <div className="bg-indigo-500/5 px-2 py-1.5 border-b border-indigo-500/10 flex items-center gap-2">
        {React.cloneElement(data.icon, { className: "w-3.5 h-3.5 text-indigo-600" })}
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{data.label}</span>
      </div>
      
      <div className="p-2 space-y-2">
        {data.subType === 'join' && (
          <>
            <div className="space-y-1">
              <Label className="text-[9px] text-muted-foreground uppercase">{t("joinType")}</Label>
              <Select defaultValue="inner">
                <SelectTrigger className="h-7 text-[10px] bg-background">
                  <SelectValue placeholder={t("selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inner" className="text-xs">{t("innerJoin")}</SelectItem>
                  <SelectItem value="left" className="text-xs">{t("leftJoin")}</SelectItem>
                  <SelectItem value="right" className="text-xs">{t("rightJoin")}</SelectItem>
                  <SelectItem value="full" className="text-xs">{t("fullOuterJoin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <Label className="text-[9px] text-muted-foreground uppercase">{t("onKeys")}</Label>
              </div>
              
              <div className="space-y-1.5">
                {joinKeys.map((keyPair: any, index: number) => (
                  <div key={keyPair.id} className="flex items-center gap-1 group">
                    <Select 
                        value={keyPair.leftKey} 
                        onValueChange={(v) => updateKey(keyPair.id, 'leftKey', v)}
                        disabled={sources.length < 1}
                    >
                      <SelectTrigger className="h-7 text-[10px] bg-background flex-1 min-w-0">
                        <SelectValue placeholder={sources[0]?.label ? `${sources[0].label} Key` : "Source 1 Key"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] font-bold text-muted-foreground px-2 py-1.5 bg-secondary/20">
                            {sources[0]?.label || "Source Table 1"}
                          </SelectLabel>
                          <SelectItem value="id" className="text-xs">ID</SelectItem>
                          <SelectItem value="company_name" className="text-xs">COMPANY_NAME</SelectItem>
                          <SelectItem value="type" className="text-xs">TYPE</SelectItem>
                          <SelectItem value="suspect_id" className="text-xs">SUSPECT_ID</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <span className="text-[10px] text-muted-foreground">=</span>
                    
                    <Select 
                        value={keyPair.rightKey} 
                        onValueChange={(v) => updateKey(keyPair.id, 'rightKey', v)}
                        disabled={sources.length < 2}
                    >
                      <SelectTrigger className="h-7 text-[10px] bg-background flex-1 min-w-0">
                        <SelectValue placeholder={sources[1]?.label ? `${sources[1].label} Key` : "Source 2 Key"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] font-bold text-muted-foreground px-2 py-1.5 bg-secondary/20">
                            {sources[1]?.label || "Source Table 2"}
                          </SelectLabel>
                          <SelectItem value="id" className="text-xs">ID</SelectItem>
                          <SelectItem value="ref_id" className="text-xs">REF_ID</SelectItem>
                          <SelectItem value="user_id" className="text-xs">USER_ID</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              {sources.length === 0 && (
                <p className="text-[9px] text-amber-500 mt-1">{t("connectSourcesToConfigureKeys")}</p>
              )}
            </div>
          </>
        )}

        {data.subType === 'filter' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-1">
                <Label className="text-[9px] text-muted-foreground uppercase">{t("column")}</Label>
                <Select defaultValue="severity">
                  <SelectTrigger className="h-7 text-[10px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="severity" className="text-xs">Severity</SelectItem>
                    <SelectItem value="type" className="text-xs">Type</SelectItem>
                    <SelectItem value="status" className="text-xs">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] text-muted-foreground uppercase">{t("operator")}</Label>
                <Select defaultValue="gt">
                  <SelectTrigger className="h-7 text-[10px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq" className="text-xs">=</SelectItem>
                    <SelectItem value="gt" className="text-xs">&gt;</SelectItem>
                    <SelectItem value="lt" className="text-xs">&lt;</SelectItem>
                    <SelectItem value="contains" className="text-xs">{t("contains")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input placeholder={t("value")} className="h-7 text-[10px]" />
          </div>
        )}

        {data.subType === 'transform' && (
          <div className="space-y-2">
            <div className="space-y-1">
               <Label className="text-[9px] text-muted-foreground uppercase">{t("targetColumn")}</Label>
               <Select defaultValue="time">
                  <SelectTrigger className="h-7 text-[10px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time" className="text-xs">Time</SelectItem>
                    <SelectItem value="severity" className="text-xs">Severity</SelectItem>
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-1">
               <Label className="text-[9px] text-muted-foreground uppercase">{t("functionLabel")}</Label>
               <Select defaultValue="extract_hour">
                  <SelectTrigger className="h-7 text-[10px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extract_hour" className="text-xs">{t("extractHour")}</SelectItem>
                    <SelectItem value="to_upper" className="text-xs">{t("toUppercase")}</SelectItem>
                    <SelectItem value="normalize" className="text-xs">{t("normalizeRange")}</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DestinationNode = ({ data }: any) => {
  const { t } = useLanguage();
  return (
    <div className="bg-card border-2 border-emerald-500/20 rounded-lg shadow-sm min-w-[180px] overflow-hidden">
      <Handle type="target" position={Position.Left} className="!bg-emerald-500" />
      <div className="bg-emerald-500/5 px-2 py-1.5 border-b border-emerald-500/10 flex items-center gap-2">
        <Database className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{t("destination")}</span>
      </div>
      <div className="p-2 space-y-2">
        <div className="space-y-1">
          <Label className="text-[9px] text-muted-foreground uppercase">{t("newTableName")}</Label>
          <Input placeholder="e.g. processed_data_v1" className="h-7 text-[10px]" defaultValue={data.label !== 'Target Table' ? data.label : ''} />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t("readyToExport")}
        </div>
      </div>
    </div>
  );
};

const NODE_TYPES = {
  source: SourceNode,
  operation: OperationNode,
  destination: DestinationNode,
};

const INITIAL_NODES: Node[] = [
  { 
    id: '1', 
    type: 'source', 
    position: { x: 50, y: 50 }, 
    data: { label: 'crime_incidents_2024', rowCount: '1,420' } 
  },
];

function DataPreprocessingBuilderContent({ onRun }: { onRun?: (data: any[]) => void }) {
  const { t } = useLanguage();
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [previewTabs, setPreviewTabs] = useState<Array<{id: string, label: string}>>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [panelHeight, setPanelHeight] = useState(256); // Default 256px
  const [isResizing, setIsResizing] = useState(false);
  const animationFrameRef = React.useRef<number | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Check if output node exists
  const hasOutput = nodes.some(n => n.type === 'destination');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      if (animationFrameRef.current) return;
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const newHeight = window.innerHeight - mouseMoveEvent.clientY;
        if (newHeight > 100 && newHeight < window.innerHeight - 100) {
          setPanelHeight(newHeight);
        }
        animationFrameRef.current = null;
      });
    }
  }, [isResizing]);

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // Update operation nodes with connected sources
  useEffect(() => {
    setNodes((nds) => nds.map((node) => {
        if (node.type === 'operation' && node.data.subType === 'join') {
            const connectedEdges = edges.filter((e) => e.target === node.id);
            // Sort edges by source handle or just order to keep consistent left/right
            // For now, we trust the order or just map them.
            // But we need to distinguish left vs right if we want to be strict.
            // React Flow handles usually don't dictate "left" or "right" input slot unless we use multiple handles.
            // The current OperationNode has one target handle 'target'.
            // So multiple edges connect to the same handle.
            
            const sources = connectedEdges.map((e) => {
                const sourceNode = nds.find((n) => n.id === e.source);
                return sourceNode ? { id: sourceNode.id, label: sourceNode.data.label } : null;
            }).filter(Boolean);

            const currentSourcesJson = JSON.stringify(node.data.sources);
            const newSourcesJson = JSON.stringify(sources);

            if (currentSourcesJson !== newSourcesJson) {
                return { ...node, data: { ...node.data, sources } };
            }
        }
        return node;
    }));
  }, [edges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
      type: 'default'
    }, eds)),
    [setEdges],
  );

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  };

  const updateEdgeType = (type: string) => {
    if (!selectedEdge) return;
    setEdges((eds) => eds.map((e) => {
      if (e.id === selectedEdge.id) {
        return { ...e, type };
      }
      return e;
    }));
    setSelectedEdge((prev) => prev ? { ...prev, type } : null);
  };

  const updateEdgeAnimation = (animated: boolean) => {
    if (!selectedEdge) return;
    setEdges((eds) => eds.map((e) => {
      if (e.id === selectedEdge.id) {
        return { ...e, animated };
      }
      return e;
    }));
    setSelectedEdge((prev) => prev ? { ...prev, animated } : null);
  };

  const onPaneClick = () => {
    setSelectedEdge(null);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!draggedType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: Date.now().toString(),
        type: draggedType === 'source' ? 'source' : draggedType === 'destination' ? 'destination' : 'operation',
        position,
        data: getInitialDataForType(draggedType),
      };

      setNodes((nds) => nds.concat(newNode));
      setDraggedType(null);
    },
    [draggedType, setNodes, screenToFlowPosition],
  );

  const getInitialDataForType = (type: string) => {
    switch (type) {
      case 'join':
        return { label: t('joinMerge'), subType: 'join', icon: <GitMerge className="w-4 h-4 text-indigo-600" />, description: 'Left, Right, Inner Join' };
      case 'filter':
        return { label: t('filterRows'), subType: 'filter', icon: <ListFilter className="w-4 h-4 text-indigo-600" />, description: 'Filter by conditions' };
      case 'transform':
        return { label: t('transform'), subType: 'transform', icon: <ArrowRightLeft className="w-4 h-4 text-indigo-600" />, description: 'Rename, Type Cast' };
      case 'source':
        return { label: 'crime_incidents_2024', rowCount: '1,420' };
      case 'destination':
        return { label: t('targetTable') };
      default:
        return { label: t('operation') };
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setDraggedType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    const label = node.data.label as string || t('dataResult');
    const newTab = { id: node.id, label };
    
    setPreviewTabs(prev => {
      if (prev.some(tab => tab.id === node.id)) return prev;
      return [...prev, newTab];
    });
    setActiveTabId(node.id);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      return newTabs;
    });
  };

  // Helper to get paginated data
  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  return (
    <div className="flex h-full bg-background flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative bg-secondary/5">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button variant="outline" size="sm" className="bg-background shadow-sm">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("clear")}
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!hasOutput}
              onClick={() => {
                const resultData = PREVIEW_DATA['default'].map((row, i) => ({
                  id: i + 1,
                  ...row,
                  processed_at: new Date().toISOString().split('T')[0],
                  status: 'processed'
                }));
                onRun?.(resultData);
                toast({
                  title: t("pipelineExecuted"),
                  description: t("pipelineExecutedDesc"),
                });
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              {t("runPipeline")}
            </Button>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            fitView
          >
            <Background gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-30" />
            <Controls className="!bg-background !border-border !fill-foreground !shadow-sm" />
          </ReactFlow>
        </div>

        {/* Sidebar Palette */}
        <div className="w-64 border-l border-border bg-card/30 flex flex-col z-10">
          {selectedEdge ? (
            <div className="flex flex-col h-full animate-in slide-in-from-right-5 duration-200">
              <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4" />
                  {t("edgeProperties")}
                </h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedEdge(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("lineStyle")}</Label>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant={selectedEdge.type === 'default' || !selectedEdge.type ? "default" : "outline"} 
                      size="sm" 
                      className="h-8 text-xs justify-start"
                      onClick={() => updateEdgeType('default')}
                    >
                      <Spline className="w-3 h-3 mr-2" /> {t("bezierCurve")}
                    </Button>
                    <Button 
                      variant={selectedEdge.type === 'straight' ? "default" : "outline"} 
                      size="sm" 
                      className="h-8 text-xs justify-start"
                      onClick={() => updateEdgeType('straight')}
                    >
                      <ArrowRight className="w-3 h-3 mr-2" /> {t("straightLine")}
                    </Button>
                    <Button 
                      variant={selectedEdge.type === 'step' ? "default" : "outline"} 
                      size="sm" 
                      className="h-8 text-xs justify-start"
                      onClick={() => updateEdgeType('step')}
                    >
                      <Type className="w-3 h-3 mr-2" /> {t("stepLine")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("animation")}</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={selectedEdge.animated ? "default" : "outline"} 
                      size="sm" 
                      className="w-full h-8 text-xs"
                      onClick={() => updateEdgeAnimation(true)}
                    >
                      {t("animated")}
                    </Button>
                    <Button 
                      variant={!selectedEdge.animated ? "default" : "outline"} 
                      size="sm" 
                      className="w-full h-8 text-xs"
                      onClick={() => updateEdgeAnimation(false)}
                    >
                      {t("staticLabel")}
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-secondary/20 rounded-lg border border-border/50 text-xs text-muted-foreground">
                  <p>ID: <span className="font-mono">{selectedEdge.id}</span></p>
                  <p className="mt-1">{t("source")}: <span className="font-mono">{selectedEdge.source}</span></p>
                  <p>{t("target")}: <span className="font-mono">{selectedEdge.target}</span></p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  {t("components")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{t("dragComponentsDesc")}</p>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Sources */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("dataSources")}</h4>
                    <div 
                      className="bg-card border border-border p-3 rounded-lg shadow-sm cursor-grab hover:border-primary/50 transition-colors flex items-center gap-3"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'source')}
                    >
                      <div className="bg-primary/10 p-1.5 rounded text-primary">
                        <TableIcon className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium">{t("tableSource")}</div>
                    </div>
                  </div>

                  {/* Operations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("operations")}</h4>
                    
                    <div 
                      className="bg-card border border-border p-3 rounded-lg shadow-sm cursor-grab hover:border-indigo-500/50 transition-colors flex items-center gap-3"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'join')}
                    >
                      <div className="bg-indigo-500/10 p-1.5 rounded text-indigo-600">
                        <GitMerge className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t("joinMerge")}</div>
                        <div className="text-[10px] text-muted-foreground">{t("combineTwoDatasets")}</div>
                      </div>
                    </div>

                    <div 
                      className="bg-card border border-border p-3 rounded-lg shadow-sm cursor-grab hover:border-indigo-500/50 transition-colors flex items-center gap-3"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'filter')}
                    >
                      <div className="bg-indigo-500/10 p-1.5 rounded text-indigo-600">
                        <ListFilter className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t("filter")}</div>
                        <div className="text-[10px] text-muted-foreground">{t("selectSpecificRows")}</div>
                      </div>
                    </div>

                    <div 
                      className="bg-card border border-border p-3 rounded-lg shadow-sm cursor-grab hover:border-indigo-500/50 transition-colors flex items-center gap-3"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'transform')}
                    >
                      <div className="bg-indigo-500/10 p-1.5 rounded text-indigo-600">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t("transform")}</div>
                        <div className="text-[10px] text-muted-foreground">{t("modifyColumns")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("output")}</h4>
                    <div 
                      className="bg-card border border-border p-3 rounded-lg shadow-sm cursor-grab hover:border-emerald-500/50 transition-colors flex items-center gap-3"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'destination')}
                    >
                      <div className="bg-emerald-500/10 p-1.5 rounded text-emerald-600">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium">{t("newTable")}</div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      {activeTabId && (
        <div 
          className="border-t border-border bg-background flex flex-col animate-in slide-in-from-bottom-10 duration-300 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20 relative"
          style={{ height: panelHeight }}
        >
          {/* Resize Handle */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-primary/50 transition-colors z-30"
            onMouseDown={startResizing}
          />
          
          {/* Tabs Header */}
          <div className="flex items-center px-2 pt-2 border-b border-border bg-secondary/10">
             <div className="flex-1 flex gap-1 overflow-x-auto">
                {previewTabs.map(tab => (
                   <div 
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`
                         flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer border-t-2 rounded-t-lg transition-colors min-w-[120px] max-w-[200px]
                         ${activeTabId === tab.id 
                            ? 'bg-background border-primary text-foreground shadow-sm' 
                            : 'bg-secondary/20 border-transparent text-muted-foreground hover:bg-secondary/40'}
                      `}
                   >
                      <TableIcon className={`w-3 h-3 ${activeTabId === tab.id ? 'text-primary' : ''}`} />
                      <span className="truncate flex-1">{tab.label}</span>
                      <div 
                        onClick={(e) => closeTab(tab.id, e)}
                        className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5"
                      >
                         <X className="w-3 h-3" />
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex items-center gap-2 px-2">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveTabId(null)}>
                   <X className="w-4 h-4" />
                </Button>
             </div>
          </div>

          <div className="flex-1 overflow-auto flex flex-col">
             <Tabs defaultValue="data" className="w-full h-full flex flex-col">
                <div className="px-4 border-b border-border flex items-center justify-between">
                  <TabsList className="h-9 bg-transparent p-0">
                    <TabsTrigger value="data" className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs">{t("dataResult")}</TabsTrigger>
                    <TabsTrigger value="schema" className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs">{t("schema")}</TabsTrigger>
                    <TabsTrigger value="logs" className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-xs">{t("executionLogs")}</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="data" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
                  <div className="flex-1 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-secondary/5 z-10">
                        <TableRow className="hover:bg-transparent border-b border-border">
                          {Object.keys((PREVIEW_DATA[previewTabs.find(tab => tab.id === activeTabId)?.label || ''] || PREVIEW_DATA['default'])[0]).map((key) => (
                            <TableHead key={key} className="h-8 text-xs font-semibold uppercase tracking-wider">{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPaginatedData(PREVIEW_DATA[previewTabs.find(tab => tab.id === activeTabId)?.label || ''] || PREVIEW_DATA['default']).map((row: any, i: number) => (
                          <TableRow key={i} className="hover:bg-secondary/20 border-b border-border/50">
                            {Object.values(row).map((val: any, j: number) => (
                               <TableCell key={j} className="py-1.5 text-xs">{val}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Footer Pagination Controls */}
                  <div className="border-t border-border p-2 bg-secondary/5 flex items-center justify-between">
                     <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                           <span>{t("total")}: <span className="font-mono font-medium text-foreground">{(PREVIEW_DATA[previewTabs.find(tab => tab.id === activeTabId)?.label || ''] || PREVIEW_DATA['default']).length}</span> {t("rows")}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-2">
                           <span className="text-muted-foreground">{t("rowsPerPage")}:</span>
                           <Select value={rowsPerPage.toString()} onValueChange={(v) => setRowsPerPage(Number(v))}>
                              <SelectTrigger className="h-6 text-xs w-[60px]">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="10">10</SelectItem>
                                 <SelectItem value="25">25</SelectItem>
                                 <SelectItem value="50">50</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>

                     <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                           <ChevronLeft className="w-3 h-3" />
                        </Button>
                        
                        {/* Page Numbers */}
                        {(() => {
                          const totalRows = (PREVIEW_DATA[previewTabs.find(tab => tab.id === activeTabId)?.label || ''] || PREVIEW_DATA['default']).length;
                          const totalPages = Math.ceil(totalRows / rowsPerPage);
                          const pages = [];
                          
                          // Always show first page
                          pages.push(
                            <Button
                              key={1}
                              variant={currentPage === 1 ? "secondary" : "ghost"}
                              size="sm"
                              className={`h-6 w-6 text-xs p-0 ${currentPage === 1 ? "font-bold" : "text-muted-foreground"}`}
                              onClick={() => setCurrentPage(1)}
                            >
                              1
                            </Button>
                          );

                          if (currentPage > 3) {
                             pages.push(<span key="start-ellipsis" className="text-xs text-muted-foreground px-1">...</span>);
                          }

                          for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                             pages.push(
                                <Button
                                  key={i}
                                  variant={currentPage === i ? "secondary" : "ghost"}
                                  size="sm"
                                  className={`h-6 w-6 text-xs p-0 ${currentPage === i ? "font-bold" : "text-muted-foreground"}`}
                                  onClick={() => setCurrentPage(i)}
                                >
                                  {i}
                                </Button>
                             );
                          }

                          if (currentPage < totalPages - 2) {
                             pages.push(<span key="end-ellipsis" className="text-xs text-muted-foreground px-1">...</span>);
                          }

                          // Always show last page if more than 1 page
                          if (totalPages > 1) {
                             pages.push(
                                <Button
                                  key={totalPages}
                                  variant={currentPage === totalPages ? "secondary" : "ghost"}
                                  size="sm"
                                  className={`h-6 w-6 text-xs p-0 ${currentPage === totalPages ? "font-bold" : "text-muted-foreground"}`}
                                  onClick={() => setCurrentPage(totalPages)}
                                >
                                  {totalPages}
                                </Button>
                             );
                          }
                          
                          return pages;
                        })()}

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          disabled={currentPage * rowsPerPage >= (PREVIEW_DATA[previewTabs.find(tab => tab.id === activeTabId)?.label || ''] || PREVIEW_DATA['default']).length}
                          onClick={() => setCurrentPage(p => p + 1)}
                        >
                           <ChevronRight className="w-3 h-3" />
                        </Button>
                     </div>
                  </div>
                </TabsContent>
                <TabsContent value="schema" className="p-4 m-0">
                  <div className="text-sm text-muted-foreground">{t("schemaInfoDesc")}</div>
                </TabsContent>
                <TabsContent value="logs" className="p-4 m-0">
                  <div className="text-sm text-muted-foreground font-mono">
                    [10:24:01] {t("processStarted")}<br/>
                    [10:24:02] {t("fetched")} {(PREVIEW_DATA[previewTabs.find(tab => tab.id === activeTabId)?.label || ''] || PREVIEW_DATA['default']).length} {t("rows")}<br/>
                    [10:24:02] {t("completedSuccessfully")}
                  </div>
                </TabsContent>
             </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DataPreprocessingBuilder(props: { onRun?: (data: any[]) => void }) {
  return (
    <ReactFlowProvider>
      <DataPreprocessingBuilderContent {...props} />
    </ReactFlowProvider>
  );
}