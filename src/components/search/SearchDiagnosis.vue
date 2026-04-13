<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  keyword: { type: String, default: '' },
  courses: { type: Array, default: () => [] }
})

const emit = defineEmits(['result'])

const quizType = computed(() => {
  const kw = props.keyword.toLowerCase().replace(/\s/g, '')
  if (kw.includes('實戰模組') || kw.includes('實戰')) return 'career'
  if (kw.includes('css')) return 'css'
  return null
})

const phase = ref('idle')
const currentStep = ref(0)
const answers = ref({})
const loadingProgress = ref(0)
const loadingText = ref('')
const resultRevealed = ref(false)

function startQuiz() {
  phase.value = 'quiz'
  currentStep.value = 0
  answers.value = {}
  resultRevealed.value = false
}

function closeQuiz() {
  phase.value = 'idle'
  currentStep.value = 0
  answers.value = {}
  emit('result', null)
}

const careerFields = [
  { value: 'frontend', label: '前端開發', icon: '💻', keywords: ['前端', 'front-end', 'html', 'css', 'javascript', 'react', 'vue'] },
  { value: 'backend', label: '後端開發', icon: '🖥️', keywords: ['後端', 'back-end', 'node', 'express', 'api'] },
  { value: 'fullstack', label: '全端開發', icon: '🔗', keywords: ['全端', '前端', '後端', 'react', 'vue', 'node', 'next', 'nuxt'] },
  { value: 'uiux', label: 'UI / UX 設計', icon: '🎨', keywords: ['ui', 'ux', '設計', 'figma', '原型', 'prototype'] },
  { value: 'product', label: '產品管理', icon: '📋', keywords: ['產品', 'product', '策略'] }
]

const careerTechOptions = {
  frontend: [
    { value: 'html-semantic', label: 'HTML 語意標籤與結構', keywords: ['html', '語意', '結構', 'seo'] },
    { value: 'css-layout', label: 'CSS 排版佈局（Flexbox / Grid）', keywords: ['css', '切版', '佈局', 'flexbox', 'grid', '排版'] },
    { value: 'css-animation', label: 'CSS 動畫與視覺特效', keywords: ['動畫', 'animation', 'transition', '視覺', 'gsap', 'motion'] },
    { value: 'css-framework', label: 'CSS 框架（Tailwind / Bootstrap）', keywords: ['tailwind', 'bootstrap', 'css', '響應式', 'rwd'] },
    { value: 'js-basic', label: 'JavaScript 核心語法與 ES6+', keywords: ['javascript', 'js', 'es6', '非同步', 'promise', 'async'] },
    { value: 'js-dom', label: 'DOM 操作與事件處理', keywords: ['dom', '事件', 'api', '互動', 'javascript'] },
    { value: 'vue', label: 'Vue 3 生態系（Composition API / Pinia）', keywords: ['vue', 'pinia', 'composition', '元件', '狀態'] },
    { value: 'react', label: 'React 生態系（Hooks / Redux）', keywords: ['react', 'hooks', 'redux', '元件', '狀態'] },
    { value: 'typescript', label: 'TypeScript 型別安全開發', keywords: ['typescript', 'ts', '型別', 'type'] },
    { value: 'fe-testing', label: '前端測試（Vitest / Cypress）', keywords: ['vitest', 'cypress', '測試', 'testing', 'jest'] },
    { value: 'fe-tooling', label: '建構工具與效能優化（Vite / Webpack）', keywords: ['vite', 'webpack', '效能', '打包', '優化', '部署'] }
  ],
  backend: [
    { value: 'node-basic', label: 'Node.js 基礎與模組系統', keywords: ['node', 'npm', '模組'] },
    { value: 'express', label: 'Express.js 路由與中間件', keywords: ['express', 'middleware', '路由', 'api'] },
    { value: 'db-relational', label: '關聯式資料庫（PostgreSQL / MySQL）', keywords: ['sql', 'postgresql', 'mysql', '資料庫'] },
    { value: 'db-nosql', label: 'NoSQL 資料庫（MongoDB / Firebase）', keywords: ['mongodb', 'firebase', 'supabase', 'nosql'] },
    { value: 'orm', label: 'ORM 工具（Prisma / Sequelize）', keywords: ['prisma', 'sequelize', 'orm'] },
    { value: 'api-design', label: 'RESTful API 設計與文件', keywords: ['api', 'rest', 'swagger', '文件'] },
    { value: 'auth', label: '身份驗證與授權（JWT / OAuth）', keywords: ['jwt', 'oauth', '登入', '驗證', '權限', '安全'] },
    { value: 'serverless', label: '雲端服務與 Serverless', keywords: ['aws', 'gcp', 'serverless', 'vercel', 'cloud'] }
  ],
  fullstack: [
    { value: 'html-css', label: 'HTML / CSS 切版基礎', keywords: ['html', 'css', '切版'] },
    { value: 'js-core', label: 'JavaScript 核心觀念', keywords: ['javascript', 'js', 'es6'] },
    { value: 'vue-fullstack', label: 'Vue 前端框架', keywords: ['vue', '元件', '狀態'] },
    { value: 'react-fullstack', label: 'React 前端框架', keywords: ['react', 'hooks', '元件'] },
    { value: 'backend-api', label: '後端 API 開發（Express / Fastify）', keywords: ['express', 'api', 'node', '後端'] },
    { value: 'fullstack-framework', label: '全端框架（Next.js / Nuxt）', keywords: ['next', 'nuxt', '全端', 'ssr'] },
    { value: 'db-integration', label: '資料庫整合與 ORM', keywords: ['mongodb', 'prisma', 'supabase', '資料庫'] },
    { value: 'deploy', label: '部署與 CI/CD 工作流', keywords: ['部署', 'vercel', 'netlify', 'ci/cd', 'docker'] }
  ],
  uiux: [
    { value: 'figma-basic', label: 'Figma 基礎操作與元件', keywords: ['figma', '設計'] },
    { value: 'figma-advanced', label: 'Figma 進階（Auto Layout / 變數）', keywords: ['figma', 'auto layout', '變數', 'variant'] },
    { value: 'ux-research', label: '使用者研究與訪談', keywords: ['使用者', 'user', '訪談', 'usability', '研究'] },
    { value: 'wireframe', label: '線框圖與資訊架構', keywords: ['wireframe', '線框', '資訊架構', 'ia'] },
    { value: 'prototype', label: '互動原型與 Micro-interaction', keywords: ['prototype', '原型', '互動', '微互動', 'motion'] },
    { value: 'design-system', label: '設計系統與 Design Token', keywords: ['design system', '設計系統', 'token', '組件庫'] },
    { value: 'ui-visual', label: '視覺設計與色彩理論', keywords: ['ui', '視覺', '色彩', '排版', '字體'] }
  ],
  product: [
    { value: 'strategy', label: '產品策略與市場分析', keywords: ['產品', '策略', '市場'] },
    { value: 'user-story', label: '使用者故事與需求文件', keywords: ['user story', '需求', 'prd'] },
    { value: 'analytics', label: '數據分析與 KPI 追蹤', keywords: ['數據', 'data', 'kpi', '分析'] },
    { value: 'agile', label: '敏捷開發與 Scrum 流程', keywords: ['agile', 'scrum', 'sprint', '迭代'] },
    { value: 'growth', label: '成長駭客與 A/B 測試', keywords: ['growth', 'a/b', '成長', '實驗'] }
  ]
}

