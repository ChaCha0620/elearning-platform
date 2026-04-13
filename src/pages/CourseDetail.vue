<script setup>
import CourseHeaderNav from '../components/course/CourseHeaderNav.vue'
import CourseHero from '../components/course/CourseHero.vue'
import CourseCurriculum from '../components/course/CourseCurriculum.vue'
import AchievementCard from '../components/course/AchievementCard.vue'
import NotesPanel from '../components/course/NotesPanel.vue'
import QAPanel from '../components/course/QAPanel.vue'

// ─── 課程基本資訊 ───
const courseInfo = {
  status: '進行中',
  title: 'React 進階：狀態管理與系統架構',
  instructor: '陳建宏',
  totalChapters: 28,
  totalHours: '14.5',
  completedChapters: 12,
  remainingChapters: 16,
  progressPercent: 45,
  estimatedHours: '7.8'
}

// ─── 進度條分段（含章節範圍與完成度） ───
const sections = [
  { label: '基礎複習', chapters: '1-1 ~ 1-3', percent: 100, status: 'done' },
  { label: 'Context API', chapters: '2-1 ~ 2-4', percent: 50, status: 'current' },
  { label: 'Redux', chapters: '3-1 ~ 3-3', percent: 0, status: 'locked' },
  { label: 'Zustand', chapters: '4-1 ~ 4-3', percent: 0, status: 'locked' },
  { label: '架構設計', chapters: '5-1 ~ 5-4', percent: 0, status: 'locked' }
]

// ─── 課程大綱（模組 + 課節） ───
const modules = [
  {
    title: '單元 1：基礎概念複習',
    meta: '2 支影片 · 1 份測驗',
    status: 'done',
    defaultOpen: true,
    lessons: [
      { type: 'video', title: 'React 渲染機制回顧', duration: '18:20', status: 'done' },
      { type: 'video', title: 'Hooks 使用規則', duration: '22:05', status: 'done' },
      { type: 'quiz', title: '單元測驗：Hooks 基礎', duration: '10 題', status: 'done' }
    ]
  },
  {
    title: '單元 2：Context API 實戰',
    meta: '3 支影片 · 1 份作業',
    status: 'current',
    defaultOpen: true,
    lessons: [
      { type: 'video', title: 'Context 的設計哲學與使用時機', duration: '24:10', status: 'done' },
      { type: 'video', title: 'useContext 深度整合', duration: '31:45', status: 'current', isCurrent: true },
      { type: 'video', title: '效能優化：memo 與 useMemo', duration: '28:00', status: 'locked' },
      { isAssignment: true, title: '作業：重構購物車狀態', duration: '完成後可解鎖下一單元' }
    ]
  },
  {
    title: '單元 3：Redux Toolkit 實戰',
    meta: '2 支影片 · 1 份作業',
    status: 'locked',
    defaultOpen: false,
    lessons: [
      { type: 'video', title: 'Redux Toolkit 快速入門', duration: '26:30', status: 'locked' },
      { type: 'video', title: 'createSlice 與非同步 Thunk', duration: '34:15', status: 'locked' },
      { isAssignment: true, title: '作業：todo app 狀態重構', duration: '提交即完成' }
    ]
  }
]

// ─── 成就卡資料 ───
const achievement = {
  badge: 'React 架構大師',
  description: '完成度達 90% 且繳交作業，即可解鎖此徽章並獲得',
  reward: '8折券',
  progressCurrent: 45,
  progressTarget: 90,
  hint: '距離解鎖還差 45%，繼續完成作業！'
}

// ─── 筆記資料 ───
const notes = [
  {
    time: '03:45',
    color: 'bg-[#1B3A5C]',
    text: 'useEffect 的依賴寫法要避免 object reference 陷阱',
    chapter: '章節 2-2 · 點擊跳轉複習'
  },
  {
    time: '11:20',
    color: 'bg-[#5B3FA8]',
    text: 'Context 穿透多層元件時需注意重渲染效能問題',
    chapter: '章節 2-1 · 點擊跳轉複習'
  }
]

