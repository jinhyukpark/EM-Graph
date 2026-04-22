import { Monitor, Share2, ShieldAlert, Box, Activity, Table as TableIcon, FileCode, Network, Workflow } from "lucide-react";

// ==================== Project Types ====================
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

// ==================== Database Sidebar Items ====================
export interface SidebarItem {
  id: string;
  name: string;
  icon: typeof TableIcon;
  type: 'table' | 'query' | 'graph' | 'preprocessing';
}

export interface SidebarSubcategory {
  name: string;
  items: SidebarItem[];
}

export interface SidebarCategory {
  category: string;
  items?: SidebarItem[];
  subcategories?: SidebarSubcategory[];
  isTool?: boolean;
}

export const SIDEBAR_ITEMS: SidebarCategory[] = [
  {
    category: "Table",
    subcategories: [
      {
        name: "Original",
        items: [
          { id: "t1", name: "crime_incidents_2024", icon: TableIcon, type: "table" },
          { id: "t2", name: "suspect_profiles", icon: TableIcon, type: "table" },
        ]
      },
      {
        name: "Custom",
        items: [
          { id: "t3", name: "location_hotspots", icon: TableIcon, type: "table" },
          { id: "t4", name: "supply_chain_nodes", icon: TableIcon, type: "table" },
        ]
      }
    ]
  },
  {
    category: "Query",
    items: [
      { id: "q1", name: "High Severity Crimes", icon: FileCode, type: "query" },
      { id: "q2", name: "District Analysis", icon: FileCode, type: "query" },
    ]
  },
  {
    category: "Graph",
    items: [
      { id: "g1", name: "Crime Network 2024", icon: Network, type: "graph" },
      { id: "g2", name: "Supply Chain Risk", icon: Network, type: "graph" },
    ]
  },
  {
    category: "PREPROCESSING",
    isTool: true,
    items: [
      { id: "p1", name: "Pre-Process", icon: Workflow, type: "preprocessing" },
    ]
  }
];

// ==================== Company Names ====================
export const COMPANY_NAMES = [
  "illunex", "samsung", "lg_electronics", "sk_hynix", "naver", "kakao", "hyundai", "kia", "posco", "coupang",
  "woowa_brothers", "krafton", "nc_soft", "netmarble", "smilegate", "nexon", "pearl_abyss", "com2us", "devsisters", "shift_up",
  "toss", "viva_republica", "dunamu", "upbit", "bithumb", "coinone", "korbit", "gopax", "hana_bank", "shinhan_bank",
  "kb_bank", "woori_bank", "nh_bank", "ibk", "kakao_bank", "k_bank", "samsung_sds", "lg_cns", "sk_c_c", "lotte_data",
  "hanwha_systems", "doosan_digital", "posco_ict", "cj_olivenetworks", "shinsegae_isc", "gs_retail", "lotte_shopping", "emart", "homeplus", "costco_korea",
  "starbucks_korea", "mcdonald_korea", "burger_king_kr", "subway_korea", "dominos_korea", "pizza_hut_kr", "bbq_chicken", "kyochon", "bhc_chicken", "nene_chicken",
  "cj_enm", "jtbc", "mbc", "kbs", "sbs", "tvn", "yg_entertainment", "sm_entertainment", "jyp_entertainment", "hybe",
  "big_hit", "kakao_m", "melon", "genie_music", "flo_music", "bugs_music", "vibe_music", "naver_webtoon", "kakao_webtoon", "lezhin_comics",
  "tving", "wavve", "watcha", "seezn", "coupang_play", "netflix_korea", "disney_plus_kr", "amazon_korea", "eleven_street", "wemakeprice",
  "tmon", "interpark", "yes24", "kyobo_book", "aladin_book", "millie_library", "ridi_books", "kakao_page", "naver_series", "munpia",
  "carrot_market", "bungae_jangter", "joongna_market", "hello_market", "samsung_card", "hyundai_card", "kb_card", "shinhan_card", "lotte_card", "bc_card",
  "hana_card", "woori_card", "nh_card", "kakao_pay", "naver_pay", "toss_pay", "payco", "samsung_pay", "lg_pay", "zee_pay",
  "skplanet", "kt_corporation", "lg_uplus", "sk_telecom", "sk_broadband", "kt_skylife", "lg_hellovision", "cable_tv", "iptv_korea", "olleh_tv",
  "u_plus_tv", "btv", "seezn_cable", "kt_cloud", "naver_cloud", "kakao_i_cloud", "samsung_cloud", "lg_cloud", "aws_korea", "azure_korea",
  "google_cloud_kr", "oracle_korea", "ibm_korea", "sap_korea", "salesforce_kr", "slack_korea", "zoom_korea", "ms_teams_kr", "webex_korea", "notion_korea"
] as const;

