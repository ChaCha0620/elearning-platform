/**
 * 課程組合包資料
 * 每個 bundle 對應一條學習路線，課程 ID 對齊 SearchCourses.vue 的 allCourses
 */

function makeBundle(raw) {
  const total = raw.courses.reduce((s, c) => s + c.price, 0);
  return {
    ...raw,
    totalOriginalPrice: total,
    discountedPrice: Math.round(total * 0.7),
    discountPercent: 30,
  };
}

export const bundles = [
  makeBundle({
    id: "fe-react",
    name: "前端工程師養成路線",
    subtitle: "React 技術棧",
    description: "14 週從 JS 基礎到電商實戰，建立完整前端技能樹。",
    tagline: "適合：轉職前端 ／ 已有 HTML/CSS 基礎",
    icon: "fa-solid fa-code",
    color: "#3672B5",
    courses: [
      { id: 2, title: "JavaScript 核心語法與非同步", price: 990 },
      { id: 3, title: "React 基礎與元件開發", price: 890 },
      { id: 5, title: "React 狀態管理與系統架構", price: 2490 },
      { id: 8, title: "實戰：電商平台全端開發", price: 4790 },
    ],
  }),
  makeBundle({
    id: "fe-vue",
    name: "前端工程師養成路線",
    subtitle: "Vue 技術棧",
    description: "從 Vue 元件開發到 Nuxt 全端框架，進入生態系完整實戰。",
    tagline: "適合：偏好 Vue 生態 ／ 已有 JS 基礎",
    icon: "fa-solid fa-cubes",
    color: "#42B883",
    courses: [
      { id: 20, title: "Vue 基礎與元件開發", price: 890 },
      { id: 23, title: "Vue 進階：Composition API 與 Pinia", price: 1990 },
      { id: 25, title: "Nuxt 3 全端框架開發", price: 2290 },
      { id: 27, title: "實戰：線上學習平台", price: 4790 },
    ],
  }),
  makeBundle({
    id: "uiux",
    name: "UI/UX 設計師養成路線",
    subtitle: "從研究到落地",
    description: "掌握設計原則、Figma 工具與原型測試，建立完整設計作品集。",
    tagline: "適合：轉職設計 ／ 想提升介面設計能力",
    icon: "fa-solid fa-wand-magic-sparkles",
    color: "#8B5CF6",
    courses: [
      { id: 11, title: "UI/UX 設計基礎概論", price: 790 },
      { id: 12, title: "Figma 介面設計入門", price: 690 },
      { id: 14, title: "互動原型與 Usability Testing", price: 1990 },
      { id: 17, title: "實戰：App 重新設計專案", price: 4290 },
    ],
  }),
  makeBundle({
    id: "backend",
    name: "後端開發入門路線",
    subtitle: "Node.js 全端思維",
    description: "從伺服器基礎到 API 設計與容器化部署，拓展全端能力。",
    tagline: "適合：前端想補後端 ／ 想了解伺服器運作",
    icon: "fa-solid fa-server",
    color: "#059669",
    courses: [
      { id: 43, title: "Node.js 基礎與伺服器概念", price: 890 },
      { id: 44, title: "SQL 資料庫設計與查詢", price: 890 },
      { id: 45, title: "RESTful API 設計原則", price: 790 },
      { id: 49, title: "實戰：全端電商 API 開發", price: 4290 },
    ],
  }),
  makeBundle({
    id: "data",
    name: "資料科學入門路線",
    subtitle: "Python 數據分析",
    description: "從 Python 入門到機器學習，培養數據驅動決策能力。",
    tagline: "適合：想轉資料分析 ／ 對 AI 有興趣",
    icon: "fa-solid fa-chart-line",
    color: "#D97706",
    courses: [
      { id: 52, title: "Python 程式設計入門", price: 690 },
      { id: 53, title: "統計學與資料視覺化", price: 790 },
      { id: 55, title: "機器學習基礎：Scikit-learn", price: 1990 },
      { id: 58, title: "實戰：電商用戶行為分析", price: 3990 },
    ],
  }),
  makeBundle({
    id: "product",
    name: "產品經理能力提升路線",
    subtitle: "從洞察到落地",
    description: "學習市場研究、需求管理與數據決策，帶領產品從 0 到 1。",
    tagline: "適合：想轉 PM ／ 設計師想懂產品思維",
    icon: "fa-solid fa-rocket",
    color: "#E11D48",
    courses: [
      { id: 70, title: "產品經理入門：角色與工作流程", price: 690 },
      { id: 71, title: "市場研究與競品分析", price: 790 },
      { id: 73, title: "數據驅動產品決策", price: 1790 },
      { id: 76, title: "實戰：從零到一打造 MVP", price: 3990 },
    ],
  }),
];