const careerExpLevels = [
  { value: 'beginner', label: '完全新手，還沒寫過程式', icon: '🌱', weight: 0 },
  { value: 'student', label: '學過一點，做過簡單練習', icon: '📖', weight: 1 },
  { value: 'junior', label: '有基礎能力，想做完整專案', icon: '🚀', weight: 2 },
  { value: 'mid', label: '有工作經驗，想深化特定技術', icon: '⚡', weight: 3 }
]

const careerGoals = [
  { value: 'career-switch', label: '轉職進入科技業', keywords: ['基礎', '入門'] },
  { value: 'skill-up', label: '提升目前工作技能', keywords: ['進階', '效能', '架構'] },
  { value: 'side-project', label: '做出自己的 Side Project', keywords: ['實戰', '專案'] },
  { value: 'freelance', label: '接案 / 自由工作者', keywords: ['實戰', '品牌', '官網'] }
]

const careerScenarioQ = {
  question: '如果你有一週時間做 Side Project，你比較想做哪一類？',
  options: [
    { value: 'ui', label: '品牌形象網站或作品集，注重視覺與體驗', icon: '🎨', keywords: ['landing', '品牌', '官網', 'ui', '設計', '作品集', '視覺'] },
    { value: 'webapp', label: '一個有會員系統、資料庫的完整 Web App', icon: '🔐', keywords: ['電商', '聊天', '系統', '管理', '登入', 'kanban', '訂位', 'saas'] },
    { value: 'tool', label: '串接 API 的實用小工具（天氣、匯率、翻譯等）', icon: '🔌', keywords: ['api', '串接', 'cms', '部落格', '工具'] },
    { value: 'game', label: '互動遊戲或動態視覺化作品', icon: '🎮', keywords: ['遊戲', 'canvas', '動畫', 'animation', '互動', 'gsap'] }
  ]
}

const careerScenarioQ2 = {
  question: '你更重視作品的哪個面向？',
  options: [
    { value: 'visual', label: '視覺細膩，動畫流暢，讓人眼前一亮', icon: '✨', keywords: ['動畫', 'animation', 'gsap', 'motion', '視覺', 'landing', 'css'] },
    { value: 'functional', label: '功能完整，架構清晰，像真正上線的產品', icon: '🏗️', keywords: ['電商', '管理', 'cms', 'saas', '儀表板', '系統', '架構'] },
    { value: 'practical', label: '實用至上，能解決真實場景的需求', icon: '🛠️', keywords: ['訂位', '點餐', '學習', '社群', '聊天', '工具'] },
    { value: 'scalable', label: '可擴展，支援多人協作與團隊開發', icon: '📐', keywords: ['typescript', '測試', 'ci/cd', '架構', '設計系統', '效能'] }
  ]
}

