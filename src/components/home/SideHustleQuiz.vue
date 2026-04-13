<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart'

const router = useRouter()

const emit = defineEmits(['close'])
const { addToCart, isInCart, cartCount } = useCart()

/* ══ State ══ */
const showLeaveModal = ref(false)
const currentView = ref('quiz')
const currentQuestion = ref(0)
const answers = ref({})
const selectedPath = ref(0)
const slideDir = ref('slide-next')
const barsAnimated = ref(false)
const bundleAdded = ref(false)

/* ══ Stepper ══ */
const allSteps = [
  { label: '背景' }, { label: '技能' }, { label: '性向' },
  { label: '分析' }, { label: '推薦' }
]

const stages = [
  { label: '背景', key: 'background' },
  { label: '技能', key: 'skill' },
  { label: '性向', key: 'aptitude' }
]

/* ══ Questions ══ */
const questions = [
  {
    stage: 0, stageLabel: '背景調查', type: 'grid',
    title: '你目前從事或最接近哪個職業領域？',
    subtitle: '選擇最接近的選項即可，這將幫助我們理解你的起點。',
    tag: '基本資料',
    options: [
      { value: 'tech', label: '科技業', en: 'Technology' },
      { value: 'finance', label: '金融業', en: 'Finance' },
      { value: 'marketing', label: '行銷廣告', en: 'Marketing' },
      { value: 'education', label: '教育業', en: 'Education' },
      { value: 'design', label: '設計創意', en: 'Design' },
      { value: 'medical', label: '醫療業', en: 'Healthcare' },
      { value: 'student', label: '學生', en: 'Student' },
      { value: 'other', label: '其他領域', en: 'Other' }
    ]
  },
  {
    stage: 0, stageLabel: '背景調查', type: 'pill',
    title: '你有多少年的工作經驗？',
    subtitle: '含實習與 Part-time 皆可。',
    tag: '基本資料',
    options: [
      { value: '0', label: '尚未就業' },
      { value: '0-1', label: '不到 1 年' },
      { value: '1-3', label: '1 ~ 3 年' },
      { value: '3-5', label: '3 ~ 5 年' },
      { value: '5-10', label: '5 ~ 10 年' },
      { value: '10+', label: '10 年以上' }
    ]
  },
  {
    stage: 0, stageLabel: '背景調查', type: 'list',
    title: '你目前面臨的最大職涯困擾是？',
    subtitle: '選擇最有共鳴的一個描述。',
    tag: '職涯洞察',
    options: [
      { value: 'stuck', label: '感覺職涯停滯不前', desc: '已經很久沒有成長的感覺，每天都在重複' },
      { value: 'income', label: '想增加額外收入來源', desc: '薪水成長有限，想靠副業提升收入' },
      { value: 'passion', label: '想做真正有熱情的事', desc: '目前的工作不是真正想做的，缺少動力' },
      { value: 'pivot', label: '正在考慮轉換跑道', desc: '想轉到不同領域，但不確定方向' },
      { value: 'skill', label: '想培養新的專業技能', desc: '希望學習新技能，為未來做準備' }
    ]
  },
  {
    stage: 1, stageLabel: '技能盤點', type: 'multi', maxSelect: 3,
    title: '以下哪些是你覺得自己「做起來特別順手」的能力？',
    subtitle: '不需要是專家等級，選擇你相對擅長的即可。最多選 3 項。',
    tag: '能力盤點',
    options: [
      { value: 'writing', label: '文案撰寫' }, { value: 'visual', label: '視覺美感' },
      { value: 'data', label: '數據分析' }, { value: 'coding', label: '程式撰寫' },
      { value: 'communication', label: '溝通表達' }, { value: 'project-mgmt', label: '專案管理' },
      { value: 'research', label: '市場調查' }, { value: 'video', label: '影片製作' },
      { value: 'teaching', label: '教學分享' }, { value: 'sales', label: '銷售談判' },
      { value: 'problem-solving', label: '問題解決' }, { value: 'creativity', label: '創意發想' }
    ]
  },
  {
    stage: 1, stageLabel: '技能盤點', type: 'direction',
    title: '如果可以選一個方向深耕，你最想投入？',
    subtitle: '純粹以興趣為主，先別考慮現實因素。',
    tag: '興趣方向',
    options: [
      { value: 'code', label: '程式與技術', icon: '💻', desc: '寫程式、架網站、自動化工具' },
      { value: 'design', label: '設計與創作', icon: '🎨', desc: '平面設計、UI/UX、插畫動畫' },
      { value: 'content', label: '內容創作', icon: '✍️', desc: '寫文章、拍影片、Podcast' },
      { value: 'business', label: '商業與行銷', icon: '📊', desc: '行銷策略、品牌經營、數據' },
      { value: 'teaching', label: '教育與諮詢', icon: '🧑‍🏫', desc: '線上教學、職涯顧問、培訓' }
    ]
  },
  {
    stage: 2, stageLabel: '性向測驗', type: 'scale',
    title: '我喜歡把事情規劃得井然有序，勝過隨性發揮。',
    subtitle: '沒有對錯，選擇最接近你真實感受的答案即可。',
    tag: '人格特質',
    options: [
      { value: 'strongly-agree', label: '非常同意', en: 'Strongly Agree', dots: 4 },
      { value: 'slightly-agree', label: '稍微同意', en: 'Slightly Agree', dots: 3 },
      { value: 'slightly-disagree', label: '不太同意', en: 'Slightly Disagree', dots: 2 },
      { value: 'strongly-disagree', label: '完全不同意', en: 'Strongly Disagree', dots: 1 }
    ]
  },
  {
    stage: 2, stageLabel: '性向測驗', type: 'scale',
    title: '面對新技術時，我傾向先動手試做，而非先把文件看完。',
    subtitle: '沒有對錯，選擇最接近你真實感受的答案即可。',
    tag: '情境題',
    options: [
      { value: 'strongly-agree', label: '非常同意', en: 'Strongly Agree', dots: 4 },
      { value: 'slightly-agree', label: '稍微同意', en: 'Slightly Agree', dots: 3 },
      { value: 'slightly-disagree', label: '不太同意', en: 'Slightly Disagree', dots: 2 },
      { value: 'strongly-disagree', label: '完全不同意', en: 'Strongly Disagree', dots: 1 }
    ]
  },
  {
    stage: 2, stageLabel: '性向測驗', type: 'list',
    title: '假設你有一個週末可以做 Side Project，你會選哪種？',
    subtitle: '純粹想像，選一個最讓你興奮的方向。',
    tag: '情境題',
    options: [
      { value: 'portfolio', label: '做一個個人作品集網站', desc: '把自己的經歷用最好看的方式展現出來' },
      { value: 'tool', label: '寫一個解決日常問題的小工具', desc: '例如自動記帳、行事曆整合機器人' },
      { value: 'course', label: '整理一套教學內容並上架', desc: '把自己擅長的知識變成課程或文章' },
      { value: 'startup', label: '驗證一個小型創業 idea', desc: '快速架一個 Landing Page 測試市場反應' }
    ]
  }
]

const totalQuestions = questions.length

