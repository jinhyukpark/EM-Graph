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
    <div className="relative flex flex-col items-center justify-center">
      <Handle type="target" position={Position.Top} className="opacity-0 pointer-events-none" />
      
      {/* Circle Container - Strictly Circular */}
      <div 
        className={cn(
          "relative rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 bg-background",
          selected ? "ring-4 ring-primary/30 scale-105" : "hover:ring-4 hover:ring-muted/30",
          data.highlight && "shadow-[0_0_20px_rgba(var(--primary),0.2)]"
        )}
        style={{
          width: '100%',
          height: '100%',
          border: `3px solid ${data.borderColor || 'hsl(var(--border))'}`,
          aspectRatio: '1/1'
        }}
      >
        {data.image ? (
          <img 
            src={data.image} 
            alt={data.label} 
            className="w-full h-full object-cover pointer-events-none" 
          />
        ) : (
          <div className="w-full h-full bg-secondary/50 flex flex-col items-center justify-center p-2 text-center">
             <span className="text-[10px] font-bold text-muted-foreground leading-tight">{data.label.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Floating Label (Strictly Outside) */}
      <div className="absolute top-full mt-2 flex flex-col items-center pointer-events-none">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm bg-background/90 backdrop-blur-sm border border-border/50 whitespace-nowrap",
          selected ? "text-primary border-primary/30" : "text-foreground/80"
        )}>
          {data.label}
        </span>
        {data.subLabel && (
          <span className="text-[9px] text-muted-foreground font-medium mt-0.5 bg-secondary/50 px-1.5 rounded-sm">
            {data.subLabel}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0 pointer-events-none" />
    </div>
  );
}
