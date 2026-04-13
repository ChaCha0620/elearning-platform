<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  startStep: { type: Number, default: 1 },
  savedTimeSlots: { type: Array, default: null },
  savedSelectedCourseIds: { type: Array, default: () => [] },
  savedBlockedSlots: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'completed'])

const currentStep = ref(props.startStep)

/* ═══════════════════════════════════
   Step 1 — 設定每週可用時間
   ═══════════════════════════════════ */
const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const hours = Array.from({ length: 17 }, (_, i) => i + 7) // 07~23

// timeSlots[dayIndex][hour] = true/false
const timeSlots = ref(
  Array.from({ length: 7 }, () =>
    Object.fromEntries(hours.map(h => [h, false]))
  )
)

function toggleSlot(dayIdx, hour) {
  timeSlots.value[dayIdx][hour] = !timeSlots.value[dayIdx][hour]
}

// Drag selection
const isDragging = ref(false)
const dragValue = ref(false)
function startDrag(dayIdx, hour) {
  isDragging.value = true
  dragValue.value = !timeSlots.value[dayIdx][hour]
  timeSlots.value[dayIdx][hour] = dragValue.value
}
function enterSlot(dayIdx, hour) {
  if (isDragging.value) {
    timeSlots.value[dayIdx][hour] = dragValue.value
  }
}
function stopDrag() {
  isDragging.value = false
}

const totalSelectedHours = computed(() => {
  let count = 0
  for (let d = 0; d < 7; d++) {
    for (const h of hours) {
      if (timeSlots.value[d][h]) count++
    }
  }
  return count
})

const dayHours = computed(() =>
  weekDays.map((_, d) => {
    let count = 0
    for (const h of hours) {
      if (timeSlots.value[d][h]) count++
    }
    return count
  })
)

// Quick presets
function applyPreset(preset) {
  // Clear first
  clearAll()
  if (preset === 'workday-evening') {
    // 一~五 19:00–22:00
    for (let d = 0; d < 5; d++) {
      for (let h = 19; h < 22; h++) timeSlots.value[d][h] = true
    }
  } else if (preset === 'weekend-charge') {
    // 六、日 10:00–18:00
    for (let h = 10; h < 18; h++) {
      timeSlots.value[5][h] = true
      timeSlots.value[6][h] = true
    }
  } else if (preset === 'everyday-morning') {
    // 一~日 07:00–09:00
    for (let d = 0; d < 7; d++) {
      for (let h = 7; h < 9; h++) timeSlots.value[d][h] = true
    }
  } else if (preset === 'slash-mode') {
    // 三五晚上 + 週末下午
    for (const d of [2, 4]) {
      for (let h = 19; h < 22; h++) timeSlots.value[d][h] = true
    }
    for (const d of [5, 6]) {
      for (let h = 14; h < 18; h++) timeSlots.value[d][h] = true
    }
  }
}
function clearAll() {
  for (let d = 0; d < 7; d++) {
    for (const h of hours) timeSlots.value[d][h] = false
  }
}

// Summary sentences per active day
const daySummaries = computed(() => {
  const names = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
  const list = []
  for (let d = 0; d < 7; d++) {
    const on = hours.filter(h => timeSlots.value[d][h]).sort((a, b) => a - b)
    if (on.length === 0) continue
    const start = String(on[0]).padStart(2, '0') + ':00'
    const end = String(on[on.length - 1] + 1).padStart(2, '0') + ':00'
    list.push({ label: names[d], range: `${start}-${end}`, hours: on.length })
  }
  return list
})

const paceLabel = computed(() => {
  const h = totalSelectedHours.value
  if (h >= 10) return '密集衝刺模式'
  if (h >= 6) return '穩定前進模式'
  if (h >= 3) return '輕鬆入門模式'
  return '尚未選取'
})

const estimatedUnits = computed(() => Math.round(totalSelectedHours.value * 0.7))

/* ═══════════════════════════════════
   Step 2 — 選擇課程
   ═══════════════════════════════════ */
