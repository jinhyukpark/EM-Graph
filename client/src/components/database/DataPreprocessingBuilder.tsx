import { useState, useCallback, useEffect, useRef } from 'react';
import * as React from 'react';
import { 
  ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, 
  Connection, Edge, BackgroundVariant, Node, Handle, Position, 
  ReactFlowProvider, useReactFlow, MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Database, ArrowRightLeft, GitMerge, ListFilter, Layers, X, Spline, 
  Activity, Type, ChevronLeft, ChevronRight, Play, Trash2, Table as TableIcon, 
  ArrowRight 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 통합된 Import
import { useLanguage } from "@/lib/i18n";
import { TableSelect } from "@/components/common";
import { PREVIEW_DATA } from "@/lib/mockData";
import { JOIN_TYPE_OPTIONS } from "@/constants";
import { generateId } from "@/lib/arrayUtils";

// --- Node Components ---

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
          <TableSelect defaultValue={data.label} size="sm" placeholder={t("selectTable")} />
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
  const sources = data.sources || [];
  const joinKeys = data.joinKeys || [{ id: 'default', leftKey: 'id', rightKey: 'id' }];

  const updateKey = (keyId: string, field: 'leftKey' | 'rightKey', value: string) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === id) {
        const newKeys = n.data.joinKeys.map((k: any) => k.id === keyId ? { ...k, [field]: value } : k);
        return { ...n, data: { ...n.data, joinKeys: newKeys } };
      }
      return n;
    }));
  };

  return (
    <div className="bg-card border-2 border-indigo-500/20 rounded-lg shadow-sm min-w-[240px] overflow-hidden">
      <Handle type="target" position={Position.Left} className="!bg-indigo-500" />
      <Handle type="source" position={Position.Right} className="!bg-indigo-500" />
      <div className="bg-indigo-500/5 px-2 py-1.5 border-b border-indigo-500/10 flex items-center gap-2">
        {data.icon && React.cloneElement(data.icon as React.ReactElement, { className: "w-3.5 h-3.5 text-indigo-600" })}
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
                  {JOIN_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] text-muted-foreground uppercase">{t("onKeys")}</Label>
              {joinKeys.map((keyPair: any) => (
                <div key={keyPair.id} className="flex items-center gap-1">
                  <Select value={keyPair.leftKey} onValueChange={(v) => updateKey(keyPair.id, 'leftKey', v)} disabled={sources.length < 1}>
                    <SelectTrigger className="h-7 text-[10px] bg-background flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectLabel className="text-[10px]">{sources[0]?.label || "Source 1"}</SelectLabel>
                      <SelectItem value="id" className="text-xs">ID</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[10px]">=</span>
                  <Select value={keyPair.rightKey} onValueChange={(v) => updateKey(keyPair.id, 'rightKey', v)} disabled={sources.length < 2}>
                    <SelectTrigger className="h-7 text-[10px] bg-background flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectLabel className="text-[10px]">{sources[1]?.label || "Source 2"}</SelectLabel>
                      <SelectItem value="id" className="text-xs">ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </>
        )}
        {data.subType === 'filter' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-1">
                <Label className="text-[9px] text-muted-foreground uppercase">{t("column")}</Label>
                <Select defaultValue="severity">
                  <SelectTrigger className="h-7 text-[10px] bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="severity">Severity</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] text-muted-foreground uppercase">{t("operator")}</Label>
                <Select defaultValue="gt">
                  <SelectTrigger className="h-7 text-[10px] bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="gt">&gt;</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Input placeholder={t("value")} className="h-7 text-[10px]" />
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
        <Label className="text-[9px] text-muted-foreground uppercase">{t("newTableName")}</Label>
        <Input placeholder="processed_data_v1" className="h-7 text-[10px]" defaultValue={data.label !== 'Target Table' ? data.label : ''} />
      </div>
    </div>
  );
};

const NODE_TYPES = { source: SourceNode, operation: OperationNode, destination: DestinationNode };

// --- Main Component Content ---

function DataPreprocessingBuilderContent({ onRun }: { onRun?: (data: any[]) => void }) {
  const { t } = useLanguage();
  const [nodes, setNodes, onNodesChange] = useNodesState([{ id: '1', type: 'source', position: { x: 50, y: 50 }, data: { label: 'crime_incidents_2024', rowCount: '1,420' } }]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [previewTabs, setPreviewTabs] = useState<Array<{id: string, label: string}>>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [panelHeight, setPanelHeight] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  const startResizing = useCallback((e: React.MouseEvent) => { e.preventDefault(); setIsResizing(true); }, []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight - 100) setPanelHeight(newHeight);
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => { window.removeEventListener("mousemove", resize); window.removeEventListener("mouseup", stopResizing); };
  }, [resize, stopResizing]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)), [setEdges]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedType) return;
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode: Node = {
      id: generateId(),
      type: draggedType === 'source' ? 'source' : draggedType === 'destination' ? 'destination' : 'operation',
      position,
      data: getInitialDataForType(draggedType),
    };
    setNodes((nds) => nds.concat(newNode));
  }, [draggedType, screenToFlowPosition, setNodes]);

  const getInitialDataForType = (type: string) => {
    switch (type) {
      case 'join': return { label: t('joinMerge'), subType: 'join', icon: <GitMerge />, joinKeys: [{ id: '1', leftKey: 'id', rightKey: 'id' }] };
      case 'filter': return { label: t('filterRows'), subType: 'filter', icon: <ListFilter /> };
      case 'destination': return { label: t('targetTable') };
      default: return { label: t('tableSource'), rowCount: '0' };
    }
  };

  return (
    <div className="flex h-full bg-background flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-secondary/5" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button size="sm" onClick={() => onRun?.([])} className="bg-indigo-600 text-white"><Play className="w-4 h-4 mr-2" />{t("runPipeline")}</Button>
          </div>
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={NODE_TYPES} fitView>
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
        </div>

        <div className="w-64 border-l border-border bg-card/30 flex flex-col z-10">
          <div className="p-4 border-b border-border"><h3 className="font-semibold text-sm">{t("components")}</h3></div>
          <ScrollArea className="flex-1 p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-muted-foreground">{t("dataSources")}</Label>
              <div draggable onDragStart={() => setDraggedType('source')} className="p-3 border rounded-lg cursor-grab hover:bg-accent flex items-center gap-2 text-sm">
                <TableIcon className="w-4 h-4" /> {t("tableSource")}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-muted-foreground">{t("operations")}</Label>
              <div draggable onDragStart={() => setDraggedType('join')} className="p-3 border rounded-lg cursor-grab hover:bg-accent flex items-center gap-2 text-sm">
                <GitMerge className="w-4 h-4" /> {t("joinMerge")}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {activeTabId && (
        <div className="border-t bg-background relative" style={{ height: panelHeight }}>
          <div className="absolute top-0 w-full h-1 cursor-ns-resize" onMouseDown={startResizing} />
          <div className="p-4">{t("dataResult")}</div>
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