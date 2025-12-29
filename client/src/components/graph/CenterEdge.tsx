import { BaseEdge, EdgeProps, getStraightPath, useInternalNode } from '@xyflow/react';

export default function CenterEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  target,
}: EdgeProps) {
  // Get the target node to determine its radius
  const targetNode = useInternalNode(target);

  // Default radius if node not found (fallback)
  let radius = 35;

  if (targetNode && targetNode.measured?.width) {
    radius = targetNode.measured.width / 2;
  } else if (targetNode && targetNode.style?.width) {
    // Fallback if measured dimensions aren't ready but style width is explicit (number)
    const w = targetNode.style.width;
    if (typeof w === 'number') {
      radius = w / 2;
    }
  }

  // Calculate the angle of the edge
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);

  // Calculate the new target position at the edge of the node (plus a tiny gap for visual clearance)
  // We add ~3px gap so the arrow doesn't touch the circle exactly
  const gap = 3;
  const offsetX = (radius + gap) * Math.cos(angle);
  const offsetY = (radius + gap) * Math.sin(angle);

  const newTargetX = targetX - offsetX;
  const newTargetY = targetY - offsetY;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX: newTargetX,
    targetY: newTargetY,
  });

  return (
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
  );
}
