
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function LegendConfigDialog({ open, onOpenChange, items, onSave }: LegendConfigDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Legend</DialogTitle>
          <DialogDescription>
            Set categories, colors, and display aliases for the legend.
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
             
             {localItems.map((item) => (
               <div key={item.id} className="grid grid-cols-[30px_auto_1fr_1fr_30px] gap-2 items-center bg-secondary/20 p-2 rounded-md border border-border/50 group">
                  <div className="cursor-move flex justify-center text-muted-foreground/50 hover:text-foreground">
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
                              onClick={() => handleUpdateItem(item.id, { color })}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Value/Range Input */}
                  <Input 
                    value={item.label} 
                    onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                    className="h-8 text-xs"
                    placeholder="Category"
                  />

                  {/* Alias Input */}
                  <Input 
                    value={item.alias || ""} 
                    onChange={(e) => handleUpdateItem(item.id, { alias: e.target.value })}
                    className="h-8 text-xs"
                    placeholder="Display Name"
                  />

                  {/* Delete Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
               </div>
             ))}

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
