import { Monitor, Share2, ShieldAlert, Box, Activity } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  type: "crime" | "supply-chain" | "social";
  nodes: number;
  edges: number;
  lastModified: string;
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "City Crime Analysis 2024",
    description: "Relationship network between crime types, locations, and time of day.",
    type: "crime",
    nodes: 142,
    edges: 856,
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    title: "Global Supply Chain Alpha",
    description: "Tier 1 and Tier 2 supplier dependencies and risk nodes.",
    type: "supply-chain",
    nodes: 3200,
    edges: 12400,
    lastModified: "1 day ago",
  },
];

export const MOCK_FIELDS = {
  crime: [
    { id: "f1", name: "Crime Type", type: "category", icon: ShieldAlert },
    { id: "f2", name: "Location (Lat/Long)", type: "geo", icon: Monitor },
    { id: "f3", name: "Suspect ID", type: "id", icon: Box },
    { id: "f4", name: "Time of Day", type: "time", icon: Activity },
    { id: "f5", name: "Severity Score", type: "number", icon: Activity },
  ],
  supply: [
    { id: "s1", name: "Supplier Name", type: "category", icon: Box },
    { id: "s2", name: "Part ID", type: "id", icon: Box },
    { id: "s3", name: "Origin Country", type: "geo", icon: Monitor },
    { id: "s4", name: "Risk Level", type: "number", icon: ShieldAlert },
    { id: "s5", name: "Lead Time", type: "number", icon: Activity },
  ]
};