// ─── 所有章節筆記（header筆記按鈕 & 全部筆記按鈕共用） ───
const allNotes = [
  {
    time: '03:45',
    color: 'bg-[#1B3A5C]',
    text: 'useEffect 的依賴寫法要避免 object reference 陷阱',
    chapter: '章節 2-2 · useContext 深度整合'
  },
  {
    time: '11:20',
    color: 'bg-[#5B3FA8]',
    text: 'Context 穿透多層元件時需注意重渲染效能問題',
    chapter: '章節 2-1 · Context 的設計哲學'
  },
  {
    time: '05:32',
    color: 'bg-[#1B3A5C]',
    text: 'React 渲染機制：Virtual DOM diff 演算法',
    chapter: '章節 1-1 · React 渲染機制回顧'
  },
  {
    time: '14:10',
    color: 'bg-[#1B3A5C]',
    text: 'useCallback 和 useMemo 的使用時機差異',
    chapter: '章節 1-2 · Hooks 使用規則'
  },
  {
    time: '08:55',
    color: 'bg-[#5B3FA8]',
    text: 'Provider 巢狀層級過深會造成不必要的重渲染',
    chapter: '章節 2-1 · Context 的設計哲學'
  },
  {
    time: '22:15',
    color: 'bg-[#1B3A5C]',
    text: 'useReducer 適合處理複雜的狀態邏輯，可替代多個 useState',
    chapter: '章節 1-2 · Hooks 使用規則'
  },
  {
    time: '17:30',
    color: 'bg-[#5B3FA8]',
    text: 'createContext 的 defaultValue 只在沒有 Provider 包裹時生效',
    chapter: '章節 2-1 · Context 的設計哲學'
  },
  {
    time: '06:48',
    color: 'bg-[#1B3A5C]',
    text: 'StrictMode 會在開發環境下雙重呼叫 useEffect，上線後不會',
    chapter: '章節 1-1 · React 渲染機制回顧'
  }
]

// ─── 常見問題資料 ───
const questions = [
  {
    question: '為什麼 useEffect 依賴陣列留空時，某些情況還是會重複執行？',
    answer: '這通常是因為 StrictMode 在開發環境下的雙重呼叫機制，上線後不會有此問題。',
    helpfulCount: 42,
    instructorReplied: true
  },
  {
    question: 'Context 和 Redux 的選擇時機？什麼規模的專案才需要 Redux？',
    answer: 'Context 適合低頻更新的全域狀態（如 theme、auth），高頻互動建議用 Zustand 或 Redux Toolkit。',
    helpfulCount: 38,
    instructorReplied: true
  }
]
</script>

<template>
  <!-- Course Detail page -->
  <div class="min-h-screen bg-[#F8F9FA] pt-20">
    <!-- Header -->
    <CourseHeaderNav :progress="courseInfo.progressPercent" :showBack="false" :allNotes="allNotes" userName="小凌" />

    <!-- Breadcrumbs + Hero -->
    <div class="mx-auto w-full max-w-[1440px] px-6 pt-5 md:px-16">
      <!-- Back link (above breadcrumbs, not in header) -->
      <router-link :to="{ name: 'schedule' }"
        class="mb-3 inline-flex items-center gap-[7px] text-[13px] font-medium text-[#888] transition-colors duration-200 hover:text-[#555]">
        <i class="fa-solid fa-chevron-left text-[12px]"></i>
        返回個人主頁
      </router-link>

      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-[6px] text-[13px]">
        <router-link :to="{ name: 'myCourses' }"
          class="text-[#999] transition-colors duration-200 hover:text-[#555]">已購課程</router-link>
        <i class="fa-solid fa-chevron-right text-[12px] text-[#999]"></i>
        <span class="font-semibold text-[#3672B5]">React進階</span>
      </nav>

      <!-- Hero card -->
      <div class="mt-4">
        <CourseHero v-bind="courseInfo" :sections="sections" />
      </div>
    </div>

    <!-- Main content: Curriculum + Sidebar -->
    <div class="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-16">
      <div class="grid gap-7 lg:grid-cols-[2fr_1fr]">
        <!-- Left: Curriculum -->
        <CourseCurriculum :modules="modules" :locked-count="2" />

        <!-- Right: Sidebar -->
        <div class="flex min-w-0 flex-col gap-4">
          <AchievementCard v-bind="achievement" />
          <NotesPanel :notes="notes" :allNotes="allNotes" />
          <QAPanel :questions="questions" />
        </div>
      </div>
    </div>
  </div>
</template>