const courses = ref([
  {
    id: 1, title: 'React 進階：狀態管理與系統架構', tag: '前端開發', tagColor: '#1B3A5C',
    instructor: '陳建宏', selected: false,
    chapters: [
      {
        name: '第1章：React 回顧', sections: [
          { name: '1.1 元件基礎複習', hours: 1, done: true },
          { name: '1.2 JSX 進階語法', hours: 1, done: true },
          { name: '1.3 Props 與 State', hours: 1, done: true }
        ]
      },
      {
        name: '第2章：進階元件模式', sections: [
          { name: '2.1 Render Props', hours: 0.8, done: true },
          { name: '2.2 HOC 模式', hours: 0.8, done: true },
          { name: '2.3 Compound 模式', hours: 0.8, done: true }
        ]
      },
      {
        name: '第3章：Effect 與副作用', sections: [
          { name: '3.1 useEffect 深入', hours: 0.5, done: true },
          { name: '3.2 清除與競態', hours: 0.5, done: true },
          { name: '3.3 自訂 Hook 初探', hours: 0.5, done: false }
        ]
      },
      {
        name: '第4章：Hooks 深探', sections: [
          { name: '4.1 useReducer 實戰', hours: 1, done: false },
          { name: '4.2 自定義 Hooks', hours: 1, done: false },
          { name: '4.3 Hooks 效能優化', hours: 1, done: false }
        ]
      },
      {
        name: '第5章：Context API', sections: [
          { name: '5.1 Context 基礎建立', hours: 0.8, done: false },
          { name: '5.2 多層 Provider', hours: 0.8, done: false },
          { name: '5.3 效能與拆分策略', hours: 0.8, done: false }
        ]
      },
      {
        name: '第6章：狀態管理架構', sections: [
          { name: '6.1 Zustand 入門', hours: 0.6, done: false },
          { name: '6.2 全域狀態設計', hours: 0.6, done: false },
          { name: '6.3 大型架構實戰', hours: 0.7, done: false }
        ]
      }
    ]
  },
  {
    id: 2, title: 'UI/UX 概論與設計系統建構', tag: '設計', tagColor: '#1A5C3A',
    instructor: '林曉涵', selected: false,
    chapters: [
      {
        name: '第1章：設計思維基礎', sections: [
          { name: '1.1 什麼是 UX', hours: 0.8, done: true },
          { name: '1.2 設計思考流程', hours: 0.8, done: true },
          { name: '1.3 用戶旅程地圖', hours: 0.9, done: true }
        ]
      },
      {
        name: '第2章：使用者研究', sections: [
          { name: '2.1 質性研究方法', hours: 0.6, done: true },
          { name: '2.2 量化分析入門', hours: 0.8, done: false },
          { name: '2.3 研究報告撰寫', hours: 0.8, done: false }
        ]
      },
      {
        name: '第3章：資訊架構', sections: [
          { name: '3.1 資訊分類法', hours: 0.8, done: false },
          { name: '3.2 導覽結構設計', hours: 0.8, done: false },
          { name: '3.3 Card Sorting', hours: 0.8, done: false }
        ]
      },
      {
        name: '第4章：互動設計原則', sections: [
          { name: '4.1 回饋與可讀性', hours: 1, done: false },
          { name: '4.2 微互動設計', hours: 1, done: false },
          { name: '4.3 手勢與動態', hours: 0.8, done: false }
        ]
      },
      {
        name: '第5章：視覺設計語言', sections: [
          { name: '5.1 色彩心理學', hours: 1, done: false },
          { name: '5.2 字型與排版', hours: 1, done: false },
          { name: '5.3 設計一致性', hours: 0.8, done: false }
        ]
      },
      {
        name: '第6章：設計系統建構', sections: [
          { name: '6.1 Token 與變數', hours: 1, done: false },
          { name: '6.2 元件庫規劃', hours: 1, done: false },
          { name: '6.3 協作流程', hours: 0.8, done: false }
        ]
      }
    ]
  },
  {
    id: 3, title: 'TypeScript 全攻略：從零到型別大師', tag: '程式語言', tagColor: '#555',
    instructor: '王俊傑', selected: false,
    chapters: [
      {
        name: '第1章：TypeScript 入門', sections: [
          { name: '1.1 環境建置', hours: 0.5, done: false },
          { name: '1.2 基本語法', hours: 1, done: false },
          { name: '1.3 編譯設定', hours: 1, done: false }
        ]
      },
      {
        name: '第2章：基本型別系統', sections: [
          { name: '2.1 原始型別', hours: 1, done: false },
          { name: '2.2 陣列與元組', hours: 1, done: false },
          { name: '2.3 Enum 與 Literal', hours: 0.5, done: false }
        ]
      },
      {
        name: '第3章：進階型別', sections: [
          { name: '3.1 Union / Intersection', hours: 1, done: false },
          { name: '3.2 Type Guard', hours: 1, done: false },
          { name: '3.3 Mapped Types', hours: 0.5, done: false }
        ]
      },
      {
        name: '第4章：泛型', sections: [
          { name: '4.1 泛型函式', hours: 1, done: false },
          { name: '4.2 泛型約束', hours: 1, done: false },
          { name: '4.3 條件型別', hours: 1, done: false }
        ]
      },
      {
        name: '第5章：TS 與 React', sections: [
          { name: '5.1 元件型別定義', hours: 1, done: false },
          { name: '5.2 Hooks 型別', hours: 1, done: false },
          { name: '5.3 Context 型別', hours: 0.5, done: false }
        ]
      },
      {
        name: '第6章：專案實戰', sections: [
          { name: '6.1 全端型別共享', hours: 1, done: false },
          { name: '6.2 API 型別安全', hours: 1, done: false },
          { name: '6.3 大型專案配置', hours: 1, done: false }
        ]
      }
    ]
  },
  {
    id: 4, title: 'Figma 專業工作流與元件設計', tag: '設計工具', tagColor: '#7C3AED',
    instructor: '張美怡', selected: false,
    chapters: [
      {
        name: '第1章：Figma 基礎操作', sections: [
          { name: '1.1 介面導覽', hours: 0.8, done: true },
          { name: '1.2 圖形工具', hours: 0.8, done: true },
          { name: '1.3 圖層管理', hours: 0.9, done: true }
        ]
      },
      {
        name: '第2章：Auto Layout', sections: [
          { name: '2.1 排版原理', hours: 0.8, done: true },
          { name: '2.2 巢狀佈局', hours: 0.8, done: true },
          { name: '2.3 響應式設計', hours: 0.9, done: true }
        ]
      },
      {
        name: '第3章：元件與變數', sections: [
          { name: '3.1 元件建立', hours: 0.8, done: true },
          { name: '3.2 Variants', hours: 1, done: true },
          { name: '3.3 Variables', hours: 1, done: true }
        ]
      },
      {
        name: '第4章：原型與互動', sections: [
          { name: '4.1 互動觸發器', hours: 0.8, done: false },
          { name: '4.2 動畫轉場', hours: 0.8, done: false },
          { name: '4.3 Prototype 測試', hours: 0.8, done: false }
        ]
      },
      {
        name: '第5章：團隊協作流程', sections: [
          { name: '5.1 分支管理', hours: 1, done: false },
          { name: '5.2 開發交付', hours: 1, done: false },
          { name: '5.3 Design Review', hours: 0.8, done: false }
        ]
      }
    ]
  }
])

function getCourseProgress(course) {
  let total = 0, done = 0
  for (const ch of course.chapters) {
    for (const sec of ch.sections) {
      total += sec.hours
      if (sec.done) done += sec.hours
    }
  }
  return total > 0 ? Math.round((done / total) * 100) : 0
}