const careerScenarioQ3 = {
  question: '當你學一門新技術時，你更傾向哪種學習方式？',
  options: [
    { value: 'follow', label: '跟著老師一步步做完整專案，邊做邊學', icon: '📺', keywords: ['實戰', '專案', '入門', '基礎'] },
    { value: 'concept', label: '先搞懂觀念原理，再自己動手實作', icon: '📚', keywords: ['觀念', '原理', '進階', '架構'] },
    { value: 'tinker', label: '直接看範例 Code、動手改，從錯誤中學習', icon: '🧪', keywords: ['實戰', '進階', '效能', '部署'] },
    { value: 'doc', label: '閱讀官方文件，搭配小範例反覆練習', icon: '📖', keywords: ['typescript', 'api', '文件', '基礎'] }
  ]
}

const careerScenarioQ4 = {
  question: '以下哪個真實場景的挑戰最吸引你去解決？',
  options: [
    { value: 'rwd', label: '一個在手機上跑版的電商頁面，需要重做響應式佈局', icon: '📱', keywords: ['css', '響應式', 'rwd', '切版', '佈局', 'tailwind', 'bootstrap'] },
    { value: 'perf', label: '一個載入很慢的 SPA，需要做效能優化與 Code Splitting', icon: '⚡', keywords: ['效能', '優化', 'vite', 'webpack', 'lazy', 'ssr', '部署'] },
    { value: 'collab', label: '一個多人協作的後台系統，需要規劃元件架構與狀態管理', icon: '🧩', keywords: ['元件', '狀態', 'pinia', 'redux', 'vue', 'react', '架構', '設計系統'] },
    { value: 'fullstack-challenge', label: '一個從零到部署的全端專案，前後端都要自己來', icon: '🚀', keywords: ['全端', 'next', 'nuxt', 'express', '部署', 'api', '資料庫', '實戰'] },
    { value: 'ux', label: '一個使用者反饋很差的 App，需要重新設計操作流程', icon: '🎯', keywords: ['ui', 'ux', '設計', 'figma', '使用者', '原型', '訪談'] }
  ]
}

const careerTimeQ = {
  question: '你每週大約能投入多少時間學習？',
  options: [
    { value: 'lt5', label: '不到 5 小時', icon: '🕐', weight: 1 },
    { value: '5to10', label: '5 – 10 小時', icon: '🕑', weight: 2 },
    { value: '10to20', label: '10 – 20 小時', icon: '🕒', weight: 3 },
    { value: 'gt20', label: '20 小時以上，全力衝刺', icon: '🔥', weight: 4 }
  ]
}

const currentTechOptions = computed(() => {
  const field = answers.value.field
  return careerTechOptions[field] || careerTechOptions['frontend']
})

