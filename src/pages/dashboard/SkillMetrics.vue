<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import HeaderLoggedIn from '../../components/common/HeaderLoggedIn.vue'
import Footer from '../../components/common/Footer.vue'
import ScheduleSidebar from '../../components/schedule/ScheduleSidebar.vue'
import { purchasedCourses, pathSkills, pathTargets, coursePathImpact } from '../../data/coursesHistory.js'

/* ── 動畫控制 ── */
const animated = ref(false)
onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(() => {
      animated.value = true
    })
  })
})

/* ── 路徑選擇 ── */
const selectedPath = ref('frontendDev')
const pathList = computed(() =>
  Object.entries(pathSkills).map(([key, val]) => ({ key, ...val }))
)
const currentPathInfo = computed(() => pathSkills[selectedPath.value])

/* ── 依路徑細項加總技能分數（按課程完成度加權，封頂 100） ── */
const currentPathScores = computed(() => {
  const path = selectedPath.value
  const dims = pathSkills[path].dimensions
  const totals = {}
  for (const d of dims) totals[d.key] = 0

  purchasedCourses.forEach((c) => {
    const impact = coursePathImpact[c.id]?.[path]
    if (!impact) return
    const weight = c.progress / 100
    for (const [key, val] of Object.entries(impact)) {
      if (totals[key] !== undefined) totals[key] += val * weight
    }
  })
  for (const key of Object.keys(totals)) {
    totals[key] = Math.min(Math.round(totals[key]), 100)
  }
  return totals
})

/* ── 路徑維度陣列（含 current / target / gap） ── */
const pathDimensions = computed(() => {
  const path = selectedPath.value
  const targets = pathTargets[path]
  return pathSkills[path].dimensions.map((d) => {
    const current = currentPathScores.value[d.key]
    const target = targets[d.key]
    const pct = target > 0 ? Math.round((current / target) * 100) : 0
    return {
      key: d.key,
      label: d.label,
      current,
      target,
      gap: Math.max(target - current, 0),
      pct: Math.min(pct, 100),
      level: getSkillLevel(current),
    }
  })
})

/* ── 技能等級判定 ── */
function getSkillLevel(score) {
  if (score >= 90) return { label: '大師', bg: 'bg-amber-50 text-amber-600' }
  if (score >= 70) return { label: '精通', bg: 'bg-emerald-50 text-emerald-600' }
  if (score >= 45) return { label: '熟練', bg: 'bg-blue-50 text-blue-600' }
  if (score >= 20) return { label: '初學', bg: 'bg-purple-50 text-purple-600' }
  return { label: '入門', bg: 'bg-slate-100 text-slate-500' }
}

/* ── 路徑掌握度 ── */
const pathMastery = computed(() => {
  const dims = pathDimensions.value
  if (!dims.length) return 0
  return Math.round(dims.reduce((s, d) => s + d.current, 0) / dims.length)
})

/* ── KPI 數值 ── */
const completedCount = computed(
  () => purchasedCourses.filter((c) => c.status === 'completed').length
)
const inProgressCount = computed(
  () => purchasedCourses.filter((c) => c.status === 'in-progress').length
)
const totalHours = computed(() =>
  purchasedCourses.reduce((sum, c) => sum + c.totalHours, 0)
)

/* ── 進行中課程（與選定路徑相關） ── */
const pathInProgressCourses = computed(() =>
  purchasedCourses
    .filter((c) => {
      if (c.status !== 'in-progress') return false
      const impact = coursePathImpact[c.id]?.[selectedPath.value]
      return impact && Object.values(impact).some((v) => v > 0)
    })
    .map((c) => {
      const impact = coursePathImpact[c.id][selectedPath.value]
      let maxKey = '', maxVal = 0
      for (const [k, v] of Object.entries(impact)) {
        if (v > maxVal) { maxVal = v; maxKey = k }
      }
      const dimDef = pathSkills[selectedPath.value].dimensions.find((d) => d.key === maxKey)
      return {
        ...c,
        remainHours: Math.round((1 - c.progress / 100) * c.totalHours * 10) / 10,
        topSkillKey: maxKey,
        topSkillLabel: dimDef ? dimDef.label : maxKey,
      }
    })
)