function getCourseRemainHours(course) {
  let h = 0
  for (const ch of course.chapters) {
    for (const sec of ch.sections) {
      if (!sec.done) h += sec.hours
    }
  }
  return Math.round(h * 10) / 10
}

const enrichedCourses = computed(() =>
  courses.value.map(c => ({
    ...c,
    progress: getCourseProgress(c),
    remainHours: getCourseRemainHours(c)
  }))
)

function toggleCourseSelection(id) {
  const c = courses.value.find(x => x.id === id)
  if (c) c.selected = !c.selected
}

const selectedCourses = computed(() => enrichedCourses.value.filter(c => c.selected))

const totalRemainHours = computed(() =>
  selectedCourses.value.reduce((sum, c) => sum + c.remainHours, 0)
)

/* ═══════════════════════════════════
   Step 3 — 自動排課 + 可封鎖時段（多週）
   ═══════════════════════════════════ */
const manualBlocks = ref([])
const blockedSlots = ref([])        // { dayIdx, hour, weekOffset }
const currentWeekOffset = ref(0)

// 課程排課優先度：數字越小越優先（1 = 最先排）
const courseWeights = ref({})

// Restore saved state when opening in edit mode (startStep === 3)
if (props.startStep === 3) {
  if (props.savedTimeSlots) {
    for (let d = 0; d < 7; d++) {
      for (const h of hours) {
        timeSlots.value[d][h] = props.savedTimeSlots[d]?.[h] === true
      }
    }
  }
  if (props.savedSelectedCourseIds.length > 0) {
    for (const c of courses.value) {
      c.selected = props.savedSelectedCourseIds.includes(c.id)
    }
  }
  blockedSlots.value = props.savedBlockedSlots.map(s => ({ ...s }))
}

// 起始日為 2026/3/30（週一），依 weekOffset 推算每週日期
const weekStartDate = computed(() => {
  const base = new Date(2026, 2, 30) // 2026-03-30 Mon
  const d = new Date(base)
  d.setDate(d.getDate() + currentWeekOffset.value * 7)
  return d
})