const cssQuestions = [
  {
    question: '在 CSS 盒模型（Box Model）中，box-sizing: border-box 的效果是？',
    options: [
      { label: 'width 和 height 只包含 content', value: 'a' },
      { label: 'width 和 height 包含 content + padding + border', value: 'b' },
      { label: 'width 和 height 包含 margin', value: 'c' },
      { label: '讓元素變成 inline 元素', value: 'd' }
    ],
    answer: 'b',
    explanation: 'border-box 讓 width/height 包含 padding 和 border，更符合直覺的計算方式。'
  },
  {
    question: '使用 Flexbox 時，若要讓子元素在主軸上均勻分佈且兩端貼邊，應使用哪個屬性值？',
    options: [
      { label: 'justify-content: center', value: 'a' },
      { label: 'justify-content: space-between', value: 'b' },
      { label: 'align-items: stretch', value: 'c' },
      { label: 'flex-wrap: wrap', value: 'd' }
    ],
    answer: 'b',
    explanation: 'space-between 會讓第一個元素靠左、最後一個靠右，中間均勻分佈。'
  },
  {
    question: '下列哪個 CSS 選擇器的優先級（Specificity）最高？',
    options: [
      { label: '.card .title', value: 'a' },
      { label: '#main .title', value: 'b' },
      { label: 'div.card > h2', value: 'c' },
      { label: 'body .card .title', value: 'd' }
    ],
    answer: 'b',
    explanation: '#main 是 ID 選擇器（權重 100），遠高於 class 選擇器（權重 10）。'
  },
  {
    question: '要讓一個元素在不同螢幕寬度下顯示不同樣式，應該使用下列哪個技術？',
    options: [
      { label: 'CSS Variables', value: 'a' },
      { label: '@media query', value: 'b' },
      { label: '@keyframes', value: 'c' },
      { label: 'calc() 函式', value: 'd' }
    ],
    answer: 'b',
    explanation: '@media query 可根據視窗寬度等條件套用不同樣式，是 RWD 的核心技術。'
  },
  {
    question: '下列關於 CSS Grid 的敘述，哪一個是正確的？',
    options: [
      { label: 'Grid 只能做一維佈局', value: 'a' },
      { label: 'grid-template-columns 定義的是列高', value: 'b' },
      { label: 'Grid 支援二維（行與列）佈局', value: 'c' },
      { label: 'Grid 不支援 gap 屬性', value: 'd' }
    ],
    answer: 'c',
    explanation: 'CSS Grid 是二維佈局系統，可以同時控制行（row）和列（column）。'
  },
  {
    question: '以下哪個方法可以讓 position: absolute 的元素在父容器中垂直水平置中？',
    options: [
      { label: 'margin: auto 搭配 top/right/bottom/left: 0', value: 'a' },
      { label: 'text-align: center', value: 'b' },
      { label: 'float: center', value: 'c' },
      { label: 'vertical-align: middle', value: 'd' }
    ],
    answer: 'a',
    explanation: '搭配 inset: 0 + margin: auto，可讓絕對定位的元素完美置中。'
  },
  {
    question: '下列哪個屬性可以為元素的狀態變化添加平滑動畫效果？',
    options: [
      { label: 'animation-name', value: 'a' },
      { label: 'transition', value: 'b' },
      { label: 'transform', value: 'c' },
      { label: 'will-change', value: 'd' }
    ],
    answer: 'b',
    explanation: 'transition 用於在屬性值變化時添加過渡動畫，例如 hover 狀態的顏色變化。'
  },
  {
    question: '在 CSS 中，z-index 只在下列哪種情況下才會生效？',
    options: [
      { label: '元素使用了 display: block', value: 'a' },
      { label: '元素設定了 position 為 relative/absolute/fixed/sticky', value: 'b' },
      { label: '元素有設定 overflow: hidden', value: 'c' },
      { label: '元素是 flexbox 的子元素（永遠生效）', value: 'd' }
    ],
    answer: 'b',
    explanation: 'z-index 只對建立了「層疊上下文」的定位元素生效。'
  }
]

const careerSteps = computed(() => {
  if (quizType.value !== 'career') return []
  return [
    { id: 'field', title: '你想深耕的領域', subtitle: '選擇一個你最感興趣的方向' },
    { id: 'experience', title: '你目前的程度', subtitle: '讓我們了解你的起點' },
    { id: 'tech', title: '偏好使用的技術', subtitle: '可以複選，選出你感興趣或已熟悉的技術' },
    { id: 'goal', title: '你的學習目標', subtitle: '選擇最符合你現階段需求的方向' },
    { id: 'scenario1', title: '情境題 (1/4)', subtitle: '想像一下你的理想 Side Project' },
    { id: 'scenario2', title: '情境題 (2/4)', subtitle: '你更重視成品的哪個面向？' },
    { id: 'scenario3', title: '情境題 (3/4)', subtitle: '了解你偏好的學習模式' },
    { id: 'scenario4', title: '情境題 (4/4)', subtitle: '模擬真實開發情境' },
    { id: 'time', title: '學習時間評估', subtitle: '幫助我們推薦適合的課程長度' }
  ]
})

const totalSteps = computed(() => {
  if (quizType.value === 'career') return careerSteps.value.length
  if (quizType.value === 'css') return cssQuestions.length
  return 0
})

const canGoNext = computed(() => {
  if (quizType.value === 'career') {
    const step = careerSteps.value[currentStep.value]
    if (!step) return false
    if (step.id === 'field') return !!answers.value.field
    if (step.id === 'experience') return !!answers.value.experience
    if (step.id === 'tech') return answers.value.techs && answers.value.techs.length > 0
    if (step.id === 'goal') return !!answers.value.goal
    if (step.id === 'scenario1') return !!answers.value.scenario1
    if (step.id === 'scenario2') return !!answers.value.scenario2
    if (step.id === 'scenario3') return !!answers.value.scenario3
    if (step.id === 'scenario4') return !!answers.value.scenario4
    if (step.id === 'time') return !!answers.value.time
    return false
  }
  if (quizType.value === 'css') {
    return answers.value['css_' + currentStep.value] != null
  }
  return false
})

function selectField(val) {
  answers.value.field = val
  answers.value.techs = []
}

function toggleTech(val) {
  if (!answers.value.techs) answers.value.techs = []
  const idx = answers.value.techs.indexOf(val)
  if (idx >= 0) answers.value.techs.splice(idx, 1)
  else answers.value.techs.push(val)
}

function selectSingle(key, val) {
  answers.value[key] = val
}

function selectCssAnswer(val) {
  answers.value['css_' + currentStep.value] = val
}

function nextStep() {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  } else {
    showLoadingAndFinish()
  }
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

