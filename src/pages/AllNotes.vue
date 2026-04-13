<script setup>
import { ref, computed } from 'vue'
import HeaderLoggedIn from '../components/common/HeaderLoggedIn.vue'
import Footer from '../components/common/Footer.vue'

// ─── 所有已購課程的筆記資料 ───
const courseNotes = [
  {
    courseId: 1,
    courseTitle: 'React 進階：Hooks 與狀態管理',
    courseColor: '#3672B5',
    icon: '⚛',
    progress: 45,
    notes: [
      { time: '03:45', color: 'bg-[#1B3A5C]', text: 'useEffect 的依賴寫法要避免 object reference 陷阱', chapter: '章節 2-2 · useContext 深度整合' },
      { time: '11:20', color: 'bg-[#5B3FA8]', text: 'Context 穿透多層元件時需注意重渲染效能問題', chapter: '章節 2-1 · Context 的設計哲學' },
      { time: '05:32', color: 'bg-[#1B3A5C]', text: 'React 渲染機制：Virtual DOM diff 演算法', chapter: '章節 1-1 · React 渲染機制回顧' },
      { time: '14:10', color: 'bg-[#1B3A5C]', text: 'useCallback 和 useMemo 的使用時機差異', chapter: '章節 1-2 · Hooks 使用規則' },
      { time: '08:55', color: 'bg-[#5B3FA8]', text: 'Provider 巢狀層級過深會造成不必要的重渲染', chapter: '章節 2-1 · Context 的設計哲學' }
    ]
  },
  {
    courseId: 2,
    courseTitle: 'UI/UX 設計概論',
    courseColor: '#E67E22',
    icon: '🎨',
    progress: 20,
    notes: [
      { time: '02:18', color: 'bg-[#E67E22]', text: '設計系統的一致性原則：色彩、間距、字級要統一', chapter: '章節 1-1 · 設計系統基礎' },
      { time: '07:30', color: 'bg-[#E67E22]', text: '可用性測試應在原型階段就開始進行', chapter: '章節 1-3 · 可用性測試入門' },
      { time: '15:42', color: 'bg-[#E67E22]', text: '情緒板（Mood Board）有助於統一視覺方向', chapter: '章節 2-1 · 視覺設計流程' }
    ]
  },
  {
    courseId: 3,
    courseTitle: 'JavaScript 核心觀念',
    courseColor: '#1A5C3A',
    icon: '📜',
    progress: 68,
    notes: [
      { time: '06:10', color: 'bg-[#1A5C3A]', text: '閉包（Closure）保留外層函式的作用域鏈', chapter: '章節 3-1 · 閉包與作用域' },
      { time: '09:45', color: 'bg-[#1A5C3A]', text: 'Promise.all 會在任一失敗時直接 reject，注意錯誤處理', chapter: '章節 4-2 · 非同步程式設計' }
    ]
  }
]

const searchQuery = ref('')
const activeCourseId = ref(null)

const totalNotes = computed(() => courseNotes.reduce((sum, c) => sum + c.notes.length, 0))

const filteredCourses = computed(() => {
  let courses = activeCourseId.value
    ? courseNotes.filter(c => c.courseId === activeCourseId.value)
    : courseNotes
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    courses = courses.map(c => ({
      ...c,
      notes: c.notes.filter(n => n.text.toLowerCase().includes(q) || n.chapter.toLowerCase().includes(q))
    })).filter(c => c.notes.length > 0)
  }
  return courses
})

const filteredTotal = computed(() => filteredCourses.value.reduce((sum, c) => sum + c.notes.length, 0))



