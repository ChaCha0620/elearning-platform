/**
 * Temporary script to replace all 78 course placeholder images with Unsplash photos.
 * Run: node replace-images.cjs
 * Then delete this file.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "src", "pages", "SearchCourses.vue");
let content = fs.readFileSync(file, "utf8");

const U = (id) =>
  `https://images.unsplash.com/${id}?w=640&h=320&fit=crop&auto=format&q=80`;

const imageMap = {
  // ═══════════ 前端開發 (Frontend) ═══════════
  // ── 基礎 ──
  1: U("photo-1621839673705-6617adf9e890"), // HTML/CSS → 螢幕上的 HTML 程式碼
  2: U("photo-1627398242454-45a1465c2479"), // JavaScript → JS 語法高亮
  3: U("photo-1633356122544-f134324a6cee"), // React 基礎 → React 標誌藍色
  20: U("photo-1614064641938-3bbee52942c7"), // Vue 基礎 → 綠色開發環境
  21: U("photo-1507721999472-8ed4421c4af2"), // Tailwind CSS → 乾淨的程式碼筆電
  22: U("photo-1512941937669-90a1b58e7e9c"), // Bootstrap 響應式 → 手機與筆電
  // ── 進階 ──
  4: U("photo-1593720213428-28a5b9e94613"), // CSS 進階動畫 → CSS 程式碼
  5: U("photo-1555066931-4365d14bab8c"), // React 狀態管理 → 深色編輯器
  6: U("photo-1460925895917-afdab827c52f"), // 效能優化 → 儀表板速度指標
  7: U("photo-1618477388954-7852f32655ec"), // TypeScript → 藍色型別碼
  23: U("photo-1542831371-29b0f74f9713"), // Vue 進階 → 彩色程式碼
  24: U("photo-1537432376769-00f5c2f4c8d2"), // Next.js → 深色矩陣碼
  // ── 實戰 ──
  8: U("photo-1563013544-824ae1b704d3"), // 電商平台 → 手機購物介面
  9: U("photo-1611606063065-ee7946f0787a"), // 聊天 App → 訊息對話氣泡
  10: U("photo-1611224923853-80b023f02d71"), // Kanban → 專案管理看板
  25: U("photo-1517694712202-14dd9538aa97"), // Nuxt 3 → 筆電程式碼畫面
  26: U("photo-1611162617213-7d7a39e9b1d7"), // Instagram Clone → 社群媒體相片牆
  27: U("photo-1501504905252-473c47e087f8"), // E-Learning → 書桌學習情境
  28: U("photo-1499750310107-5fef28a66643"), // Blog CMS → 筆電寫作情境
  29: U("photo-1414235077428-338989a2e8c0"), // 餐廳訂位 → 精緻餐點擺盤
  30: U("photo-1488998427799-e3362cec87c3"), // 個人品牌作品集 → 創意工作桌面

  // ═══════════ UI/UX 設計 ═══════════
  // ── 基礎 ──
  11: U("photo-1586717791821-3f44a563fa4c"), // UX 設計概論 → 線框圖筆記
  12: U("photo-1558655146-9f40138edfeb"), // Figma 入門 → 設計工具色票
  13: U("photo-1561070791-2526d30994b5"), // 色彩學 → 漸層色彩藝術
  31: U("photo-1455390582262-044cdead277a"), // UX 寫作 → 打字機/寫作
  32: U("photo-1559028012-481c04fa702d"), // 使用者研究 → 便利貼研究牆
  33: U("photo-1581291518633-83b4eef1d2fa"), // Wireframe → UI 設計原型
  // ── 進階 ──
  14: U("photo-1581287053822-fd7bf4f4bfec"), // Usability Testing → 裝置測試
  15: U("photo-1507238691740-187a5b1d37b8"), // Design System → 網頁設計畫面
  16: U("photo-1613909207039-6b173b755cc1"), // Figma 進階 → 原型設計工具
  34: U("photo-1550745165-9bc0b252726f"), // 動態設計 → 復古科技美學
  35: U("photo-1573164713714-d95e436ab8d6"), // 無障礙設計 → 包容性介面
  36: U("photo-1531403009284-440f080d1e12"), // Design Thinking → 白板 UX 流程
  37: U("photo-1523240795612-9a054b0db644"), // 跨平台設計 → 多裝置協作
  // ── 實戰 ──
  17: U("photo-1611532736597-de2d4265fba3"), // App Redesign → 行動 App 介面
  18: U("photo-1576153192396-180ecef2a715"), // SaaS Dashboard → 數據儀表板 UI
  19: U("photo-1467232004584-a241de8bcf5d"), // Landing Page → 網站展示畫面
  38: U("photo-1556742049-0cfed4f6a45d"), // 電商 App → 購物袋/消費
  39: U("photo-1517245386747-e4c8c24dc199"), // Design Sprint → 敏捷衝刺規劃
  40: U("photo-1576091160550-2173dba999ef"), // 醫療 App → 健康醫療意象
  41: U("photo-1586281380349-632531db7ed4"), // 設計作品集 → 作品展示
  42: U("photo-1677442136019-21780ecad995"), // AI UX → AI 科技概念

  // ═══════════ 後端開發 (Backend) ═══════════
  // ── 基礎 ──
  43: U("photo-1558494949-ef010cbdcc31"), // Node.js → 伺服器機房
  44: U("photo-1544383835-bda2bc66a55d"), // SQL → 資料庫結構
  45: U("photo-1504639725590-34d0984388bd"), // REST API → 程式碼編輯器特寫
  // ── 進階 ──
  46: U("photo-1555949963-ff9fe0c870eb"), // JWT/OAuth → 資安鎖概念
  47: U("photo-1605745341112-85968b19335b"), // Docker → 容器化視覺化
  48: U("photo-1544197150-b99a580bb7a8"), // MongoDB → NoSQL 資料概念
  // ── 實戰 ──
  49: U("photo-1504711331039-71e7b59e2f4a"), // 電商 API → 後端開發
  50: U("photo-1551434678-e076c223a692"), // WebSocket → 即時團隊協作
  51: U("photo-1451187580459-43490279c0fa"), // 微服務 → 全球網路架構

  // ═══════════ 資料科學 (Data Science) ═══════════
  // ── 基礎 ──
  52: U("photo-1526379095098-d400fd0bf935"), // Python → Python 程式碼
  53: U("photo-1551288049-bebda4e38f71"), // 統計/視覺化 → 數據儀表板
  54: U("photo-1509228468518-180dd4864904"), // Pandas → 資料處理視覺化
  // ── 進階 ──
  55: U("photo-1555949963-aa79dcee981c"), // 機器學習 → ML 概念
  56: U("photo-1620712943543-bcc4688e7485"), // 深度學習 → AI 大腦
  57: U("photo-1543286386-713bdd548da4"), // SQL 進階 → 分析報表
  // ── 實戰 ──
  58: U("photo-1526628953301-3e589a6a8b74"), // 用戶行為分析 → 分析圖表
  59: U("photo-1655720828018-edd71de1fdd7"), // NLP → 文字語言處理
  60: U("photo-1504868584819-f8e8b4b6d7e3"), // 資料儀表板 → 數據視覺化

  // ═══════════ 平面設計 (Graphic Design) ═══════════
  // ── 基礎 ──
  61: U("photo-1626785774573-4b799315345d"), // 排版原理 → 設計排版
  62: U("photo-1572044162444-ad60f128bdea"), // Illustrator → 向量插畫
  63: U("photo-1541462608143-67571c6738dd"), // Photoshop → 創意影像編輯
  // ── 進階 ──
  64: U("photo-1618004912476-29818d81ae2e"), // Typography → 字體設計藝術
  65: U("photo-1609921212029-bb5a28e60960"), // Brand Identity → 品牌識別設計
  66: U("photo-1544716278-ca5e3f4abd8c"), // InDesign → 書籍印刷排版
  // ── 實戰 ──
  67: U("photo-1558655146-d09347e92766"), // 品牌視覺 → 全套品牌設計
  68: U("photo-1563986768609-322da13575f2"), // 社群素材 → 社群行銷
  69: U("photo-1432888498266-38ffec3eaf0a"), // 書籍封面 → 書本/閱讀

  // ═══════════ 產品策略 (Product Strategy) ═══════════
  // ── 基礎 ──
  70: U("photo-1553877522-43269d4ea984"), // PM 入門 → 團隊產品會議
  71: U("photo-1454165804606-c3d57bc86b40"), // 市場研究 → 商業數據分析
  72: U("photo-1552664730-d307ca884978"), // User Story → 白板 brainstorming
  // ── 進階 ──
  73: U("photo-1460925895917-afdab827c52f"), // 數據驅動 → 分析儀表板
  74: U("photo-1533750349088-cd871a92f312"), // Growth Hacking → 成長趨勢
  75: U("photo-1531498860502-7c67cf02f657"), // Agile Scrum → 敏捷看板
  // ── 實戰 ──
  76: U("photo-1559136555-9303baea8ebd"), // MVP → 新創工作空間
  77: U("photo-1497032628192-86f99bee8b22"), // SaaS 策略 → 策略規劃桌面
  78: U("photo-1542626991-cbc4e32524cc"), // 產品路線圖 → 團隊協作規劃
};

let replaced = 0;
let missed = [];

for (const [id, url] of Object.entries(imageMap)) {
  // Match: id: N, ... (non-greedy, within same object) ... image: '...'
  const regex = new RegExp(`(id: ${id},\\r?\\n[\\s\\S]*?)image: '[^']*'`);
  if (regex.test(content)) {
    content = content.replace(regex, `$1image: '${url}'`);
    replaced++;
  } else {
    missed.push(id);
  }
}

fs.writeFileSync(file, content, "utf8");
console.log(`Done! Replaced ${replaced}/78 course images.`);
if (missed.length) {
  console.log("Missed IDs:", missed.join(", "));
}