const loadingSteps = [
  '正在分析你的偏好…',
  '比對課程內容與技術關鍵字…',
  '計算各課程的符合度…',
  '產生個人化推薦結果…'
]

function showLoadingAndFinish() {
  phase.value = 'loading'
  loadingProgress.value = 0
  loadingText.value = loadingSteps[0]

  let step = 0
  const interval = setInterval(() => {
    step++
    if (step < loadingSteps.length) {
      loadingProgress.value = Math.round((step / loadingSteps.length) * 100)
      loadingText.value = loadingSteps[step]
    } else {
      clearInterval(interval)
      loadingProgress.value = 100
      loadingText.value = '分析完成！'

      setTimeout(() => {
        if (quizType.value === 'career') calculateCareerResult()
        else calculateCssResult()
        phase.value = 'result'
        resultRevealed.value = false
        nextTick(() => { resultRevealed.value = true })
      }, 400)
    }
  }, 600)
}

const diagnosisResult = ref(null)

function calculateCareerResult() {
  const userKeywords = []

  const fieldObj = careerFields.find(f => f.value === answers.value.field)
  if (fieldObj) userKeywords.push(...fieldObj.keywords)

  const techs = answers.value.techs || []
  const techPool = currentTechOptions.value
  for (const t of techs) {
    const found = techPool.find(o => o.value === t)
    if (found) userKeywords.push(...found.keywords)
  }

  const goalObj = careerGoals.find(g => g.value === answers.value.goal)
  if (goalObj) userKeywords.push(...goalObj.keywords)

  const s1 = careerScenarioQ.options.find(o => o.value === answers.value.scenario1)
  if (s1) userKeywords.push(...s1.keywords)
  const s2 = careerScenarioQ2.options.find(o => o.value === answers.value.scenario2)
  if (s2) userKeywords.push(...s2.keywords)
  const s3 = careerScenarioQ3.options.find(o => o.value === answers.value.scenario3)
  if (s3) userKeywords.push(...s3.keywords)
  const s4 = careerScenarioQ4.options.find(o => o.value === answers.value.scenario4)
  if (s4) userKeywords.push(...s4.keywords)

  const expObj = careerExpLevels.find(e => e.value === answers.value.experience)
  const expWeight = expObj ? expObj.weight : 1

  const scored = props.courses.map(course => {
    let score = 0
    const haystack = [
      course.title, course.description, course.category,
      course.framework, course.module, course.level,
      ...(course.tags || [])
    ].filter(Boolean).join(' ').toLowerCase()

    // Keyword matching — unique hit only counted once
    const matched = new Set()
    for (const kw of userKeywords) {
      if (haystack.includes(kw.toLowerCase()) && !matched.has(kw.toLowerCase())) {
        matched.add(kw.toLowerCase())
        score += 3
      }
    }

    // Experience level alignment
    if (expWeight <= 1 && course.level === '基礎') score += 5
    else if (expWeight <= 1 && course.level === '進階') score -= 2
    else if (expWeight === 2) {
      if (course.module === '實戰') score += 5
      else if (course.level === '進階') score += 3
    } else if (expWeight >= 3) {
      if (course.module === '實戰') score += 6
      else if (course.level === '進階') score += 4
      else if (course.level === '基礎') score -= 3
    }

    // Module bonus for 實戰 search context
    if (course.module === '實戰') score += 3

    // Framework match bonus (double weight for exact framework match)
    if (course.framework) {
      const fw = course.framework.toLowerCase()
      for (const kw of userKeywords) {
        if (fw.includes(kw.toLowerCase())) { score += 4; break }
      }
    }

    // Tags bonus
    if (course.tags && course.tags.length) {
      for (const tag of course.tags) {
        const tagLower = tag.toLowerCase()
        for (const kw of userKeywords) {
          if (tagLower.includes(kw.toLowerCase())) { score += 2; break }
        }
      }
    }

    return { courseId: course.id, score: Math.max(score, 0) }
  })

  const maxScore = Math.max(...scored.map(s => s.score), 1)

  const results = scored.map(s => {
    const raw = s.score / maxScore
    // Wider spread: top courses get 90-99, mid 40-70, low 5-25
    const matchPercent = Math.round(5 + raw * raw * 94)
    return { courseId: s.courseId, matchPercent: Math.min(99, Math.max(matchPercent, 5)), isTop: false }
  })

  results.sort((a, b) => b.matchPercent - a.matchPercent)
  if (results.length > 0) results[0].isTop = true

  diagnosisResult.value = { type: 'career', items: results }
  emit('result', diagnosisResult.value)
}