function groupByChapter(notes) {
  const map = {}
  notes.forEach(note => {
    const ch = note.chapter || '未分類'
    if (!map[ch]) map[ch] = []
    map[ch].push(note)
  })
  return Object.entries(map).map(([chapter, items]) => ({ chapter, items }))
}
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA]">
    <!-- Header -->
    <HeaderLoggedIn userName="小凌" />

    <!-- Content -->
    <div class="mx-auto w-full max-w-[960px] px-6 py-10 pt-28 md:px-16">
      <!-- Page heading -->
      <div class="mb-8 flex flex-col gap-1">
        <p class="text-[11px] font-semibold uppercase tracking-[1.1px] text-[#1B3A5C]">✦ 跨課程筆記總整理</p>
        <h1 class="text-[28px] font-black tracking-[-0.98px] text-[#111]">筆記總覽</h1>
        <p class="text-[14px] text-[#888]">集中管理所有課程中記下的學習筆記</p>
      </div>

      <!-- Stats bar -->
      <div class="mb-6 grid grid-cols-3 gap-3">
        <div class="rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 text-center">
          <p class="text-[22px] font-black text-[#1B3A5C]">{{ courseNotes.length }}</p>
          <p class="text-[11px] font-medium text-[#888]">門課程</p>
        </div>
        <div class="rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 text-center">
          <p class="text-[22px] font-black text-[#1B3A5C]">{{ totalNotes }}</p>
          <p class="text-[11px] font-medium text-[#888]">則筆記</p>
        </div>
        <div class="rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 text-center">
          <p class="text-[22px] font-black text-[#1B3A5C]">{{courseNotes.reduce((s, c) => s + new Set(c.notes.map(n =>
            n.chapter)).size, 0)}}</p>
          <p class="text-[11px] font-medium text-[#888]">個章節</p>
        </div>
      </div>

      <!-- Search + course filter -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <!-- Search -->
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#BBB]"></i>
          <input v-model="searchQuery" type="text" placeholder="搜尋筆記內容或章節名稱…"
            class="w-full rounded-xl border border-[#E5E7EB] bg-white py-[10px] pl-9 pr-4 text-[13px] text-[#333] placeholder-[#BBB] outline-none transition-colors duration-150 focus:border-[#1B3A5C]/40" />
        </div>
        <!-- Course dropdown -->
        <div class="relative shrink-0">
          <select v-model="activeCourseId"
            class="min-w-[180px] appearance-none rounded-xl border border-[#E5E7EB] bg-white py-[10px] pl-4 pr-9 text-[13px] font-medium text-[#333] outline-none transition-colors duration-150 focus:border-[#1B3A5C]/40">
            <option :value="null">全部課程</option>
            <option v-for="course in courseNotes" :key="course.courseId" :value="course.courseId">
              {{ course.icon }} {{ course.courseTitle }}
            </option>
          </select>
          <i
            class="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#999]"></i>
        </div>
      </div>

      <!-- Filtered result hint -->
      <p v-if="searchQuery.trim() || activeCourseId" class="mb-4 text-[12px] text-[#888]">
        顯示 {{ filteredTotal }} 則筆記
        <button v-if="searchQuery.trim() || activeCourseId" @click="searchQuery = ''; activeCourseId = null"
          class="ml-2 text-[#3672B5] hover:underline">清除篩選</button>
      </p>

      <!-- Course sections -->
      <div class="flex flex-col gap-10">
        <div v-for="course in filteredCourses" :key="course.courseId">
          <!-- Course header card -->
          <div class="mb-4 flex items-center gap-4 rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4">
            <div class="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-[18px]"
              :style="{ backgroundColor: course.courseColor + '18' }">
              {{ course.icon }}
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <h2 class="truncate text-[15px] font-bold tracking-[-0.32px] text-[#111]">{{ course.courseTitle }}</h2>
              <div class="flex items-center gap-2">
                <div class="h-[3px] w-20 rounded-full bg-[#E5E7EB]">
                  <div class="h-full rounded-full transition-all duration-500"
                    :style="{ width: course.progress + '%', backgroundColor: course.courseColor }" />
                </div>
                <span class="text-[11px] text-[#BBB]">{{ course.progress }}% 完成</span>
              </div>
            </div>
            <span class="shrink-0 rounded-full px-[10px] py-[3px] text-[11px] font-semibold text-white"
              :style="{ backgroundColor: course.courseColor }">
              {{ course.notes.length }} 則筆記
            </span>
          </div>

          <!-- Notes grouped by chapter -->
          <div class="flex flex-col gap-6 pl-2">
            <div v-for="group in groupByChapter(course.notes)" :key="group.chapter">
              <!-- Chapter heading -->
              <div class="mb-3 flex items-center gap-2 border-l-2 pl-3" :style="{ borderColor: course.courseColor }">
                <h3 class="text-[13px] font-bold text-[#111]">{{ group.chapter }}</h3>
                <span class="rounded-full bg-[#F0F2F5] px-[7px] py-[1px] text-[11px] font-medium text-[#888]">{{
                  group.items.length }} 則</span>
              </div>

              <!-- Note cards -->
              <div class="flex flex-col gap-2 pl-5">
                <div v-for="(note, j) in group.items" :key="j"
                  class="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                  <!-- Timestamp -->
                  <div
                    class="mt-0.5 shrink-0 rounded-md px-2 py-[3px] text-[11px] font-bold tracking-[0.2px] text-white"
                    :class="note.color || 'bg-[#1B3A5C]'">
                    {{ note.time }}
                  </div>
                  <!-- Content -->
                  <div class="flex min-w-0 flex-1 flex-col gap-1">
                    <p class="text-[13px] leading-[21px] text-[#111]">{{ note.text }}</p>
                    <p class="text-[11px] text-[#BBB]">點擊跳轉到影片對應時間</p>
                  </div>
                  <!-- Jump icon -->
                  <i
                    class="fa-solid fa-chevron-right mt-1 shrink-0 text-[14px] text-[#BBB] transition-colors duration-150 hover:text-[#3672B5]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredCourses.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
          <p class="text-[40px]">📝</p>
          <p class="text-[15px] font-semibold text-[#555]">找不到符合的筆記</p>
          <p class="text-[13px] text-[#999]">試試不同的關鍵字或清除篩選條件</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>