// ==================== Table Data Generation ====================
export interface TableDataRow {
  idx: number;
  company_name: string;
  age: number;
  member: number;
  regdate: string;
}

export function generateMockTableData(count = 150): TableDataRow[] {
  const data: TableDataRow[] = [];
  for (let i = 1; i <= count; i++) {
    const company = COMPANY_NAMES[(i - 1) % COMPANY_NAMES.length];
    const age = ((i * 7) % 60) + 1;
    const member = ((i * 317) % 50000) + 10;
    const month = (i % 12);
    const day = (i % 28) + 1;
    const hour = (i % 24);
    const minute = ((i * 3) % 60);
    const second = ((i * 7) % 60);
    const date = new Date(2025, month, day, hour, minute, second);
    const regdate = date.toISOString().replace('T', ' ').substring(0, 19);
    data.push({ idx: i, company_name: company, age, member, regdate });
  }
  return data;
}

export const MOCK_TABLE_DATA = generateMockTableData();

// ==================== Crime Data ====================
export const CRIME_TYPES = ["Theft", "Assault", "Vandalism", "Burglary", "Fraud", "Robbery", "Arson", "Trespassing", "Harassment", "Shoplifting"] as const;
export const LOCATIONS = ["Downtown", "Sector 4", "North Park", "West End", "Mall District", "Central Station", "Harbor Area", "Industrial Zone", "Residential Block A", "Commercial District", "University Area", "Airport Terminal", "Train Station", "Sports Complex", "City Hall"] as const;
export const STATUSES = ["Open", "Investigating", "Closed", "Pending", "Resolved"] as const;

export interface QueryDataRow {
  id: number;
  type: string;
  location: string;
  time: string;
  severity: number;
  status: string;
}

export function generateMockQueryData(count = 100): QueryDataRow[] {
  const data: QueryDataRow[] = [];
  for (let i = 1; i <= count; i++) {
    const type = CRIME_TYPES[(i - 1) % CRIME_TYPES.length];
    const location = LOCATIONS[(i * 3) % LOCATIONS.length];
    const status = STATUSES[(i * 2) % STATUSES.length];
    const severity = ((i * 7) % 10) + 1;
    const month = ((i - 1) % 12) + 1;
    const day = ((i * 2) % 28) + 1;
    const hour = (i % 24);
    const minute = ((i * 5) % 60);
    const time = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    data.push({ id: i, type, location, time, severity, status });
  }
  return data;
}

export const MOCK_QUERY_DATA = generateMockQueryData();

// ==================== Preview Data (for DataPreprocessingBuilder) ====================
export interface CrimeIncidentRow {
  id: number;
  type: string;
  location: string;
  time: string;
  severity: number;
}

export interface SuspectProfileRow {
  id: number;
  name: string;
  age: number;
  history: string;
}

export interface DefaultPreviewRow {
  col1: string;
  col2: string;
  col3: string;
}

export const PREVIEW_DATA: Record<string, CrimeIncidentRow[] | SuspectProfileRow[] | DefaultPreviewRow[]> = {
  'crime_incidents_2024': Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    type: ["Theft", "Assault", "Vandalism", "Burglary"][i % 4],
    location: ["Downtown", "Sector 4", "North Park", "West End"][i % 4],
    time: `2024-03-${10 + (i % 20)}`,
    severity: (i % 10) + 1
  })),
  'suspect_profiles': Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Suspect ${i + 1}`,
    age: 20 + (i % 30),
    history: ["Major Theft", "Minor Theft", "Assault", "None"][i % 4]
  })),
  'default': Array.from({ length: 50 }, (_, i) => ({
    col1: `Value ${i * 3 + 1}`,
    col2: `Value ${i * 3 + 2}`,
    col3: `Value ${i * 3 + 3}`
  }))
};

// ==================== Tab Types ====================
export interface TabData {
  id: string;
  type: 'table' | 'query' | 'graph' | 'preprocessing' | 'pipeline-result';
  title: string;
  data?: unknown[];
}

// ==================== Query Block Types ====================
export interface QueryBlock {
  id: string;
  sql: string;
  title?: string;
  description?: string;
  type?: 'template' | 'custom';
}

export const DEFAULT_QUERY_BLOCKS: QueryBlock[] = [
  {
    id: '1',
    sql: "crime_incidents_2024 테이블에서 severity가 5보다 큰 데이터를 조회해줘",
    title: "자연어 쿼리 예시",
    type: 'custom'
  }
];
