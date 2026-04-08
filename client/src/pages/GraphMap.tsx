import { useState, useCallback, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/lib/i18n";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Search, User, Building2, FileText, CalendarDays, MapPin, X } from "lucide-react";

type EntityType = "person" | "organization" | "document" | "event" | "location";

const NODE_COLORS: Record<EntityType, string> = {
  person: "#3b82f6",
  organization: "#22c55e",
  document: "#f59e0b",
  event: "#a855f7",
  location: "#ef4444",
};

const NODE_ICONS: Record<EntityType, typeof User> = {
  person: User,
  organization: Building2,
  document: FileText,
  event: CalendarDays,
  location: MapPin,
};

interface EntityNodeData {
  label: string;
  entityType: EntityType;
  description?: string;
  properties?: Record<string, string>;
  [key: string]: unknown;
}

function EntityNode({ data, selected }: NodeProps<Node<EntityNodeData>>) {
  const color = NODE_COLORS[data.entityType];
  const Icon = NODE_ICONS[data.entityType];

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ visibility: "hidden" }} />
      <div
        className="flex flex-col items-center gap-1 cursor-pointer"
        style={{ filter: selected ? `drop-shadow(0 0 8px ${color})` : undefined }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-medium text-foreground max-w-[100px] text-center truncate bg-background/80 px-1.5 py-0.5 rounded shadow-sm">
          {data.label}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ visibility: "hidden" }} />
    </>
  );
}

const nodeTypes = { entity: EntityNode };

const initialNodes: Node<EntityNodeData>[] = [
  { id: "p1", type: "entity", position: { x: 250, y: 50 }, data: { label: "김철수", entityType: "person", description: "POSCO 원가관리팀 과장", properties: { "직책": "과장", "부서": "원가관리팀", "입사년도": "2015" } } },
  { id: "p2", type: "entity", position: { x: 600, y: 100 }, data: { label: "이영희", entityType: "person", description: "POSCO 구매팀 대리", properties: { "직책": "대리", "부서": "구매팀", "입사년도": "2018" } } },
  { id: "p3", type: "entity", position: { x: 100, y: 350 }, data: { label: "박민수", entityType: "person", description: "현대제철 전략기획팀 차장", properties: { "직책": "차장", "부서": "전략기획팀", "입사년도": "2010" } } },
  { id: "o1", type: "entity", position: { x: 400, y: 250 }, data: { label: "POSCO", entityType: "organization", description: "포항종합제철 주식회사", properties: { "업종": "철강", "설립": "1968", "본사": "포항" } } },
  { id: "o2", type: "entity", position: { x: 50, y: 150 }, data: { label: "현대제철", entityType: "organization", description: "현대제철 주식회사", properties: { "업종": "철강", "설립": "1953", "본사": "인천" } } },
  { id: "d1", type: "entity", position: { x: 700, y: 300 }, data: { label: "원가절감 보고서", entityType: "document", description: "2024년 3분기 원가절감 실적 보고서", properties: { "작성일": "2024-09-15", "보안등급": "대외비", "페이지": "42" } } },
  { id: "d2", type: "entity", position: { x: 500, y: 450 }, data: { label: "공급망 분석 리포트", entityType: "document", description: "글로벌 철강 공급망 리스크 분석", properties: { "작성일": "2024-08-20", "보안등급": "내부", "페이지": "28" } } },
  { id: "d3", type: "entity", position: { x: 150, y: 500 }, data: { label: "이사회 안건서", entityType: "document", description: "2024년 하반기 이사회 안건서", properties: { "작성일": "2024-10-01", "보안등급": "기밀", "페이지": "15" } } },
  { id: "e1", type: "entity", position: { x: 350, y: 550 }, data: { label: "이사회 회의", entityType: "event", description: "2024년 3분기 정기 이사회", properties: { "일시": "2024-10-15", "참석인원": "12명", "장소": "서울 본사" } } },
  { id: "e2", type: "entity", position: { x: 750, y: 500 }, data: { label: "공급사 미팅", entityType: "event", description: "주요 원자재 공급사 정기 미팅", properties: { "일시": "2024-09-20", "참석인원": "8명", "장소": "포항 제철소" } } },
  { id: "l1", type: "entity", position: { x: 200, y: 200 }, data: { label: "포항 제철소", entityType: "location", description: "POSCO 포항제철소", properties: { "주소": "경북 포항시 남구 동해안로 6261", "면적": "9,200,000㎡" } } },
  { id: "l2", type: "entity", position: { x: 650, y: 50 }, data: { label: "서울 본사", entityType: "location", description: "POSCO 서울 본사", properties: { "주소": "서울특별시 강남구 테헤란로 440", "층수": "33층" } } },
];