/* ── 能力缺口前 3 名（選定路徑內） ── */
const topGaps = computed(() =>
  [...pathDimensions.value]
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)
    .filter((d) => d.gap > 0)
)

/* 缺口建議文字 — 根據使用者學習狀態動態生成（精確版） */
function getSmartAdvice(subSkillKey) {
  const path = selectedPath.value
  const dimDef = pathSkills[path].dimensions.find((d) => d.key === subSkillKey)
  const dimLabel = dimDef ? dimDef.label : subSkillKey
  const current = currentPathScores.value[subSkillKey] || 0
  const target = pathTargets[path][subSkillKey] || 0
  const gap = Math.max(target - current, 0)

  const related = purchasedCourses.filter((c) => {
    const impact = coursePathImpact[c.id]?.[path]
    return impact && (impact[subSkillKey] || 0) >= 5
  })
  const completed = related.filter((c) => c.status === 'completed')
  const inProgress = related.filter((c) => c.status === 'in-progress')
  const notStarted = related.filter((c) => c.status === 'not-started')
  const completedBasics = completed.filter((c) => c.level === '基礎')
  const completedAdvanced = completed.filter((c) => c.level === '進階')

  /* 計算進行中課程可帶來的預估提升 */
  let potentialGain = 0
  const gainDetails = []
  inProgress.forEach((c) => {
    const impactVal = coursePathImpact[c.id]?.[path]?.[subSkillKey] || 0
    const remainWeight = (100 - c.progress) / 100
    const gain = Math.round(impactVal * remainWeight)
    if (gain > 0) {
      potentialGain += gain
      gainDetails.push({ title: c.title, gain, remainHours: Math.round((1 - c.progress / 100) * c.totalHours * 10) / 10 })
    }
  })

  /* 計算未開始課程可帶來的提升 */
  let notStartedGain = 0
  notStarted.forEach((c) => {
    const impactVal = coursePathImpact[c.id]?.[path]?.[subSkillKey] || 0
    notStartedGain += impactVal
  })

  if (related.length === 0) {
    return `你目前尚未購買與「${dimLabel}」直接相關的課程，缺口為 ${gap} 分。建議從基礎課程入手，預計可補足 15–25 分的基礎能力。`
  }

  if (inProgress.length > 0 && completedBasics.length === 0) {
    const detail = gainDetails.map((d) => `「${d.title}」完成後預估 +${d.gain} 分（剩餘 ${d.remainHours} hr）`).join('；')
    return `目前缺口 ${gap} 分。${detail}。建議先完成進行中的課程，打好根基再進入進階內容。`
  }

  if (completedBasics.length > 0 && completedAdvanced.length === 0) {
    if (inProgress.length > 0) {
      const detail = gainDetails.map((d) => `「${d.title}」→ 預估 +${d.gain} 分（剩 ${d.remainHours} hr）`).join('；')
      const afterGain = Math.min(current + potentialGain, 100)
      const remainGap = Math.max(target - afterGain, 0)
      return `你已完成 ${completedBasics.length} 門基礎課程。${detail}。完成後預估可達 ${afterGain} 分${remainGap > 0 ? `，仍差 ${remainGap} 分須透過進階課程補足` : '，即可達標'}。`
    }
    return `你已完成 ${completedBasics.length} 門基礎課程（目前 ${current} 分），距離目標還差 ${gap} 分。建議選修進階課程來補強「${dimLabel}」的實務應用能力。`
  }

  if (completedAdvanced.length > 0) {
    if (notStarted.length > 0) {
      return `你已完成基礎＋進階共 ${completed.length} 門課程（目前 ${current} 分）。還有 ${notStarted.length} 門已購課程未開始，預估可再提升 ${notStartedGain} 分。建議安排學習時間以達成目標 ${target} 分。`
    }
    return `你在「${dimLabel}」已具備紮實實力（${current} 分），距目標僅差 ${gap} 分。建議透過實戰專案課程或跨領域整合來突破瓶頸。`
  }

  if (inProgress.length > 0) {
    const detail = gainDetails.map((d) => `「${d.title}」→ +${d.gain} 分（剩 ${d.remainHours} hr）`).join('；')
    const afterGain = Math.min(current + potentialGain, 100)
    return `目前 ${current} 分，缺口 ${gap} 分。${detail}。全數完成後預估可達 ${afterGain} 分。`
  }

  if (notStarted.length > 0) {
    return `你有 ${notStarted.length} 門已購課程尚未開始（預估可提升 ${notStartedGain} 分）。建議立即開始學習，每完成一門即可看到「${dimLabel}」分數提升。`
  }

  return `目前 ${current} 分，距離目標 ${target} 分還差 ${gap} 分。建議探索新課程來補強此技能。`
}