function calculateCssResult() {
  let correct = 0
  const details = []
  for (let i = 0; i < cssQuestions.length; i++) {
    const isCorrect = answers.value['css_' + i] === cssQuestions[i].answer
    if (isCorrect) correct++
    details.push({
      question: cssQuestions[i].question,
      userAnswer: answers.value['css_' + i],
      correctAnswer: cssQuestions[i].answer,
      isCorrect,
      explanation: cssQuestions[i].explanation
    })
  }

  let level, levelLabel, levelColor
  if (correct <= 2) { level = 'beginner'; levelLabel = '入門'; levelColor = 'text-[#E67E22]' }
  else if (correct <= 5) { level = 'intermediate'; levelLabel = '初階'; levelColor = 'text-[#3672B5]' }
  else { level = 'advanced'; levelLabel = '進階'; levelColor = 'text-[#1A5C3A]' }

  // Deterministic small variation based on course id
  function idVariation(id, range) {
    return ((id * 7 + 13) % range)
  }

  const scored = props.courses.map(course => {
    const haystack = [course.title, course.description, course.level, course.module, ...(course.tags || [])].filter(Boolean).join(' ').toLowerCase()
    const isCss = haystack.includes('css') || haystack.includes('切版') || haystack.includes('佈局') || haystack.includes('tailwind') || haystack.includes('bootstrap') || haystack.includes('動畫') || haystack.includes('響應式')
    let matchPercent = 40

    if (level === 'beginner') {
      if (isCss && course.level === '基礎') matchPercent = 92 + idVariation(course.id, 7)
      else if (course.level === '基礎') matchPercent = 50 + idVariation(course.id, 15)
      else if (course.level === '進階' && isCss) matchPercent = 30 + idVariation(course.id, 10)
      else matchPercent = 5 + idVariation(course.id, 10)
    } else if (level === 'intermediate') {
      if (isCss && course.level === '進階') matchPercent = 90 + idVariation(course.id, 8)
      else if (isCss && course.level === '基礎') matchPercent = 55 + idVariation(course.id, 10)
      else if (course.level === '進階') matchPercent = 45 + idVariation(course.id, 15)
      else if (course.module === '實戰' && isCss) matchPercent = 60 + idVariation(course.id, 10)
      else matchPercent = 8 + idVariation(course.id, 12)
    } else {
      if (isCss && (course.module === '實戰' || course.level === '進階')) matchPercent = 90 + idVariation(course.id, 8)
      else if (course.module === '實戰') matchPercent = 55 + idVariation(course.id, 15)
      else if (course.level === '進階') matchPercent = 40 + idVariation(course.id, 12)
      else matchPercent = 5 + idVariation(course.id, 10)
    }

    matchPercent = Math.min(99, matchPercent)
    return { courseId: course.id, matchPercent, isTop: false }
  })

  scored.sort((a, b) => b.matchPercent - a.matchPercent)
  if (scored.length > 0) scored[0].isTop = true

  diagnosisResult.value = {
    type: 'css', correct, total: cssQuestions.length,
    level, levelLabel, levelColor, details, items: scored
  }
  emit('result', diagnosisResult.value)
}

function retakeQuiz() {
  phase.value = 'idle'
  currentStep.value = 0
  answers.value = {}
  diagnosisResult.value = null
  resultRevealed.value = false
  emit('result', null)
}

watch(() => props.keyword, () => {
  phase.value = 'idle'
  currentStep.value = 0
  answers.value = {}
  diagnosisResult.value = null
  resultRevealed.value = false
  emit('result', null)
})

const showCssReview = ref(false)
</script>