const initialEdges: Edge[] = [
  { id: "e-p1-o1", source: "p1", target: "o1", label: "Belongs To", type: "default", style: { stroke: "#94a3b8" }, data: { relationType: "belongsTo" } },
  { id: "e-p2-o1", source: "p2", target: "o1", label: "Belongs To", type: "default", style: { stroke: "#94a3b8" }, data: { relationType: "belongsTo" } },
  { id: "e-p3-o2", source: "p3", target: "o2", label: "Belongs To", type: "default", style: { stroke: "#94a3b8" }, data: { relationType: "belongsTo" } },
  { id: "e-p1-d1", source: "p1", target: "d1", label: "Mentions", type: "default", style: { stroke: "#f59e0b" }, data: { relationType: "mentions" } },
  { id: "e-p2-d2", source: "p2", target: "d2", label: "Mentions", type: "default", style: { stroke: "#f59e0b" }, data: { relationType: "mentions" } },
  { id: "e-d1-o1", source: "d1", target: "o1", label: "Related To", type: "default", style: { stroke: "#a855f7" }, data: { relationType: "relatedTo" } },
  { id: "e-d2-o1", source: "d2", target: "o1", label: "Related To", type: "default", style: { stroke: "#a855f7" }, data: { relationType: "relatedTo" } },
  { id: "e-d3-e1", source: "d3", target: "e1", label: "Related To", type: "default", style: { stroke: "#a855f7" }, data: { relationType: "relatedTo" } },
  { id: "e-p1-e1", source: "p1", target: "e1", label: "Participated In", type: "default", style: { stroke: "#22c55e" }, data: { relationType: "participatedIn" } },
  { id: "e-p3-e1", source: "p3", target: "e1", label: "Participated In", type: "default", style: { stroke: "#22c55e" }, data: { relationType: "participatedIn" } },
  { id: "e-p2-e2", source: "p2", target: "e2", label: "Participated In", type: "default", style: { stroke: "#22c55e" }, data: { relationType: "participatedIn" } },
  { id: "e-o1-l1", source: "o1", target: "l1", label: "Located At", type: "default", style: { stroke: "#ef4444" }, data: { relationType: "locatedAt" } },
  { id: "e-o1-l2", source: "o1", target: "l2", label: "Located At", type: "default", style: { stroke: "#ef4444" }, data: { relationType: "locatedAt" } },
  { id: "e-e2-l1", source: "e2", target: "l1", label: "Located At", type: "default", style: { stroke: "#ef4444" }, data: { relationType: "locatedAt" } },
];

