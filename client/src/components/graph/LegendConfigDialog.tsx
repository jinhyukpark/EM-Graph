
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  label: string;
  color: string;
  alias?: string;
  valueType?: 'exact' | 'range';
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

  const isRange = item.valueType === 'range';

  return (
    <Reorder.Item 
      value={item} 
      id={item.id} 
      dragListener={false}
      dragControls={controls}
      className="bg-secondary/20 p-2.5 rounded-md border border-border/50 group mb-2"
    >
      <div className="flex items-center gap-2">
        <div 
          className="cursor-grab active:cursor-grabbing flex justify-center text-muted-foreground/50 hover:text-foreground touch-none shrink-0"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn("w-6 h-6 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform shrink-0", item.color)} />
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

        {/* Value Type Selector */}
        <Select 
          value={item.valueType || 'exact'} 
          onValueChange={(val) => onUpdate(item.id, { valueType: val as 'exact' | 'range' })}
        >
          <SelectTrigger className="h-7 text-[10px] w-[80px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exact">Exact</SelectItem>
            <SelectItem value="range">Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Value/Range Input */}
        {isRange ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Input 
              type="number"
              value={item.min ?? 0} 
              onChange={(e) => onUpdate(item.id, { min: Number(e.target.value), label: `${e.target.value}~${item.max ?? 100}` })}
              className="h-7 text-xs w-14 px-1.5"
              placeholder="Min"
            />
            <span className="text-muted-foreground text-xs shrink-0">~</span>
            <Input 
              type="number"
              value={item.max ?? 100} 
              onChange={(e) => onUpdate(item.id, { max: Number(e.target.value), label: `${item.min ?? 0}~${e.target.value}` })}
              className="h-7 text-xs w-14 px-1.5"
              placeholder="Max"
            />
          </div>
        ) : (
          <Input 
            value={item.label} 
            onChange={(e) => onUpdate(item.id, { label: e.target.value })}
            className="h-7 text-xs flex-1 min-w-0"
            placeholder="Category"
          />
        )}

        {/* Alias Input */}
        <Input 
          value={item.alias || ""} 
          onChange={(e) => onUpdate(item.id, { alias: e.target.value })}
          className="h-7 text-xs flex-1 min-w-0"
          placeholder="Alias"
        />

        {/* Delete Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Range Slider Preview */}
      {isRange && (
        <div className="mt-2 px-8">
          <Slider 
            value={[item.min ?? 0, item.max ?? 100]}
            min={0}
            max={Math.max(item.max ?? 100, 100)}
            step={1}
            onValueChange={([min, max]) => onUpdate(item.id, { min, max, label: `${min}~${max}` })}
            className="py-1"
          />
        </div>
      )}
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
      <DialogContent className="sm:max-w-[600px]">
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
                <p>Select "Exact" for category values or "Range" for numeric ranges with slider control.</p>
                <p className="mt-1">Items will be matched in order. Drag to reorder priority.</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2">
                <div className="w-4"></div>
                <div className="w-6">Color</div>
                <div className="w-[80px]">Type</div>
                <div className="flex-1">Value/Range</div>
                <div className="flex-1">Alias</div>
                <div className="w-7"></div>
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
