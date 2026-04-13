/**
 * 已購 / 已上過課程假資料（集中管理）
 *
 * ── 技能維度設計說明 ──────────────────────────────────────────
 * 維度對齊平台課程大廳的「探索領域」分類，分成：
 *   工程技術 (Engineering)：前端開發、後端開發、資料科學
 *   設計創意 (Design)：UI/UX 設計、平面設計、產品策略
 * ──────────────────────────────────────────────────────────────
 */

/* ── 技能維度分組定義（對齊課程大廳側欄分類） ── */
export const skillGroups = [
  {
    label: "工程技術",
    sublabel: "Engineering",
    color: "#3672B5",
    icon: "fa-solid fa-code",
    dimensions: [
      { key: "frontendDev", label: "前端開發" },
      { key: "backendDev", label: "後端開發" },
      { key: "dataScience", label: "資料科學" },
    ],
  },
  {
    label: "設計創意",
    sublabel: "Design",
    color: "#8B5CF6",
    icon: "fa-solid fa-palette",
    dimensions: [
      { key: "uiuxDesign", label: "UI/UX 設計" },
      { key: "graphicDesign", label: "平面設計" },
      { key: "productStrategy", label: "產品策略" },
    ],
  },
];

/* ── 方便查表的 flat label map ── */
export const skillLabels = Object.fromEntries(
  skillGroups.flatMap((g) => g.dimensions.map((d) => [d.key, d.label])),
);

/* ── 已購課程（ID 對齊 SearchCourses.vue 課程編號） ── */
export const purchasedCourses = [
  /* ─── 前端開發 ─── */
  {
    id: 1,
    title: "HTML/CSS 與網頁切版",
    instructor: "林曉涵",
    category: "前端開發",
    level: "基礎",
    status: "completed",
    progress: 100,
    totalHours: 6,
    totalChapters: 18,
    completedChapters: 18,
    thumb:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 20,
      backendDev: 0,
      uiuxDesign: 5,
      graphicDesign: 0,
      dataScience: 0,
      productStrategy: 0,
    },
  },
  {
    id: 2,
    title: "JavaScript 核心語法與非同步",
    instructor: "陳建宏",
    category: "前端開發",
    level: "基礎",
    status: "completed",
    progress: 100,
    totalHours: 8,
    totalChapters: 24,
    completedChapters: 24,
    thumb:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 25,
      backendDev: 5,
      uiuxDesign: 0,
      graphicDesign: 0,
      dataScience: 0,
      productStrategy: 0,
    },
  },
  {
    id: 4,
    title: "CSS 進階：動畫、變數與架構設計",
    instructor: "張美怡",
    category: "前端開發",
    level: "進階",
    status: "completed",
    progress: 100,
    totalHours: 5,
    totalChapters: 15,
    completedChapters: 15,
    thumb:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 15,
      backendDev: 0,
      uiuxDesign: 5,
      graphicDesign: 10,
      dataScience: 0,
      productStrategy: 0,
    },
  },
  {
    id: 5,
    title: "React 狀態管理與系統架構",
    instructor: "陳建宏",
    category: "前端開發",
    level: "進階",
    status: "in-progress",
    progress: 45,
    totalHours: 10,
    totalChapters: 28,
    completedChapters: 12,
    thumb:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 20,
      backendDev: 5,
      uiuxDesign: 0,
      graphicDesign: 0,
      dataScience: 0,
      productStrategy: 5,
    },
  },
  {
    id: 7,
    title: "TypeScript 全面入門與實戰",
    instructor: "王俊傑",
    category: "前端開發",
    level: "進階",
    status: "not-started",
    progress: 0,
    totalHours: 6,
    totalChapters: 18,
    completedChapters: 0,
    thumb:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 15,
      backendDev: 10,
      uiuxDesign: 0,
      graphicDesign: 0,
      dataScience: 0,
      productStrategy: 0,
    },
  },
  /* ─── UI/UX 設計 ─── */
  {
    id: 11,
    title: "UI/UX 設計基礎概論",
    instructor: "林曉涵",
    category: "UI/UX 設計",
    level: "基礎",
    status: "in-progress",
    progress: 20,
    totalHours: 6,
    totalChapters: 16,
    completedChapters: 3,
    thumb:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 0,
      backendDev: 0,
      uiuxDesign: 25,
      graphicDesign: 5,
      dataScience: 0,
      productStrategy: 5,
    },
  },
  {
    id: 12,
    title: "Figma 介面設計入門",
    instructor: "張美怡",
    category: "UI/UX 設計",
    level: "基礎",
    status: "in-progress",
    progress: 60,
    totalHours: 5,
    totalChapters: 14,
    completedChapters: 8,
    thumb:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 0,
      backendDev: 0,
      uiuxDesign: 20,
      graphicDesign: 10,
      dataScience: 0,
      productStrategy: 0,
    },
  },
  {
    id: 14,
    title: "互動原型與 Usability Testing",
    instructor: "周雅琪",
    category: "UI/UX 設計",
    level: "進階",
    status: "completed",
    progress: 100,
    totalHours: 7,
    totalChapters: 18,
    completedChapters: 18,
    thumb:
      "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 0,
      backendDev: 0,
      uiuxDesign: 20,
      graphicDesign: 5,
      dataScience: 0,
      productStrategy: 10,
    },
  },
  /* ─── 後端開發 ─── */
  {
    id: 43,
    title: "Node.js 基礎與伺服器概念",
    instructor: "李柏翰",
    category: "後端開發",
    level: "基礎",
    status: "in-progress",
    progress: 35,
    totalHours: 6,
    totalChapters: 16,
    completedChapters: 5,
    thumb:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 5,
      backendDev: 25,
      uiuxDesign: 0,
      graphicDesign: 0,
      dataScience: 5,
      productStrategy: 0,
    },
  },
  /* ─── 產品策略 ─── */
  {
    id: 15,
    title: "設計系統建構與管理",
    instructor: "周雅琪",
    category: "UI/UX 設計",
    level: "進階",
    status: "in-progress",
    progress: 15,
    totalHours: 6,
    totalChapters: 16,
    completedChapters: 2,
    thumb:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=225&fit=crop",
    skillsImpact: {
      frontendDev: 0,
      backendDev: 0,
      uiuxDesign: 15,
      graphicDesign: 10,
      dataScience: 0,
      productStrategy: 15,
    },
  },
];

