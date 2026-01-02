
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, Plus, GripVertical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reorder, useDragControls } from "framer-motion";

// Standard tailwind colors for selection
const PRESET_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", 
  "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
  "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
  "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
  "bg-rose-500", "bg-slate-500", "bg-gray-500", "bg-zinc-500"
];

export interface LegendItem {
  id: string;
  label: string; // The category name or range
  color: string; // Tailwind class
  alias?: string; // Display name override
  // For ranges (if implemented later)
  min?: number;
  max?: number;
}

interface LegendConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: LegendItem[];
  onSave: (items: LegendItem[]) => void;
  fieldName?: string;
}

function DraggableItem({ item, onUpdate, onRemove }: { item: LegendItem, onUpdate: (id: string, updates: Partial<LegendItem>) => void, onRemove: (id: string) => void }) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={item} 
      id={item.id} 
      dragListener={false}
      dragControls={controls}
      className="grid grid-cols-[30px_auto_1fr_1fr_30px] gap-2 items-center bg-secondary/20 p-2 rounded-md border border-border/50 group mb-2"
    >
        <div 
          className="cursor-grab active:cursor-grabbing flex justify-center text-muted-foreground/50 hover:text-foreground touch-none"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        {/* Color Picker */}
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <button className={cn("w-6 h-6 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform", item.color)} />
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    className={cn("w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform", color)}
                    onClick={() => onUpdate(item.id, { color })}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Value/Range Input */}
        <Input 
          value={item.label} 
          onChange={(e) => onUpdate(item.id, { label: e.target.value })}
          className="h-8 text-xs"
          placeholder="Category"
        />

        {/* Alias Input */}
        <Input 
          value={item.alias || ""} 
          onChange={(e) => onUpdate(item.id, { alias: e.target.value })}
          className="h-8 text-xs"
          placeholder="Display Name"
        />

        {/* Delete Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
    </Reorder.Item>
  );
}

export function LegendConfigDialog({ open, onOpenChange, items, onSave, fieldName = "Category" }: LegendConfigDialogProps) {
  const [localItems, setLocalItems] = useState<LegendItem[]>([]);

  useEffect(() => {
    if (open) {
      setLocalItems(JSON.parse(JSON.stringify(items))); // Deep copy
    }
  }, [open, items]);

  const handleAddItem = () => {
    const newItem: LegendItem = {
      id: crypto.randomUUID(),
      label: "New Category",
      color: "bg-gray-500",
      alias: ""
    };
    setLocalItems([...localItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setLocalItems(localItems.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<LegendItem>) => {
    setLocalItems(localItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleSave = () => {
    onSave(localItems);
    onOpenChange(false);
  };

  const handleAutoGenerate = () => {
    // Mock AI generation
    const mockGeneratedItems: LegendItem[] = [
      { id: crypto.randomUUID(), label: "High Risk", color: "bg-red-500", alias: "High Risk (Score > 8)" },
      { id: crypto.randomUUID(), label: "Medium Risk", color: "bg-orange-500", alias: "Medium Risk (Score 4~7)" },
      { id: crypto.randomUUID(), label: "Low Risk", color: "bg-emerald-500", alias: "Low Risk (Score < 4)" },
      { id: crypto.randomUUID(), label: "Unknown", color: "bg-slate-400", alias: "Unclassified" },
    ];
    setLocalItems(mockGeneratedItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
             <DialogTitle>Configure Legend</DialogTitle>
             <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs gap-1.5 border-purple-500/30 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 hover:text-purple-700"
                onClick={handleAutoGenerate}
             >
                <Sparkles className="w-3 h-3" />
                Auto Set
             </Button>
          </div>
          <DialogDescription>
            <div className="flex flex-col gap-2 pt-1">
              <div>
                Settings for field: <span className="font-semibold text-foreground">{fieldName}</span>
              </div>
              <div className="text-xs bg-muted/50 p-2 rounded-md border border-border/50 text-muted-foreground/80">
                <p>Enter exact values or specify a numeric range using tilde (e.g., <span className="font-mono text-xs bg-background/50 px-1 rounded">1~10</span>).</p>
                <p className="mt-1">Items will be matched in order. Drag to reorder priority.</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div className="space-y-2">
             <div className="grid grid-cols-[30px_100px_1fr_1fr_30px] gap-2 text-xs font-medium text-muted-foreground px-2">
                <div></div>
                <div>Color</div>
                <div>Value/Range</div>
                <div>Alias (Optional)</div>
                <div></div>
             </div>
             
             <Reorder.Group axis="y" values={localItems} onReorder={setLocalItems}>
               {localItems.map((item) => (
                 <DraggableItem 
                    key={item.id} 
                    item={item} 
                    onUpdate={handleUpdateItem} 
                    onRemove={handleRemoveItem} 
                 />
               ))}
             </Reorder.Group>

             {localItems.length === 0 && (
               <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-lg">
                 No categories defined.
               </div>
             )}
          </div>

          <Button variant="outline" size="sm" className="w-full border-dashed gap-2" onClick={handleAddItem}>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