<template>
  <!-- Idle -->
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0">
    <div v-if="phase === 'idle' && quizType" @click="startQuiz"
      class="relative cursor-pointer overflow-hidden rounded-2xl border border-dashed border-[#C5CAD3] bg-gradient-to-r from-[#EEF2F7] to-[#F8F9FA] px-7 py-6 transition-all duration-200 hover:border-[#1B3A5C]/40 hover:shadow-md">
      <div class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1B3A5C]/10">
            <span class="text-xl">🧭</span>
          </div>
          <div>
            <p class="text-[15px] font-bold text-[#111]">不確定哪門課最適合自己？</p>
            <p class="mt-0.5 text-[13px] text-[#666]">讓我們用小測驗幫你找到最適合的課程</p>
          </div>
        </div>
        <span
          class="shrink-0 rounded-lg bg-[#1B3A5C] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
          開始診斷
        </span>
      </div>
      <div class="absolute -right-4 -top-4 size-24 rounded-full bg-[#1B3A5C]/5"></div>
      <div class="absolute -bottom-6 -right-6 size-16 rounded-full bg-[#3672B5]/5"></div>
    </div>
  </Transition>

  <!-- Quiz Modal -->
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="phase === 'quiz' || phase === 'loading'"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="phase === 'quiz' ? closeQuiz() : null">
        <Transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0">
          <div
            class="relative flex max-h-[90vh] w-full max-w-[580px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            <!-- Loading overlay -->
            <div v-if="phase === 'loading'" class="flex flex-col items-center justify-center px-10 py-16">
              <div class="relative mb-8">
                <div class="size-20 rounded-full bg-[#EEF2F7] animate-pulse"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-3xl">🔍</span>
                </div>
                <div class="absolute -inset-2 animate-ping rounded-full border-2 border-[#1B3A5C]/20"
                  style="animation-duration: 1.5s;"></div>
              </div>
              <div class="mb-4 h-2 w-full max-w-[300px] overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-[#1B3A5C] to-[#3672B5] transition-all duration-500 ease-out"
                  :style="{ width: loadingProgress + '%' }"></div>
              </div>
              <p class="text-[14px] font-medium text-[#555] transition-all duration-300">{{ loadingText }}</p>
              <p class="mt-2 text-[12px] text-[#BBB]">{{ loadingProgress }}%</p>
            </div>

            <!-- Quiz content -->
            <template v-if="phase === 'quiz'">
              <div class="flex items-center justify-between border-b border-[#E5E7EB] px-7 py-5">
                <div>
                  <h2 class="text-[17px] font-bold text-[#111]">
                    {{ quizType === 'career' ? '🎯 課程診斷測驗' : '📝 CSS 能力檢測' }}
                  </h2>
                  <p class="mt-0.5 text-[12px] text-[#999]">步驟 {{ currentStep + 1 }} / {{ totalSteps }}</p>
                </div>
                <button @click="closeQuiz"
                  class="flex size-8 items-center justify-center rounded-full text-[#999] transition-colors hover:bg-[#F3F4F6] hover:text-[#333]">
                  <i class="fa-solid fa-xmark text-[18px]"></i>
                </button>
              </div>

              <div class="h-1 bg-[#E5E7EB]">
                <div class="h-full rounded-r bg-gradient-to-r from-[#1B3A5C] to-[#3672B5] transition-all duration-500"
                  :style="{ width: ((currentStep + 1) / totalSteps * 100) + '%' }"></div>
              </div>

              <div class="flex-1 overflow-y-auto px-7 py-6">
                <template v-if="quizType === 'career'">
                  <div v-if="careerSteps[currentStep]?.id === 'field'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerSteps[currentStep].subtitle }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="f in careerFields" :key="f.value" @click="selectField(f.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.field === f.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ f.icon }}</span>
                        {{ f.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'experience'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerSteps[currentStep].subtitle }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="e in careerExpLevels" :key="e.value" @click="selectSingle('experience', e.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.experience === e.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ e.icon }}</span>
                        {{ e.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'tech'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerSteps[currentStep].subtitle }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="t in currentTechOptions" :key="t.value" @click="toggleTech(t.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="(answers.techs || []).includes(t.value) ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span
                          class="flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors"
                          :class="(answers.techs || []).includes(t.value) ? 'border-[#1B3A5C] bg-[#1B3A5C]' : 'border-[#D1D5DB]'">
                          <i v-if="(answers.techs || []).includes(t.value)"
                            class="fa-solid fa-check text-[10px] text-white"></i>
                        </span>
                        {{ t.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'goal'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerSteps[currentStep].subtitle }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="g in careerGoals" :key="g.value" @click="selectSingle('goal', g.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.goal === g.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        {{ g.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'scenario1'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerScenarioQ.question }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="o in careerScenarioQ.options" :key="o.value"
                        @click="selectSingle('scenario1', o.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.scenario1 === o.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ o.icon }}</span>
                        {{ o.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'scenario2'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerScenarioQ2.question }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="o in careerScenarioQ2.options" :key="o.value"
                        @click="selectSingle('scenario2', o.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.scenario2 === o.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ o.icon }}</span>
                        {{ o.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'scenario3'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerScenarioQ3.question }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="o in careerScenarioQ3.options" :key="o.value"
                        @click="selectSingle('scenario3', o.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.scenario3 === o.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ o.icon }}</span>
                        {{ o.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'scenario4'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerScenarioQ4.question }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="o in careerScenarioQ4.options" :key="o.value"
                        @click="selectSingle('scenario4', o.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.scenario4 === o.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ o.icon }}</span>
                        {{ o.label }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="careerSteps[currentStep]?.id === 'time'">
                    <h3 class="text-[15px] font-bold text-[#111]">{{ careerSteps[currentStep].title }}</h3>
                    <p class="mt-1 text-[13px] text-[#888]">{{ careerTimeQ.question }}</p>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="o in careerTimeQ.options" :key="o.value" @click="selectSingle('time', o.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers.time === o.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span class="text-lg">{{ o.icon }}</span>
                        {{ o.label }}
                      </button>
                    </div>
                  </div>
                </template>

                <template v-else-if="quizType === 'css'">
                  <div>
                    <div class="mb-1 flex items-center gap-2">
                      <span class="rounded bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-bold text-[#1B3A5C]">第 {{
                        currentStep + 1 }} 題</span>
                      <span class="text-[11px] text-[#BBB]">（共 {{ cssQuestions.length }} 題）</span>
                    </div>
                    <h3 class="text-[15px] font-bold leading-relaxed text-[#111]">{{ cssQuestions[currentStep].question
                      }}</h3>
                    <div class="mt-5 flex flex-col gap-2">
                      <button v-for="o in cssQuestions[currentStep].options" :key="o.value"
                        @click="selectCssAnswer(o.value)"
                        class="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-[14px] font-medium transition-all duration-150"
                        :class="answers['css_' + currentStep] === o.value ? 'border-[#1B3A5C] bg-[#EEF2F7] text-[#1B3A5C] shadow-sm' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#C5CAD3] hover:bg-[#FAFBFC]'">
                        <span
                          class="flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors"
                          :class="answers['css_' + currentStep] === o.value ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white' : 'border-[#D1D5DB] text-[#999]'">
                          {{ o.value.toUpperCase() }}
                        </span>
                        {{ o.label }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>

              <div class="flex items-center justify-between border-t border-[#E5E7EB] px-7 py-4">
                <button v-if="currentStep > 0" @click="prevStep"
                  class="rounded-lg border border-[#E4E6EA] px-4 py-2 text-[13px] font-medium text-[#555] transition-colors hover:bg-[#F3F4F6]">
                  ← 上一題
                </button>
                <div v-else></div>
                <button @click="nextStep" :disabled="!canGoNext"
                  class="rounded-lg px-5 py-2 text-[13px] font-semibold text-white transition-all duration-200"
                  :class="canGoNext ? 'bg-[#1B3A5C] hover:-translate-y-0.5 hover:bg-[#17314d] hover:shadow-lg active:translate-y-0' : 'cursor-not-allowed bg-[#1B3A5C]/30'">
                  {{ currentStep < totalSteps - 1 ? '下一題 →' : '查看結果' }} </button>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>

  <!-- Result -->
  <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0">
    <div v-if="phase === 'result' && diagnosisResult"
      class="overflow-hidden rounded-2xl border border-[#D4EFDF] bg-gradient-to-r from-[#EAFAF1] to-[#F0FDF4]">
      <div class="px-7 py-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-xl bg-[#1A5C3A]/10">
              <span class="text-xl" :class="resultRevealed ? 'animate-bounce' : ''">🎉</span>
            </div>
            <div>
              <p class="text-[16px] font-bold text-[#1A5C3A]">診斷完成！</p>
              <p v-if="diagnosisResult.type === 'css'" class="mt-0.5 text-[13px] text-[#555]">
                你答對了
                <span class="font-bold text-[#1B3A5C]">{{ diagnosisResult.correct }}</span> /
                {{ diagnosisResult.total }} 題，CSS 程度為：
                <span class="font-bold" :class="diagnosisResult.levelColor">{{ diagnosisResult.levelLabel }}</span>
              </p>
              <p v-else class="mt-0.5 text-[13px] text-[#555]">已根據你的偏好為課程標註符合度，往下查看推薦結果</p>
            </div>
          </div>
          <button @click="retakeQuiz"
            class="shrink-0 rounded-lg border border-[#D4EFDF] bg-white px-4 py-2 text-[12px] font-medium text-[#1A5C3A] transition-colors hover:bg-[#EAFAF1]">
            重新測驗
          </button>
        </div>
      </div>

      <div v-if="diagnosisResult.type === 'css'" class="border-t border-[#D4EFDF]/60 px-7 pb-6">
        <button @click="showCssReview = !showCssReview"
          class="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-[#1A5C3A] transition-colors hover:text-[#155D33]">
          <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"
            :class="showCssReview ? 'rotate-180' : ''"></i>
          {{ showCssReview ? '收起答題詳情' : '查看答題詳情' }}
        </button>
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0"
          enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-if="showCssReview" class="mt-3 space-y-3">
            <div v-for="(d, i) in diagnosisResult.details" :key="i" class="rounded-xl border px-4 py-3"
              :class="d.isCorrect ? 'border-[#BBF7D0] bg-[#F0FDF4]' : 'border-[#FECACA] bg-[#FEF2F2]'">
              <div class="flex items-start gap-2">
                <span class="mt-0.5 text-[13px]">{{ d.isCorrect ? '✅' : '❌' }}</span>
                <div class="flex-1">
                  <p class="text-[12px] font-medium text-[#333]">{{ i + 1 }}. {{ d.question }}</p>
                  <p v-if="!d.isCorrect" class="mt-1 text-[11px] text-[#888]">
                    正確答案：<span class="font-bold text-[#1A5C3A]">{{ d.correctAnswer.toUpperCase() }}</span>
                  </p>
                  <p class="mt-1 text-[11px] text-[#666]">💡 {{ d.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="border-t border-[#D4EFDF]/60 bg-white/60 px-7 py-4">
        <p class="text-[12px] font-bold text-[#1A5C3A]">🏆 最推薦的課程已在下方卡片上標註「最推薦」角標</p>
      </div>
    </div>
  </Transition>
</template>
