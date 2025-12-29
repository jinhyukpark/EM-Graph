import { Handle, Position } from '@xyflow/react';
import { cn } from "@/lib/utils";

interface ImageNodeProps {
  data: {
    label: string;
    image?: string;
    type?: string;
    subLabel?: string;
    highlight?: boolean;
    borderColor?: string;
  };
  selected?: boolean;
}

export default function ImageNode({ data, selected }: ImageNodeProps) {
  return (
    <div className={cn(
      "relative flex flex-col items-center group",
    )}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      {/* Circle Container */}
      <div className={cn(
        "relative w-16 h-16 rounded-full border-2 bg-background flex items-center justify-center overflow-hidden transition-all duration-300",
        selected ? "ring-4 ring-primary/20 border-primary scale-110" : "border-border hover:border-primary/50",
        data.highlight && "border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]",
        data.borderColor ? `border-[${data.borderColor}]` : ""
      )}
      style={data.borderColor ? { borderColor: data.borderColor } : {}}
      >
        {data.image ? (
          <img src={data.image} alt={data.label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground p-1 text-center leading-tight">
            {data.label}
          </div>
        )}
      </div>

      {/* Label (Outside) */}
      <div className="absolute top-full mt-2 flex flex-col items-center">
        <span className={cn(
          "text-[10px] font-semibold bg-background/80 backdrop-blur px-2 py-0.5 rounded-full border border-border/50 whitespace-nowrap shadow-sm",
          selected ? "text-primary border-primary/30" : "text-foreground"
        )}>
          {data.label}
        </span>
        {data.subLabel && (
          <span className="text-[9px] text-muted-foreground mt-0.5 max-w-[100px] text-center leading-tight">
            {data.subLabel}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
