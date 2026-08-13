import { useState, useMemo, useCallback, useRef } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Database, Network, ArrowRight, Plus, GripVertical, Trash2, Table as TableIcon, Eye, Image, MapPin, Tag, ChevronDown, ChevronUp, X, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node as FlowNode,
  type Edge as FlowEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Link {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  labelField: string;
  weightField: string;
  /** PK of the source-node table that sourceColumn references */
  sourceNodeKey: string;
  /** PK of the target-node table that targetColumn references */
  targetNodeKey: string;
}

interface NodeConfig {
  id: string;
  table: string;
  labelField: string;
  imageField: string;
  latitudeField: string;
  longitudeField: string;
  sizeField: string;
  colorField: string;
  icon: string;
}

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  "crime_incidents_2024": { bg: "#EEF2FF", border: "#818CF8", text: "#4338CA" },
  "suspect_profiles": { bg: "#F0FDF4", border: "#4ADE80", text: "#15803D" },
  "location_hotspots": { bg: "#FFF7ED", border: "#FB923C", text: "#C2410C" },
  "supply_chain_nodes": { bg: "#FDF2F8", border: "#F472B6", text: "#BE185D" },
};

const defaultColor = { bg: "#F8FAFC", border: "#94A3B8", text: "#475569" };

function CircleNode({ data }: { data: { label: string; field: string; color: { bg: string; border: string; text: string } } }) {
  return (
    <div
      className="flex items-center justify-center text-center"
      style={{
        width: 110,
        height: 110,
        borderRadius: "50%",
        background: data.color.bg,
        border: `3px solid ${data.color.border}`,
        boxShadow: `0 4px 12px ${data.color.border}30`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div className="px-2">
        <div className="text-[10px] font-bold leading-tight" style={{ color: data.color.text }}>
          {data.label}
        </div>
        {data.field && (
          <div className="text-[8px] mt-0.5 opacity-60 font-medium" style={{ color: data.color.text }}>
            {data.field}
          </div>
        )}
      </div>
    </div>
  );
}

const previewNodeTypes = { circle: CircleNode };

function DraggableNodeItem({ node, onRemove }: { node: NodeConfig; onRemove: (id: string) => void }) {
  const { t } = useLanguage();
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={node}
      dragListener={false}
      dragControls={dragControls}
      className="border p-4 rounded-lg bg-card/50"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 50 }}
      transition={{ duration: 0.2, layout: { duration: 0 } }}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center h-9 mt-[22px]">
          <div
            className="text-muted-foreground/40 cursor-grab active:cursor-grabbing hover:text-muted-foreground/70 transition-colors"
            onPointerDown={(e) => dragControls.start(e)}
            data-testid={`drag-handle-node-${node.id}`}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[1fr_1fr_auto_1fr_1fr_1fr] gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("tableSource")}</Label>
            <Select defaultValue={node.table}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t("selectTable")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crime_incidents_2024">crime_incidents_2024</SelectItem>
                <SelectItem value="suspect_profiles">suspect_profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("nodeField")}</Label>
            <Select defaultValue={node.labelField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t("selectField")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type">type</SelectItem>
                <SelectItem value="name">name</SelectItem>
                <SelectItem value="id">id</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center h-9 mt-[22px]">
            <div className="w-px h-8 bg-border"></div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("imageField")}</Label>
            <Select defaultValue={node.imageField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t("none")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("none")}</SelectItem>
                <SelectItem value="photo_url">photo_url</SelectItem>
                <SelectItem value="image">image</SelectItem>
                <SelectItem value="thumbnail">thumbnail</SelectItem>
                <SelectItem value="avatar">avatar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("latitude")}</Label>
            <Select defaultValue={node.latitudeField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t("none")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("none")}</SelectItem>
                <SelectItem value="latitude">latitude</SelectItem>
                <SelectItem value="lat">lat</SelectItem>
                <SelectItem value="y">y</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("longitude")}</Label>
            <Select defaultValue={node.longitudeField}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t("none")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("none")}</SelectItem>
                <SelectItem value="longitude">longitude</SelectItem>
                <SelectItem value="lng">lng</SelectItem>
                <SelectItem value="x">x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center h-9 mt-[22px]">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => onRemove(node.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

const KEY_OPTIONS = ["id", "suspect_id", "profile_id", "incident_id", "location_id", "node_id"];