export default function GraphMap() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [depth, setDepth] = useState([2]);
  const [selectedNode, setSelectedNode] = useState<Node<EntityNodeData> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const q = searchQuery.toLowerCase();
    const matchingIds = new Set(
      nodes.filter((n) => n.data.label.toLowerCase().includes(q)).map((n) => n.id)
    );

    const connectedIds = new Set<string>();
    const currentDepth = depth[0];
    let frontier = new Set(matchingIds);

    for (let d = 0; d < currentDepth; d++) {
      const nextFrontier = new Set<string>();
      edges.forEach((e) => {
        if (frontier.has(e.source) && !connectedIds.has(e.target) && !matchingIds.has(e.target)) {
          nextFrontier.add(e.target);
          connectedIds.add(e.target);
        }
        if (frontier.has(e.target) && !connectedIds.has(e.source) && !matchingIds.has(e.source)) {
          nextFrontier.add(e.source);
          connectedIds.add(e.source);
        }
      });
      frontier = nextFrontier;
    }

    const visibleIds = new Set(Array.from(matchingIds).concat(Array.from(connectedIds)));
    return nodes.map((n) => ({
      ...n,
      style: visibleIds.has(n.id) ? {} : { opacity: 0.15 },
    }));
  }, [searchQuery, nodes, edges, depth]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<EntityNodeData>);
    setSheetOpen(true);
  }, []);

  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id);
  }, [selectedNode, edges]);

  const connectedNodes = useMemo(() => {
    if (!selectedNode) return [];
    const ids = new Set<string>();
    connectedEdges.forEach((e) => {
      if (e.source !== selectedNode.id) ids.add(e.source);
      if (e.target !== selectedNode.id) ids.add(e.target);
    });
    return nodes.filter((n) => ids.has(n.id));
  }, [selectedNode, connectedEdges, nodes]);

  const relationTypeLabels: Record<string, string> = {
    belongsTo: t("belongsTo"),
    mentions: t("mentions"),
    relatedTo: t("relatedTo"),
    participatedIn: t("participatedIn"),
    locatedAt: t("locatedAt"),
  };

  const entityTypeLabels: Record<EntityType, string> = {
    person: t("person"),
    organization: t("organization"),
    document: t("document"),
    event: t("event"),
    location: t("location"),
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background relative" data-testid="graph-map-page">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-graph-search"
              placeholder={t("graphSearchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/95 backdrop-blur-sm shadow-md"
            />
            {searchQuery && (
              <Button
                data-testid="button-clear-search"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{t("explorationDepth")}</span>
              <Badge variant="secondary" data-testid="badge-depth-value">
                {depth[0] === 1 ? t("depth1") : depth[0] === 2 ? t("depth2") : t("depth3")}
              </Badge>
            </div>
            <Slider
              data-testid="slider-depth"
              min={1}
              max={3}
              step={1}
              value={depth}
              onValueChange={setDepth}
            />
          </div>

          <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-md border p-3">
            <span className="text-xs font-medium text-muted-foreground mb-2 block">{t("legend")}</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(NODE_COLORS) as EntityType[]).map((type) => (
                <div key={type} className="flex items-center gap-2" data-testid={`legend-${type}`}>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: NODE_COLORS[type] }}
                  />
                  <span className="text-xs text-foreground">{entityTypeLabels[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{ animated: true }}
        >
          <Background gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              const d = n.data as EntityNodeData;
              return NODE_COLORS[d.entityType] || "#94a3b8";
            }}
            maskColor="rgba(0,0,0,0.08)"
          />
        </ReactFlow>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-[380px] sm:w-[420px]" data-testid="sheet-node-details">
            {selectedNode && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: NODE_COLORS[selectedNode.data.entityType] }}
                    >
                      {(() => {
                        const Icon = NODE_ICONS[selectedNode.data.entityType];
                        return <Icon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    <div>
                      <SheetTitle data-testid="text-node-name">{selectedNode.data.label}</SheetTitle>
                      <Badge variant="outline" className="mt-1" data-testid="badge-node-type">
                        {entityTypeLabels[selectedNode.data.entityType]}
                      </Badge>
                    </div>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  {selectedNode.data.description && (
                    <p className="text-sm text-muted-foreground" data-testid="text-node-description">
                      {selectedNode.data.description}
                    </p>
                  )}

                  {selectedNode.data.properties && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        {t("nodeDetails")}
                      </h4>
                      <div className="space-y-1.5">
                        {Object.entries(selectedNode.data.properties).map(([key, val]) => (
                          <div key={key} className="flex justify-between text-sm py-1 px-2 rounded bg-secondary/30">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {t("relationType")} ({connectedEdges.length})
                    </h4>
                    <div className="space-y-2">
                      {connectedEdges.map((edge) => {
                        const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                        const otherNode = connectedNodes.find((n) => n.id === otherNodeId);
                        const relType = (edge.data as { relationType?: string })?.relationType || "relatedTo";
                        return (
                          <div
                            key={edge.id}
                            className="flex items-center gap-2 text-sm p-2 rounded-md border bg-card cursor-pointer hover:bg-accent/50 transition-colors"
                            data-testid={`relation-${edge.id}`}
                            onClick={() => {
                              if (otherNode) {
                                setSelectedNode(otherNode as Node<EntityNodeData>);
                              }
                            }}
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{ backgroundColor: otherNode ? NODE_COLORS[(otherNode.data as EntityNodeData).entityType] : "#94a3b8" }}
                            >
                              {otherNode && (() => {
                                const OIcon = NODE_ICONS[(otherNode.data as EntityNodeData).entityType];
                                return <OIcon className="w-3 h-3 text-white" />;
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium truncate block">
                                {otherNode ? (otherNode.data as EntityNodeData).label : otherNodeId}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                              {relationTypeLabels[relType] || relType}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