/* ══ Career Paths (dynamically computed from quiz answers) ══ */
const skillLabelMap = {
  writing: '文案撰寫', visual: '視覺美感', data: '數據分析', coding: '程式撰寫',
  communication: '溝通表達', 'project-mgmt': '專案管理', research: '市場調查',
  video: '影片製作', teaching: '教學分享', sales: '銷售談判',
  'problem-solving': '問題解決', creativity: '創意發想'
}
const concernMap = {
  stuck: '突破職涯瓶頸', income: '開拓多元收入來源', passion: '找到真正的熱情所在',
  pivot: '順利轉換跑道', skill: '建立新的專業技能'
}

const careerPaths = computed(() => {
  const field = answers.value[0]
  const concern = answers.value[2]
  const skills = answers.value[3] || []
  const direction = answers.value[4]
  const planScale = answers.value[5]
  const handsOnScale = answers.value[6]
  const sideProject = answers.value[7]

  const skillLabels = skills.map(s => skillLabelMap[s] || s)
  const skillStr = skillLabels.join('、') || '多元能力'
  const concernText = concernMap[concern] || '持續精進職涯發展'

  /* ── UI/UX match score ── */
  let uiux = 52
  if (field === 'design') uiux += 12
  else if (['marketing', 'education'].includes(field)) uiux += 6
  else if (field === 'student') uiux += 4
  if (skills.includes('visual')) uiux += 10
  if (skills.includes('creativity')) uiux += 8
  if (skills.includes('communication')) uiux += 4
  if (skills.includes('writing')) uiux += 4
  if (skills.includes('research')) uiux += 4
  if (direction === 'design') uiux += 14
  else if (direction === 'content') uiux += 5
  if (['strongly-agree', 'slightly-agree'].includes(planScale)) uiux += 3
  if (sideProject === 'portfolio') uiux += 6
  else if (sideProject === 'startup') uiux += 3
  uiux = Math.min(98, Math.max(55, uiux))

  /* ── Frontend match score ── */
  let fe = 52
  if (field === 'tech') fe += 12
  else if (field === 'student') fe += 5
  if (skills.includes('coding')) fe += 12
  if (skills.includes('problem-solving')) fe += 8
  if (skills.includes('data')) fe += 5
  if (skills.includes('visual')) fe += 3
  if (direction === 'code') fe += 14
  else if (direction === 'design') fe += 5
  if (['strongly-agree', 'slightly-agree'].includes(handsOnScale)) fe += 5
  if (sideProject === 'tool') fe += 6
  else if (sideProject === 'portfolio') fe += 4
  fe = Math.min(98, Math.max(55, fe))

  /* ── Dynamic skill scores ── */
  const uiuxCreativity = Math.min(97, 60 + (skills.includes('visual') ? 14 : 0) + (skills.includes('creativity') ? 14 : 0) + (direction === 'design' ? 8 : 0))
  const uiuxEmpathy = Math.min(95, 58 + (skills.includes('communication') ? 12 : 0) + (skills.includes('research') ? 12 : 0) + (skills.includes('writing') ? 8 : 0))
  const uiuxVisual = Math.min(98, 56 + (skills.includes('visual') ? 18 : 0) + (skills.includes('creativity') ? 10 : 0) + (direction === 'design' ? 10 : 0))
  const uiuxComm = Math.min(95, 58 + (skills.includes('communication') ? 16 : 0) + (skills.includes('teaching') ? 10 : 0) + (skills.includes('writing') ? 8 : 0))

  const feLogic = Math.min(98, 58 + (skills.includes('coding') ? 16 : 0) + (skills.includes('problem-solving') ? 12 : 0) + (skills.includes('data') ? 8 : 0))
  const feProbSolve = Math.min(95, 56 + (skills.includes('problem-solving') ? 16 : 0) + (skills.includes('coding') ? 10 : 0) + (skills.includes('data') ? 8 : 0))
  const feTechLearn = Math.min(97, 58 + (skills.includes('coding') ? 12 : 0) + (direction === 'code' ? 12 : 0) + (['strongly-agree', 'slightly-agree'].includes(handsOnScale) ? 8 : 0))
  const feVisImpl = Math.min(95, 54 + (skills.includes('visual') ? 16 : 0) + (skills.includes('creativity') ? 8 : 0) + (skills.includes('coding') ? 10 : 0))

  /* ── Dynamic personality (UI/UX) ── */
  let uiuxPTitle, uiuxPTitleEn, uiuxPSub
  if (skills.includes('visual') && skills.includes('creativity')) {
    uiuxPTitle = '視覺創意大師型'
    uiuxPTitleEn = 'Visual-Creative Master'
    uiuxPSub = '你同時具備極高的視覺敏銳度與創意思維，能從使用者需求出發，創造出美觀且實用的數位產品體驗。'
  } else if (skills.includes('visual')) {
    uiuxPTitle = '美感直覺敏銳型'
    uiuxPTitleEn = 'Aesthetic-Intuitive Type'
    uiuxPSub = '你對美感有天然的追求與辨識力，善於從視覺細節中發現問題，這是進入 UI/UX 領域的絕佳起點。'
  } else if (skills.includes('research') || skills.includes('communication')) {
    uiuxPTitle = '洞察溝通型設計師'
    uiuxPTitleEn = 'Insight-Driven Designer'
    uiuxPSub = '你擅長與人溝通、洞察需求，具備 UX 設計師最核心的用戶同理心與研究能力。'
  } else if (skills.includes('creativity')) {
    uiuxPTitle = '創意驅動型設計師'
    uiuxPTitleEn = 'Creativity-Driven Designer'
    uiuxPSub = '你具備跳脫框架的創意潛能，善於提出新穎的解決方案，是設計團隊中的靈感引擎。'
  } else {
    uiuxPTitle = '跨域潛力型設計師'
    uiuxPTitleEn = 'Cross-Domain Designer'
    uiuxPSub = '你的多元背景與技能組合，讓你在 UI/UX 設計領域具有獨特的跨域思維優勢。'
  }

  let uiuxAnalysis = `根據你的測驗回答，你自評擅長「${skillStr}」`
  if (skills.includes('visual') && skills.includes('creativity')) {
    uiuxAnalysis += '，顯示你對視覺美感與創意表達具備雙重優勢。'
  } else if (skills.includes('visual')) {
    uiuxAnalysis += '，展現出對視覺呈現的出色感知力與辨識度。'
  } else if (skills.includes('communication') || skills.includes('research')) {
    uiuxAnalysis += '，這些正是 UX 研究與用戶洞察領域的核心能力。'
  } else if (skills.includes('creativity')) {
    uiuxAnalysis += '，創意思維正是推動設計創新的關鍵動力。'
  } else {
    uiuxAnalysis += '，這些跨領域能力可以轉化為設計思維的養分。'
  }
  uiuxAnalysis += ` 結合你「${concernText}」的目標，UI/UX 設計是一個同時具備創造性與高市場需求的方向——`
  uiuxAnalysis += '不僅能發揮你的視覺感知，更能確保每一個設計決策都有用戶洞察支撐。建議從 Figma 工具與設計原則入門，逐步掌握用戶研究、互動原型與設計系統，最終建立完整的設計師作品集。'

  const uiuxDirection = `以 UI/UX 設計為主軸，善用你擅長的「${skillLabels[0] || '創意思維'}」能力，專注打造以使用者為中心的數位產品。從 Figma 工具與設計基礎概論入門，逐步掌握互動原型與 Usability Testing，並透過 App 重新設計等實戰專案建立作品集。`

  /* ── Dynamic personality (Frontend) ── */
  let fePTitle, fePTitleEn, fePSub
  if (skills.includes('coding') && skills.includes('problem-solving')) {
    fePTitle = '全棧架構型實踐者'
    fePTitleEn = 'Full-Stack Architect'
    fePSub = '你同時具備扎實的程式能力與系統性問題解決思維，是前端開發領域最搶手的人才類型。'
  } else if (skills.includes('coding')) {
    fePTitle = '技術導向型開發者'
    fePTitleEn = 'Tech-Oriented Developer'
    fePSub = '你對程式語言有天然的親和力，學習新技術的速度快，非常適合深耕前端開發。'
  } else if (skills.includes('visual') && (skills.includes('coding') || direction === 'code')) {
    fePTitle = '視覺工程雙修者'
    fePTitleEn = 'Visual-Engineering Hybrid'
    fePSub = '你兼具美感直覺與技術思維，能同時理解設計意圖和技術限制，打造出真正好用的使用者介面。'
  } else if (skills.includes('problem-solving')) {
    fePTitle = '邏輯解題型開發者'
    fePTitleEn = 'Logic-Driven Developer'
    fePSub = '你擅長拆解複雜問題、制定解決策略，這種系統化思維是優秀前端工程師的核心素養。'
  } else {
    fePTitle = '跨域潛力型工程師'
    fePTitleEn = 'Cross-Domain Engineer'
    fePSub = '你的多元背景為技術學習帶來獨特視角，在前端開發的路上能走出自己的特色。'
  }

  let feAnalysis = `根據你的測驗回答，你自評擅長「${skillStr}」`
  if (skills.includes('coding') && skills.includes('problem-solving')) {
    feAnalysis += '，呈現出強烈的邏輯思維與技術導向特質。'
  } else if (skills.includes('coding')) {
    feAnalysis += '，你的程式基礎讓你在前端開發領域有很好的起跑點。'
  } else if (skills.includes('visual') || skills.includes('creativity')) {
    feAnalysis += '，結合視覺感知與技術學習力，你能打造兼具美感與功能的介面。'
  } else {
    feAnalysis += '，這些能力可以幫助你從不同角度切入前端開發領域。'
  }
  feAnalysis += ` 結合你「${concernText}」的目標，前端開發是一個需求量大、入門門檻明確且薪資成長空間充足的方向——`
  feAnalysis += '你可以從 JavaScript 核心語法開始，逐步學會 React 框架與狀態管理，並透過電商平台等實戰專案累積作品集，打造可商業化的技術能力。'

  const feDirection = `以前端開發為切入點，善用你擅長的「${skillLabels[0] || '問題解決'}」能力，從 JavaScript 核心語法與非同步開始，進階到 React 元件開發與狀態管理，最終透過電商平台全端開發等實戰課程快速累積作品。`

  /* ── Build path objects ── */
  const uiuxPath = {
    title: 'UI/UX 設計師',
    titleEn: 'User Experience Designer',
    desc: '你兼具邏輯思維與視覺直覺，能在設計決策與用戶洞察之間找到完美平衡。',
    match: uiux,
    icon: 'fa-solid fa-wand-magic-sparkles',
    personality: {
      title: uiuxPTitle,
      titleEn: uiuxPTitleEn,
      badge: '🎨 天賦基因已解鎖',
      subtitle: uiuxPSub,
      analysis: uiuxAnalysis,
      direction: uiuxDirection
    },
    scores: [
      { label: '創意力', value: uiuxCreativity, icon: 'fa-solid fa-lightbulb' },
      { label: '使用者同理', value: uiuxEmpathy, icon: 'fa-solid fa-heart' },
      { label: '視覺敏銳度', value: uiuxVisual, icon: 'fa-solid fa-eye' },
      { label: '溝通表達', value: uiuxComm, icon: 'fa-solid fa-comments' }
    ],
    learningPath: [
      { step: 1, title: '設計基礎入門', desc: 'Figma 工具操作、設計原則與色彩排版基礎', duration: '4 週', icon: 'fa-solid fa-pencil-ruler' },
      { step: 2, title: 'UX 研究方法', desc: '用戶訪談技巧、易用性測試與數據驅動設計', duration: '3 週', icon: 'fa-solid fa-magnifying-glass-chart' },
      { step: 3, title: 'UI 設計實戰', desc: '設計系統建立、元件庫開發與響應式設計', duration: '4 週', icon: 'fa-solid fa-layer-group' },
      { step: 4, title: '作品集衝刺', desc: '完成 2-3 個完整專案並建立個人品牌', duration: '3 週', icon: 'fa-solid fa-trophy' }
    ],
    bundle: {
      name: 'UI/UX 設計師養成組合包',
      subtitle: '4 堂精選課程 · 來自「UI/UX 設計」學習路徑',
      originalTotal: 7760,
      discountPrice: 5432,
      discountPercent: 30,
      courses: [
        { id: 11, title: 'UI/UX 設計基礎概論', price: 790, desc: '使用者研究、設計原則與 Figma 入門', image: 'https://placehold.co/400x200/1e1b4b/c4b5fd?text=UI%2FUX+基礎' },
        { id: 12, title: 'Figma 介面設計入門', price: 690, desc: '從零學會 Figma，掌握 Auto Layout、元件與設計規範', image: 'https://placehold.co/400x200/312e81/a5b4fc?text=Figma' },
        { id: 14, title: '互動原型與 Usability Testing', price: 1990, desc: '使用 Figma Prototype 建立互動流程，規劃與執行易用性測試', image: 'https://placehold.co/400x200/3b0764/d8b4fe?text=Prototype' },
        { id: 17, title: '實戰：App 重新設計專案', price: 4290, desc: '從用戶訪談、競品分析到高保真原型，完整走過產品設計流程', image: 'https://placehold.co/400x200/581c87/f0abfc?text=App+Redesign' }
      ]
    }
  }

  const fePath = {
    title: '前端工程師',
    titleEn: 'Front-end Developer',
    desc: '你對視覺細節的敏銳度，加上邏輯結構能力，讓你能打造兼具美感與功能的介面。',
    match: fe,
    icon: 'fa-solid fa-code',
    personality: {
      title: fePTitle,
      titleEn: fePTitleEn,
      badge: '💻 天賦基因已解鎖',
      subtitle: fePSub,
      analysis: feAnalysis,
      direction: feDirection
    },
    scores: [
      { label: '邏輯思維', value: feLogic, icon: 'fa-solid fa-brain' },
      { label: '問題解決', value: feProbSolve, icon: 'fa-solid fa-puzzle-piece' },
      { label: '技術學習力', value: feTechLearn, icon: 'fa-solid fa-graduation-cap' },
      { label: '視覺實現力', value: feVisImpl, icon: 'fa-solid fa-desktop' }
    ],
    learningPath: [
      { step: 1, title: 'Web 基礎打底', desc: 'HTML5、CSS3 與 JavaScript ES6+ 核心語法', duration: '4 週', icon: 'fa-solid fa-code' },
      { step: 2, title: '框架與工程化', desc: 'React 框架入門與 Vite 建構工具', duration: '4 週', icon: 'fa-solid fa-cubes' },
      { step: 3, title: '進階開發技能', desc: '狀態管理、API 串接與效能優化', duration: '3 週', icon: 'fa-solid fa-rocket' },
      { step: 4, title: '實戰專案與面試', desc: '完成 2-3 個作品並準備技術面試', duration: '3 週', icon: 'fa-solid fa-briefcase' }
    ],
    bundle: {
      name: '前端工程師養成組合包',
      subtitle: '4 堂精選課程 · 來自「前端開發」學習路徑',
      originalTotal: 9160,
      discountPrice: 6412,
      discountPercent: 30,
      courses: [
        { id: 2, title: 'JavaScript 核心語法與非同步', price: 990, desc: 'ES6+、Promise、async/await 與模組化開發', image: 'https://placehold.co/400x200/1f2937/fde68a?text=JavaScript' },
        { id: 3, title: 'React 基礎與元件開發', price: 890, desc: 'JSX 語法、元件生命週期、Props 與 State 管理', image: 'https://placehold.co/400x200/020617/86efac?text=React' },
        { id: 5, title: 'React 狀態管理與系統架構', price: 2490, desc: 'Context、Zustand、效能優化與大型架構實戰', image: 'https://placehold.co/400x200/111827/22d3ee?text=React+State' },
        { id: 8, title: '實戰：電商平台全端開發', price: 4790, desc: '從零打造完整電商系統——商品展示、購物車、結帳與後台管理', image: 'https://placehold.co/400x200/172554/c4b5fd?text=E-Commerce' }
      ]
    }
  }

  /* Sort by match: highest first */
  if (uiux >= fe) {
    return [
      { ...uiuxPath, tag: '最佳配對 #1' },
      { ...fePath, tag: '潛力方向 #2' }
    ]
  }
  return [
    { ...fePath, tag: '最佳配對 #1' },
    { ...uiuxPath, tag: '潛力方向 #2' }
  ]
})