/* ── 路徑技能細項定義（每條路徑獨立的子技能維度） ── */
export const pathSkills = {
  frontendDev: {
    label: '前端開發',
    color: '#3672B5',
    icon: 'fa-solid fa-code',
    dimensions: [
      { key: 'htmlCss', label: 'HTML / CSS 切版' },
      { key: 'javascript', label: 'JavaScript 語法與邏輯' },
      { key: 'cssAdvanced', label: 'CSS 動畫與進階設計' },
      { key: 'framework', label: '前端框架 (React / Vue)' },
      { key: 'responsive', label: '響應式設計與 Tailwind' },
      { key: 'tooling', label: 'TypeScript 與工程工具' },
    ],
  },
  backendDev: {
    label: '後端開發',
    color: '#3672B5',
    icon: 'fa-solid fa-server',
    dimensions: [
      { key: 'nodeBasic', label: 'Node.js 伺服器基礎' },
      { key: 'apiDesign', label: 'RESTful API 設計' },
      { key: 'database', label: '資料庫操作' },
      { key: 'auth', label: '認證與授權機制' },
      { key: 'cloud', label: '雲端服務與部署' },
    ],
  },
  dataScience: {
    label: '資料科學',
    color: '#3672B5',
    icon: 'fa-solid fa-chart-line',
    dimensions: [
      { key: 'python', label: 'Python 程式設計' },
      { key: 'statistics', label: '統計學與機率' },
      { key: 'dataViz', label: '資料視覺化' },
      { key: 'machineLearning', label: '機器學習' },
      { key: 'nlp', label: '自然語言處理' },
    ],
  },
  uiuxDesign: {
    label: 'UI/UX 設計',
    color: '#8B5CF6',
    icon: 'fa-solid fa-pen-nib',
    dimensions: [
      { key: 'figma', label: 'Figma 工具操作' },
      { key: 'uxResearch', label: '使用者研究與訪談' },
      { key: 'wireframe', label: '線框圖與資訊架構' },
      { key: 'prototype', label: '互動原型設計' },
      { key: 'visualDesign', label: '視覺設計與色彩' },
      { key: 'designSystem', label: '設計系統建構' },
    ],
  },
  graphicDesign: {
    label: '平面設計',
    color: '#8B5CF6',
    icon: 'fa-solid fa-palette',
    dimensions: [
      { key: 'typography', label: '排版與字體設計' },
      { key: 'colorTheory', label: '色彩理論與應用' },
      { key: 'illustration', label: '插畫與圖像處理' },
      { key: 'branding', label: '品牌識別設計' },
      { key: 'socialMedia', label: '社群視覺設計' },
    ],
  },
  productStrategy: {
    label: '產品策略',
    color: '#8B5CF6',
    icon: 'fa-solid fa-bullseye',
    dimensions: [
      { key: 'pmBasic', label: '產品管理基礎' },
      { key: 'marketResearch', label: '市場研究與競品分析' },
      { key: 'dataDecision', label: '數據驅動決策' },
      { key: 'agile', label: '敏捷開發流程' },
      { key: 'growthHack', label: '成長策略與實驗' },
    ],
  },
};

