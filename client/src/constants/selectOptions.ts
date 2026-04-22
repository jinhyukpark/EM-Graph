// Centralized select options for various dropdowns

export const JOIN_TYPE_OPTIONS = [
  { value: 'inner', label: 'Inner Join' },
  { value: 'left', label: 'Left Join' },
  { value: 'right', label: 'Right Join' },
  { value: 'full', label: 'Full Outer Join' },
] as const;

export const OPERATOR_OPTIONS = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: 'LIKE', label: 'LIKE' },
  { value: 'IN', label: 'IN' },
  { value: 'IS NULL', label: 'IS NULL' },
  { value: 'IS NOT NULL', label: 'IS NOT NULL' },
] as const;

export const AGGREGATION_OPTIONS = [
  { value: 'COUNT', label: 'COUNT' },
  { value: 'SUM', label: 'SUM' },
  { value: 'AVG', label: 'AVG' },
  { value: 'MIN', label: 'MIN' },
  { value: 'MAX', label: 'MAX' },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: 'ASC', label: 'Ascending' },
  { value: 'DESC', label: 'Descending' },
] as const;

export const DATA_TYPE_OPTIONS = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
] as const;

export const LOGIC_OPERATOR_OPTIONS = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
] as const;

export const MCP_SERVER_TYPES = [
  { value: 'database', label: 'Database' },
  { value: 'api', label: 'API' },
  { value: 'file', label: 'File System' },
  { value: 'custom', label: 'Custom' },
] as const;

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
] as const;