/* ══ Computed ══ */
const currentQ = computed(() => questions[currentQuestion.value])
const currentStage = computed(() => currentQ.value.stage)

const activeStepIndex = computed(() => {
  if (currentView.value === 'quiz') return currentStage.value
  if (currentView.value === 'pathSelect') return 3
  return 4
})

const currentPath = computed(() => careerPaths.value[selectedPath.value ?? 0])

const stageQuestions = computed(() => {
  const stage = currentStage.value
  const inStage = questions.filter(q => q.stage === stage)
  const indexInStage = inStage.indexOf(currentQ.value)
  return { current: indexInStage + 1, total: inStage.length }
})

const progressPercent = computed(() => {
  if (currentView.value !== 'quiz') return 100
  return Math.round(((currentQuestion.value) / totalQuestions) * 100)
})

/* ══ Answers ══ */
function selectAnswer(qIndex, value) {
  const q = questions[qIndex]
  if (q.type === 'multi') {
    const current = answers.value[qIndex] || []
    if (current.includes(value)) {
      answers.value[qIndex] = current.filter(v => v !== value)
    } else if (current.length < q.maxSelect) {
      answers.value[qIndex] = [...current, value]
    }
  } else {
    answers.value[qIndex] = value
  }
}

function isSelected(qIndex, value) {
  const ans = answers.value[qIndex]
  if (Array.isArray(ans)) return ans.includes(value)
  return ans === value
}

