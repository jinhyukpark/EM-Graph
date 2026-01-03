import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Database, Table as TableIcon, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const MOCK_DATA: Record<string, any[]> = {
  't1': [
    { id: 'SP-001', full_name: 'Kang "The Viper"', alias: 'Viper', status: 'Wanted', last_seen: '2024-01-20' },
    { id: 'SP-002', full_name: 'Park "Razor"', alias: 'Razor', status: 'In Custody', last_seen: '2024-02-15' },
    { id: 'SP-003', full_name: 'Kim "Ledger"', alias: 'Ledger', status: 'Active', last_seen: '2024-03-01' },
    { id: 'SP-004', full_name: 'Unknown Male', alias: 'Shadow', status: 'Suspect', last_seen: '2023-12-10' },
    { id: 'SP-005', full_name: 'Lee Min-ho', alias: '-', status: 'Clear', last_seen: '2024-01-05' },
  ],
  't2': [
    { incident_id: 'INC-2024-001', type: 'Aggravated Assault', date_time: '2024-01-15 23:45', location_id: 'LOC-201', description: 'Physical altercation reported' },
    { incident_id: 'INC-2024-002', type: 'Wire Fraud', date_time: '2024-02-10 09:30', location_id: 'LOC-202', description: 'Suspicious transaction flagged' },
    { incident_id: 'INC-2024-003', type: 'Smuggling', date_time: '2024-02-28 02:15', location_id: 'LOC-205', description: 'Illegal cargo intercepted' },
  ],
  't3': [
    { loc_id: 'LOC-201', address: '123 Dark Alley, Gangnam', district: 'Gangnam', risk_level: 'High' },
    { loc_id: 'LOC-202', address: 'Warehouse 4, Incheon Port', district: 'Incheon', risk_level: 'Critical' },
    { loc_id: 'LOC-205', address: 'Busan Terminal', district: 'Busan', risk_level: 'Moderate' },
  ],
  't4': [
    { evidence_id: 'EV-301', incident_id: 'INC-2024-001', type: 'Physical', custody_chain: 'Det. Choi -> Forensics' },
    { evidence_id: 'EV-302', incident_id: 'INC-2024-002', type: 'Digital', custody_chain: 'Cyber Unit -> Server Log' },
    { evidence_id: 'EV-303', incident_id: 'INC-2024-002', type: 'Document', custody_chain: 'Det. Lee -> Archive' },
  ],
  't5': [
    { node_id: 'SC-501', location_id: 'LOC-202', operator: 'Global Logistics Co.', capacity: '5000 containers' },
    { node_id: 'SC-502', location_id: 'LOC-205', operator: 'Busan Port Authority', capacity: '12000 containers' },
  ]
};

const TABLE_NAMES: Record<string, string> = {
    't1': 'Suspects_Profiles',
    't2': 'Crime_Incidents_2024',
    't3': 'Location_Hotspots',
    't4': 'Evidence_Log',
    't5': 'Supply_Chain_Nodes'
};

export default function ERDTablePanel({ 
    activeTableId, 
    openTables, 
    onTabChange, 
    onTabClose,
    onClose 
}: { 
    activeTableId: string | null, 
    openTables: string[],
    onTabChange: (id: string) => void,
    onTabClose: (id: string) => void,
    onClose: () => void 
}) {
  const [height, setHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newHeight = window.innerHeight - e.clientY;
      // Min height 150px, Max height 80% of screen
      if (newHeight >= 150 && newHeight <= window.innerHeight * 0.8) {
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  if (!activeTableId || !MOCK_DATA[activeTableId]) return null;

  const data = MOCK_DATA[activeTableId];
  const columns = Object.keys(data[0]);
  const activeTableName = TABLE_NAMES[activeTableId];

  return (
    <div 
      ref={panelRef}
      className="absolute bottom-0 left-0 right-0 bg-background border-t border-border shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-10 z-20 flex flex-col"
      style={{ height: `${height}px` }}
    >
       {/* Resize Handle */}
       <div 
         className="absolute top-0 left-0 right-0 h-1.5 cursor-row-resize hover:bg-primary/50 transition-colors z-30 group flex justify-center"
         onMouseDown={(e) => {
           e.preventDefault();
           setIsResizing(true);
         }}
       >
          <div className="w-16 h-1 rounded-full bg-border group-hover:bg-primary/50 mt-0.5 transition-colors" />
       </div>

       {/* Tab Bar */}
       <div className="flex items-center justify-between px-2 pt-2 border-b bg-muted/30 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {openTables.map(tableId => (
                  <div 
                    key={tableId}
                    onClick={() => onTabChange(tableId)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-md cursor-pointer border-t border-x transition-colors min-w-[120px] max-w-[200px]",
                        activeTableId === tableId 
                            ? "bg-background border-border text-foreground -mb-px relative z-10 font-semibold" 
                            : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                      <TableIcon className={cn("w-3.5 h-3.5", activeTableId === tableId ? "text-blue-500" : "text-muted-foreground")} />
                      <span className="truncate flex-1">{TABLE_NAMES[tableId]}</span>
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onTabClose(tableId);
                        }}
                        className="p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive opacity-70 hover:opacity-100"
                      >
                          <X className="w-3 h-3" />
                      </button>
                  </div>
              ))}
          </div>
          <div className="flex items-center gap-2 pb-1 pr-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
                <X className="w-4 h-4" />
            </Button>
          </div>
       </div>

       {/* Toolbar */}
       <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
          <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                {activeTableName}
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] border">Table View</span>
              </h3>
              <div className="h-4 w-px bg-border" />
              <p className="text-[10px] text-muted-foreground">{data.length} records found</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Query Table
            </Button>
          </div>
       </div>

       <ScrollArea className="flex-1 w-full bg-card/30">
         <div className="p-0">
            <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow className="hover:bg-transparent border-b border-border">
                {columns.map(col => (
                    <TableHead key={col} className="h-9 text-xs font-semibold text-foreground/70 uppercase tracking-wider">{col}</TableHead>
                ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/30 border-b border-border/50">
                    {columns.map(col => (
                        <TableCell key={col} className="py-2.5 text-xs font-mono text-muted-foreground">{row[col]}</TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
         </div>
       </ScrollArea>
    </div>
  );
}