function getWeekDateLabel(dayIdx) {
  const d = new Date(weekStartDate.value)
  d.setDate(d.getDate() + dayIdx)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const weekRangeLabel = computed(() => {
  const s = weekStartDate.value
  const e = new Date(s)
  e.setDate(e.getDate() + 6)
  return `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()} – ${e.getMonth() + 1}/${e.getDate()}`
})

const totalWeeks = computed(() => {
  if (manualBlocks.value.length === 0) return 1
  return Math.max(...manualBlocks.value.map(b => b.weekOffset)) + 1
})

const currentWeekBlocks = computed(() =>
  manualBlocks.value.filter(b => b.weekOffset === currentWeekOffset.value)
)

function isBlocked(dayIdx, hour) {
  return blockedSlots.value.some(s => s.dayIdx === dayIdx && s.hour === hour && s.weekOffset === currentWeekOffset.value)
}

function getUndoneSections(courseId) {
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return []
  const result = []
  for (const ch of course.chapters) {
    for (const sec of ch.sections) {
      if (!sec.done) {
        result.push({ courseId, chapter: ch.name, section: sec.name, hours: sec.hours })
      }
    }
  }
  return result
}

function isSlotAvailable(dayIdx, hour) {
  return timeSlots.value[dayIdx]?.[hour] === true
}

function getBlockAt(dayIdx, hour) {
  return currentWeekBlocks.value.find(b => b.dayIdx === dayIdx && b.startHour === hour)
}

function getShortTitle(course) {
  if (course.id === 1) return 'React 進階'
  if (course.id === 2) return 'UI/UX 概論'
  if (course.id === 3) return 'TypeScript'
  if (course.id === 4) return 'Figma'
  return course.title.slice(0, 8)
}

/* 取得課程排課優先度（數字越小越先排），預設按選取順序 */
function getPriority(courseId) {
  return courseWeights.value[courseId] ?? null
}
/* 計算排課順序清單（按優先度排序） */
const priorityOrderedCourses = computed(() => {
  const list = selectedCourses.value.map((c, idx) => ({
    ...c,
    priority: courseWeights.value[c.id] ?? (idx + 1)
  }))
  return list.sort((a, b) => a.priority - b.priority)
})
function movePriority(courseId, direction) {
  // 取得目前排序
  const ordered = priorityOrderedCourses.value.map(c => c.id)
  const idx = ordered.indexOf(courseId)
  if (idx < 0) return
  const swapIdx = idx + direction
  if (swapIdx < 0 || swapIdx >= ordered.length) return
  // 交換兩者的優先度
  const myP = courseWeights.value[ordered[idx]] ?? (idx + 1)
  const otherP = courseWeights.value[ordered[swapIdx]] ?? (swapIdx + 1)
  courseWeights.value[ordered[idx]] = otherP
  courseWeights.value[ordered[swapIdx]] = myP
  smartSchedule()
}
/* 初始化優先度（進入 Step 3 時） */
function initPriorities() {
  const selected = selectedCourses.value
  selected.forEach((c, idx) => {
    if (courseWeights.value[c.id] == null) {
      courseWeights.value[c.id] = idx + 1
    }
  })
}

/* 點擊格子：有排課 → block it & 重排；有 X → 取消 X & 重排；空 → 無動作 */
function clickSlot(dayIdx, hour) {
  if (!isSlotAvailable(dayIdx, hour)) return
  const blocked = isBlocked(dayIdx, hour)
  if (blocked) {
    // 取消封鎖
    blockedSlots.value = blockedSlots.value.filter(s =>
      !(s.dayIdx === dayIdx && s.hour === hour && s.weekOffset === currentWeekOffset.value)
    )
    smartSchedule()
    return
  }
  const existing = getBlockAt(dayIdx, hour)
  if (existing) {
    // 封鎖這個時段
    blockedSlots.value.push({ dayIdx, hour, weekOffset: currentWeekOffset.value })
    smartSchedule()
  }
}

function smartSchedule() {
  manualBlocks.value = []
  const selected = selectedCourses.value
  if (selected.length === 0) return

  const daySlots = []
  for (let d = 0; d < 7; d++) {
    const on = hours.filter(h => timeSlots.value[d][h]).sort((a, b) => a - b)
    if (on.length > 0) daySlots.push({ dayIdx: d, hours: on })
  }
  if (daySlots.length === 0) return

  const queues = {}
  for (const c of selected) queues[c.id] = getUndoneSections(c.id)

  // 按優先度排序：數字越小越先排
  const orderedIds = priorityOrderedCourses.value.map(c => c.id)
  let weekOff = 0

  function allDone() { return orderedIds.every(id => queues[id].length === 0) }

  function isSlotBlocked(dayIdx, hour, wk) {
    return blockedSlots.value.some(s => s.dayIdx === dayIdx && s.hour === hour && s.weekOffset === wk)
  }

  function addB(dayIdx, hour, wk, courseId) {
    const sec = queues[courseId].shift()
    if (!sec) return
    const course = selected.find(c => c.id === courseId)
    manualBlocks.value.push({
      dayIdx, startHour: hour, span: 1, weekOffset: wk, courseId,
      sectionKey: `${sec.courseId}:${sec.chapter}:${sec.section}`,
      title: course.title.length > 12 ? course.title.slice(0, 12) : course.title,
      shortTitle: getShortTitle(course), chapter: sec.chapter, section: sec.section,
      color: course.tagColor || '#1B3A5C',
      timeRange: `${String(hour).padStart(2, '0')}:00–${String(hour + 1).padStart(2, '0')}:00`
    })
  }

  while (!allDone() && weekOff < 12) {
    for (const day of daySlots) {
      if (allDone()) break
      const availHours = day.hours.filter(h => !isSlotBlocked(day.dayIdx, h, weekOff))
      if (availHours.length === 0) continue

      // 按優先度依序填入：先把高優先課程的所有單元排完，再排下一門
      for (const h of availHours) {
        if (allDone()) break
        let placed = false
        for (const cid of orderedIds) {
          if (queues[cid].length > 0) {
            addB(day.dayIdx, h, weekOff, cid)
            placed = true
            break
          }
        }
        if (!placed) break
      }
    }
    weekOff++
  }
}

function nextWeek() {
  if (currentWeekOffset.value < totalWeeks.value - 1) currentWeekOffset.value++
}

function prevWeek() {
  if (currentWeekOffset.value > 0) currentWeekOffset.value--
}

const step3VisibleHours = computed(() => {
  const allH = new Set()
  for (let d = 0; d < 7; d++) {
    for (const h of hours) {
      if (timeSlots.value[d][h]) allH.add(h)
    }
  }
  const sorted = [...allH].sort((a, b) => a - b)
  return sorted.length > 0 ? sorted : [19, 20, 21]
})

const currentWeekTotalHours = computed(() => currentWeekBlocks.value.length)
const allWeeksTotalHours = computed(() => manualBlocks.value.length)

const courseSummaries = computed(() =>
  selectedCourses.value.map(c => {
    const thisWeek = currentWeekBlocks.value.filter(b => b.courseId === c.id).length
    return { ...c, thisWeek }
  })
)

/* ═══════════════════════════════════
   Navigation
   ═══════════════════════════════════ */
function goNext() {
  if (currentStep.value < 3) {
    currentStep.value++
    if (currentStep.value === 3) {
      blockedSlots.value = []
      currentWeekOffset.value = 0
      initPriorities()
      smartSchedule()
    }
  }
}
function goPrev() {
  if (currentStep.value > 1) currentStep.value--
}
function finish() {
  const result = {
    weeklyHours: totalSelectedHours.value,
    courses: selectedCourses.value.map(c => ({ id: c.id, title: c.title })),
    blocks: manualBlocks.value,
    savedTimeSlots: timeSlots.value.map(d => ({ ...d })),
    savedSelectedCourseIds: selectedCourses.value.map(c => c.id),
    savedBlockedSlots: blockedSlots.value.map(s => ({ ...s }))
  }
  emit('completed', result)
}

// When starting at step 3 (edit mode), auto-run smartSchedule after all functions are ready
onMounted(() => {
  if (props.startStep === 3) {
    smartSchedule()
  }
})

function close() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @mouseup="stopDrag"
      @click.self="close">
      <div
        class="relative flex max-h-[90vh] w-full max-w-[740px] flex-col overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.3)]"
        :class="currentStep === 3 ? 'max-w-[860px]' : ''">

        <!-- ═══ Header ═══ -->
        <div class="shrink-0 border-b border-[#E5E7EB] px-8 pb-1 pt-5">
          <!-- Step label -->
          <p class="text-[10px] font-bold uppercase tracking-[1px] text-[#1B3A5C]">
            ✦ 步驟 {{ currentStep }} / 3
          </p>
          <!-- Title -->
          <h2 class="mt-2 text-[20px] font-extrabold leading-[30px] tracking-[-0.6px] text-[#111]">
            <template v-if="currentStep === 1">設定每週可用時間</template>
            <template v-else-if="currentStep === 2">選擇要排入課表的課程</template>
            <template v-else>確認課表</template>
          </h2>
          <!-- Subtitle -->
          <p class="mt-1 text-[13px] text-[#888]">
            <template v-if="currentStep === 1">以小時為單位點擊或拖曳選取，系統將依此自動安排最佳課表</template>
            <template v-else-if="currentStep === 2">勾選想排入學習計畫的課程</template>
            <template v-else>系統已自動排課，點擊課程方塊可封鎖該時段，排程會自動更新</template>
          </p>
          <!-- Step indicator -->
          <div class="mt-3 mb-3 flex items-center">
            <!-- Step 1 dot -->
            <div class="flex items-center gap-[7px]">
              <div class="flex size-[22px] items-center justify-center rounded-full"
                :class="currentStep >= 1 ? 'bg-[#1B3A5C]' : 'bg-[#E5E7EB]'">
                <template v-if="currentStep > 1">
                  <i class="fa-solid fa-check text-[8px] text-white"></i>
                </template>
                <span v-else class="text-[10px] font-extrabold text-white">1</span>
              </div>
              <span class="text-[12px]"
                :class="currentStep === 1 ? 'font-bold text-[#111]' : 'text-[#444]'">設定可用時間</span>
            </div>
            <div class="mx-[10px] h-[1.5px] w-7" :class="currentStep >= 2 ? 'bg-[#1B3A5C]' : 'bg-[#E5E7EB]'" />
            <!-- Step 2 dot -->
            <div class="flex items-center gap-[7px]">
              <div class="flex size-[22px] items-center justify-center rounded-full"
                :class="currentStep >= 2 ? 'bg-[#1B3A5C]' : 'bg-[#E5E7EB]'">
                <template v-if="currentStep > 2">
                  <i class="fa-solid fa-check text-[8px] text-white"></i>
                </template>
                <span v-else class="text-[10px] font-extrabold"
                  :class="currentStep >= 2 ? 'text-white' : 'text-[#9CA3AF]'">2</span>
              </div>
              <span class="text-[12px]"
                :class="currentStep === 2 ? 'font-bold text-[#111]' : currentStep > 2 ? 'text-[#444]' : 'text-[#BBB]'">選擇課程</span>
            </div>
            <div class="mx-[10px] h-[1.5px] w-7" :class="currentStep >= 3 ? 'bg-[#1B3A5C]' : 'bg-[#E5E7EB]'" />
            <!-- Step 3 dot -->
            <div class="flex items-center gap-[7px]">
              <div class="flex size-[22px] items-center justify-center rounded-full"
                :class="currentStep >= 3 ? 'bg-[#1B3A5C]' : 'bg-[#E5E7EB]'">
                <span class="text-[10px] font-extrabold"
                  :class="currentStep >= 3 ? 'text-white' : 'text-[#9CA3AF]'">3</span>
              </div>
              <span class="text-[12px]" :class="currentStep === 3 ? 'font-bold text-[#111]' : 'text-[#BBB]'">確認課表</span>
            </div>
          </div>

          <!-- Close button -->
          <button
            class="absolute right-4 top-5 flex size-8 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#999] transition-colors hover:bg-[#E5E7EB] hover:text-[#333]"
            @click="close">
            <i class="fa-solid fa-xmark text-[11px]"></i>
          </button>
        </div>

        <!-- ═══ Body ═══ -->
        <div class="flex flex-1 overflow-hidden">

          <!-- ███████████████████████████████
               STEP 1 — 時間選取
               ███████████████████████████████ -->
          <template v-if="currentStep === 1">
            <!-- Left: Time grid -->
            <div class="flex-1 overflow-auto px-5 py-2" @mouseleave="stopDrag">
              <!-- Day headers -->
              <div class="flex select-none">
                <div class="w-[50px] shrink-0" />
                <div v-for="(day, di) in weekDays" :key="di" class="flex flex-1 flex-col items-center gap-[3px] py-1">
                  <span class="text-[11px] font-bold tracking-[0.66px]"
                    :class="di >= 5 ? 'text-[#5B3FA8]' : 'text-[#444]'">{{ day }}</span>
                  <span class="text-[10px] font-bold" :class="dayHours[di] > 0 ? 'text-[#1B3A5C]' : 'text-[#BBB]'">
                    {{ dayHours[di] > 0 ? dayHours[di] + '小時' : '—' }}
                  </span>
                </div>
              </div>
              <!-- Grid rows -->
              <div class="select-none">
                <div v-for="h in hours" :key="h" class="flex">
                  <div class="flex w-[50px] shrink-0 items-center justify-end pr-[10px]">
                    <span class="text-[10px] tracking-[0.2px]" :class="h % 2 === 0 ? 'text-[#888]' : 'text-[#BBB]'">
                      {{ String(h).padStart(2, '0') }}:00
                    </span>
                  </div>
                  <div v-for="(day, di) in weekDays" :key="di"
                    class="flex-1 cursor-pointer border-b border-l border-[#F0F2F5] transition-colors" :class="[
                      timeSlots[di][h] ? (di >= 5 ? 'bg-[#5B3FA8]/20' : 'bg-[#1B3A5C]') : 'bg-[#FAFBFC] hover:bg-[#EEF2F7]'
                    ]" style="height: 32px;" @mousedown.prevent="startDrag(di, h)" @mouseenter="enterSlot(di, h)" />
                </div>
              </div>
              <!-- Legend + hint -->
              <div class="mt-3 flex items-center justify-between text-[10px] text-[#999]">
                <div class="flex items-center gap-4">
                  <span class="flex items-center gap-1"><span
                      class="inline-block size-[10px] rounded-sm bg-[#1B3A5C]" /> 工作日可用</span>
                  <span class="flex items-center gap-1"><span
                      class="inline-block size-[10px] rounded-sm bg-[#5B3FA8]/30" /> 週末可用</span>
                  <span class="flex items-center gap-1"><span
                      class="inline-block size-[10px] rounded-sm bg-[#FAFBFC] border border-[#E5E7EB]" /> 不可用</span>
                </div>
                <span class="text-[10px] text-[#BBB]">🖱️ 可拖曳連續選取整段時間</span>
              </div>
            </div>

            <!-- Right: Sidebar -->
            <div class="w-[230px] shrink-0 border-l border-[#E5E7EB] bg-[#FAFBFC] px-5 py-4 overflow-auto">
              <p class="text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">快速套用</p>
              <div class="mt-3 flex flex-col gap-2">
                <button
                  class="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left transition-colors hover:border-[#1B3A5C]/30 hover:bg-[#EEF2F7]"
                  @click="applyPreset('workday-evening')">
                  <span class="text-base">🌙</span>
                  <div>
                    <p class="text-[12px] font-bold text-[#111]">工作日晚上</p>
                    <p class="text-[10px] text-[#999]">一~五 · 19:00-22:00</p>
                  </div>
                </button>
                <button
                  class="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left transition-colors hover:border-[#1B3A5C]/30 hover:bg-[#EEF2F7]"
                  @click="applyPreset('weekend-charge')">
                  <span class="text-base">⚡</span>
                  <div>
                    <p class="text-[12px] font-bold text-[#111]">週末充電</p>
                    <p class="text-[10px] text-[#999]">六、日 · 10:00-18:00</p>
                  </div>
                </button>
                <button
                  class="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left transition-colors hover:border-[#1B3A5C]/30 hover:bg-[#EEF2F7]"
                  @click="applyPreset('everyday-morning')">
                  <span class="text-base">☀️</span>
                  <div>
                    <p class="text-[12px] font-bold text-[#111]">每天早晨</p>
                    <p class="text-[10px] text-[#999]">一~日 · 07:00-09:00</p>
                  </div>
                </button>
                <button
                  class="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left transition-colors hover:border-[#1B3A5C]/30 hover:bg-[#EEF2F7]"
                  @click="applyPreset('slash-mode')">
                  <span class="text-base">🔀</span>
                  <div>
                    <p class="text-[12px] font-bold text-[#111]">斜槓族模式</p>
                    <p class="text-[10px] text-[#999]">三五晚上 + 週末下午</p>
                  </div>
                </button>
              </div>
              <button class="mt-3 text-[11px] text-[#999] transition-colors hover:text-[#555]" @click="clearAll">×
                清除全部時段</button>

              <!-- Summary -->
              <div class="mt-5">
                <p class="text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">本週摘要</p>
                <div class="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <p class="text-[24px] font-black leading-[26px] tracking-[-0.96px] text-[#111]">
                    {{ totalSelectedHours }} <span class="text-[14px] font-bold text-[#444]">小時 / 週</span>
                  </p>
                  <p class="mt-1 text-[11px] text-[#1B3A5C]">✓ {{ paceLabel }}</p>
                  <p class="text-[10px] text-[#BBB]">預估每週完成 {{ estimatedUnits }} 個單元</p>
                </div>
                <div v-if="daySummaries.length > 0" class="mt-3 flex flex-col gap-[6px]">
                  <div v-for="s in daySummaries" :key="s.label"
                    class="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-3 py-2">
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-bold text-[#1B3A5C]">{{ s.label }}</span>
                      <span class="text-[10px] text-[#999]">{{ s.range }}</span>
                    </div>
                    <span class="text-[11px] font-bold text-[#1B3A5C]">{{ s.hours }}小時</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ███████████████████████████████
               STEP 2 — 選擇課程
               ███████████████████████████████ -->
          <template v-else-if="currentStep === 2">
            <div class="flex-1 overflow-auto px-8 py-3">
              <p class="text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">你的已購課程（選擇要納入排程的課程）</p>
              <div class="mt-3 flex flex-col gap-[10px]">
                <div v-for="course in enrichedCourses" :key="course.id"
                  class="flex items-center gap-3 overflow-hidden rounded-[14px] border pr-4 py-1 transition-all cursor-pointer"
                  :class="course.selected
                    ? 'border-[' + (course.tagColor || '#E5E7EB') + ']'
                    : 'border-[#E5E7EB] bg-white'"
                  :style="course.selected ? { borderColor: course.tagColor || '#E5E7EB', backgroundColor: course.tagColor ? (course.tagColor === '#1B3A5C' ? 'rgba(214,228,240,0.67)' : course.tagColor === '#1A5C3A' ? 'rgba(212,239,225,0.67)' : course.tagColor === '#7C3AED' ? 'rgba(224,212,247,0.67)' : 'rgba(230,230,230,0.67)') : '#fff' } : {}"
                  @click="toggleCourseSelection(course.id)">
                  <!-- Left bar -->
                  <div class="h-[90px] w-1 shrink-0 rounded-l-[14px]"
                    :style="{ backgroundColor: course.selected ? (course.tagColor || '#E5E7EB') : '#E5E7EB' }" />
                  <!-- Checkbox -->
                  <div
                    class="flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[2px] transition-colors"
                    :class="course.selected ? '' : 'border-[#E5E7EB] bg-white'"
                    :style="course.selected ? { backgroundColor: course.tagColor || '#1B3A5C', borderColor: course.tagColor || '#1B3A5C' } : {}">
                    <i v-if="course.selected" class="fa-solid fa-check text-[8px] text-white"></i>
                  </div>
                  <!-- Info -->
                  <div class="flex min-w-0 flex-1 flex-col gap-[6px]">
                    <div class="flex items-center gap-2">
                      <p class="truncate text-[13px]"
                        :class="course.selected ? 'font-bold text-[#111]' : 'font-medium text-[#444]'">{{ course.title
                        }}</p>
                      <span v-if="course.tagColor"
                        class="shrink-0 rounded px-[7px] py-[1px] text-[10px] font-semibold text-white"
                        :style="{ backgroundColor: course.tagColor }">{{ course.tag }}</span>
                      <span v-else
                        class="shrink-0 rounded bg-[#F3F4F6] px-[7px] py-[1px] text-[10px] font-semibold text-[#888]">{{
                          course.tag }}</span>
                    </div>
                    <p class="text-[11px] text-[#888]">{{ course.instructor }} · 已完成 {{ course.progress }}%</p>
                    <div class="flex items-center gap-[2px]">
                      <div class="h-1 flex-1 overflow-hidden rounded-sm bg-[#E8EAF0]">
                        <div class="h-full rounded-sm transition-all"
                          :style="{ width: course.progress + '%', backgroundColor: course.selected ? (course.tagColor || '#C5CDD6') : '#C5CDD6' }" />
                      </div>
                      <span class="shrink-0 text-[11px] font-semibold"
                        :style="{ color: course.selected ? (course.tagColor || '#BBB') : '#BBB' }">
                        還剩 {{ course.remainHours }}小時
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Summary -->
              <div v-if="selectedCourses.length > 0"
                class="mt-4 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] px-5 py-3">
                <p class="text-[12px] text-[#555]">已選取 <span class="font-bold text-[#1B3A5C]">{{ selectedCourses.length
                    }}</span> 門課程，共 <span class="font-bold text-[#1B3A5C]">{{ totalRemainHours.toFixed(1) }}</span>
                  小時待完成</p>
              </div>
            </div>
          </template>

          <!-- ███████████████████████████████
               STEP 3 — 確認課表
               ███████████████████████████████ -->
          <template v-else>
            <!-- Left: scheduling grid -->
            <div class="flex-1 overflow-auto px-6 py-4">
              <!-- Selected courses indicator (read-only) -->
              <div class="flex items-center gap-2">
                <p class="mr-1 text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">已選課程</p>
                <span v-for="c in selectedCourses" :key="c.id"
                  class="rounded-lg border border-transparent px-3 py-[5px] text-[11px] font-bold text-white"
                  :style="{ backgroundColor: c.tagColor || '#1B3A5C' }">
                  {{ getShortTitle(c) }}
                </span>
              </div>

              <!-- Week navigation -->
              <div class="mt-2 flex items-center gap-2">
                <button
                  class="rounded px-2 py-1 text-[11px] font-bold text-[#888] transition-colors hover:bg-[#F0F2F5] disabled:opacity-30"
                  :disabled="currentWeekOffset === 0" @click="prevWeek">‹ 上週</button>
                <span class="text-[12px] font-bold text-[#1B3A5C]">第 {{ currentWeekOffset + 1 }} 週</span>
                <button class="rounded px-2 py-1 text-[11px] font-bold text-[#888] transition-colors hover:bg-[#F0F2F5]"
                  :disabled="currentWeekOffset >= totalWeeks - 1" @click="nextWeek">下週 ›</button>
                <span class="ml-2 text-[11px] text-[#888]">{{ weekRangeLabel }}</span>
                <span class="ml-auto text-[10px] text-[#BBB]">共 {{ totalWeeks }} 週</span>
              </div>

              <!-- Grid -->
              <div class="mt-3 overflow-hidden rounded-xl border border-[#E5E7EB]">
                <!-- Header row -->
                <div class="flex bg-[#F9FAFB]">
                  <div class="w-[44px] shrink-0 border-b border-[#E5E7EB]" />
                  <div v-for="(day, di) in weekDays" :key="di"
                    class="flex flex-1 flex-col items-center gap-[2px] border-b border-l border-[#E5E7EB] py-2">
                    <span class="text-[11px] font-bold tracking-[0.55px]"
                      :class="dayHours[di] > 0 ? 'text-[#1B3A5C]' : 'text-[#BBB]'">{{ day }}</span>
                    <span class="text-[9px] text-[#BBB]">{{ getWeekDateLabel(di) }}</span>
                  </div>
                </div>
                <!-- Time rows -->
                <div v-for="h in step3VisibleHours" :key="h" class="flex" style="height: 42px;">
                  <div
                    class="flex w-[44px] shrink-0 items-start justify-end border-b border-[#F0F2F5] bg-[#FAFBFC] pr-2 pt-[6px]">
                    <span class="text-[9px] text-[#BBB]">{{ String(h).padStart(2, '0') }}:00</span>
                  </div>
                  <div v-for="(day, di) in weekDays" :key="di"
                    class="relative flex-1 border-b border-l border-[#E5E7EB] transition-colors" :class="[
                      isSlotAvailable(di, h)
                        ? (isBlocked(di, h) ? 'cursor-pointer bg-[#FEF2F2]' : (getBlockAt(di, h) ? 'cursor-pointer' : 'bg-[rgba(27,58,92,0.02)]'))
                        : 'bg-[#FAFBFC]'
                    ]" @click="clickSlot(di, h)">
                    <!-- Blocked (X) slot -->
                    <template v-if="isBlocked(di, h)">
                      <div
                        class="absolute inset-x-[2px] inset-y-[2px] flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#E5A0A0] bg-[#FEF2F2]">
                        <span class="text-[16px] font-bold text-[#D97777]">✕</span>
                      </div>
                    </template>
                    <!-- Scheduled block -->
                    <template v-else-if="getBlockAt(di, h)">
                      <div
                        class="absolute inset-x-[2px] inset-y-[2px] flex cursor-pointer flex-col items-start justify-center overflow-hidden rounded-lg px-1.5 shadow-sm transition-all hover:shadow-md"
                        :title="getBlockAt(di, h).chapter + ' › ' + getBlockAt(di, h).section"
                        :style="{ backgroundColor: getBlockAt(di, h).color }">
                        <p class="w-full truncate text-[9px] font-bold text-white/95">{{ getBlockAt(di, h).shortTitle }}
                        </p>
                        <p class="w-full truncate text-[7px] text-white/70">{{ getBlockAt(di, h).section }}</p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- Legend + hint -->
              <div class="mt-3 flex items-center justify-between text-[10px] text-[#999]">
                <div class="flex items-center gap-4">
                  <span class="flex items-center gap-1"><span
                      class="inline-block size-[10px] rounded-sm bg-[#FAFBFC] border border-[#E5E7EB]" /> 不可用</span>
                  <template v-for="c in selectedCourses" :key="c.id">
                    <span class="flex items-center gap-1">
                      <span class="inline-block size-[10px] rounded-sm"
                        :style="{ backgroundColor: c.tagColor || '#1B3A5C' }" />
                      {{ getShortTitle(c) }}
                    </span>
                  </template>
                  <span class="flex items-center gap-1"><span
                      class="inline-block size-[10px] rounded-sm border-2 border-dashed border-[#E5A0A0] bg-[#FEF2F2]" />
                    已封鎖</span>
                </div>
                <span class="text-[10px] text-[#BBB]">點擊課程方塊可封鎖該時段，點擊 ✕ 可取消封鎖</span>
              </div>
            </div>

            <!-- Right: sidebar -->
            <div class="w-[210px] shrink-0 border-l border-[#E5E7EB] bg-[#FAFBFC] px-5 py-4 overflow-auto">
              <!-- 排課優先順序 -->
              <p class="text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">排課優先順序</p>
              <div class="mt-2 flex flex-col gap-[6px]">
                <div v-for="(c, ci) in priorityOrderedCourses" :key="'p-'+c.id"
                  class="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 transition-all"
                  :style="{ borderColor: c.tagColor || '#E5E7EB' }">
                  <!-- 順序號碼 -->
                  <span class="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                    :style="{ backgroundColor: c.tagColor || '#1B3A5C' }">{{ ci + 1 }}</span>
                  <!-- 課程名稱 -->
                  <p class="flex-1 truncate text-[11px] font-bold text-[#111]">{{ getShortTitle(c) }}</p>
                  <!-- 上下箭頭 -->
                  <div class="flex flex-col gap-0">
                    <button class="px-1 text-[10px] text-[#999] transition-colors hover:text-[#1B3A5C] disabled:opacity-20"
                      :disabled="ci === 0" @click="movePriority(c.id, -1)">
                      <i class="fa-solid fa-chevron-up"></i>
                    </button>
                    <button class="px-1 text-[10px] text-[#999] transition-colors hover:text-[#1B3A5C] disabled:opacity-20"
                      :disabled="ci === priorityOrderedCourses.length - 1" @click="movePriority(c.id, 1)">
                      <i class="fa-solid fa-chevron-down"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="mt-1.5 text-[9px] text-[#BBB] leading-[13px]">排在前面的課程會優先安排到較早的時段</p>

              <!-- 排課摘要 -->
              <p class="mt-4 text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">排課摘要</p>
              <div class="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.9px] text-[#888]">第 {{ currentWeekOffset + 1 }} 週
                </p>
                <p class="mt-2 text-[28px] font-black leading-[30px] tracking-[-1px] text-[#111]">
                  {{ currentWeekTotalHours }} <span class="text-[14px] font-bold text-[#444]">小時</span>
                </p>
                <p class="mt-1 text-[11px] text-[#1B3A5C]">✓ 共 {{ totalWeeks }} 週，{{ allWeeksTotalHours }} 小時</p>
              </div>

              <div class="mt-4 flex flex-col gap-[10px]">
                <div v-for="c in courseSummaries" :key="c.id"
                  class="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
                  <div class="flex items-center justify-between">
                    <p class="text-[12px] font-bold text-[#111]">{{ c.title.length > 10 ? c.title.slice(0, 10) + '…' :
                      c.title }}
                    </p>
                    <span class="rounded-md px-2 py-[2px] text-[11px] font-bold text-white"
                      :style="{ backgroundColor: c.tagColor || '#1B3A5C' }">{{ c.thisWeek }}h</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex items-start gap-2 text-[10px] text-[#888]">
                <span
                  class="mt-[1px] flex size-[14px] shrink-0 items-center justify-center rounded-full border border-[#BBB] text-[8px]">?</span>
                <p class="leading-[15px]">系統已自動排課。若某時段有事，點擊該格封鎖即可，排程會自動更新。</p>
              </div>
            </div>
          </template>
        </div>

        <!-- ═══ Footer ═══ -->
        <div class="flex shrink-0 items-center justify-between border-t border-[#E5E7EB] px-8 py-4">
          <!-- Left info -->
          <p class="text-[12px] text-[#1B3A5C]">
            <template v-if="currentStep === 1">✓ 共選取 {{ totalSelectedHours }} 個小時時段</template>
            <template v-else-if="currentStep === 2">✓ 已選 {{ selectedCourses.length }} 門課程，共 {{
              totalRemainHours.toFixed(1) }}小時待完成</template>
            <template v-else>✓ 共 {{ totalWeeks }} 週，{{ allWeeksTotalHours }} 小時｜第 {{ currentWeekOffset + 1 }} 週 {{
              currentWeekTotalHours }} 小時</template>
          </p>
          <!-- Buttons -->
          <div class="flex items-center gap-3">
            <button v-if="currentStep === 1"
              class="rounded-lg border border-[#E5E7EB] bg-white px-5 py-[10px] text-[13px] font-semibold text-[#555] transition-colors hover:bg-[#F3F4F6]"
              @click="close">
              取消
            </button>
            <button v-if="currentStep > 1"
              class="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-5 py-[10px] text-[13px] font-semibold text-[#555] transition-colors hover:bg-[#F3F4F6]"
              @click="goPrev">
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
              上一步
            </button>
            <button v-if="currentStep < 3"
              class="flex items-center gap-1 rounded-lg bg-[#1B3A5C] px-5 py-[10px] text-[13px] font-bold text-white transition-colors hover:bg-[#17314D]"
              :disabled="(currentStep === 1 && totalSelectedHours === 0) || (currentStep === 2 && selectedCourses.length === 0)"
              :class="{ 'opacity-40 cursor-not-allowed': (currentStep === 1 && totalSelectedHours === 0) || (currentStep === 2 && selectedCourses.length === 0) }"
              @click="goNext">
              下一步：{{ currentStep === 1 ? '選擇課程' : '排入課表' }}
              <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
            <button v-if="currentStep === 3"
              class="flex items-center gap-1 rounded-lg bg-[#1B3A5C] px-5 py-[10px] text-[13px] font-bold text-white transition-colors hover:bg-[#17314D]"
              @click="finish">
              <i class="fa-solid fa-check text-[10px]"></i>
              儲存課表
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