const multiCount = computed(() => {
  const ans = answers.value[currentQuestion.value]
  return Array.isArray(ans) ? ans.length : 0
})

const canProceed = computed(() => {
  const ans = answers.value[currentQuestion.value]
  if (Array.isArray(ans)) return ans.length > 0
  return !!ans
})

/* ══ Navigation ══ */
function next() {
  if (currentQuestion.value < totalQuestions - 1) {
    slideDir.value = 'slide-next'
    currentQuestion.value++
  } else {
    goToPathSelect()
  }
}

function prev() {
  if (currentQuestion.value > 0) {
    slideDir.value = 'slide-prev'
    currentQuestion.value--
  }
}

function goToPathSelect() {
  selectedPath.value = 0
  currentView.value = 'pathSelect'
  barsAnimated.value = false
  nextTick(() => setTimeout(() => { barsAnimated.value = true }, 400))
}

function goToResult() {
  currentView.value = 'result'
  bundleAdded.value = false
  barsAnimated.value = false
  nextTick(() => setTimeout(() => { barsAnimated.value = true }, 500))
}

function backToPathSelect() {
  currentView.value = 'pathSelect'
  bundleAdded.value = false
  barsAnimated.value = false
  nextTick(() => setTimeout(() => { barsAnimated.value = true }, 400))
}

function backToQuiz() {
  currentView.value = 'quiz'
  currentQuestion.value = totalQuestions - 1
}

function restart() {
  currentQuestion.value = 0
  currentView.value = 'quiz'
  answers.value = {}
  selectedPath.value = 0
  bundleAdded.value = false
  barsAnimated.value = false
}

function handleLogoClick() {
  const hasAnswers = Object.keys(answers.value).length > 0
  if (currentView.value === 'quiz' && hasAnswers) {
    showLeaveModal.value = true
  } else {
    emit('close')
  }
}

function confirmLeave() {
  showLeaveModal.value = false
  emit('close')
}

const userField = computed(() => {
  const v = answers.value[0]
  const opt = questions[0].options.find(o => o.value === v)
  return opt ? opt.label : '跨領域'
})

const userInterest = computed(() => {
  const v = answers.value[4]
  const opt = questions[4].options.find(o => o.value === v)
  return opt ? opt.label : '程式與技術'
})

/* ══ Cart ══ */
function addBundleToCart() {
  const path = currentPath.value
  const discount = path.bundle.discountPercent / 100
  path.bundle.courses.forEach(c => {
    addToCart(c.id, {
      id: c.id,
      title: c.title,
      price: Math.round(c.price * (1 - discount)),
      originalPrice: c.price,
      image: c.image
    })
  })
  bundleAdded.value = true
}

