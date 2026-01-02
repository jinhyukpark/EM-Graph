import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Settings2 } from "lucide-react";

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: any[];
}

export default function CompareDialog({ open, onOpenChange, nodes }: CompareDialogProps) {
  // Extract all possible keys from node data, excluding some internal ones if needed
  // We'll filter out complex objects or large strings if necessary, but for now just take keys
  const allKeys = Array.from(new Set(nodes.flatMap(n => Object.keys(n.data || {}))));
  
  // Default visible columns (start with all)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allKeys);

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ["ID", ...visibleColumns];
    const rows = nodes.map(n => {
      const data = n.data || {};
      return [
        n.id,
        ...visibleColumns.map(col => {
            const val = data[col];
            if (val === null || val === undefined) return "";
            // Handle objects safely for CSV
            if (typeof val === 'object') {
                return `"${String(JSON.stringify(val)).replace(/"/g, '""')}"`;
            }
            return `"${String(val).replace(/"/g, '""')}"`; // Escape quotes
        })
      ].join(",");
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "graph_comparison.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>Compare Nodes</DialogTitle>
          <DialogDescription>
            Compare properties of {nodes.length} nodes in the current view.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center py-4 gap-2">
            <div className="flex-1">
                {/* Optional: Filter input could go here */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Settings2 className="mr-2 h-4 w-4" />
                  View Fields
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
                {allKeys.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column}
                    className="capitalize"
                    checked={visibleColumns.includes(column)}
                    onCheckedChange={() => toggleColumn(column)}
                  >
                    {column}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="secondary" className="ml-2" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
            </Button>
        </div>

        <div className="rounded-md border border-border/50 flex-1 overflow-auto bg-card/50">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                {visibleColumns.map((col) => (
                  <TableHead key={col} className="capitalize min-w-[120px]">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => {
                const data = node.data || {};
                return (
                  <TableRow key={node.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium font-mono text-xs">{node.id}</TableCell>
                    {visibleColumns.map((col) => {
                      const val = data[col];
                      return (
                        <TableCell key={`${node.id}-${col}`} className="text-xs">
                          {typeof val === 'object' && val !== null ? (
                             <span className="text-muted-foreground italic text-[10px]">{JSON.stringify(val).substring(0, 30)}...</span>
                          ) : (
                            col === 'image' && typeof val === 'string' ? (
                                <img src={val} alt="node" className="w-6 h-6 rounded-full object-cover border border-border" />
                            ) : (
                                String(val ?? "")
                            )
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
