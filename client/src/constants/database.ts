// Centralized database table names and column definitions

export const DATABASE_TABLES = {
  CRIME_INCIDENTS: 'crime_incidents_2024',
  SUSPECT_PROFILES: 'suspect_profiles',
  LOCATION_HOTSPOTS: 'location_hotspots',
  SUPPLY_CHAIN_NODES: 'supply_chain_nodes',
} as const;

export type DatabaseTableKey = keyof typeof DATABASE_TABLES;
export type DatabaseTableValue = typeof DATABASE_TABLES[DatabaseTableKey];

export const TABLE_OPTIONS = [
  { value: DATABASE_TABLES.CRIME_INCIDENTS, label: 'crime_incidents_2024' },
  { value: DATABASE_TABLES.SUSPECT_PROFILES, label: 'suspect_profiles' },
  { value: DATABASE_TABLES.LOCATION_HOTSPOTS, label: 'location_hotspots' },
  { value: DATABASE_TABLES.SUPPLY_CHAIN_NODES, label: 'supply_chain_nodes' },
] as const;

export const TABLE_COLUMNS = {
  [DATABASE_TABLES.CRIME_INCIDENTS]: [
    { value: 'id', label: 'id (integer)' },
    { value: 'type', label: 'type (varchar)' },
    { value: 'severity', label: 'severity (integer)' },
    { value: 'suspect_id', label: 'suspect_id (integer)' },
    { value: 'location', label: 'location (varchar)' },
    { value: 'timestamp', label: 'timestamp (datetime)' },
    { value: 'status', label: 'status (varchar)' },
  ],
  [DATABASE_TABLES.SUSPECT_PROFILES]: [
    { value: 'id', label: 'id (integer)' },
    { value: 'name', label: 'name (varchar)' },
    { value: 'age', label: 'age (integer)' },
    { value: 'address', label: 'address (varchar)' },
    { value: 'status', label: 'status (varchar)' },
  ],
  [DATABASE_TABLES.LOCATION_HOTSPOTS]: [
    { value: 'id', label: 'id (integer)' },
    { value: 'name', label: 'name (varchar)' },
    { value: 'lat', label: 'lat (decimal)' },
    { value: 'lng', label: 'lng (decimal)' },
    { value: 'risk_level', label: 'risk_level (integer)' },
  ],
  [DATABASE_TABLES.SUPPLY_CHAIN_NODES]: [
    { value: 'id', label: 'id (integer)' },
    { value: 'name', label: 'name (varchar)' },
    { value: 'type', label: 'type (varchar)' },
    { value: 'country', label: 'country (varchar)' },
    { value: 'risk_score', label: 'risk_score (decimal)' },
  ],
} as const;

export const COLUMN_OPTIONS = [
  { value: 'id', label: 'id' },
  { value: 'suspect_id', label: 'suspect_id' },
  { value: 'type', label: 'type' },
  { value: 'name', label: 'name' },
  { value: 'severity', label: 'severity' },
  { value: 'age', label: 'age' },
  { value: 'status', label: 'status' },
] as const;

export const FIELD_OPTIONS = [
  { value: 'type', label: 'type' },
  { value: 'name', label: 'name' },
  { value: 'id', label: 'id' },
  { value: 'severity', label: 'severity' },
  { value: 'age', label: 'age' },
  { value: 'status', label: 'status' },
] as const;

export const SIZE_METRIC_OPTIONS = [
  { value: 'severity', label: 'severity' },
  { value: 'age', label: 'age' },
  { value: 'none', label: 'None (Fixed)' },
] as const;

export const COLOR_METRIC_OPTIONS = [
  { value: 'severity', label: 'severity' },
  { value: 'status', label: 'status' },
  { value: 'age', label: 'age' },
] as const;