/* 計算單門課程對某技能的預估提升分數 */
function getEstimatedImpact(courseId, subSkillKey) {
  const path = selectedPath.value
  const impactVal = coursePathImpact[courseId]?.[path]?.[subSkillKey] || 0
  const course = purchasedCourses.find((c) => c.id === courseId)
  if (!course) return 0
  const remainWeight = (100 - course.progress) / 100
  return Math.round(impactVal * remainWeight)
}

/* ── 未購買的推薦課程（對齊 SearchCourses 課程 ID 與定價） ── */
const unpurchasedRecommendations = {
  frontendDev: [
    { id: 23, title: 'Vue 進階：Composition API 與 Pinia', level: '進階', price: 'NT$1,990', thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop', reason: '你已具備前端基礎，Vue 進階可拓展框架廣度' },
    { id: 24, title: 'Next.js 全端框架開發', level: '進階', price: 'NT$2,490', thumb: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=225&fit=crop', reason: '結合 React 經驗，邁向全端開發' },
    { id: 6, title: '前端效能優化與部署', level: '進階', price: 'NT$2,290', thumb: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop', reason: '強化部署與效能調校，補齊上線能力' },
  ],
  backendDev: [
    { id: 44, title: 'SQL 資料庫設計與查詢', level: '基礎', price: 'NT$890', thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', reason: '搭配 Node.js 學習，補強資料層知識' },
    { id: 45, title: 'RESTful API 設計原則', level: '基礎', price: 'NT$790', thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', reason: '建立 API 設計標準，提升後端開發品質' },
    { id: 46, title: '驗證與授權：JWT、OAuth 2.0', level: '進階', price: 'NT$1,790', thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', reason: '完成基礎後的下一步，學習安全認證機制' },
  ],
  uiuxDesign: [
    { id: 13, title: '設計原則與色彩學', level: '基礎', price: 'NT$690', thumb: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=225&fit=crop', reason: '強化設計美感基礎，提升介面質感' },
    { id: 32, title: '使用者研究方法論', level: '基礎', price: 'NT$890', thumb: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=225&fit=crop', reason: '深入了解使用者需求，讓設計更有依據' },
    { id: 34, title: '動態設計與微互動', level: '進階', price: 'NT$1,990', thumb: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=225&fit=crop', reason: '已有互動原型基礎，進階動態設計是自然的下一步' },
  ],
  graphicDesign: [
    { id: 61, title: '平面設計基礎與排版原理', level: '基礎', price: 'NT$690', thumb: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=225&fit=crop', reason: '建立排版基本功，提升視覺表現力' },
    { id: 62, title: 'Adobe Illustrator 入門', level: '基礎', price: 'NT$790', thumb: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=225&fit=crop', reason: '掌握業界主流設計工具，拓展設計產出能力' },
    { id: 65, title: '品牌識別設計系統', level: '進階', price: 'NT$1,790', thumb: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=225&fit=crop', reason: '具備基礎後可挑戰品牌層級設計' },
  ],
  dataScience: [
    { id: 52, title: 'Python 程式設計入門', level: '基礎', price: 'NT$690', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop', reason: '資料科學的核心語言，從 Python 開始最有效率' },
    { id: 53, title: '統計學與資料視覺化', level: '基礎', price: 'NT$790', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop', reason: '培養數據分析思維，是資料科學的基石' },
    { id: 55, title: '機器學習基礎：Scikit-learn', level: '進階', price: 'NT$1,990', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop', reason: '學完 Python 和統計後的進階選擇' },
  ],
  productStrategy: [
    { id: 70, title: '產品經理入門：角色與工作流程', level: '基礎', price: 'NT$690', thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop', reason: '從零開始了解產品策略，適合跨領域學習者' },
    { id: 71, title: '市場研究與競品分析', level: '基礎', price: 'NT$790', thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop', reason: '強化市場敏銳度，提升產品規劃能力' },
    { id: 73, title: '數據驅動產品決策', level: '進階', price: 'NT$1,790', thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop', reason: '結合數據分析與產品思維，進階必修' },
  ],
}

/* 為每個缺口推薦相關的進行中課程 */
function getRecommendedCourses(subSkillKey) {
  const path = selectedPath.value
  return purchasedCourses
    .filter((c) => {
      const impact = coursePathImpact[c.id]?.[path]
      return impact && (impact[subSkillKey] || 0) >= 5 && c.status === 'in-progress'
    })
    .slice(0, 2)
}

/* 為路徑推薦智慧篩選後的未購買課程 */
function getUnpurchasedCourses() {
  const path = selectedPath.value
  const all = unpurchasedRecommendations[path] || []
  const related = purchasedCourses.filter((c) => {
    const impact = coursePathImpact[c.id]?.[path]
    return impact && Object.values(impact).some((v) => v >= 5)
  })
  const completedBasics = related.filter((c) => c.status === 'completed' && c.level === '基礎')
  const purchasedIds = new Set(purchasedCourses.map((c) => c.id))
  const available = all.filter((c) => !purchasedIds.has(c.id))
  if (completedBasics.length >= 2) {
    const advanced = available.filter((c) => c.level === '進階' || c.level === '實戰')
    if (advanced.length > 0) return advanced.slice(0, 3)
  }
  const basics = available.filter((c) => c.level === '基礎')
  const rest = available.filter((c) => c.level !== '基礎')
  return [...basics, ...rest].slice(0, 3)
}

/* 技能條顏色 */
function barColorClass() {
  return currentPathInfo.value.color === '#3672B5' ? 'bg-[#3672B5]' : 'bg-[#8B5CF6]'
}

/* 等級 badge 色 */
function levelColor(level) {
  const map = {
    基礎: 'bg-emerald-50 text-emerald-700',
    進階: 'bg-purple-50 text-purple-700',
    實戰: 'bg-orange-50 text-orange-700',
  }
  return map[level] || 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA]">
    <!-- Header -->
    <HeaderLoggedIn userName="小凌" />

    <!-- Body -->
    <div class="flex pt-20">
      <!-- Sidebar -->
      <ScheduleSidebar userName="小凌" :streakDays="7" activeItem="能力指標" />

      <!-- Main content -->
      <main class="ml-[260px] flex-1 px-16 py-9">
        <div class="mx-auto flex max-w-[1120px] flex-col gap-10">

          <!-- ===== Page header ===== -->
          <section>
            <h1 class="text-[32px] font-black leading-[42px] tracking-[-0.64px] text-[#111]">能力指標</h1>
            <p class="mt-2 text-sm font-medium leading-[21px] tracking-[0.14px] text-[#555]">
              根據你的學習歷程，追蹤技能成長、找出能力缺口並取得補強建議。
            </p>
          </section>

          <!-- ===== 區塊 A：總覽 KPI + 分組技能條 ===== -->
          <section class="flex flex-col gap-6">
            <!-- KPI 小卡 -->
            <div class="grid grid-cols-3 gap-5">
              <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wider text-[#888]">已完成課程</p>
                <p class="mt-2 text-3xl font-extrabold text-[#111]">{{ completedCount }}</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wider text-[#888]">進行中課程</p>
                <p class="mt-2 text-3xl font-extrabold text-[#3672B5]">{{ inProgressCount }}</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p class="text-xs font-semibold uppercase tracking-wider text-[#888]">總學習時數</p>
                <p class="mt-2 text-3xl font-extrabold text-[#111]">
                  {{ totalHours }}<span class="ml-1 text-base font-semibold text-[#999]">hr</span>
                </p>
              </div>
            </div>

            <!-- 技能雷達：路徑選擇 + 技能條 -->
            <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-bold text-[#111]">技能雷達</h2>
                  <p class="mt-1 text-sm text-[#888]">
                    選擇學習路徑，查看該路徑下各項技能的成長進度。
                  </p>
                </div>
                <!-- 路徑掌握度圓圈 -->
                <div class="flex flex-col items-center gap-1">
                  <div class="relative grid size-16 place-items-center">
                    <svg class="absolute inset-0" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#EEF2F7" stroke-width="3" />
                      <circle
                        cx="18" cy="18" r="15.5" fill="none"
                        :stroke="currentPathInfo.color" stroke-width="3" stroke-linecap="round"
                        :stroke-dasharray="97.4"
                        :stroke-dashoffset="animated ? 97.4 - (97.4 * pathMastery / 100) : 97.4"
                        transform="rotate(-90 18 18)"
                        class="transition-all duration-[1200ms] ease-out"
                      />
                    </svg>
                    <span class="text-sm font-extrabold text-[#111]">{{ pathMastery }}%</span>
                  </div>
                  <span class="text-[11px] font-medium text-[#888]">路徑掌握度</span>
                </div>
              </div>

              <!-- 路徑選擇器 -->
              <div class="mb-6 flex flex-wrap gap-2">
                <button
                  v-for="p in pathList"
                  :key="p.key"
                  @click="selectedPath = p.key"
                  class="rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                  :class="selectedPath === p.key
                    ? 'bg-[#1B3A5C] text-white shadow-md'
                    : 'bg-[#EEF2F7] text-[#555] hover:bg-[#E1E5EB]'"
                >
                  <i :class="p.icon" class="mr-1.5 text-xs"></i>
                  {{ p.label }}
                </button>
              </div>

              <!-- 路徑技能條 -->
              <div
                class="rounded-xl p-5"
                :class="currentPathInfo.color === '#3672B5' ? 'bg-blue-50/60' : 'bg-purple-50/60'"
              >
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span
                      class="grid size-7 place-items-center rounded-lg text-white"
                      :style="{ backgroundColor: currentPathInfo.color }"
                    >
                      <i :class="currentPathInfo.icon" class="text-xs"></i>
                    </span>
                    <span class="text-sm font-bold text-[#333]">{{ currentPathInfo.label }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-5">
                  <div v-for="dim in pathDimensions" :key="dim.key">
                    <div class="mb-1.5 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-[#333]">{{ dim.label }}</span>
                        <span class="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" :class="dim.level.bg">
                          {{ dim.level.label }}
                        </span>
                      </div>
                      <span class="text-xs font-semibold" :class="dim.current >= dim.target ? 'text-emerald-600' : 'text-[#555]'">
                        {{ dim.current }}%
                      </span>
                    </div>
                    <!-- Progress bar -->
                    <div class="relative h-3 w-full overflow-hidden rounded-full bg-white/80">
                      <div
                        class="absolute top-0 h-full border-r-2 border-dashed border-[#CBD5E1]"
                        :style="{ left: dim.target + '%' }"
                      />
                      <div
                        class="h-full rounded-full transition-all duration-[1000ms] ease-out"
                        :class="barColorClass()"
                        :style="{ width: animated ? Math.min(dim.current, 100) + '%' : '0%' }"
                      />
                    </div>
                    <!-- 狀態文字 -->
                    <div class="mt-1 flex items-center justify-between text-[11px]">
                      <span v-if="dim.current >= dim.target" class="text-emerald-600 font-medium">已達標</span>
                      <span v-else-if="dim.current >= dim.target * 0.7" class="text-[#888]">接近目標，再加把勁</span>
                      <span v-else-if="dim.current >= dim.target * 0.4" class="text-[#888]">持續學習中</span>
                      <span v-else class="text-[#888]">建議開始探索此領域</span>
                      <span class="text-[#BCBCBC]">{{ dim.current }} / {{ dim.target }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 等級說明 -->
              <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                <span class="text-[11px] text-[#999]">等級參考：</span>
                <span class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">入門 0–19</span>
                <span class="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600">初學 20–44</span>
                <span class="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">熟練 45–69</span>
                <span class="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">精通 70–89</span>
                <span class="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">大師 90+</span>
              </div>
            </div>
          </section>

          <!-- ===== 區塊 B：課程進度與成長 ===== -->
          <section v-if="pathInProgressCourses.length" class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 class="mb-1 text-lg font-bold text-[#111]">進行中的課程</h2>
            <p class="mb-5 text-sm text-[#888]">與「{{ currentPathInfo.label }}」路徑相關的進行中課程，完成後可提升對應技能。</p>

            <div class="grid gap-5 md:grid-cols-2">
              <div
                v-for="course in pathInProgressCourses"
                :key="course.id"
                class="flex gap-4 rounded-xl border border-[#E4E6EA] p-4 transition-all duration-200 hover:shadow-md"
              >
                <!-- Thumbnail -->
                <img
                  :src="course.thumb"
                  :alt="course.title"
                  class="h-24 w-36 shrink-0 rounded-lg object-cover"
                />

                <!-- Info -->
                <div class="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 class="text-sm font-bold leading-5 text-[#111]">{{ course.title }}</h3>
                    <div class="mt-1.5 flex items-center gap-2">
                      <span class="rounded-md px-2 py-0.5 text-[11px] font-semibold" :class="levelColor(course.level)">
                        {{ course.level }}
                      </span>
                      <span class="text-xs text-[#999]">{{ course.category }}</span>
                    </div>
                  </div>

                  <!-- progress -->
                  <div class="mt-2">
                    <div class="mb-1 flex items-center justify-between text-xs text-[#555]">
                      <span>完成 {{ course.progress }}%</span>
                      <span class="text-[#999]">剩餘 {{ course.remainHours }} hr</span>
                    </div>
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                      <div
                        class="h-full rounded-full bg-[#3672B5] transition-all duration-500"
                        :style="{ width: course.progress + '%' }"
                      />
                    </div>
                  </div>

                  <!-- Skill tag -->
                  <div class="mt-2">
                    <span class="inline-flex items-center rounded-md bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-semibold text-[#3672B5]">
                      <i class="fa-solid fa-bolt mr-1 text-[10px]"></i>
                      強化：{{ course.topSkillLabel }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== 區塊 C：能力缺口與補強建議 ===== -->
          <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 class="mb-1 text-lg font-bold text-[#111]">能力缺口與補強建議</h2>
            <p class="mb-5 text-sm text-[#888]">「{{ currentPathInfo.label }}」路徑中，目前與目標差距最大的技能維度。</p>

            <div class="flex flex-col gap-6">
              <div
                v-for="gap in topGaps"
                :key="gap.key"
                class="rounded-xl border border-amber-100 bg-amber-50/40 p-5"
              >
                <!-- Gap header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="grid size-9 place-items-center rounded-lg bg-amber-100 text-amber-600">
                      <i class="fa-solid fa-triangle-exclamation text-sm"></i>
                    </span>
                    <div>
                      <p class="text-sm font-bold text-[#111]">{{ gap.label }}</p>
                      <p class="text-xs text-[#888]">
                        目前 <span class="font-semibold text-[#333]">{{ gap.current }}</span>
                        ／ 目標 <span class="font-semibold text-[#333]">{{ gap.target }}</span>
                        　缺口 <span class="font-semibold text-amber-600">{{ gap.gap }}</span>
                      </p>
                    </div>
                  </div>
                  <!-- 達成率 badge -->
                  <span class="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                    :class="gap.pct >= 80 ? 'bg-emerald-50 text-emerald-600' : gap.pct >= 50 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'">
                    達成 {{ gap.pct }}%
                  </span>
                </div>

                <!-- 缺口視覺化進度條 -->
                <div class="mt-3 flex items-center gap-2">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div class="h-full rounded-full transition-all duration-700"
                      :class="gap.pct >= 80 ? 'bg-emerald-500' : gap.pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'"
                      :style="{ width: gap.pct + '%' }"></div>
                  </div>
                  <span class="text-[11px] font-semibold text-[#999]">{{ gap.current }}/{{ gap.target }}</span>
                </div>

                <!-- Advice -->
                <p class="mt-3 text-sm leading-relaxed text-[#555]">
                  {{ getSmartAdvice(gap.key) }}
                </p>

                <!-- 進行中的相關課程 -->
                <div v-if="getRecommendedCourses(gap.key).length" class="mt-4">
                  <p class="mb-2 text-xs font-semibold text-[#555]">
                    <i class="fa-solid fa-spinner fa-spin-pulse mr-1 text-[10px] text-[#3672B5]"></i>
                    進行中的相關課程
                  </p>
                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="rc in getRecommendedCourses(gap.key)"
                      :key="rc.id"
                      class="flex items-center gap-3 rounded-lg border border-[#E4E6EA] bg-white px-4 py-3"
                    >
                      <img :src="rc.thumb" :alt="rc.title" class="h-10 w-16 rounded object-cover" />
                      <div>
                        <p class="text-xs font-bold text-[#111]">{{ rc.title }}</p>
                        <div class="mt-0.5 flex items-center gap-2">
                          <span class="inline-block rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                            進度 {{ rc.progress }}%
                          </span>
                          <span v-if="getEstimatedImpact(rc.id, gap.key) > 0"
                            class="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            完成後預估 +{{ getEstimatedImpact(rc.id, gap.key) }} 分
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 推薦未購買的課程（路徑層級） -->
              <div v-if="getUnpurchasedCourses().length" class="rounded-xl border border-amber-200 bg-[#FFFBF0] p-5">
                <p class="mb-3 text-sm font-bold text-[#111]">
                  <i class="fa-solid fa-cart-plus mr-1.5 text-xs text-amber-600"></i>
                  推薦課程 — 強化「{{ currentPathInfo.label }}」路徑
                </p>
                <div class="flex flex-wrap gap-3">
                  <router-link
                    v-for="uc in getUnpurchasedCourses()"
                    :key="uc.id"
                    :to="{ name: 'search' }"
                    class="flex items-center gap-3 rounded-lg border border-amber-200 bg-white px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <img :src="uc.thumb" :alt="uc.title" class="h-10 w-16 rounded object-cover" />
                    <div>
                      <p class="text-xs font-bold text-[#111]">{{ uc.title }}</p>
                      <div class="mt-0.5 flex items-center gap-2">
                        <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold" :class="levelColor(uc.level)">
                          {{ uc.level }}
                        </span>
                        <span class="text-[11px] font-bold text-amber-700">{{ uc.price }}</span>
                      </div>
                      <p v-if="uc.reason" class="mt-1 text-[10px] leading-tight text-[#888]">{{ uc.reason }}</p>
                    </div>
                  </router-link>
                </div>
              </div>

              <p v-if="!topGaps.length" class="text-sm text-[#888]">
                此路徑目前沒有明顯能力缺口，繼續保持！
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>

    <!-- Footer -->
    <div class="ml-[260px]">
      <Footer />
    </div>
  </div>
</template>
