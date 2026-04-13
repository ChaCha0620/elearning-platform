<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import SearchHero from '../components/search/SearchHero.vue'
import FilterSidebar from '../components/search/FilterSidebar.vue'
import CourseList from '../components/search/CourseList.vue'
import Pagination from '../components/search/Pagination.vue'
import EmptyState from '../components/search/EmptyState.vue'
import SearchDiagnosis from '../components/search/SearchDiagnosis.vue'
import { useCart } from '../composables/useCart.js'
import { useOnboarding } from '../composables/useOnboarding.js'

const { toggleCart } = useCart()
const route = useRoute()
const { isTourActive, currentStep, nextStep, endTour } = useOnboarding()

const searchKeyword = ref('')
const selectedLevel = ref('全部')
const selectedDomain = ref('全部')
const selectedPrice = ref('全部')
const currentPage = ref(1)
const ready = ref(false)
const searchLoading = ref(false)
let searchLoadingTimer = null

/* 選定子領域欄位，null = 回到課程大廳 */
const selectedSubDomain = ref(null)

/* 智慧診斷結果 */
const diagnosisResult = ref(null)

function onDiagnosisResult(result) {
  diagnosisResult.value = result
}

function getMatchInfo(courseId) {
  if (!diagnosisResult.value || !diagnosisResult.value.items) return null
  return diagnosisResult.value.items.find(i => i.courseId === courseId) || null
}

/* 頁面載入 focus 搜尋列行為 */
onMounted(() => {
  if (route.query.q) {
    searchKeyword.value = route.query.q
  }
  if (route.query.focus) {
    nextTick(() => {
      const input = document.querySelector('header input[placeholder="搜尋課程"]')
      if (input) input.focus()
    })
  }
  nextTick(() => {
    ready.value = true
  })
})

/* 搜尋 loading 動畫 */
watch(searchKeyword, (val) => {
  if (val.trim().length > 0) {
    searchLoading.value = true
    clearTimeout(searchLoadingTimer)
    searchLoadingTimer = setTimeout(() => { searchLoading.value = false }, 600)
  } else {
    searchLoading.value = false
  }
})

const levels = ['全部', '基礎', '進階', '實戰']

const priceRanges = [
  { label: '全部', min: 0, max: Infinity },
  { label: 'NT$1,000 以下', min: 0, max: 999 },
  { label: 'NT$1,000 – NT$2,500', min: 1000, max: 2500 },
  { label: 'NT$2,500 – NT$4,000', min: 2500, max: 4000 },
  { label: 'NT$4,000 以上', min: 4000, max: Infinity },
]

const domainGroups = [
  {
    name: '工程技術',
    en: 'Engineering',
    icon: '🛠',
    items: ['前端開發 (Front-end)', '後端開發 (Back-end)', '資料科學 (Data Science)']
  },
  {
    name: '設計創意',
    en: 'Design',
    icon: '🎨',
    items: ['UI/UX 設計', '平面設計 (Graphic Design)', '產品策略 (Product Strategy)']
  }
]

/* 學習路徑資料 */
const learningPaths = {
  '前端開發 (Front-end)': {
    breadcrumb: ['工程技術', '前端開發'],
    title: '前端開發：從基礎入門\n到實戰級應用',
    description: '從零到一建立完整前端開發技能樹，涵蓋語法基礎、框架進階與真實專案實戰，幫助你循序漸進成為業界搶手的前端工程師。',
    stats: [
      { icon: '📊', label: '21 堂課程' },
      { icon: '⏱', label: '約 166 小時' },
      { icon: '👨‍🏫', label: '8 位講師' },
      { icon: '🎖', label: '官方認證' }
    ],
    bundlePrice: 'NT$43,590',
    bundleSave: '省 NT$7,700',
    bundleCount: 21,
    roadmap: [
      { stage: '階段一', title: '網頁基礎', icon: 'fa-solid fa-code', desc: '掌握 HTML 語義化結構與 CSS 佈局技巧，學會 Flexbox / Grid 完成響應式網頁切版。', skills: ['HTML5 語義化', 'CSS Flexbox / Grid', '響應式設計'], color: '#3B82F6' },
      { stage: '階段二', title: 'JavaScript 核心', icon: 'fa-brands fa-js', desc: '深入 ES6+ 語法、非同步處理與模組化開發，為框架學習打下堅實基礎。', skills: ['ES6+ 語法', 'Promise / async-await', '模組化開發'], color: '#2563EB' },
      { stage: '階段三', title: '前端框架', icon: 'fa-solid fa-cubes', desc: '學習 React 或 Vue 框架，掌握元件開發、狀態管理與路由配置，建構現代化 SPA 應用。', skills: ['React / Vue', '狀態管理', '路由配置'], color: '#1D4ED8' },
      { stage: '階段四', title: '進階工程化', icon: 'fa-solid fa-gears', desc: '學習 TypeScript 型別系統、自動化測試與效能優化，提升程式碼品質與團隊協作效率。', skills: ['TypeScript', '自動化測試', '效能優化'], color: '#1E40AF' },
      { stage: '階段五', title: '實戰專案', icon: 'fa-solid fa-rocket', desc: '整合所學技能完成完整專案，包含 CI/CD 部署與作品集製作，具備求職即戰力。', skills: ['全端整合', 'CI/CD 部署', '作品集'], color: '#1B3A5C' }
    ]
  },
  'UI/UX 設計': {
    breadcrumb: ['設計創意', 'UI/UX 設計'],
    title: 'UI/UX 設計：從用戶研究\n到產品體驗落地',
    description: '系統化學習使用者研究、介面設計與原型測試，掌握以人為本的設計思維，打造真正好用的數位產品。',
    stats: [
      { icon: '📊', label: '21 堂課程' },
      { icon: '⏱', label: '約 135 小時' },
      { icon: '👨‍🏫', label: '10 位講師' },
      { icon: '🎖', label: '官方認證' }
    ],
    bundlePrice: 'NT$37,790',
    bundleSave: '省 NT$6,700',
    bundleCount: 21,
    roadmap: [
      { stage: '階段一', title: 'UX 研究基礎', icon: 'fa-solid fa-users', desc: '學習使用者訪談、問卷設計與競品分析，建立以用戶為中心的設計思維。', skills: ['使用者訪談', '問卷設計', '競品分析'], color: '#A78BFA' },
      { stage: '階段二', title: 'UI 設計工具', icon: 'fa-solid fa-pen-ruler', desc: '精通 Figma 操作，包含元件設計、Auto Layout 與原型互動，快速產出高保真設計稿。', skills: ['Figma 精通', 'Auto Layout', '原型互動'], color: '#8B5CF6' },
      { stage: '階段三', title: '設計系統', icon: 'fa-solid fa-swatchbook', desc: '建立可擴展的設計系統，統一色彩、字型、元件規範，確保跨頁面一致性。', skills: ['Design Token', '元件規範', '設計文件'], color: '#7C3AED' },
      { stage: '階段四', title: '原型測試與迭代', icon: 'fa-solid fa-flask-vial', desc: '運用可用性測試、A/B 測試收集數據回饋，持續迭代優化產品體驗。', skills: ['可用性測試', 'A/B 測試', '數據驅動迭代'], color: '#6D28D9' },
      { stage: '階段五', title: '實戰專案', icon: 'fa-solid fa-rocket', desc: '從需求分析到設計交付的完整流程，製作專業作品集與 Case Study。', skills: ['完整設計流程', '設計交付', '作品集'], color: '#5B21B6' }
    ]
  },
  '後端開發 (Back-end)': {
    breadcrumb: ['工程技術', '後端開發'],
    title: '後端開發：從伺服器基礎\n到微服務架構',
    description: '系統化學習伺服器端開發、資料庫設計與部署流程，從 API 建構到容器化微服務，打造穩定可擴展的後端系統。',
    stats: [
      { icon: '📊', label: '9 堂課程' },
      { icon: '⏱', label: '58 小時' },
      { icon: '👨‍🏫', label: '5 位講師' },
      { icon: '🎖', label: '官方認證' }
    ],
    bundlePrice: 'NT$16,110',
    bundleSave: '省 NT$2,900',
    bundleCount: 9,
    roadmap: [
      { stage: '階段一', title: 'Node.js 基礎', icon: 'fa-brands fa-node-js', desc: '學習 Node.js 執行環境、Express 框架與 RESTful API 設計原則。', skills: ['Node.js', 'Express', 'RESTful API'], color: '#3B82F6' },
      { stage: '階段二', title: '資料庫設計', icon: 'fa-solid fa-database', desc: '掌握 SQL / NoSQL 資料庫設計，學會資料建模、查詢優化與 ORM 操作。', skills: ['SQL / PostgreSQL', 'MongoDB', 'ORM 操作'], color: '#2563EB' },
      { stage: '階段三', title: '容器化與部署', icon: 'fa-solid fa-cloud-arrow-up', desc: '使用 Docker 容器化應用，搭配 CI/CD 流程實現自動化部署。', skills: ['Docker', 'CI/CD', '雲端部署'], color: '#1D4ED8' },
      { stage: '階段四', title: '微服務架構', icon: 'fa-solid fa-diagram-project', desc: '設計微服務系統、訊息佇列與 API Gateway，打造可擴展的分散式架構。', skills: ['微服務設計', 'Message Queue', 'API Gateway'], color: '#1B3A5C' }
    ]
  },
  '資料科學 (Data Science)': {
    breadcrumb: ['工程技術', '資料科學'],
    title: '資料科學：從數據分析\n到機器學習應用',
    description: '從 Python 程式基礎到機器學習與深度學習，學會用數據說故事、驅動商業決策。',
    stats: [
      { icon: '📊', label: '9 堂課程' },
      { icon: '⏱', label: '60 小時' },
      { icon: '👨‍🏫', label: '5 位講師' },
      { icon: '🎖', label: '官方認證' }
    ],
    bundlePrice: 'NT$17,310',
    bundleSave: '省 NT$3,100',
    bundleCount: 9,
    roadmap: [
      { stage: '階段一', title: 'Python 程式基礎', icon: 'fa-brands fa-python', desc: '學習 Python 語法、資料結構與常用函式庫，建立程式設計基礎。', skills: ['Python 語法', '資料結構', 'Jupyter Notebook'], color: '#3B82F6' },
      { stage: '階段二', title: '數據分析與視覺化', icon: 'fa-solid fa-chart-bar', desc: '使用 Pandas 與 Matplotlib 進行資料清洗、探索式分析與視覺化呈現。', skills: ['Pandas', 'Matplotlib', '探索式分析'], color: '#2563EB' },
      { stage: '階段三', title: '統計與機器學習', icon: 'fa-solid fa-brain', desc: '掌握統計推論、迴歸分析與常用機器學習演算法，建立預測模型。', skills: ['統計推論', 'Scikit-learn', '模型評估'], color: '#1D4ED8' },
      { stage: '階段四', title: '深度學習應用', icon: 'fa-solid fa-microchip', desc: '學習神經網路、CNN/RNN 架構與實務應用，解決影像辨識與自然語言處理問題。', skills: ['TensorFlow / PyTorch', 'CNN / RNN', 'NLP 應用'], color: '#1B3A5C' }
    ]
  },
  '平面設計 (Graphic Design)': {
    breadcrumb: ['設計創意', '平面設計'],
    title: '平面設計：從排版基礎\n到品牌視覺系統',
    description: '掌握排版原理、插畫繪製與品牌識別設計，運用 Adobe 工具打造專業級視覺作品。',
    stats: [
      { icon: '📊', label: '9 堂課程' },
      { icon: '⏱', label: '59 小時' },
      { icon: '👨‍🏫', label: '5 位講師' },
      { icon: '🎖', label: '官方認證' }
    ],
    bundlePrice: 'NT$15,310',
    bundleSave: '省 NT$2,700',
    bundleCount: 9,
    roadmap: [
      { stage: '階段一', title: '設計原理', icon: 'fa-solid fa-palette', desc: '學習排版、色彩學與構圖基礎，建立扎實的視覺設計素養。', skills: ['排版原理', '色彩學', '構圖法則'], color: '#F472B6' },
      { stage: '階段二', title: 'Adobe 工具精通', icon: 'fa-solid fa-pen-nib', desc: '精通 Illustrator 向量繪製與 Photoshop 影像處理，高效產出設計作品。', skills: ['Illustrator', 'Photoshop', '向量繪製'], color: '#EC4899' },
      { stage: '階段三', title: '品牌識別設計', icon: 'fa-solid fa-stamp', desc: '從 Logo 設計到完整品牌視覺系統，學會建立一致的品牌形象。', skills: ['Logo 設計', '品牌規範', '視覺系統'], color: '#DB2777' },
      { stage: '階段四', title: '商業實戰', icon: 'fa-solid fa-rocket', desc: '完成商業海報、社群素材與品牌專案，打造專業設計作品集。', skills: ['商業海報', '社群素材', '作品集'], color: '#BE185D' }
    ]
  },
  '產品策略 (Product Strategy)': {
    breadcrumb: ['設計創意', '產品策略'],
    title: '產品策略：從市場洞察\n到成長營運',
    description: '學習產品經理核心技能：市場研究、需求管理、數據決策與敏捷開發，帶領產品從 0 到 1。',
    stats: [
      { icon: '📊', label: '9 堂課程' },
      { icon: '⏱', label: '55 小時' },
      { icon: '👨‍🏫', label: '5 位講師' },
      { icon: '🎖', label: '官方認證' }
    ],
    bundlePrice: 'NT$14,810',
    bundleSave: '省 NT$2,600',
    bundleCount: 9,
    roadmap: [
      { stage: '階段一', title: 'PM 入門', icon: 'fa-solid fa-lightbulb', desc: '認識產品經理角色與職責，學習需求訪談、PRD 撰寫與優先級排序。', skills: ['PM 職責', 'PRD 撰寫', '需求排序'], color: '#FBBF24' },
      { stage: '階段二', title: '市場研究', icon: 'fa-solid fa-magnifying-glass-chart', desc: '掌握市場調查方法、用戶畫像與商業模式分析，發掘產品機會點。', skills: ['市場調查', '用戶畫像', '商業模式'], color: '#F59E0B' },
      { stage: '階段三', title: '敏捷開發', icon: 'fa-solid fa-arrows-spin', desc: '實踐 Scrum / Kanban 敏捷流程，學會 Sprint 規劃、站會與回顧。', skills: ['Scrum', 'Kanban', 'Sprint 規劃'], color: '#D97706' },
      { stage: '階段四', title: '成長與營運', icon: 'fa-solid fa-chart-line', desc: '運用數據驅動成長策略，學習 A/B 測試、漏斗分析與用戶留存優化。', skills: ['Growth Hacking', '漏斗分析', '留存優化'], color: '#B45309' }
    ]
  }
}