const allBundleInCart = computed(() => {
  return currentPath.value.bundle.courses.every(c => isInCart(c.id))
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex flex-col bg-[#F8F9FA]">

      <!-- ═══ Top Header ═══ -->
      <header class="shrink-0 border-b border-[#E4E6EA] bg-white">
        <div class="flex items-center gap-6 px-10 py-4">
          <button @click="handleLogoClick"
            class="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-70">
            <img src="/image.png" alt="學易點 Logo" class="h-8 w-auto" />
            <span class="text-[18px] font-black tracking-tight text-[#1B3A5C]">學易點.</span>
          </button>
          <div class="mx-2 h-5 w-px bg-[#E4E6EA]"></div>

          <!-- Stepper -->
          <nav class="flex items-center gap-1">
            <template v-for="(step, i) in allSteps" :key="i">
              <div class="flex items-center gap-2 rounded-full px-2 py-1 transition-all duration-300"
                :class="activeStepIndex >= i ? 'opacity-100' : 'opacity-40'">
                <span
                  class="flex size-[22px] items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300"
                  :class="activeStepIndex > i ? 'bg-[#1B3A5C] text-white' : activeStepIndex === i ? 'bg-[#1B3A5C] text-white' : 'bg-[#E4E6EA] text-[#999]'">
                  <i v-if="activeStepIndex > i" class="fa-solid fa-check text-[10px]"></i>
                  <template v-else>{{ String(i + 1).padStart(2, '0') }}</template>
                </span>
                <span class="text-[13px] font-medium transition-colors duration-300"
                  :class="activeStepIndex >= i ? 'text-[#333]' : 'text-[#999]'">{{ step.label }}</span>
              </div>
              <i v-if="i < allSteps.length - 1" class="fa-solid fa-chevron-right text-[10px] text-[#CCC]"></i>
            </template>
          </nav>

          <div class="ml-auto flex items-center gap-3">
            <template v-if="currentView === 'quiz'">
              <span class="text-[12px] text-[#999]">第 {{ currentQuestion + 1 }} / {{ totalQuestions }} 題</span>
              <div class="h-[3px] w-20 rounded-full bg-[#E4E6EA]">
                <div class="h-full rounded-full bg-[#1B3A5C] transition-all duration-500"
                  :style="{ width: progressPercent + '%' }"></div>
              </div>
              <span class="text-[12px] font-medium text-[#1B3A5C]">{{ progressPercent }}%</span>
            </template>
            <span v-else-if="currentView === 'pathSelect'" class="text-[12px] font-semibold text-[#1B3A5C]">
              <i class="fa-solid fa-dna mr-1"></i> 分析完成
            </span>
            <span v-else class="text-[12px] font-semibold text-[#1B3A5C]">
              <i class="fa-solid fa-sparkles mr-1"></i> 個人化推薦
            </span>

            <div class="ml-3 h-5 w-px bg-[#E4E6EA]"></div>
            <button @click="router.push({ name: 'checkout' }); emit('close')"
              class="relative flex size-9 items-center justify-center rounded-lg text-[#1B3A5C] transition-all duration-200 hover:bg-[#F0F2F5] hover:text-[#2d5f97]"
              title="購物車">
              <i class="fa-solid fa-bag-shopping text-[20px]"></i>
              <span v-if="cartCount > 0"
                class="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-[#E74C3C] text-[10px] font-bold text-white shadow-sm">{{
                  cartCount }}</span>
            </button>
          </div>
        </div>

        <!-- Sub-progress (quiz only) -->
        <div v-if="currentView === 'quiz'" class="flex items-center gap-3 border-t border-[#F0F2F5] px-10 py-[6px]">
          <span class="text-[12px] font-medium text-[#999]">{{ currentQ.stageLabel }} · {{ stageQuestions.current }}/{{
            stageQuestions.total }}</span>
          <div class="h-[2px] flex-1 rounded-full bg-[#E4E6EA]">
            <div class="h-full rounded-full bg-[#1B3A5C]/60 transition-all duration-500"
              :style="{ width: (stageQuestions.current / stageQuestions.total * 100) + '%' }"></div>
          </div>
          <span class="text-[12px] text-[#999]">{{ Math.round(stageQuestions.current / stageQuestions.total * 100) }}%
            完成</span>
        </div>
      </header>

      <!-- ═══ Content ═══ -->
      <main class="flex-1 overflow-y-auto">
        <Transition name="view-fade" mode="out-in">

          <!-- ─── Quiz View ─── -->
          <div v-if="currentView === 'quiz'" key="quiz">
            <Transition :name="slideDir" mode="out-in">
              <div :key="currentQuestion" class="mx-auto w-full max-w-[900px] px-10 py-10">
                <!-- Stage badge + Tag -->
                <div class="mb-2 flex items-center gap-2">
                  <span class="rounded-full bg-[#EEF2F7] px-3 py-1 text-[12px] font-semibold text-[#1B3A5C]">{{
                    currentQ.stageLabel }}</span>
                  <i class="fa-solid fa-circle text-[4px] text-[#CCC]"></i>
                  <span class="rounded-full bg-[#F5F5F5] px-3 py-1 text-[12px] font-medium text-[#888]">{{ currentQ.tag
                  }}</span>
                </div>

                <h2 class="mt-4 text-[26px] font-black leading-[36px] tracking-[-0.5px] text-[#111]">{{ currentQ.title
                }}</h2>
                <p class="mt-2 text-[14px] leading-[22px] text-[#888]">{{ currentQ.subtitle }}</p>

                <!-- Grid -->
                <div v-if="currentQ.type === 'grid'" class="mt-8 grid grid-cols-4 gap-3">
                  <button v-for="opt in currentQ.options" :key="opt.value"
                    @click="selectAnswer(currentQuestion, opt.value)"
                    class="flex flex-col items-start gap-1 rounded-xl border-2 px-5 py-5 text-left transition-all duration-200"
                    :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#EEF2F7] shadow-sm scale-[1.02]' : 'border-[#E4E6EA] bg-white hover:border-[#CCC] hover:shadow-sm'">
                    <span class="text-[15px] font-bold text-[#111]">{{ opt.label }}</span>
                    <span class="text-[12px] text-[#999]">{{ opt.en }}</span>
                  </button>
                </div>

                <!-- Pill -->
                <div v-if="currentQ.type === 'pill'" class="mt-8 flex flex-wrap gap-3">
                  <button v-for="opt in currentQ.options" :key="opt.value"
                    @click="selectAnswer(currentQuestion, opt.value)"
                    class="rounded-full border-2 px-6 py-3 text-[14px] font-medium transition-all duration-200"
                    :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white shadow-sm scale-[1.03]' : 'border-[#E4E6EA] bg-white text-[#333] hover:border-[#CCC]'">
                    <span v-if="isSelected(currentQuestion, opt.value)">✓ </span>{{ opt.label }}
                  </button>
                </div>

                <!-- List -->
                <div v-if="currentQ.type === 'list'" class="mt-8 flex flex-col gap-3">
                  <button v-for="(opt, j) in currentQ.options" :key="opt.value"
                    @click="selectAnswer(currentQuestion, opt.value)"
                    class="flex items-center gap-4 rounded-xl border-2 px-5 py-5 text-left transition-all duration-200"
                    :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#EEF2F7] shadow-sm' : 'border-[#E4E6EA] bg-white hover:border-[#CCC] hover:shadow-sm'">
                    <span
                      class="flex size-[34px] shrink-0 items-center justify-center rounded-lg text-[14px] font-bold transition-all duration-200"
                      :class="isSelected(currentQuestion, opt.value) ? 'bg-[#1B3A5C] text-white' : 'bg-[#F5F5F5] text-[#999]'">
                      {{ String.fromCharCode(65 + j) }}
                    </span>
                    <div class="flex flex-col gap-[2px]">
                      <span class="text-[15px] font-semibold text-[#111]">{{ opt.label }}</span>
                      <span class="text-[13px] text-[#888]">{{ opt.desc }}</span>
                    </div>
                    <div
                      class="ml-auto flex size-[20px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
                      :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#1B3A5C]' : 'border-[#DDD]'">
                      <i v-if="isSelected(currentQuestion, opt.value)"
                        class="fa-solid fa-check text-[10px] text-white"></i>
                    </div>
                  </button>
                </div>

                <!-- Multi-select -->
                <div v-if="currentQ.type === 'multi'" class="mt-8">
                  <div class="mb-4 flex items-center justify-between rounded-xl bg-[#F5F5F5] px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span v-for="i in currentQ.maxSelect" :key="i"
                        class="size-2 rounded-full transition-all duration-300"
                        :class="i <= multiCount ? 'bg-[#1B3A5C] scale-110' : 'bg-[#DDD]'"></span>
                    </div>
                    <span class="text-[12px] font-medium"
                      :class="multiCount >= currentQ.maxSelect ? 'text-[#1B3A5C]' : 'text-[#999]'">
                      已選 {{ multiCount }} / {{ currentQ.maxSelect }}
                      <template v-if="multiCount >= currentQ.maxSelect"> ✓ 已達上限</template>
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button v-for="opt in currentQ.options" :key="opt.value"
                      @click="selectAnswer(currentQuestion, opt.value)"
                      class="rounded-full border-2 px-5 py-[10px] text-[13px] font-medium transition-all duration-200"
                      :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white scale-[1.03]' : 'border-[#E4E6EA] bg-white text-[#444] hover:border-[#CCC]'"
                      :disabled="!isSelected(currentQuestion, opt.value) && multiCount >= currentQ.maxSelect">
                      <span v-if="isSelected(currentQuestion, opt.value)">✓ </span>{{ opt.label }}
                    </button>
                  </div>
                </div>

                <!-- Direction cards -->
                <div v-if="currentQ.type === 'direction'" class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
                  <button v-for="opt in currentQ.options" :key="opt.value"
                    @click="selectAnswer(currentQuestion, opt.value)"
                    class="flex flex-col items-start gap-2 rounded-xl border-2 px-5 pb-5 pt-6 text-left transition-all duration-200"
                    :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#EEF2F7] shadow-sm scale-[1.02]' : 'border-[#E4E6EA] bg-white hover:border-[#CCC] hover:shadow-sm'">
                    <span class="text-[28px] leading-none">{{ opt.icon }}</span>
                    <span class="mt-2 text-[15px] font-bold text-[#111]">{{ opt.label }}</span>
                    <span class="text-[12px] text-[#888]">{{ opt.desc }}</span>
                  </button>
                </div>

                <!-- Scale -->
                <div v-if="currentQ.type === 'scale'" class="mt-8 grid grid-cols-2 gap-4">
                  <button v-for="opt in currentQ.options" :key="opt.value"
                    @click="selectAnswer(currentQuestion, opt.value)"
                    class="flex flex-col items-start gap-3 rounded-xl border-2 px-6 pt-6 pb-5 text-left transition-all duration-200"
                    :class="isSelected(currentQuestion, opt.value) ? 'border-[#1B3A5C] bg-[#EEF2F7] shadow-sm scale-[1.02]' : 'border-[#E4E6EA] bg-white hover:border-[#CCC] hover:shadow-sm'">
                    <div class="flex gap-1">
                      <span v-for="d in 4" :key="d" class="text-[14px] transition-colors duration-200"
                        :class="d <= opt.dots ? 'text-[#1B3A5C]' : 'text-[#DDD]'">◆</span>
                    </div>
                    <div>
                      <p class="text-[15px] font-bold text-[#111]">{{ opt.label }}</p>
                      <p class="text-[12px] text-[#999]">{{ opt.en }}</p>
                    </div>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ─── Path Select View ─── -->
          <div v-else-if="currentView === 'pathSelect'" key="pathSelect"
            class="mx-auto w-full max-w-[900px] px-10 py-10">
            <!-- Centered hero -->
            <div class="flex flex-col items-center text-center anim-stagger-1">
              <!-- Concentric circles icon -->
              <div class="relative mb-6 flex size-[100px] items-center justify-center">
                <div
                  class="absolute inset-0 animate-[pulseRing_2s_ease-in-out_infinite] rounded-full border border-[#1B3A5C]/10">
                </div>
                <div class="absolute inset-3 rounded-full border border-[#1B3A5C]/18"></div>
                <div class="absolute inset-6 rounded-full border border-[#1B3A5C]/26"></div>
                <div class="flex size-[28px] items-center justify-center rounded-lg bg-[#1B3A5C]/90">
                  <div class="size-2 rounded-sm bg-white"></div>
                </div>
              </div>

              <span
                class="mb-4 inline-flex items-center rounded-full border border-[#E4E6EA] bg-[#EDF2F7] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1px] text-[#1B3A5C]">
                🎉 天賦基因已解鎖
              </span>

              <h2 class="text-[36px] font-black tracking-[-1.5px] text-[#111]">{{ currentPath.personality.title }}</h2>
              <p class="mt-3 max-w-[480px] text-[15px] leading-[25px] text-[#555]">{{ currentPath.personality.subtitle
              }}</p>
            </div>

            <!-- Two career path cards -->
            <div class="mt-10 grid grid-cols-2 gap-5">
              <button v-for="(path, i) in careerPaths" :key="i" @click="selectedPath = i"
                class="anim-stagger-card group relative flex flex-col rounded-2xl border-2 p-7 text-left transition-all duration-300"
                :class="selectedPath === i
                  ? 'border-[#1B3A5C] bg-[#EDF2F7] shadow-[0_8px_30px_rgba(27,58,92,0.12)]'
                  : 'border-[#E4E6EA] bg-white hover:border-[#CCC] hover:shadow-md'"
                :style="{ animationDelay: (0.2 + i * 0.15) + 's' }">
                <!-- Tag + selected -->
                <div class="flex items-center justify-between">
                  <span
                    class="rounded border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px] transition-colors duration-300"
                    :class="selectedPath === i
                      ? 'border-[#1B3A5C] bg-[#EDF2F7] text-[#1B3A5C]'
                      : 'border-[#E4E6EA] bg-[#F8F9FA] text-[#999]'">
                    {{ path.tag }}
                  </span>
                  <span v-if="selectedPath === i" class="text-[11px] font-bold text-[#1B3A5C]">✓ 選中</span>
                </div>

                <!-- Title -->
                <h3 class="mt-5 text-[20px] font-black transition-colors duration-300"
                  :class="selectedPath === i ? 'text-[#1B3A5C]' : 'text-[#111]'">{{ path.title }}</h3>
                <p class="mt-1 text-[12px] font-medium text-[#999]">{{ path.titleEn }}</p>

                <!-- Desc -->
                <p class="mt-4 text-[13px] font-medium leading-[21px] text-[#555]">{{ path.desc }}</p>

                <!-- Match bar -->
                <div class="mt-6 flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999]">適配度</span>
                    <span class="text-[20px] font-black transition-colors duration-300"
                      :class="selectedPath === i ? 'text-[#1B3A5C]' : 'text-[#111]'">{{ path.match }}%</span>
                  </div>
                  <div class="h-[5px] w-full rounded-full bg-[#E4E6EA]">
                    <div class="h-full rounded-full transition-all duration-1000 ease-out"
                      :class="selectedPath === i ? 'bg-[#1B3A5C]' : 'bg-[#AABBC8]'"
                      :style="{ width: barsAnimated ? path.match + '%' : '0%' }"></div>
                  </div>
                </div>
              </button>
            </div>

            <!-- CTA -->
            <div class="mt-10 flex justify-center anim-stagger-3">
              <button @click="goToResult"
                class="flex items-center gap-2 rounded-xl bg-[#1B3A5C] px-8 py-4 text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14304d] hover:shadow-xl active:scale-95">
                探索此方向的課程 <i class="fa-solid fa-arrow-right text-[13px]"></i>
              </button>
            </div>
          </div>

          <!-- ─── Result View ─── -->
          <div v-else key="result" class="mx-auto w-full max-w-[900px] px-10 py-10">

            <!-- Personality hero -->
            <div class="rounded-2xl border border-[#E4E6EA] bg-white p-8 anim-stagger-1">
              <div class="flex items-start gap-6">
                <div
                  class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B3A5C] to-[#3672B5]">
                  <i :class="currentPath.icon" class="text-[24px] text-white"></i>
                </div>
                <div>
                  <span
                    class="inline-flex items-center rounded-full bg-[#EDF2F7] px-3 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#1B3A5C]">
                    {{ currentPath.personality.badge }}
                  </span>
                  <h2 class="mt-2 text-[28px] font-black leading-[36px] tracking-[-0.5px] text-[#111]">{{
                    currentPath.personality.title }}</h2>
                  <p class="mt-1 text-[14px] text-[#888]">{{ currentPath.personality.titleEn }}</p>
                </div>
              </div>

              <div class="mt-6 h-px bg-[#F0F2F5]"></div>

              <!-- Deep analysis -->
              <div class="mt-6">
                <h3 class="text-[15px] font-bold text-[#111]">
                  <i class="fa-solid fa-brain mr-2 text-[#3672B5]"></i>性向深度分析
                </h3>
                <p class="mt-3 text-[14px] leading-[24px] text-[#555]">{{ currentPath.personality.analysis }}</p>
              </div>

              <div class="mt-6 h-px bg-[#F0F2F5]"></div>

              <!-- Suggested direction -->
              <div class="mt-6">
                <h3 class="text-[15px] font-bold text-[#111]">
                  <i class="fa-solid fa-route mr-2 text-[#3672B5]"></i>建議發展方向
                </h3>
                <div class="mt-3 flex items-start gap-3 rounded-xl bg-[#F8F9FA] px-5 py-4">
                  <p class="text-[14px] font-medium leading-[24px] text-[#444]">{{ currentPath.personality.direction }}
                  </p>
                </div>
              </div>

              <div class="mt-6 h-px bg-[#F0F2F5]"></div>

              <!-- Skill scores -->
              <div class="mt-6">
                <h3 class="mb-4 text-[15px] font-bold text-[#111]">
                  <i class="fa-solid fa-chart-bar mr-2 text-[#3672B5]"></i>能力指標
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="(score, i) in currentPath.scores" :key="score.label"
                    class="flex items-center gap-3 rounded-xl bg-[#F8F9FA] px-4 py-3">
                    <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EDF2F7]">
                      <i :class="score.icon" class="text-[14px] text-[#1B3A5C]"></i>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[12px] font-medium text-[#666]">{{ score.label }}</span>
                        <span class="text-[14px] font-black text-[#1B3A5C]">{{ score.value }}</span>
                      </div>
                      <div class="mt-1.5 h-[4px] w-full rounded-full bg-[#E4E6EA]">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-[#1B3A5C] to-[#3672B5] transition-all duration-1000 ease-out"
                          :style="{ width: barsAnimated ? score.value + '%' : '0%', transitionDelay: (i * 150) + 'ms' }">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Learning Path -->
            <div class="mt-8 anim-stagger-2">
              <div class="mb-4 flex items-center gap-2">
                <i class="fa-solid fa-map text-[16px] text-[#1B3A5C]"></i>
                <h3 class="text-[17px] font-extrabold tracking-[-0.3px] text-[#111]">學習路徑規劃</h3>
                <span class="ml-1 text-[12px] text-[#999]">· 預計 {{currentPath.learningPath.reduce((sum, s) => sum +
                  parseInt(s.duration), 0)}} 週完成</span>
              </div>
              <div class="relative rounded-2xl border border-[#E4E6EA] bg-white p-6">
                <!-- Vertical connector line -->
                <div
                  class="absolute bottom-[60px] left-[39px] top-[56px] w-px bg-gradient-to-b from-[#1B3A5C] via-[#1B3A5C]/40 to-[#E4E6EA]">
                </div>

                <div v-for="(lp, i) in currentPath.learningPath" :key="i" class="relative flex items-start gap-5 py-4">
                  <!-- Step circle -->
                  <div
                    class="relative z-10 flex size-[34px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300"
                    :class="i === 0 ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white' : 'border-[#E4E6EA] bg-white text-[#1B3A5C]'">
                    <i :class="lp.icon" class="text-[13px]"></i>
                  </div>
                  <!-- Content -->
                  <div class="flex-1 pb-2">
                    <div class="flex items-center gap-3">
                      <span class="text-[10px] font-bold uppercase tracking-[1px] text-[#999]">STEP {{ lp.step }}</span>
                      <span class="rounded-full bg-[#EDF2F7] px-2.5 py-0.5 text-[10px] font-semibold text-[#1B3A5C]">{{
                        lp.duration }}</span>
                    </div>
                    <h4 class="mt-1 text-[15px] font-bold text-[#111]">{{ lp.title }}</h4>
                    <p class="mt-1 text-[13px] leading-[20px] text-[#888]">{{ lp.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Course Bundle -->
            <div class="mt-8 anim-stagger-3">
              <div class="mb-4 flex items-center gap-3">
                <i class="fa-solid fa-graduation-cap text-[16px] text-[#1B3A5C]"></i>
                <h3 class="text-[17px] font-extrabold tracking-[-0.3px] text-[#111]">推薦課程組合包</h3>
                <span class="rounded-full bg-[#FF6B35] px-3 py-1 text-[11px] font-bold text-white">省 {{
                  currentPath.bundle.discountPercent }}%</span>
              </div>

              <div class="overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white">
                <!-- Bundle header -->
                <div class="border-b border-[#F0F2F5] bg-gradient-to-r from-[#1B3A5C] to-[#3672B5] px-6 py-4">
                  <h4 class="text-[16px] font-bold text-white">{{ currentPath.bundle.name }}</h4>
                  <p class="mt-0.5 text-[12px] text-white/70">{{ currentPath.bundle.subtitle }}</p>
                </div>

                <!-- Courses -->
                <div class="divide-y divide-[#F0F2F5]">
                  <div v-for="course in currentPath.bundle.courses" :key="course.id"
                    class="flex items-center gap-4 px-6 py-4 transition-colors duration-150 hover:bg-[#FAFBFC]">
                    <div class="size-[60px] shrink-0 overflow-hidden rounded-lg bg-[#F0F2F5]">
                      <img :src="course.image" :alt="course.title" class="size-full object-cover" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <h5 class="truncate text-[14px] font-bold text-[#111]">{{ course.title }}</h5>
                      <p class="mt-0.5 truncate text-[12px] text-[#888]">{{ course.desc }}</p>
                    </div>
                    <div class="shrink-0 text-right">
                      <p class="text-[12px] text-[#BBB] line-through">NT${{ course.price.toLocaleString() }}</p>
                      <p class="text-[14px] font-bold text-[#1B3A5C]">NT${{ Math.round(course.price * (1 -
                        currentPath.bundle.discountPercent / 100)).toLocaleString() }}</p>
                    </div>
                  </div>
                </div>

                <!-- Pricing & CTA -->
                <div class="border-t border-[#E4E6EA] bg-[#F8F9FA] px-6 py-5">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-3">
                        <span class="text-[14px] text-[#999] line-through">NT${{
                          currentPath.bundle.originalTotal.toLocaleString() }}</span>
                        <span
                          class="rounded-full bg-[#FF6B35]/10 px-2.5 py-0.5 text-[12px] font-bold text-[#FF6B35]">-{{
                            currentPath.bundle.discountPercent }}%</span>
                      </div>
                      <p class="mt-1 text-[24px] font-black text-[#1B3A5C]">NT${{
                        currentPath.bundle.discountPrice.toLocaleString() }}</p>
                    </div>
                    <button @click="addBundleToCart" :disabled="bundleAdded || allBundleInCart"
                      class="flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-bold transition-all duration-300"
                      :class="bundleAdded || allBundleInCart
                        ? 'bg-[#10B981] text-white cursor-default'
                        : 'bg-[#1B3A5C] text-white hover:-translate-y-0.5 hover:bg-[#14304d] hover:shadow-lg active:scale-95'">
                      <template v-if="bundleAdded || allBundleInCart">
                        <i class="fa-solid fa-check"></i> 已加入購物車
                      </template>
                      <template v-else>
                        <i class="fa-solid fa-cart-plus"></i> 整組加入購物車
                      </template>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="mt-8 flex items-center justify-center gap-4 pb-4 anim-stagger-4">
              <button @click="backToPathSelect"
                class="flex items-center gap-2 rounded-xl border border-[#E4E6EA] px-6 py-3 text-[14px] font-medium text-[#555] transition-all duration-200 hover:bg-white hover:shadow-sm">
                <i class="fa-solid fa-chevron-left text-[12px]"></i> 返回方向選擇
              </button>
              <button @click="restart"
                class="flex items-center gap-2 rounded-xl border border-[#E4E6EA] px-6 py-3 text-[14px] font-medium text-[#555] transition-all duration-200 hover:bg-white hover:shadow-sm">
                <i class="fa-solid fa-arrow-rotate-left text-[12px]"></i> 重新測驗
              </button>
              <button @click="emit('close')"
                class="flex items-center gap-2 rounded-xl bg-[#1B3A5C] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#14304d] hover:shadow-md">
                回到首頁 <i class="fa-solid fa-chevron-right text-[12px]"></i>
              </button>
            </div>
          </div>

        </Transition>
      </main>

      <!-- ═══ Footer ═══ -->
      <footer v-if="currentView === 'quiz'" class="shrink-0 border-t border-[#E4E6EA] bg-white">
        <div class="mx-auto flex w-full max-w-[900px] items-center justify-between px-10 py-4">
          <button v-if="currentQuestion > 0" @click="prev"
            class="flex items-center gap-2 rounded-xl border border-[#E4E6EA] px-5 py-[10px] text-[14px] font-medium text-[#666] transition-all duration-200 hover:bg-[#F8F9FA] hover:shadow-sm">
            <i class="fa-solid fa-chevron-left text-[12px]"></i> 上一題
          </button>
          <button v-else @click="emit('close')"
            class="flex items-center gap-2 rounded-xl border border-[#E4E6EA] px-5 py-[10px] text-[14px] font-medium text-[#666] transition-all duration-200 hover:bg-[#F8F9FA] hover:shadow-sm">
            <i class="fa-solid fa-house text-[12px]"></i> 回首頁
          </button>

          <button @click="next" :disabled="!canProceed"
            class="flex items-center gap-2 rounded-xl px-6 py-[10px] text-[14px] font-semibold transition-all duration-200"
            :class="canProceed ? 'bg-[#1B3A5C] text-white hover:bg-[#14304d] hover:shadow-md active:scale-95' : 'cursor-not-allowed bg-[#E4E6EA] text-[#BBB]'">
            <template v-if="currentQuestion < totalQuestions - 1">下一題 <i
                class="fa-solid fa-chevron-right text-[12px]"></i></template>
            <template v-else><i class="fa-solid fa-sparkles text-[12px]"></i> 分析結果</template>
          </button>
        </div>
      </footer>

      <footer v-else-if="currentView === 'pathSelect'" class="shrink-0 border-t border-[#E4E6EA] bg-white">
        <div class="mx-auto flex w-full max-w-[900px] items-center px-10 py-4">
          <button @click="backToQuiz"
            class="flex items-center gap-2 rounded-xl border border-[#E4E6EA] px-5 py-[10px] text-[14px] font-medium text-[#555] transition-all duration-200 hover:bg-[#F8F9FA] hover:shadow-sm">
            <i class="fa-solid fa-chevron-left text-[12px]"></i> 返回測驗
          </button>
        </div>
      </footer>

    </div>

    <!-- ═══ Leave Confirmation Modal ═══ -->
    <Transition name="view-fade">
      <div v-if="showLeaveModal"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="showLeaveModal = false">
        <div class="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-2xl">
          <div class="flex size-12 items-center justify-center rounded-full bg-[#FFF3E0]">
            <i class="fa-solid fa-triangle-exclamation text-[20px] text-[#FF9800]"></i>
          </div>
          <h3 class="mt-4 text-[18px] font-bold text-[#111]">確定要離開測驗嗎？</h3>
          <p class="mt-2 text-[14px] leading-[22px] text-[#666]">你的測驗進度將不會被保留，下次需要重新作答。</p>
          <div class="mt-6 flex gap-3">
            <button @click="showLeaveModal = false"
              class="flex-1 rounded-xl border border-[#E4E6EA] px-4 py-2.5 text-[14px] font-medium text-[#555] transition-all hover:bg-[#F8F9FA]">
              繼續作答
            </button>
            <button @click="confirmLeave"
              class="flex-1 rounded-xl bg-[#1B3A5C] px-4 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#14304d]">
              回到首頁
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* View transitions */
.view-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-fade-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.view-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Question slide */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

/* Staggered animations */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseRing {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.06);
    opacity: 0.7;
  }
}

.anim-stagger-1 {
  animation: fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.anim-stagger-2 {
  animation: fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.25s both;
}

.anim-stagger-3 {
  animation: fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

.anim-stagger-4 {
  animation: fadeSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.55s both;
}

.anim-stagger-card {
  animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}
</style>