function DraggableLinkItem({ link, onRemove }: { link: Link; onRemove: (id: string) => void }) {
  const { t } = useLanguage();
  const dragControls = useDragControls();
  const [showMapping, setShowMapping] = useState(false);
  const [labelEnabled, setLabelEnabled] = useState(false);
  const [weightEnabled, setWeightEnabled] = useState(false);

  const TABLE_OPTIONS = ["crime_incidents_2024", "suspect_profiles"];
  const COL_OPTIONS = ["id", "suspect_id"];

  return (
    <Reorder.Item
      value={link}
      dragListener={false}
      dragControls={dragControls}
      className="rounded-lg border border-border bg-slate-50/50 shadow-sm overflow-hidden"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 50 }}
      transition={{ duration: 0.2, layout: { duration: 0 } }}
    >
      {/* ── 통합 그리드: 메인 행 + 노드 정보 연결 ──
           col: [handle 28px] [sourceTable 160px | border-r] [sourceCol 1fr] [arrow auto] [targetCol 1fr] [buttons auto]
      */}
      <div
        className="px-4 pt-3 pb-2"
        style={{ display: "grid", gridTemplateColumns: "28px 160px 1fr auto 1fr auto", columnGap: 0 }}
      >
        {/* ── Row 1 ── */}

        {/* R1 C1: drag handle */}
        <div
          className="self-end pb-1.5 pr-3 text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-muted-foreground/60 transition-colors"
          onPointerDown={(e) => dragControls.start(e)}
          data-testid={`drag-handle-link-${link.id}`}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* R1 C2: SOURCE TABLE */}
        <div className="self-center flex flex-col gap-1 pr-4 border-r border-border py-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("sourceTable")}</span>
          <Select defaultValue={link.sourceTable}>
            <SelectTrigger className="bg-white h-9 text-xs"><SelectValue placeholder={t("table")} /></SelectTrigger>
            <SelectContent>{TABLE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* R1 C3: SOURCE COLUMN */}
        <div className="self-end flex flex-col gap-1 pl-4 pb-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("sourceColumn")}</span>
          <Select defaultValue={link.sourceColumn}>
            <SelectTrigger className="bg-white h-9 text-sm font-medium"><SelectValue placeholder={t("column")} /></SelectTrigger>
            <SelectContent>{COL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* R1 C4: 화살표 */}
        <div className="self-end flex items-center pb-1.5 px-3">
          <div className="w-10 h-px bg-muted-foreground/30" />
          <ArrowRight className="w-4 h-4 text-muted-foreground/50 -ml-0.5" />
        </div>

        {/* R1 C5: TARGET COLUMN */}
        <div className="self-end flex flex-col gap-1 pb-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("targetColumn")}</span>
          <Select defaultValue={link.targetColumn}>
            <SelectTrigger className="bg-white h-9 text-sm font-medium"><SelectValue placeholder={t("column")} /></SelectTrigger>
            <SelectContent>{COL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* R1 C6: 버튼 — 두 행 스팬 + 수직 중앙 */}
        <div className="flex items-center justify-end gap-1 pl-3" style={{ gridRow: "span 2", alignSelf: "center" }}>
          <Button
            variant="ghost" size="sm"
            className={`h-9 px-2.5 gap-1 text-xs transition-colors ${showMapping ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setShowMapping(v => !v)}
          >
            {showMapping ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            추가 설정
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-9 w-9" onClick={() => onRemove(link.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* ── Row 2: 노드 정보 연결 ── */}

        {/* R2 C1: 빈 공간 */}
        <div className="pb-3" />

        {/* R2 C2: 빈 공간 (소스 테이블 열) */}
        <div className="pb-3 border-r border-border pr-4" />

        {/* R2 C3: 노드 정보 연결 라벨 + 소스 측 */}
        <div className="pb-3 pl-4 flex flex-col gap-1.5 justify-end min-w-0">
          {/* 라벨 */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider cursor-default whitespace-nowrap w-fit">
                  노드 정보 연결
                  <HelpCircle className="w-3 h-3 text-indigo-400 shrink-0" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed whitespace-normal">
                소스·타깃 컬럼이 연결된 노드의 속성 정보를 가져올 때, 관련 키(고유키)로 매핑하여 추가 속성 정보를 연결합니다.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* 소스 측 인풋 */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center rounded px-2 h-7 bg-white border border-border text-[11px] font-medium text-slate-600 shrink-0 max-w-[90px] truncate">{link.sourceColumn || "—"}</span>
            <div className="flex flex-col gap-[3px] shrink-0 mx-0.5">
              <div className="w-4 h-px bg-muted-foreground/40"/>
              <div className="w-4 h-px bg-muted-foreground/40"/>
            </div>
            <Select defaultValue={link.sourceTable}>
              <SelectTrigger className="bg-white h-7 text-xs flex-1 min-w-[90px]"><SelectValue placeholder="시작 시트명"/></SelectTrigger>
              <SelectContent>{TABLE_OPTIONS.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
            <Select defaultValue={link.sourceNodeKey||"none"} disabled>
              <SelectTrigger className="h-7 text-xs w-[68px] shrink-0 opacity-40 cursor-not-allowed"><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="none">{t("none")}</SelectItem>{KEY_OPTIONS.map(k=><SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>{/* /R2 C3 */}

        {/* R2 C4: 중앙 화살표 */}
        <div className="pb-3 flex items-end pb-3 px-3">
          <div className="w-10 h-px bg-muted-foreground/30" />
          <ArrowRight className="w-4 h-4 text-muted-foreground/40 -ml-0.5" />
        </div>

        {/* R2 C5: 타깃 측 */}
        <div className="pb-3 flex items-end gap-1.5 min-w-0">
          <span className="inline-flex items-center rounded px-2 h-7 bg-white border border-border text-[11px] font-medium text-slate-600 shrink-0 max-w-[90px] truncate">{link.targetColumn || "—"}</span>
          <div className="flex flex-col gap-[3px] shrink-0 mx-0.5">
            <div className="w-4 h-px bg-muted-foreground/40"/>
            <div className="w-4 h-px bg-muted-foreground/40"/>
          </div>
          <Select defaultValue={link.sourceTable}>
            <SelectTrigger className="bg-white h-7 text-xs flex-1 min-w-[90px]"><SelectValue placeholder="도착 시트명"/></SelectTrigger>
            <SelectContent>{TABLE_OPTIONS.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
          <Select defaultValue={link.targetNodeKey||"none"} disabled>
            <SelectTrigger className="h-7 text-xs w-[68px] shrink-0 opacity-40 cursor-not-allowed"><SelectValue/></SelectTrigger>
            <SelectContent><SelectItem value="none">{t("none")}</SelectItem>{KEY_OPTIONS.map(k=><SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* R2 C6: span 2인 버튼이 이미 점유 — 추가 셀 불필요 */}
      </div>

      {/* ── 추가 설정 패널 (링크 라벨 · 웨이트) ── */}
      {showMapping && (
        <div className="border-t border-border/60 bg-slate-50/40">
          {/* pl = px-4(16) + handle(28) + tableCol(160) + border(1) + pl-4(16) = 221px → SOURCE COLUMN 열 시작과 정렬 */}
          <div className="pr-4 py-2 space-y-1" style={{ paddingLeft: "221px" }}>

            {/* 링크 라벨 */}
            <div className="flex items-center gap-3 h-9">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground w-[120px] shrink-0 cursor-default">
                      링크 라벨
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed whitespace-normal">
                    그래프에서 링크(엣지) 위에 표시되는 텍스트 라벨을 지정합니다.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {labelEnabled ? (
                <div className="flex items-center gap-1.5">
                  <Select defaultValue={link.sourceTable}>
                    <SelectTrigger className="bg-white h-7 text-xs w-[130px]"><SelectValue placeholder="시트명"/></SelectTrigger>
                    <SelectContent>{TABLE_OPTIONS.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select defaultValue={link.labelField!=="none"?link.labelField:"color"}>
                    <SelectTrigger className="bg-white h-7 text-xs w-[95px]"><SelectValue placeholder="color"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">color</SelectItem>
                      {["type","relationship","status","category"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <button onClick={()=>setLabelEnabled(false)} className="shrink-0 rounded-full p-0.5 text-muted-foreground/40 hover:text-destructive hover:bg-slate-100 transition-colors">
                    <X className="w-3 h-3"/>
                  </button>
                </div>
              ) : (
                <button onClick={()=>setLabelEnabled(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-600 border border-dashed border-border hover:border-indigo-400 rounded px-2.5 h-7 transition-colors font-medium">
                  <Plus className="w-3 h-3"/> 설정
                </button>
              )}
            </div>

            {/* 링크 웨이트 */}
            <div className="flex items-center gap-3 h-9">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground w-[120px] shrink-0 cursor-default">
                      링크 웨이트
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed whitespace-normal">
                    그래프에서 링크(엣지)의 두께를 지정하는 필드를 설정합니다. 값이 클수록 링크가 굵게 표시됩니다.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {weightEnabled ? (
                <div className="flex items-center gap-1.5">
                  <Select defaultValue={link.sourceTable}>
                    <SelectTrigger className="bg-white h-7 text-xs w-[130px]"><SelectValue placeholder="시트명"/></SelectTrigger>
                    <SelectContent>{TABLE_OPTIONS.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select defaultValue={link.weightField!=="none"?link.weightField:"color"}>
                    <SelectTrigger className="bg-white h-7 text-xs w-[95px]"><SelectValue placeholder="color"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">color</SelectItem>
                      {["weight","severity","count","score"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <button onClick={()=>setWeightEnabled(false)} className="shrink-0 rounded-full p-0.5 text-muted-foreground/40 hover:text-destructive hover:bg-slate-100 transition-colors">
                    <X className="w-3 h-3"/>
                  </button>
                </div>
              ) : (
                <button onClick={()=>setWeightEnabled(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-600 border border-dashed border-border hover:border-indigo-400 rounded px-2.5 h-7 transition-colors font-medium">
                  <Plus className="w-3 h-3"/> 설정
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </Reorder.Item>
  );
}

export default function GraphBuilderForm() {
  const { t } = useLanguage();
  const [links, setLinks] = useState<Link[]>([
    { id: "1", sourceTable: "crime_incidents_2024", sourceColumn: "suspect_id", targetTable: "suspect_profiles", targetColumn: "id", labelField: "none", weightField: "none", sourceNodeKey: "id", targetNodeKey: "id" }
  ]);

  const [nodes, setNodes] = useState<NodeConfig[]>([
    { id: "1", table: "crime_incidents_2024", labelField: "type", imageField: "none", latitudeField: "none", longitudeField: "none", sizeField: "severity", colorField: "severity", icon: "Circle" },
    { id: "2", table: "suspect_profiles", labelField: "name", imageField: "none", latitudeField: "none", longitudeField: "none", sizeField: "age", colorField: "age", icon: "User" }
  ]);


  const addLink = () => {
    setLinks([...links, { 
      id: Date.now().toString(), 
      sourceTable: "", 
      sourceColumn: "", 
      targetTable: "", 
      targetColumn: "",
      labelField: "none",
      weightField: "none",
      sourceNodeKey: "",
      targetNodeKey: "",
    }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const addNode = () => {
    setNodes([...nodes, { 
      id: Date.now().toString(), 
      table: "", 
      labelField: "", 
      imageField: "none",
      latitudeField: "none",
      longitudeField: "none",
      sizeField: "", 
      colorField: "", 
      icon: "Circle" 
    }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const [previewHeight, setPreviewHeight] = useState(280);
  const resizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(280);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    startY.current = e.clientY;
    startHeight.current = previewHeight;

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      const delta = ev.clientY - startY.current;
      setPreviewHeight(Math.max(150, Math.min(800, startHeight.current + delta)));
    };
    const onMouseUp = () => {
      resizing.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [previewHeight]);

  const { flowNodes, flowEdges } = useMemo(() => {
    const validNodes = nodes.filter(n => n.table);
    const tableToNodeId = new Map<string, string>();
    validNodes.forEach(n => {
      if (!tableToNodeId.has(n.table)) {
        tableToNodeId.set(n.table, n.id);
      }
    });

    const uniqueTables = Array.from(tableToNodeId.keys());
    const spacing = 250;
    const startX = 50;
    const centerY = 80;

    const fNodes: FlowNode[] = uniqueTables.map((table, i) => {
      const nodeConfig = validNodes.find(n => n.table === table);
      const color = nodeColors[table] || defaultColor;
      return {
        id: tableToNodeId.get(table)!,
        type: "circle",
        position: {
          x: startX + i * spacing,
          y: centerY,
        },
        data: {
          label: table,
          field: nodeConfig?.labelField || "",
          color,
        },
      };
    });

    const fEdges: FlowEdge[] = links
      .filter(l => l.sourceTable && l.targetTable && tableToNodeId.has(l.sourceTable) && tableToNodeId.has(l.targetTable))
      .map((l, idx) => ({
        id: `edge-${l.id}`,
        source: tableToNodeId.get(l.sourceTable)!,
        target: tableToNodeId.get(l.targetTable)!,
        sourceHandle: null,
        targetHandle: null,
        label: `${l.sourceColumn} → ${l.targetColumn}`,
        labelStyle: { fontSize: 10, fill: "#64748B", fontWeight: 500 },
        labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.95 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
        style: { stroke: "#334155", strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#334155", width: 18, height: 18 },
        type: "default",
      }));

    return { flowNodes: fNodes, flowEdges: fEdges };
  }, [nodes, links]);

  const [activeTab, setActiveTab] = useState<"nodes" | "links">("nodes");

  return (
    <div className="space-y-6 pb-20">

      {/* ── 1. Graph Preview (top) ───────────────────────────────────── */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t("graphPreview")}</h3>
            {flowNodes.length > 0 && (
              <span className="text-[10px] text-slate-400 font-medium ml-2">
                {flowNodes.length} {t("nodes")} · {flowEdges.length} {t("links")}
              </span>
            )}
          </div>
        </div>

        {flowNodes.length > 0 ? (
          <>
            <div className="bg-white" style={{ height: previewHeight }} data-testid="graph-preview">
              <ReactFlow
                key="default-preview"
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={previewNodeTypes}
                fitView
                fitViewOptions={{ padding: 0.5 }}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={true}
                zoomOnScroll={true}
                minZoom={0.3}
                maxZoom={2}
              >
                <Background color="#E2E8F0" gap={20} size={1} />
              </ReactFlow>
            </div>
            <div
              className="h-2 bg-slate-50 border-t border-slate-100 cursor-row-resize flex items-center justify-center hover:bg-slate-100 transition-colors"
              onMouseDown={handleResizeStart}
              data-testid="graph-preview-resize"
            >
              <div className="w-8 h-0.5 rounded-full bg-slate-300" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-muted-foreground bg-white">
            <Network className="w-10 h-10 mb-3 opacity-15" />
            <p className="text-sm">노드를 추가하면 미리보기가 표시됩니다.</p>
          </div>
        )}
      </Card>

      {/* ── 2. Nodes & Links (tabbed) ────────────────────────────────── */}
      <Card className="border-none shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "nodes" | "links")}>
          {/* Tab bar + add button */}
          <div className="bg-indigo-600/5 px-6 pt-4 border-b border-indigo-100/50 flex items-end justify-between">
            <TabsList className="h-auto bg-transparent p-0 gap-0">
              <TabsTrigger
                value="nodes"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-medium text-muted-foreground data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <TableIcon className="w-3.5 h-3.5" />
                {t("nodeConfiguration")}
                <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                  {nodes.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="links"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-medium text-muted-foreground data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Database className="w-3.5 h-3.5" />
                {t("dataLinks")}
                <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                  {links.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "nodes" ? (
              <Button size="sm" onClick={addNode} className="mb-3 h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                {t("addNode")}
              </Button>
            ) : (
              <Button size="sm" onClick={addLink} className="mb-3 h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                {t("addLink")}
              </Button>
            )}
          </div>

          {/* Nodes tab */}
          <TabsContent value="nodes" className="mt-0">
            <CardContent className="p-6">
              <Reorder.Group axis="y" values={nodes} onReorder={setNodes} className="space-y-4">
                {nodes.map((node) => (
                  <DraggableNodeItem key={node.id} node={node} onRemove={removeNode} />
                ))}
              </Reorder.Group>
              {nodes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-slate-50/50">
                  <TableIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">{t("nodeConfigDesc")}</p>
                </div>
              )}
            </CardContent>
          </TabsContent>

          {/* Links tab */}
          <TabsContent value="links" className="mt-0">
            <div className="p-6 bg-white min-h-[200px]">
              <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-3">
                {links.map((link) => (
                  <DraggableLinkItem key={link.id} link={link} onRemove={removeLink} />
                ))}
              </Reorder.Group>
              {links.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-slate-50/50">
                  <Network className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">{t("noLinksDefinedDesc")}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex justify-end gap-3 pt-4 pb-10">
        <Button variant="outline" size="lg" className="h-10">{t("reset")}</Button>
        <Button size="lg" className="bg-black hover:bg-black/90 text-white px-8 h-10">{t("generateGraph")}</Button>
      </div>
    </div>
  );
}