/* 全部課程資料（含分類標籤） */
const allCourses = ref([
  /* ========== 前端開發 — 基礎 ========== */
  {
    id: 1,
    title: 'HTML/CSS 與網頁切版',
    description: '從語義化結構到 Flexbox/Grid 完整佈局實作',
    meta: '6 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$790',
    level: '基礎',
    category: '前端開發 (Front-end)',
    module: '基礎',
    rating: 4.8,
    students: 3420,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 2,
    title: 'JavaScript 核心語法與非同步',
    description: 'ES6+、Promise、async/await 與模組化開發',
    meta: '8 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$990',
    level: '基礎',
    category: '前端開發 (Front-end)',
    module: '基礎',
    framework: 'JavaScript',
    rating: 4.9,
    students: 4180,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 3,
    title: 'React 基礎與元件開發',
    description: 'JSX 語法、元件生命週期、Props 與 State 管理',
    meta: '7 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$890',
    level: '基礎',
    category: '前端開發 (Front-end)',
    module: '基礎',
    framework: 'React',
    rating: 4.7,
    students: 2860,
    added: false,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 20,
    title: 'Vue 基礎與元件開發',
    description: 'Template 語法、響應式系統、Props/Emit 與組件通訊',
    meta: '7 小時 · 21 單元',
    provider: '學易點 官方',
    price: 'NT$890',
    level: '基礎',
    category: '前端開發 (Front-end)',
    module: '基礎',
    framework: 'Vue',
    rating: 4.8,
    students: 2540,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 21,
    title: 'Tailwind CSS 實用開發',
    description: 'Utility-first 工作流、響應式設計、自訂主題與元件模式',
    meta: '5 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: '前端開發 (Front-end)',
    module: '基礎',
    framework: 'Tailwind',
    rating: 4.6,
    students: 1920,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 22,
    title: 'Bootstrap 響應式佈局',
    description: 'Grid System、預製元件、客製化 Sass 變數與 RWD 實作',
    meta: '5 小時 · 15 單元',
    provider: '學易點 官方',
    price: 'NT$590',
    level: '基礎',
    category: '前端開發 (Front-end)',
    module: '基礎',
    framework: 'Bootstrap',
    rating: 4.4,
    students: 1680,
    added: false,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 前端開發 — 進階 ========== */
  {
    id: 4,
    title: 'CSS 進階：動畫、變數與架構設計',
    description: 'CSS Custom Properties、複雜動畫、BEM/Utility-first 架構實踐',
    meta: '5 小時 · 15 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    rating: 4.5,
    students: 1340,
    added: false,
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 5,
    title: 'React 狀態管理與系統架構',
    description: 'Context、Zustand、效能優化與大型架構實戰',
    meta: '10 小時 · 28 單元',
    provider: '學易點 官方',
    price: 'NT$2,490',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    framework: 'React',
    rating: 4.8,
    students: 2210,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 6,
    title: '前端效能優化與部署',
    description: 'Webpack/Vite、Lighthouse、CI/CD 自動化部署',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    rating: 4.4,
    students: 980,
    added: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 7,
    title: 'TypeScript 全面入門與實戰',
    description: '型別系統、泛型、與 React/Vue 整合應用',
    meta: '6 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$1,790',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    framework: 'TypeScript',
    rating: 4.7,
    students: 1850,
    added: false,
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 23,
    title: 'Vue 進階：Composition API 與 Pinia',
    description: 'Composables 模式、Pinia 狀態管理、VueRouter 進階與效能調校',
    meta: '8 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$2,290',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    framework: 'Vue',
    rating: 4.8,
    students: 1760,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 24,
    title: 'Next.js 全端框架開發',
    description: 'App Router、SSR/SSG、API Routes 與全端部署策略',
    meta: '7 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$1,990',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    framework: 'Next.js',
    rating: 4.6,
    students: 1420,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 25,
    title: 'Nuxt 3 全端框架開發',
    description: 'Auto Import、Server API、SSR/ISR 與 Nitro 引擎實戰',
    meta: '7 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$1,990',
    level: '進階',
    category: '前端開發 (Front-end)',
    module: '進階',
    framework: 'Nuxt',
    rating: 4.5,
    students: 1180,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 前端開發 — 實戰 ========== */
  {
    id: 8,
    title: '實戰：電商平台全端開發',
    description: '從零打造完整電商系統——商品展示、購物車、結帳與後台管理',
    meta: '12 小時 · 32 單元',
    provider: '學易點 官方',
    price: 'NT$4,790',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'React',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
    rating: 4.9,
    students: 3150,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 9,
    title: '實戰：即時聊天應用 (Chat App)',
    description: '使用 WebSocket 與 React 建立多人即時通訊系統，含訊息通知與讀取狀態',
    meta: '8 小時 · 22 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'React',
    tags: ['React', 'Socket.io', 'Express', 'Redis'],
    rating: 4.7,
    students: 1890,
    added: false,
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 10,
    title: '實戰：專案管理工具 (Kanban)',
    description: '拖曳看板、即時協作與權限控制，類似 Trello 的全功能系統',
    meta: '9 小時 · 26 單元',
    provider: '學易點 官方',
    price: 'NT$3,790',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'React',
    tags: ['React', 'TypeScript', 'DnD Kit', 'Supabase'],
    rating: 4.6,
    students: 1520,
    added: false,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 26,
    title: '實戰：社群媒體平台 (Instagram Clone)',
    description: '使用 Vue 3 打造圖片社群——動態牆、按讚留言、追蹤系統與即時通知',
    meta: '10 小時 · 28 單元',
    provider: '學易點 官方',
    price: 'NT$4,290',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'Vue',
    tags: ['Vue 3', 'Pinia', 'Firebase', 'Tailwind'],
    rating: 4.8,
    students: 2080,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 27,
    title: '實戰：線上學習平台 (E-Learning)',
    description: '課程購買、影片播放器、學習進度追蹤與智慧排程功能',
    meta: '10 小時 · 30 單元',
    provider: '學易點 官方',
    price: 'NT$4,290',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'Vue',
    tags: ['Vue 3', 'Tailwind', 'Pinia', 'Video.js'],
    rating: 4.7,
    students: 1640,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 28,
    title: '實戰：部落格 CMS 系統',
    description: '使用 Next.js 建立 Markdown 部落格——SEO 優化、ISR 與後台管理',
    meta: '14 小時 · 36 單元',
    provider: '學易點 官方',
    price: 'NT$5,490',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'Next.js',
    tags: ['Next.js', 'MDX', 'Prisma', 'Vercel'],
    rating: 4.6,
    students: 1350,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 29,
    title: '實戰：餐廳訂位與點餐系統',
    description: '行動優先 UI、地圖整合、即時訂位與訂單管理全端開發',
    meta: '9 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$3,790',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'React',
    tags: ['React', 'Tailwind', 'Google Maps API', 'Node.js'],
    rating: 4.5,
    students: 1120,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 30,
    title: '實戰：個人品牌作品集',
    description: '使用 Nuxt 3 打造高效能個人網站——動態作品展示、暗色模式與 SEO',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$2,990',
    level: '實戰',
    category: '前端開發 (Front-end)',
    module: '實戰',
    framework: 'Nuxt',
    tags: ['Nuxt 3', 'GSAP', 'Tailwind', 'Netlify'],
    rating: 4.7,
    students: 1480,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== UI/UX 設計 — 基礎 ========== */
  {
    id: 11,
    title: 'UI/UX 設計基礎概論',
    description: '使用者研究、設計原則與 Figma 入門',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$790',
    level: '基礎',
    category: 'UI/UX 設計',
    module: '基礎',
    rating: 4.7,
    students: 2680,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 12,
    title: 'Figma 介面設計入門',
    description: '從零學會 Figma，掌握 Auto Layout、元件與設計規範',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: 'UI/UX 設計',
    module: '基礎',
    framework: 'Figma',
    rating: 4.8,
    students: 3240,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 13,
    title: '設計原則與色彩學',
    description: '視覺層級、字體搭配、色彩心理學在介面中的應用',
    meta: '4 小時 · 12 單元',
    provider: '學易點 官方',
    price: 'NT$490',
    level: '基礎',
    category: 'UI/UX 設計',
    module: '基礎',
    rating: 4.5,
    students: 1950,
    added: false,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== UI/UX 設計 — 進階 ========== */
  {
    id: 14,
    title: '互動原型與 Usability Testing',
    description: '使用 Figma Prototype 建立互動流程，規劃與執行易用性測試',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$1,990',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    framework: 'Figma',
    rating: 4.6,
    students: 1480,
    added: false,
    image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 15,
    title: '設計系統建構與管理',
    description: 'Design Token、元件庫規範與跨團隊協作流程',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$1,790',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    framework: 'Figma',
    rating: 4.7,
    students: 1320,
    added: false,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 16,
    title: '進階 Figma：變數、條件元件與團隊協作',
    description: 'Figma Variables、Boolean Props、分支管理與開發交付工作流',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    framework: 'Figma',
    rating: 4.5,
    students: 1060,
    added: false,
    image: 'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== UI/UX 設計 — 實戰 ========== */
  {
    id: 17,
    title: '實戰：App 重新設計專案',
    description: '從用戶訪談、競品分析到高保真原型，完整走過一次產品設計流程',
    meta: '10 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$4,290',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'User Interview', 'Wireframe', 'Prototype'],
    rating: 4.8,
    students: 1870,
    added: false,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 18,
    title: '實戰：SaaS 儀表板設計',
    description: '設計資料儀表板與管理後台，包含資料視覺化、表格與篩選器元件',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'Design System', 'Data Viz', 'Responsive'],
    rating: 4.6,
    students: 1340,
    added: false,
    image: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 19,
    title: '實戰：品牌官網與 Landing Page',
    description: '從品牌策略到視覺設計，打造高轉換率的行銷頁面',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$2,990',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'Branding', 'Typography', 'Motion'],
    rating: 4.5,
    students: 1150,
    added: false,
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== UI/UX 設計 — 基礎（新增） ========== */
  {
    id: 31,
    title: 'UX 寫作與內容策略',
    description: '從按鈕文案到錯誤訊息，學會用文字提升使用者體驗與產品轉換率',
    meta: '4 小時 · 12 單元',
    provider: '學易點 官方',
    price: 'NT$490',
    level: '基礎',
    category: 'UI/UX 設計',
    module: '基礎',
    rating: 4.6,
    students: 1420,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 32,
    title: '使用者研究方法論',
    description: '深度訪談、問卷設計、人物誌與旅程地圖，掌握質化與量化研究技巧',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: 'UI/UX 設計',
    module: '基礎',
    rating: 4.7,
    students: 1860,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 33,
    title: 'Wireframe 與資訊架構',
    description: '從 Sitemap 到低保真線框圖，建立清楚的頁面結構與導航邏輯',
    meta: '5 小時 · 13 單元',
    provider: '學易點 官方',
    price: 'NT$590',
    level: '基礎',
    category: 'UI/UX 設計',
    module: '基礎',
    framework: 'Figma',
    rating: 4.5,
    students: 1590,
    added: false,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== UI/UX 設計 — 進階（新增） ========== */
  {
    id: 34,
    title: '動態設計與微互動',
    description: 'Figma Smart Animate 與 After Effects 基礎，為介面注入動態回饋與轉場效果',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$1,790',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    framework: 'Figma',
    tags: ['Figma', 'Motion', 'After Effects', 'Micro-interaction'],
    rating: 4.7,
    students: 1280,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 35,
    title: '無障礙設計 (Accessibility)',
    description: 'WCAG 標準、色彩對比、螢幕閱讀器測試與包容性設計實務',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    rating: 4.6,
    students: 980,
    added: false,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 36,
    title: '設計思考與工作坊引導',
    description: 'Design Thinking 五步驟、共創工作坊規劃與引導技巧，推動跨部門創新',
    meta: '6 小時 · 15 單元',
    provider: '學易點 官方',
    price: 'NT$1,690',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    rating: 4.5,
    students: 1120,
    added: false,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 37,
    title: '跨平台設計：iOS 與 Android 規範',
    description: 'Human Interface Guidelines 與 Material Design 的差異、適配策略與平台專屬元件',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$1,990',
    level: '進階',
    category: 'UI/UX 設計',
    module: '進階',
    framework: 'Figma',
    tags: ['Figma', 'iOS', 'Android', 'Material Design'],
    rating: 4.6,
    students: 1350,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== UI/UX 設計 — 實戰（新增） ========== */
  {
    id: 38,
    title: '實戰：行動端電商 App 設計',
    description: '從競品拆解到高保真 Prototype，完整設計一款行動購物體驗',
    meta: '9 小時 · 22 單元',
    provider: '學易點 官方',
    price: 'NT$3,790',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'E-commerce', 'Mobile', 'Prototype'],
    rating: 4.7,
    students: 1540,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 39,
    title: '實戰：Design Sprint 產品衝刺',
    description: '五天內完成理解、發散、決策、原型與驗證，快速測試產品假說',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'Design Sprint', 'Lean UX', 'Validation'],
    rating: 4.8,
    students: 1680,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 40,
    title: '實戰：醫療健康 App 設計',
    description: '掌握醫療領域 UX 挑戰：無障礙、信任感設計與複雜表單流程優化',
    meta: '9 小時 · 22 單元',
    provider: '學易點 官方',
    price: 'NT$3,790',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'Healthcare', 'Accessibility', 'Form Design'],
    rating: 4.6,
    students: 920,
    added: false,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 41,
    title: '實戰：設計作品集與面試準備',
    description: '打造專業 Portfolio，學習 Case Study 撰寫、簡報呈現與白板挑戰技巧',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$2,990',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    tags: ['Portfolio', 'Case Study', 'Interview', 'Presentation'],
    rating: 4.8,
    students: 2150,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 42,
    title: '實戰：AI 驅動的 UX 設計',
    description: '運用 AI 工具加速設計流程：自動生成 UI、智慧分析用戶行為與 A/B 測試',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,690',
    level: '實戰',
    category: 'UI/UX 設計',
    module: '實戰',
    framework: 'Figma',
    tags: ['Figma', 'AI', 'ChatGPT', 'Midjourney', 'A/B Testing'],
    rating: 4.7,
    students: 1890,
    isNew: true,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 後端開發 — 基礎 ========== */
  {
    id: 43,
    title: 'Node.js 基礎與伺服器概念',
    description: '從零認識後端開發：HTTP 協定、路由處理與 Express 入門',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$790',
    level: '基礎',
    category: '後端開發 (Back-end)',
    module: '基礎',
    framework: 'Node.js',
    rating: 4.7,
    students: 2850,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 44,
    title: 'SQL 資料庫設計與查詢',
    description: 'MySQL / PostgreSQL 基礎：資料表設計、JOIN、索引與效能優化',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: '後端開發 (Back-end)',
    module: '基礎',
    framework: 'PostgreSQL',
    rating: 4.6,
    students: 2340,
    added: false,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 45,
    title: 'RESTful API 設計原則',
    description: '資源命名、HTTP 方法、狀態碼與 API 版本管理最佳實踐',
    meta: '4 小時 · 12 單元',
    provider: '學易點 官方',
    price: 'NT$490',
    level: '基礎',
    category: '後端開發 (Back-end)',
    module: '基礎',
    rating: 4.5,
    students: 1980,
    added: false,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 後端開發 — 進階 ========== */
  {
    id: 46,
    title: '驗證與授權：JWT、OAuth 2.0',
    description: 'Token 機制、Session 管理與第三方登入整合實務',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$1,790',
    level: '進階',
    category: '後端開發 (Back-end)',
    module: '進階',
    framework: 'Node.js',
    rating: 4.7,
    students: 1680,
    added: false,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 47,
    title: 'Docker 容器化與部署流程',
    description: 'Dockerfile 撰寫、Docker Compose 編排與 CI/CD 基礎流水線',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$1,990',
    level: '進階',
    category: '後端開發 (Back-end)',
    module: '進階',
    framework: 'Docker',
    rating: 4.6,
    students: 1420,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 48,
    title: 'NoSQL 資料庫：MongoDB 實戰',
    description: '文件模型、聚合管道、索引策略與 Mongoose ODM 整合',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: '後端開發 (Back-end)',
    module: '進階',
    framework: 'MongoDB',
    rating: 4.5,
    students: 1360,
    added: false,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 後端開發 — 實戰 ========== */
  {
    id: 49,
    title: '實戰：全端電商 API 開發',
    description: '從商品管理、購物車到金流串接，打造完整後端服務',
    meta: '10 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$4,290',
    level: '實戰',
    category: '後端開發 (Back-end)',
    module: '實戰',
    framework: 'Node.js',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Stripe'],
    rating: 4.8,
    students: 1920,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 50,
    title: '實戰：即時通知系統 (WebSocket)',
    description: '使用 Socket.io 實作即時推播、聊天室與上線狀態管理',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: '後端開發 (Back-end)',
    module: '實戰',
    framework: 'Node.js',
    tags: ['Node.js', 'Socket.io', 'Redis', 'WebSocket'],
    rating: 4.6,
    students: 1280,
    added: false,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 51,
    title: '實戰：微服務架構入門',
    description: '拆分單體應用為微服務，搭配 Docker、Message Queue 與 API Gateway',
    meta: '9 小時 · 22 單元',
    provider: '學易點 官方',
    price: 'NT$3,990',
    level: '實戰',
    category: '後端開發 (Back-end)',
    module: '實戰',
    framework: 'Docker',
    tags: ['Docker', 'RabbitMQ', 'API Gateway', 'Microservices'],
    rating: 4.7,
    students: 1150,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 資料科學 — 基礎 ========== */
  {
    id: 52,
    title: 'Python 程式設計入門',
    description: '變數、迴圈、函式與模組，為資料科學打下程式基礎',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$890',
    level: '基礎',
    category: '資料科學 (Data Science)',
    module: '基礎',
    framework: 'Python',
    rating: 4.8,
    students: 3450,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 53,
    title: '統計學與資料視覺化',
    description: '描述統計、機率分佈與 Matplotlib / Seaborn 圖表實作',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: '資料科學 (Data Science)',
    module: '基礎',
    framework: 'Python',
    rating: 4.6,
    students: 2180,
    added: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 54,
    title: 'Pandas 資料處理與清洗',
    description: 'DataFrame 操作、缺失值處理、合併與樞紐分析表',
    meta: '5 小時 · 13 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: '資料科學 (Data Science)',
    module: '基礎',
    framework: 'Python',
    rating: 4.7,
    students: 2560,
    added: false,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 資料科學 — 進階 ========== */
  {
    id: 55,
    title: '機器學習基礎：Scikit-learn',
    description: '監督式與非監督式學習：迴歸、分類、聚類與模型評估',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$2,190',
    level: '進階',
    category: '資料科學 (Data Science)',
    module: '進階',
    framework: 'Python',
    rating: 4.7,
    students: 1780,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 56,
    title: '深度學習入門：TensorFlow & Keras',
    description: '神經網路架構、CNN、RNN 與模型訓練調參實務',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$2,490',
    level: '進階',
    category: '資料科學 (Data Science)',
    module: '進階',
    framework: 'TensorFlow',
    rating: 4.6,
    students: 1450,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 57,
    title: 'SQL 進階分析與資料倉儲',
    description: '視窗函數、CTE、ETL 流程與維度建模概念',
    meta: '6 小時 · 15 單元',
    provider: '學易點 官方',
    price: 'NT$1,690',
    level: '進階',
    category: '資料科學 (Data Science)',
    module: '進階',
    framework: 'PostgreSQL',
    rating: 4.5,
    students: 1320,
    added: false,
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 資料科學 — 實戰 ========== */
  {
    id: 58,
    title: '實戰：電商用戶行為分析',
    description: '從資料清洗到 RFM 模型，用 Python 分析顧客價值與購買預測',
    meta: '9 小時 · 22 單元',
    provider: '學易點 官方',
    price: 'NT$3,790',
    level: '實戰',
    category: '資料科學 (Data Science)',
    module: '實戰',
    framework: 'Python',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Data Viz'],
    rating: 4.7,
    students: 1560,
    added: false,
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 59,
    title: '實戰：自然語言處理 (NLP)',
    description: '文本前處理、情感分析與聊天機器人建構',
    meta: '10 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$4,490',
    level: '實戰',
    category: '資料科學 (Data Science)',
    module: '實戰',
    framework: 'Python',
    tags: ['Python', 'NLP', 'Transformers', 'spaCy'],
    rating: 4.8,
    students: 1380,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 60,
    title: '實戰：資料儀表板與商業報表',
    description: '用 Streamlit + Plotly 構建互動式儀表板，自動產出週報與 KPI 追蹤',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: '資料科學 (Data Science)',
    module: '實戰',
    framework: 'Python',
    tags: ['Python', 'Streamlit', 'Plotly', 'Dashboard'],
    rating: 4.6,
    students: 1240,
    added: false,
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 平面設計 — 基礎 ========== */
  {
    id: 61,
    title: '平面設計基礎與排版原理',
    description: '構圖法則、網格系統與版面配置的視覺邏輯',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$590',
    level: '基礎',
    category: '平面設計 (Graphic Design)',
    module: '基礎',
    rating: 4.6,
    students: 2120,
    added: false,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 62,
    title: 'Adobe Illustrator 入門',
    description: '向量繪圖、路徑編輯、形狀建構與 Logo 設計基礎',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$790',
    level: '基礎',
    category: '平面設計 (Graphic Design)',
    module: '基礎',
    framework: 'Illustrator',
    rating: 4.7,
    students: 2680,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 63,
    title: 'Adobe Photoshop 影像處理',
    description: '圖層、遮罩、色彩校正與照片合成技巧',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: '平面設計 (Graphic Design)',
    module: '基礎',
    framework: 'Photoshop',
    rating: 4.6,
    students: 2450,
    added: false,
    image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 平面設計 — 進階 ========== */
  {
    id: 64,
    title: '字體設計與 Typography',
    description: '字型分類、字距調整、字體配對與品牌字體運用策略',
    meta: '5 小時 · 13 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: '平面設計 (Graphic Design)',
    module: '進階',
    rating: 4.5,
    students: 1380,
    added: false,
    image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 65,
    title: '品牌識別設計系統',
    description: '從品牌定位到 VI 規範：Logo、色彩、輔助圖形與應用延伸',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$1,990',
    level: '進階',
    category: '平面設計 (Graphic Design)',
    module: '進階',
    framework: 'Illustrator',
    rating: 4.7,
    students: 1560,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 66,
    title: 'InDesign 排版與印刷實務',
    description: '主版頁面、段落樣式、出血設定與印前輸出流程',
    meta: '6 小時 · 15 單元',
    provider: '學易點 官方',
    price: 'NT$1,690',
    level: '進階',
    category: '平面設計 (Graphic Design)',
    module: '進階',
    framework: 'InDesign',
    rating: 4.5,
    students: 1120,
    added: false,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 平面設計 — 實戰 ========== */
  {
    id: 67,
    title: '實戰：品牌全套視覺設計',
    description: '為虛擬品牌打造完整 CI：Logo、名片、信封、社群素材與品牌手冊',
    meta: '10 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$4,290',
    level: '實戰',
    category: '平面設計 (Graphic Design)',
    module: '實戰',
    framework: 'Illustrator',
    tags: ['Illustrator', 'Branding', 'Logo', 'Print'],
    rating: 4.8,
    students: 1780,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 68,
    title: '實戰：社群行銷素材設計',
    description: 'Instagram、Facebook 與 YouTube 縮圖的視覺策略與批量製作',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$2,990',
    level: '實戰',
    category: '平面設計 (Graphic Design)',
    module: '實戰',
    framework: 'Photoshop',
    tags: ['Photoshop', 'Social Media', 'Marketing', 'Template'],
    rating: 4.6,
    students: 1920,
    added: false,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 69,
    title: '實戰：書籍封面與雜誌編排',
    description: '從概念發想到完稿輸出，完整走過出版品設計流程',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: '平面設計 (Graphic Design)',
    module: '實戰',
    framework: 'InDesign',
    tags: ['InDesign', 'Photoshop', 'Editorial', 'Print'],
    rating: 4.5,
    students: 1050,
    added: false,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 產品策略 — 基礎 ========== */
  {
    id: 70,
    title: '產品經理入門：角色與工作流程',
    description: 'PM 的職責範疇、跨部門協作、產品生命週期與路線圖',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$690',
    level: '基礎',
    category: '產品策略 (Product Strategy)',
    module: '基礎',
    rating: 4.7,
    students: 2350,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 71,
    title: '市場研究與競品分析',
    description: 'TAM/SAM/SOM、SWOT 分析與競品功能矩陣建構',
    meta: '4 小時 · 12 單元',
    provider: '學易點 官方',
    price: 'NT$490',
    level: '基礎',
    category: '產品策略 (Product Strategy)',
    module: '基礎',
    rating: 4.5,
    students: 1780,
    added: false,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 72,
    title: '需求文件與 User Story 撰寫',
    description: 'PRD、使用者故事、驗收標準與 Jira 管理流程',
    meta: '4 小時 · 12 單元',
    provider: '學易點 官方',
    price: 'NT$490',
    level: '基礎',
    category: '產品策略 (Product Strategy)',
    module: '基礎',
    rating: 4.6,
    students: 1950,
    added: false,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 產品策略 — 進階 ========== */
  {
    id: 73,
    title: '數據驅動產品決策',
    description: 'A/B 測試、漏斗分析、留存率追蹤與 Google Analytics 4 實務',
    meta: '6 小時 · 16 單元',
    provider: '學易點 官方',
    price: 'NT$1,790',
    level: '進階',
    category: '產品策略 (Product Strategy)',
    module: '進階',
    framework: 'GA4',
    rating: 4.7,
    students: 1480,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 74,
    title: '產品成長策略與 Growth Hacking',
    description: 'AARRR 模型、病毒迴圈、推薦系統與付費轉換優化',
    meta: '6 小時 · 15 單元',
    provider: '學易點 官方',
    price: 'NT$1,690',
    level: '進階',
    category: '產品策略 (Product Strategy)',
    module: '進階',
    rating: 4.6,
    students: 1350,
    added: false,
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 75,
    title: 'Agile 敏捷開發與 Scrum 實踐',
    description: 'Sprint 規劃、Daily Stand-up、回顧會議與敏捷看板管理',
    meta: '5 小時 · 14 單元',
    provider: '學易點 官方',
    price: 'NT$1,490',
    level: '進階',
    category: '產品策略 (Product Strategy)',
    module: '進階',
    rating: 4.5,
    students: 1620,
    added: false,
    image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=640&h=320&fit=crop&auto=format&q=80'
  },
  /* ========== 產品策略 — 實戰 ========== */
  {
    id: 76,
    title: '實戰：從零到一打造 MVP',
    description: '驗證假說、快速原型、用戶測試與迭代上線的完整流程',
    meta: '10 小時 · 24 單元',
    provider: '學易點 官方',
    price: 'NT$4,290',
    level: '實戰',
    category: '產品策略 (Product Strategy)',
    module: '實戰',
    tags: ['MVP', 'Lean Startup', 'Prototype', 'Validation'],
    rating: 4.8,
    students: 1680,
    isHot: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 77,
    title: '實戰：SaaS 產品策略規劃',
    description: '定價模型、Onboarding 流程、Churn 分析與訂閱制營運策略',
    meta: '8 小時 · 20 單元',
    provider: '學易點 官方',
    price: 'NT$3,490',
    level: '實戰',
    category: '產品策略 (Product Strategy)',
    module: '實戰',
    tags: ['SaaS', 'Pricing', 'Retention', 'Subscription'],
    rating: 4.7,
    students: 1240,
    isNew: true,
    added: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=320&fit=crop&auto=format&q=80'
  },
  {
    id: 78,
    title: '實戰：產品路線圖與利害關係人溝通',
    description: '優先級排序框架、路線圖工具與跨部門簡報技巧',
    meta: '7 小時 · 18 單元',
    provider: '學易點 官方',
    price: 'NT$2,990',
    level: '實戰',
    category: '產品策略 (Product Strategy)',
    module: '實戰',
    tags: ['Roadmap', 'Stakeholder', 'Communication', 'Prioritization'],
    rating: 4.6,
    students: 1380,
    added: false,
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=640&h=320&fit=crop&auto=format&q=80'
  }
])

/* 判斷是否為搜尋模式 */
const isSearchMode = computed(() => searchKeyword.value.trim().length > 0)

/* 判斷是否進入路徑 */
const isPathMode = computed(() => selectedSubDomain.value !== null)

/* 取得學習路徑資料 */
const currentPath = computed(() => learningPaths[selectedSubDomain.value] || null)

/* 靠分類分組課程 */
const moduleGroups = computed(() => {
  if (!selectedSubDomain.value) return []
  const courses = allCourses.value.filter(c => c.category === selectedSubDomain.value)
  const groups = {}
  for (const c of courses) {
    const mod = c.module || '其他'
    if (!groups[mod]) groups[mod] = []
    groups[mod].push(c)
  }
  const order = ['基礎', '進階', '實戰']
  return order
    .filter(m => groups[m])
    .map(m => ({ name: m, courses: groups[m] }))
})

/* 解析 price 字串為數字 */
function parsePrice(str) {
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0
}

/* 篩選/過濾邏輯 */
const filteredCourses = computed(() => {
  const range = priceRanges.find(r => r.label === selectedPrice.value) || priceRanges[0]
  return allCourses.value.filter((course) => {
    const levelMatched =
      selectedLevel.value === '全部' || course.level === selectedLevel.value

    const domainMatched = selectedDomain.value === '全部' || course.category === selectedDomain.value

    const priceVal = parsePrice(course.price)
    const priceMatched = priceVal >= range.min && priceVal <= range.max

    const keyword = searchKeyword.value.trim().toLowerCase()
    const keywordMatched =
      keyword.length === 0 ||
      course.title.toLowerCase().includes(keyword) ||
      course.description.toLowerCase().includes(keyword)

    return levelMatched && domainMatched && priceMatched && keywordMatched
  })
})

const pageSize = 6

/* 診斷結果排序（匹配度優先） */
const sortedCourses = computed(() => {
  const list = [...filteredCourses.value]
  if (diagnosisResult.value && diagnosisResult.value.items) {
    const map = new Map(diagnosisResult.value.items.map(i => [i.courseId, i]))
    list.sort((a, b) => {
      const ma = map.get(a.id)
      const mb = map.get(b.id)
      const pa = ma ? ma.matchPercent : 0
      const pb = mb ? mb.matchPercent : 0
      if (ma && ma.isTop && !(mb && mb.isTop)) return -1
      if (mb && mb.isTop && !(ma && ma.isTop)) return 1
      return pb - pa
    })
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedCourses.value.length / pageSize)))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedCourses.value.slice(start, end)
})

function updateLevel(level) {
  selectedLevel.value = level
  currentPage.value = 1
}

function updatePrice(price) {
  selectedPrice.value = price
  currentPage.value = 1
}

function updateDomain(domain) {
  selectedDomain.value = domain
  currentPage.value = 1
  /* 同步選定子領域 */
  if (domain !== '全部') {
    selectedSubDomain.value = domain
  } else {
    selectedSubDomain.value = null
  }
}

function updatePage(page) {
  currentPage.value = page
}

function toggleCourse(courseId) {
  const course = allCourses.value.find(c => c.id === courseId)
  toggleCart(courseId, course ? { id: course.id, title: course.title, price: course.price } : undefined)
}

/* 實戰課程先修提醒 */
const prereqMap = {
  8: { label: '實戰：電商平台全端開發', prereqs: ['HTML/CSS 與網頁切版', 'JavaScript 核心語法與非同步', 'React 基礎與元件開發', 'React 狀態管理與系統架構'] },
  9: { label: '實戰：即時聊天應用 (Chat App)', prereqs: ['JavaScript 核心語法與非同步', 'React 基礎與元件開發', 'React 狀態管理與系統架構'] },
  10: { label: '實戰：專案管理工具 (Kanban)', prereqs: ['React 基礎與元件開發', 'TypeScript 全面入門與實戰', 'React 狀態管理與系統架構'] },
  17: { label: '實戰：App 重新設計專案', prereqs: ['UI/UX 設計基礎概論', 'Figma 介面設計入門', '互動原型與 Usability Testing'] },
  18: { label: '實戰：SaaS 儀表板設計', prereqs: ['UI/UX 設計基礎概論', 'Figma 介面設計入門', '設計系統建構與管理', '設計原則與色彩學'] },
  19: { label: '實戰：品牌官網與 Landing Page', prereqs: ['UI/UX 設計基礎概論', '設計原則與色彩學', 'Figma 介面設計入門'] },
  38: { label: '實戰：行動端電商 App 設計', prereqs: ['UI/UX 設計基礎概論', 'Figma 介面設計入門', '互動原型與 Usability Testing', '使用者研究方法論'] },
  39: { label: '實戰：Design Sprint 產品衝刺', prereqs: ['UI/UX 設計基礎概論', '使用者研究方法論', '設計思考與工作坊引導'] },
  40: { label: '實戰：醫療健康 App 設計', prereqs: ['UI/UX 設計基礎概論', 'Figma 介面設計入門', '無障礙設計 (Accessibility)', '互動原型與 Usability Testing'] },
  41: { label: '實戰：設計作品集與面試準備', prereqs: ['UI/UX 設計基礎概論', 'Figma 介面設計入門', '設計原則與色彩學'] },
  42: { label: '實戰：AI 驅動的 UX 設計', prereqs: ['UI/UX 設計基礎概論', 'Figma 介面設計入門', '使用者研究方法論', '互動原型與 Usability Testing'] },
  49: { label: '實戰：全端電商 API 開發', prereqs: ['Node.js 基礎與伺服器概念', 'SQL 資料庫設計與查詢', 'RESTful API 設計原則', '驗證與授權：JWT、OAuth 2.0'] },
  50: { label: '實戰：即時通知系統 (WebSocket)', prereqs: ['Node.js 基礎與伺服器概念', 'RESTful API 設計原則', 'NoSQL 資料庫：MongoDB 實戰'] },
  51: { label: '實戰：微服務架構入門', prereqs: ['Node.js 基礎與伺服器概念', 'Docker 容器化與部署流程', 'RESTful API 設計原則'] },
  58: { label: '實戰：電商用戶行為分析', prereqs: ['Python 程式設計入門', 'Pandas 資料處理與清洗', '統計學與資料視覺化'] },
  59: { label: '實戰：自然語言處理 (NLP)', prereqs: ['Python 程式設計入門', 'Pandas 資料處理與清洗', '機器學習基礎：Scikit-learn'] },
  60: { label: '實戰：資料儀表板與商業報表', prereqs: ['Python 程式設計入門', '統計學與資料視覺化', 'Pandas 資料處理與清洗'] },
  67: { label: '實戰：品牌全套視覺設計', prereqs: ['平面設計基礎與排版原理', 'Adobe Illustrator 入門', '品牌識別設計系統'] },
  68: { label: '實戰：社群行銷素材設計', prereqs: ['平面設計基礎與排版原理', 'Adobe Photoshop 影像處理', '字體設計與 Typography'] },
  69: { label: '實戰：書籍封面與雜誌編排', prereqs: ['平面設計基礎與排版原理', 'InDesign 排版與印刷實務', 'Adobe Photoshop 影像處理'] },
  76: { label: '實戰：從零到一打造 MVP', prereqs: ['產品經理入門：角色與工作流程', '市場研究與競品分析', '需求文件與 User Story 撰寫'] },
  77: { label: '實戰：SaaS 產品策略規劃', prereqs: ['產品經理入門：角色與工作流程', '數據驅動產品決策', '產品成長策略與 Growth Hacking'] },
  78: { label: '實戰：產品路線圖與利害關係人溝通', prereqs: ['產品經理入門：角色與工作流程', 'Agile 敏捷開發與 Scrum 實踐', '需求文件與 User Story 撰寫'] },
  26: { label: '實戰：社群媒體平台 (Instagram Clone)', prereqs: ['JavaScript 核心語法與非同步', 'Vue 基礎與元件開發', 'Vue 進階：Composition API 與 Pinia'] },
  27: { label: '實戰：線上學習平台 (E-Learning)', prereqs: ['Vue 基礎與元件開發', 'Tailwind CSS 實用開發', 'Vue 進階：Composition API 與 Pinia'] },
  28: { label: '實戰：部落格 CMS 系統', prereqs: ['React 基礎與元件開發', 'TypeScript 全面入門與實戰', 'Next.js 全端框架開發'] },
  29: { label: '實戰：餐廳訂位與點餐系統', prereqs: ['React 基礎與元件開發', 'Tailwind CSS 實用開發', 'React 狀態管理與系統架構'] },
  30: { label: '實戰：個人品牌作品集', prereqs: ['Vue 基礎與元件開發', 'Nuxt 3 全端框架開發', 'Tailwind CSS 實用開發'] }
}

const showPrereqModal = ref(false)
const prereqCourse = ref(null)
const prereqList = ref([])

function openPrereqModal(course) {
  prereqCourse.value = course
  const info = prereqMap[course.id]
  prereqList.value = info ? info.prereqs : []
  showPrereqModal.value = true
}

function confirmPrereqAdd() {
  if (prereqCourse.value) {
    const c = prereqCourse.value
    toggleCart(c.id, { id: c.id, title: c.title, price: c.price })
  }
  showPrereqModal.value = false
  prereqCourse.value = null
}

function cancelPrereq() {
  showPrereqModal.value = false
  prereqCourse.value = null
}

function backToHall() {
  selectedSubDomain.value = null
  selectedDomain.value = '全部'
  selectedLevel.value = '全部'
  selectedPrice.value = '全部'
  searchKeyword.value = ''
  currentPage.value = 1
}

/* 課程大廳分類資料 */
const hallCategories = [
  {
    icon: '🛠',
    title: '工程技術',
    en: 'Engineering',
    gradient: 'from-[#1B3A5C] to-[#2563EB]',
    lightBg: 'bg-[#EEF2F7]',
    accent: '#3672B5',
    description: '前端框架、後端伺服器與資料科學三大方向，共 39 堂課程。',
    paths: [
      { label: '前端開發', domain: '前端開發 (Front-end)', courses: 21, hours: 166, icon: 'fa-solid fa-code', color: '#3672B5', detail: 'HTML/CSS → JavaScript → React/Vue → TypeScript → 實戰專案' },
      { label: '後端開發', domain: '後端開發 (Back-end)', courses: 9, hours: 58, icon: 'fa-solid fa-server', color: '#1B3A5C', detail: 'Node.js → SQL/NoSQL → Docker → API → 微服務' },
      { label: '資料科學', domain: '資料科學 (Data Science)', courses: 9, hours: 60, icon: 'fa-solid fa-chart-line', color: '#2563EB', detail: 'Python → Pandas → 統計 → 機器學習 → 深度學習' }
    ]
  },
  {
    icon: '🎨',
    title: '設計創意',
    en: 'Design',
    gradient: 'from-[#7C3AED] to-[#EC4899]',
    lightBg: 'bg-[#F5F0FF]',
    accent: '#7C3AED',
    description: 'UI/UX、平面設計與產品策略三大領域，共 39 堂課程。',
    paths: [
      { label: 'UI/UX 設計', domain: 'UI/UX 設計', courses: 21, hours: 135, icon: 'fa-solid fa-pen-ruler', color: '#7C3AED', detail: 'UX 研究 → Figma → 設計系統 → 原型測試 → 實戰專案' },
      { label: '平面設計', domain: '平面設計 (Graphic Design)', courses: 9, hours: 59, icon: 'fa-solid fa-palette', color: '#EC4899', detail: '排版原理 → Illustrator/Photoshop → 品牌識別設計' },
      { label: '產品策略', domain: '產品策略 (Product Strategy)', courses: 9, hours: 55, icon: 'fa-solid fa-rocket', color: '#F59E0B', detail: 'PM 入門 → 市場研究 → Agile → Growth → MVP' }
    ]
  }
]

/* 有課程的領域 */
const availableDomains = computed(() => {
  const set = new Set()
  for (const c of allCourses.value) set.add(c.category)
  return set
})

function selectPath(domain) {
  selectedSubDomain.value = domain
  selectedDomain.value = domain
  currentPage.value = 1
}

function submitSearch(value) {
  searchKeyword.value = value
  currentPage.value = 1
}

/* 引導步驟（同步診斷） */
const diagnosisQuizOpened = ref(false)

watch([() => sortedCourses.value.length, () => isTourActive.value, () => currentStep.value], ([len, active, step]) => {
  if (active && step === 1 && len >= 2) {
    nextStep()
  }
})

function onDiagClick(e) {
  if (!isTourActive.value || currentStep.value !== 3) return
  const btn = e.target.closest('button')
  if (btn && btn.textContent.includes('開始診斷')) {
    diagnosisQuizOpened.value = true
    setTimeout(() => { nextStep() }, 600)
  }
}

function onDiagOpen() {
  diagnosisQuizOpened.value = true
  if (isTourActive.value && currentStep.value === 3) {
    nextStep()
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] pt-20 text-[#111111]">
    <!-- 引導步驟遮罩 -->
    <div v-if="isTourActive" class="fixed inset-0 z-40 bg-black/30 pointer-events-none"></div>

    <div :class="['relative', isTourActive && currentStep === 1 ? 'z-[45]' : '']">
      <Header :keyword="searchKeyword" @search="submitSearch" />
    </div>

    <!-- Step 1 引導：搜尋框提示 -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isTourActive && currentStep === 1 && !isSearchMode"
        class="fixed left-1/2 top-[72px] z-50 w-[400px] -translate-x-1/2">
        <div class="relative rounded-xl bg-[#0F172A] px-5 py-4 text-white shadow-2xl">
          <div class="absolute -top-2 left-1/2 -translate-x-1/2 border-[8px] border-transparent border-b-[#0F172A]">
          </div>
          <div class="mb-1 flex items-center gap-2">
            <span
              class="flex size-5 items-center justify-center rounded-full bg-[#3672B5] text-[10px] font-bold">1</span>
            <span class="text-[13px] font-semibold text-white/60">Step 1 / 4</span>
          </div>
          <p class="text-[14px] leading-relaxed">在上方搜尋列輸入課程相關的關鍵字，例如 <span class="font-bold text-[#60A5FA]">實戰課程</span>
            或 <span class="font-bold text-[#60A5FA]">css</span>，然後按下 Enter 送出</p>
          <div class="mt-3 flex items-center justify-end gap-2">
            <button @click="endTour"
              class="rounded-lg px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:bg-white/10 hover:text-white/80">跳過引導</button>
          </div>
        </div>
      </div>
    </Transition>

    <FilterSidebar :levels="levels" :selected-level="selectedLevel" :domain-groups="domainGroups"
      :selected-domain="selectedDomain" :show-level-filter="isSearchMode" :available-domains="availableDomains"
      :price-ranges="priceRanges" :selected-price="selectedPrice" :show-price-filter="isSearchMode"
      @update:selected-level="updateLevel" @update:selected-domain="updateDomain"
      @update:selected-price="updatePrice" />

    <main
      :class="['ml-[260px] transition-all duration-700 ease-out', ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']">
      <section class="w-full rounded-xl bg-[#F8F9FA] px-4 py-5 md:px-8 lg:px-12">
        <div class="mx-auto w-full max-w-[1000px] space-y-5">

          <!-- =============== 搜尋模式 =============== -->
          <template v-if="isSearchMode">
            <SearchHero :keyword="searchKeyword" :total-count="sortedCourses.length" @back="backToHall" />

            <!-- 智慧診斷區塊 / 引導 -->
            <div :class="['relative', isTourActive && (currentStep === 2 || currentStep === 3) ? 'z-[45]' : '']"
              @click.capture="onDiagClick">
              <SearchDiagnosis v-if="sortedCourses.length >= 2" :keyword="searchKeyword" :courses="filteredCourses"
                @result="onDiagnosisResult" />

              <!-- Step 2 引導：診斷區塊說明 -->
              <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="isTourActive && currentStep === 2"
                  class="absolute -top-2 left-1/2 z-50 w-[380px] -translate-x-1/2 -translate-y-full">
                  <div class="relative rounded-xl bg-[#0F172A] px-5 py-4 text-white shadow-2xl">
                    <div class="mb-1 flex items-center gap-2">
                      <span
                        class="flex size-5 items-center justify-center rounded-full bg-[#3672B5] text-[10px] font-bold">2</span>
                      <span class="text-[13px] font-semibold text-white/60">Step 2 / 4</span>
                    </div>
                    <p class="text-[14px] leading-relaxed">這個區塊會自動出現<span
                        class="font-bold text-[#60A5FA]">學習診斷</span>工具，幫你分析搜尋結果中的課程，有多少符合你的需求</p>
                    <div class="mt-3 flex items-center justify-end gap-2">
                      <button @click="endTour"
                        class="rounded-lg px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:bg-white/10 hover:text-white/80">跳過引導</button>
                      <button @click="nextStep"
                        class="rounded-lg bg-[#3672B5] px-4 py-1.5 text-[12px] font-semibold transition-colors hover:bg-[#2d5f97]">下一步引導</button>
                    </div>
                    <div
                      class="absolute -bottom-2 left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-[#0F172A]">
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Step 3 引導：智慧診斷按鈕 -->
              <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="isTourActive && currentStep === 3"
                  class="absolute -bottom-2 right-8 z-50 w-[340px] translate-y-full">
                  <div class="relative rounded-xl bg-[#0F172A] px-5 py-4 text-white shadow-2xl">
                    <div class="absolute -top-2 right-12 border-[8px] border-transparent border-b-[#0F172A]"></div>
                    <div class="mb-1 flex items-center gap-2">
                      <span
                        class="flex size-5 items-center justify-center rounded-full bg-[#3672B5] text-[10px] font-bold">3</span>
                      <span class="text-[13px] font-semibold text-white/60">Step 3 / 4</span>
                    </div>
                    <p class="text-[14px] leading-relaxed">現在點擊<span
                        class="font-bold text-[#60A5FA]">智慧診斷</span>按鈕，開始你的個人化學習之旅！</p>
                    <div class="mt-3 flex items-center justify-end gap-2">
                      <button @click="endTour"
                        class="rounded-lg px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:bg-white/10 hover:text-white/80">跳過引導</button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <EmptyState v-if="!searchLoading && paginatedCourses.length === 0" />

            <!-- Search loading animation -->
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <div v-if="searchLoading" class="flex flex-col items-center justify-center gap-4 py-16">
                <div class="relative size-12">
                  <div class="absolute inset-0 rounded-full border-[3px] border-[#E5E7EB]"></div>
                  <div class="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#3672B5]"></div>
                </div>
                <div class="text-center">
                  <p class="text-sm font-semibold text-[#333]">搜尋中</p>
                  <p class="mt-1 text-xs text-[#999]">正在為你篩選最合適的課程...</p>
                </div>
              </div>
            </Transition>

            <template v-if="!searchLoading">
              <CourseList v-if="paginatedCourses.length > 0" :courses="paginatedCourses" :match-results="diagnosisResult" @toggle="toggleCourse"
                @prereq="openPrereqModal" />
              <Pagination :current-page="currentPage" :total-pages="totalPages" @update:current-page="updatePage" />
            </template>
          </template>

          <!-- =============== 學習路徑模式（選定領域） =============== -->
          <template v-else-if="isPathMode && currentPath">
            <!-- Back -->
            <button type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-[13px] py-[6px] text-xs font-medium text-[#666] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F9FA] hover:shadow-sm active:translate-y-0"
              @click="backToHall">
              <i class="fa-solid fa-chevron-left text-[14px]"></i>
              返回課程大廳
            </button>

            <!-- Breadcrumb -->
            <nav class="flex items-center gap-1.5 text-sm text-[#999]">
              <span v-for="(crumb, i) in currentPath.breadcrumb" :key="i" class="flex items-center gap-1.5">
                <span :class="i === currentPath.breadcrumb.length - 1 ? 'font-bold text-[#111]' : ''">{{ crumb }}</span>
                <span v-if="i < currentPath.breadcrumb.length - 1" class="text-[#CCC]">›</span>
              </span>
            </nav>

            <!-- Path Hero -->
            <div class="space-y-5">
              <h1 class="whitespace-pre-line text-[32px] font-black leading-[42px] tracking-[-0.64px] text-[#111]">{{
                currentPath.title }}</h1>
              <p class="max-w-[600px] text-sm leading-[21px] text-[#555]">{{ currentPath.description }}</p>
              <div class="flex items-center gap-6">
                <span v-for="stat in currentPath.stats" :key="stat.label"
                  class="flex items-center gap-1.5 text-sm text-[#555]">
                  <span>{{ stat.icon }}</span>
                  <span>{{ stat.label }}</span>
                </span>
              </div>
            </div>

            <!-- Bundle pricing card -->
            <div class="rounded-xl border border-[#E4E6EA] bg-white p-7">
              <p class="text-xs font-medium text-[#888]">完整學習路徑</p>
              <div class="mt-2 flex items-baseline gap-2">
                <span class="text-[40px] font-black leading-[1] tracking-[-1px] text-[#111]">{{ currentPath.bundlePrice
                }}</span>
              </div>
              <p class="mt-1 text-xs text-[#999]">含 {{ currentPath.bundleCount }} 堂 · {{ currentPath.bundleSave }}
              </p>
              <button
                class="mt-5 w-full max-w-[280px] rounded-lg bg-[#1B3A5C] py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#17314d] hover:shadow-lg active:translate-y-0">
                開始完整旅程 →
              </button>
              <p class="mt-2 text-xs text-[#999]">支持分期付款與退費保障</p>
            </div>

            <!-- 學習路線介紹 -->
            <div v-if="currentPath.roadmap" class="rounded-2xl border border-[#E4E6EA] bg-white p-7">
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-[#111]">學習路線介紹</h2>
                  <p class="mt-1 text-sm text-[#777]">跟著系統化的階段規劃，循序漸進達成學習目標</p>
                </div>
                <span class="rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-[#3672B5]">
                  共 {{ currentPath.roadmap.length }} 個階段
                </span>
              </div>

              <div class="relative">
                <!-- 連接線 -->
                <div class="absolute left-[19px] top-5 bottom-5 w-0.5 rounded-full bg-gradient-to-b from-[#E4E6EA] to-[#E4E6EA]/30"></div>

                <div v-for="(step, idx) in currentPath.roadmap" :key="idx" class="relative flex gap-5 pb-7 last:pb-0">
                  <!-- 節點圖示 -->
                  <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                    :style="{ backgroundColor: step.color }">
                    <i :class="step.icon" class="text-sm"></i>
                  </div>
                  <!-- 內容 -->
                  <div class="flex-1 rounded-xl border border-[#E4E6EA] bg-[#FAFBFC] p-5 transition-all duration-200 hover:border-transparent hover:shadow-md"
                    :style="{ '--hover-border': step.color + '50' }">
                    <div class="flex items-center gap-2.5">
                      <span class="rounded-md px-2 py-0.5 text-[11px] font-semibold text-white"
                        :style="{ backgroundColor: step.color }">{{ step.stage }}</span>
                      <h3 class="text-[15px] font-bold text-[#111]">{{ step.title }}</h3>
                    </div>
                    <p class="mt-2 text-[13px] leading-[21px] text-[#666]">{{ step.desc }}</p>
                    <div class="mt-3 flex flex-wrap gap-1.5">
                      <span v-for="skill in step.skills" :key="skill"
                        class="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                        :style="{ color: step.color, borderColor: step.color + '30', backgroundColor: step.color + '08' }">
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Module groups -->
            <div v-for="group in moduleGroups" :key="group.name" class="space-y-4">
              <div class="flex items-center gap-3">
                <h2 class="text-lg font-bold text-[#111]">{{ group.name }}課程</h2>
                <span class="rounded-md bg-[#EEF2F7] px-2 py-0.5 text-xs font-medium text-[#3672B5]">{{
                  group.courses.length }} 堂</span>
              </div>
              <CourseList :courses="group.courses" @toggle="toggleCourse" @prereq="openPrereqModal" />
            </div>
          </template>

          <!-- =============== 課程大廳（預設首頁） =============== -->
          <template v-else>
            <!-- Hall hero -->
            <section class="relative overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white px-8 py-10">
              <div class="space-y-3">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-medium text-[#3672B5]">
                  <i class="fa-solid fa-compass text-[10px]"></i>
                  課程大廳
                </span>
                <h1 class="text-[28px] font-black leading-[38px] tracking-[-0.56px] text-[#111]">找到你的學習路徑</h1>
                <p class="max-w-[480px] text-sm leading-[22px] text-[#777]">
                  系統化路徑分類，從基礎到實戰循序漸進，找到最適合自己的學習旅程。
                </p>
              </div>
              <!-- Stats row -->
              <div class="mt-6 flex items-center gap-8">
                <div class="flex items-center gap-2">
                  <span class="flex size-8 items-center justify-center rounded-lg bg-[#EEF2F7] text-xs text-[#3672B5]"><i class="fa-solid fa-book"></i></span>
                  <div>
                    <p class="text-lg font-bold leading-none text-[#111]">78</p>
                    <p class="text-[11px] text-[#999]">堂課程</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="flex size-8 items-center justify-center rounded-lg bg-[#EEF2F7] text-xs text-[#3672B5]"><i class="fa-solid fa-clock"></i></span>
                  <div>
                    <p class="text-lg font-bold leading-none text-[#111]">533</p>
                    <p class="text-[11px] text-[#999]">小時內容</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="flex size-8 items-center justify-center rounded-lg bg-[#EEF2F7] text-xs text-[#3672B5]"><i class="fa-solid fa-road"></i></span>
                  <div>
                    <p class="text-lg font-bold leading-none text-[#111]">6</p>
                    <p class="text-[11px] text-[#999]">條學習路徑</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- 學習路徑說明 -->
            <section class="grid grid-cols-3 gap-4">
              <div class="flex items-start gap-3 rounded-xl border border-[#E4E6EA] bg-white p-5">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F7] text-sm text-[#3672B5]"><i class="fa-solid fa-layer-group"></i></span>
                <div>
                  <h3 class="text-[13px] font-bold text-[#111]">系統化路徑</h3>
                  <p class="mt-1 text-[12px] leading-[17px] text-[#888]">基礎→進階→實戰三階段循序漸進</p>
                </div>
              </div>
              <div class="flex items-start gap-3 rounded-xl border border-[#E4E6EA] bg-white p-5">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F7] text-sm text-[#3672B5]"><i class="fa-solid fa-certificate"></i></span>
                <div>
                  <h3 class="text-[13px] font-bold text-[#111]">官方認證</h3>
                  <p class="mt-1 text-[12px] leading-[17px] text-[#888]">完成路徑可獲得專業認證徽章</p>
                </div>
              </div>
              <div class="flex items-start gap-3 rounded-xl border border-[#E4E6EA] bg-white p-5">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F7] text-sm text-[#3672B5]"><i class="fa-solid fa-tags"></i></span>
                <div>
                  <h3 class="text-[13px] font-bold text-[#111]">組合優惠</h3>
                  <p class="mt-1 text-[12px] leading-[17px] text-[#888]">購買完整路徑享特別折扣</p>
                </div>
              </div>
            </section>

            <!-- Domain groups -->
            <div v-for="cat in hallCategories" :key="cat.title" class="space-y-5">
              <!-- Category header card -->
              <div class="flex items-center gap-4 rounded-xl border border-[#E4E6EA] bg-white px-6 py-4">
                <span class="flex size-10 items-center justify-center rounded-xl text-lg" :class="cat.lightBg">
                  {{ cat.icon }}
                </span>
                <div class="flex-1">
                  <div class="flex items-baseline gap-2">
                    <h2 class="text-lg font-bold text-[#111]">{{ cat.title }}</h2>
                    <span class="text-xs font-medium text-[#BBB]">{{ cat.en }}</span>
                  </div>
                  <p class="mt-0.5 text-xs text-[#888]">{{ cat.description }}</p>
                </div>
              </div>

              <!-- Path cards -->
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <button v-for="p in cat.paths" :key="p.label"
                  class="group relative flex flex-col rounded-xl border border-[#E4E6EA] bg-white text-left transition-all duration-200"
                  :class="p.courses > 0 ? 'hover:-translate-y-1 hover:shadow-lg hover:border-transparent cursor-pointer' : 'cursor-default'"
                  @click="p.courses > 0 && selectPath(p.domain)">
                  <!-- Color top bar -->
                  <div class="h-1 rounded-t-xl" :style="{ background: p.color }"></div>
                  <div class="flex flex-1 flex-col gap-4 p-5">
                    <!-- Icon + title -->
                    <div class="flex items-center gap-3">
                      <span class="flex size-10 items-center justify-center rounded-xl text-white" :style="{ background: p.color }">
                        <i :class="p.icon" class="text-[14px]"></i>
                      </span>
                      <h3 class="text-[15px] font-bold text-[#111]">{{ p.label }}</h3>
                    </div>
                    <!-- Detail -->
                    <p v-if="p.detail" class="text-xs leading-[18px] text-[#777]">{{ p.detail }}</p>
                    <!-- Stats chips -->
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center gap-1 rounded-md bg-[#F3F4F6] px-2 py-1 text-[11px] font-medium text-[#555]">
                        <i class="fa-solid fa-book-open text-[9px] text-[#999]"></i>
                        {{ p.courses }} 堂
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-md bg-[#F3F4F6] px-2 py-1 text-[11px] font-medium text-[#555]">
                        <i class="fa-regular fa-clock text-[9px] text-[#999]"></i>
                        {{ p.hours }} hr
                      </span>
                    </div>
                    <!-- CTA -->
                    <span class="mt-auto inline-flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2" :style="{ color: p.color }">
                      查看學習路徑
                      <i class="fa-solid fa-arrow-right text-[10px] transition-transform duration-200 group-hover:translate-x-0.5"></i>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </template>

        </div>
      </section>
    </main>

    <div class="ml-[260px]">
      <Footer />
    </div>
  </div>

  <!-- Step 4 引導：智慧診斷結果 -->
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isTourActive && currentStep === 4" class="fixed bottom-6 left-6 z-[60] w-[380px]">
        <div class="relative rounded-xl bg-[#0F172A] px-5 py-4 text-white shadow-2xl ring-1 ring-white/10">
          <div class="mb-1 flex items-center gap-2">
            <span
              class="flex size-5 items-center justify-center rounded-full bg-[#10B981] text-[10px] font-bold">4</span>
            <span class="text-[13px] font-semibold text-white/60">Step 4 / 4 — 最後一步</span>
          </div>
          <p class="text-[14px] leading-relaxed">智慧診斷會幫你從搜尋結果中挑出<span
              class="font-bold text-[#60A5FA]">最適合你的課程</span>，並提供系統化的學習建議和路徑規劃</p>
          <p class="mt-1.5 text-[12px] text-white/40">你隨時可以重新搜尋，系統會根據新的關鍵字重新分析</p>
          <div class="mt-3 flex items-center justify-end">
            <button @click="endTour"
              class="rounded-lg bg-[#10B981] px-4 py-1.5 text-[12px] font-semibold transition-colors hover:bg-[#059669]">知道了！開始探索</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 先修課程提醒 Modal -->
  <Teleport to="body">
    <div v-if="showPrereqModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="cancelPrereq">
      <div class="relative w-full max-w-[440px] rounded-2xl bg-white p-8 shadow-2xl">
        <!-- Close -->
        <button
          class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-[#999] transition-colors hover:bg-[#F3F4F6] hover:text-[#333]"
          @click="cancelPrereq">
          <i class="fa-solid fa-xmark text-[20px]"></i>
        </button>

        <!-- Icon -->
        <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#FFF3E0]">
          <span class="text-xl">⚠</span>
        </div>

        <h2 class="text-lg font-bold text-[#111]">先修課程提醒</h2>
        <p class="mt-2 text-sm leading-relaxed text-[#555]">
          <span class="font-semibold text-[#1B3A5C]">{{ prereqCourse?.title }}</span>
          是進階程度的實戰課程，建議你先完成以下課程，以獲得最佳學習效果
        </p>

        <!-- Prereq list -->
        <ul class="mt-4 space-y-2">
          <li v-for="(name, i) in prereqList" :key="i"
            class="flex items-center gap-3 rounded-lg bg-[#F8F9FA] px-4 py-3">
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3672B5]/10 text-xs font-bold text-[#3672B5]">{{
                i + 1 }}</span>
            <span class="text-sm text-[#333]">{{ name }}</span>
          </li>
        </ul>

        <!-- Actions -->
        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 rounded-lg border border-[#E4E6EA] bg-white py-2.5 text-sm font-semibold text-[#555] transition-colors hover:bg-[#F3F4F6]"
            @click="cancelPrereq">
            取消
          </button>
          <button
            class="flex-1 rounded-lg bg-[#1B3A5C] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#17314d]"
            @click="confirmPrereqAdd">
            知道了，仍然加入
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
