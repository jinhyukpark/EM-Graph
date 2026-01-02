import { Handle, Position } from '@xyflow/react';
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, Lock, Heart, User, Gavel, Siren } from "lucide-react";

interface ImageNodeProps {
  data: {
    label: string;
    image?: string;
    type?: string; // 'criminal' | 'detective' | 'prison' | 'victim'
    subLabel?: string;
    highlight?: boolean;
    borderColor?: string;
  };
  selected?: boolean;
}

const TypeIcon = ({ type, className }: { type?: string, className?: string }) => {
  if (!type) return null;
  
  switch (type.toLowerCase()) {
    case 'criminal': return <Siren className={className} />;
    case 'detective': return <Shield className={className} />;
    case 'prison': return <Lock className={className} />;
    case 'victim': return <Heart className={className} />;
    default: return <User className={className} />;
  }
};

export default function ImageNode({ data, selected }: ImageNodeProps) {
  // Use borderColor as the main color, default to gray if missing
  const color = data.borderColor || '#64748b'; 
  
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* 
        Central Source/Target Handles 
        Placing handles in the center allows edges to radiate naturally from the node center.
        We hide them visually but they function as connection points.
      */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, width: 1, height: 1, background: 'transparent' }} 
      />
      
      {/* Circle Container - White background with colored border */}
      <div 
        className={cn(
          "relative rounded-full transition-all duration-300 z-10 flex items-center justify-center shadow-sm overflow-hidden group",
          selected ? "ring-4 ring-primary/30 scale-105" : "hover:scale-105",
          data.highlight && "shadow-[0_0_20px_rgba(var(--primary),0.2)]"
        )}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          border: `3px solid ${color}`,
        }}
      >
        {data.image ? (
          <img 
            src={data.image} 
            alt={data.label} 
            className="w-full h-full object-cover"
          />
        ) : (
          /* Inner Text (Initials) */
          <span 
            className="text-[16px] font-bold leading-tight"
            style={{ color: color }}
          >
             {data.label.substring(0, 2).toUpperCase()}
          </span>
        )}
        
        {/* Type Icon Overlay */}
        {data.type && (
            <div 
                className="absolute bottom-0 right-0 p-1 rounded-tl-lg bg-background/80 backdrop-blur-sm border-t border-l border-border/50"
                style={{ color: color }}
            >
                <TypeIcon type={data.type} className="w-3 h-3" />
            </div>
        )}
      </div>

      {/* Floating Label (Strictly Outside) */}
      <div className="absolute top-full mt-2 flex flex-col items-center pointer-events-none w-[300%] z-20">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm bg-background/90 backdrop-blur-sm border border-border/50",
          "max-w-[120px] truncate block text-center", 
          selected ? "text-primary border-primary/30" : "text-foreground/80"
        )}
        title={data.label} 
        >
          {data.label}
        </span>
        {data.subLabel && (
          <span className="text-[9px] text-muted-foreground font-medium mt-0.5 bg-secondary/50 px-1.5 rounded-sm">
            {data.subLabel}
          </span>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, width: 1, height: 1, background: 'transparent' }} 
      />
    </div>
  );
}