/* ── 路徑技能目標分數 ── */
export const pathTargets = {
  frontendDev: { htmlCss: 90, javascript: 85, cssAdvanced: 75, framework: 80, responsive: 70, tooling: 65 },
  backendDev: { nodeBasic: 80, apiDesign: 75, database: 70, auth: 65, cloud: 60 },
  dataScience: { python: 80, statistics: 75, dataViz: 70, machineLearning: 65, nlp: 55 },
  uiuxDesign: { figma: 85, uxResearch: 70, wireframe: 75, prototype: 80, visualDesign: 70, designSystem: 65 },
  graphicDesign: { typography: 70, colorTheory: 65, illustration: 60, branding: 55, socialMedia: 60 },
  productStrategy: { pmBasic: 70, marketResearch: 65, dataDecision: 60, agile: 55, growthHack: 50 },
};

/* ── 每門課在各路徑細項的貢獻分數（依課程 ID 索引） ── */
export const coursePathImpact = {
  1: {
    frontendDev: { htmlCss: 40, cssAdvanced: 5, responsive: 15 },
  },
  2: {
    frontendDev: { javascript: 45, framework: 5, tooling: 5 },
    backendDev: { nodeBasic: 10 },
  },
  4: {
    frontendDev: { htmlCss: 10, cssAdvanced: 35, responsive: 10 },
    uiuxDesign: { visualDesign: 10 },
    graphicDesign: { typography: 5, colorTheory: 5 },
  },
  5: {
    frontendDev: { javascript: 10, framework: 40, responsive: 5, tooling: 10 },
    backendDev: { apiDesign: 5 },
    productStrategy: { agile: 5 },
  },
  7: {
    frontendDev: { javascript: 10, framework: 5, tooling: 30 },
    backendDev: { nodeBasic: 5, apiDesign: 5 },
  },
  11: {
    uiuxDesign: { figma: 10, uxResearch: 20, wireframe: 15, prototype: 5, visualDesign: 10, designSystem: 5 },
    graphicDesign: { colorTheory: 5 },
    productStrategy: { pmBasic: 5 },
  },
  12: {
    uiuxDesign: { figma: 35, wireframe: 5, prototype: 10, visualDesign: 5, designSystem: 5 },
    graphicDesign: { illustration: 5, branding: 5 },
  },
  14: {
    uiuxDesign: { figma: 10, uxResearch: 5, wireframe: 5, prototype: 35, designSystem: 5 },
    productStrategy: { pmBasic: 5, dataDecision: 5 },
  },
  43: {
    backendDev: { nodeBasic: 35, apiDesign: 10, database: 10, cloud: 5 },
    frontendDev: { javascript: 5 },
    dataScience: { python: 5 },
  },
  15: {
    uiuxDesign: { figma: 5, visualDesign: 5, designSystem: 35 },
    graphicDesign: { branding: 10, typography: 5 },
    productStrategy: { pmBasic: 5, agile: 10 },
  },
};
