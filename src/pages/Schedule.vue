<script setup>
import { ref, computed } from 'vue'
import HeaderLoggedIn from '../components/common/HeaderLoggedIn.vue'
import Footer from '../components/common/Footer.vue'
import ScheduleSidebar from '../components/schedule/ScheduleSidebar.vue'
import ScheduleHero from '../components/schedule/ScheduleHero.vue'
import ScheduleCalendar from '../components/schedule/ScheduleCalendar.vue'
import SchedulePlanDialog from '../components/schedule/SchedulePlanDialog.vue'

/* ── Plan dialog ── */
const isPlanDialogOpen = ref(false)
const planResult = ref(null)

// Saved state for edit mode re-entry
const savedTimeSlots = ref(null)
const savedSelectedCourseIds = ref([])
const savedBlockedSlots = ref([])

const hasSchedule = computed(() => planResult.value != null)

// Dynamic hero description — only show after scheduling
const heroDescription = computed(() => {
  if (!hasSchedule.value) return ''
  const r = planResult.value
  const courseTitles = (r.courses || []).map(c => c.title)
  if (courseTitles.length === 0) return ''
  // Build a concise weekly goal
  if (courseTitles.length === 1) {
    return `本週目標：完成 ${courseTitles[0]} 課程進度`
  }
  return `本週目標：完成 ${courseTitles[0]} + ${courseTitles[1]} 概論複習`
})

// Dynamic study hours — sum current week block hours
const heroStudyHours = computed(() => {
  if (!planResult.value || !planResult.value.blocks) return '0'
  const blocks = planResult.value.blocks.filter(b => (b.weekOffset ?? 0) === calendarWeekOffset.value)
  const total = blocks.reduce((sum, b) => sum + (b.span || 0), 0)
  return String(total)
})

// Dynamic study goal
const heroStudyGoal = computed(() => {
  if (!planResult.value) return ''
  return `目標 ${planResult.value.weeklyHours || 0} 小時`
})

// Dialog start step: first time → 1, after schedule exists → 3
const dialogStartStep = computed(() => hasSchedule.value ? 3 : 1)

function openDialog() {
  isPlanDialogOpen.value = true
}

/* ── Calendar week navigation ── */
const calendarWeekOffset = ref(0)

// Base date: 2026/3/30 Mon (same as SchedulePlanDialog)
const BASE_DATE = new Date(2026, 2, 30)

const calendarWeekStart = computed(() => {
  const d = new Date(BASE_DATE)
  d.setDate(d.getDate() + calendarWeekOffset.value * 7)
  return d
})

const weekLabel = computed(() => {
  const s = calendarWeekStart.value
  const year = s.getFullYear()
  // Calculate ISO week number
  const d = new Date(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${year} 年 第 ${weekNo} 週`
})

const calendarTotalWeeks = computed(() => {
  if (!planResult.value || !planResult.value.blocks) return 1
  const maxWk = Math.max(...planResult.value.blocks.map(b => b.weekOffset ?? 0))
  return maxWk + 1
})

const days = computed(() => {
  const dayLabels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dayLabels.map((label, i) => {
    const d = new Date(calendarWeekStart.value)
    d.setDate(d.getDate() + i)
    return {
      dayLabel: label,
      dateNum: String(d.getDate()),
      dateSuffix: `/${d.getMonth() + 1}`,
      isToday: d.getTime() === today.getTime()
    }
  })
})

function buildCalendarFromBlocks(allBlocks, weekOff) {
  const blocks = allBlocks.filter(b => (b.weekOffset ?? 0) === weekOff)
  if (blocks.length === 0) {
    timeSlots.value = [...defaultSlots]
    courseBlocks.value = []
    legends.value = []
    return
  }
  let minH = 24, maxH = 0
  for (const b of blocks) {
    if (b.startHour < minH) minH = b.startHour
    const end = b.startHour + b.span
    if (end > maxH) maxH = end
  }
  minH = Math.max(0, minH - 1)
  maxH = Math.min(23, maxH + 1)
  const slots = []
  for (let h = minH; h <= maxH; h++) slots.push(String(h).padStart(2, '0') + ':00')
  timeSlots.value = slots
  courseBlocks.value = blocks.map((b, i) => ({
    id: i + 1,
    dayIndex: b.dayIdx,
    startSlotIndex: b.startHour - minH,
    offsetPx: 0,
    spanSlots: b.span,
    title: b.title || b.shortTitle,
    chapter: b.chapter || '',
    timeRange: b.timeRange,
    color: b.color
  }))
  const seen = new Set()
  legends.value = blocks.filter(b => {
    const key = b.shortTitle || b.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).map(b => ({ label: (b.shortTitle || b.title) + ' 課程', color: b.color }))
}

function onPlanCompleted(result) {
  planResult.value = result
  isPlanDialogOpen.value = false
  // Save state for edit mode
  savedTimeSlots.value = result.savedTimeSlots || null
  savedSelectedCourseIds.value = result.savedSelectedCourseIds || []
  savedBlockedSlots.value = result.savedBlockedSlots || []
  // Show first week on calendar
  calendarWeekOffset.value = 0
  if (result && result.blocks && result.blocks.length > 0) {
    buildCalendarFromBlocks(result.blocks, 0)
  }
}

function calendarPrevWeek() {
  if (calendarWeekOffset.value > 0) {
    calendarWeekOffset.value--
    if (planResult.value && planResult.value.blocks) {
      buildCalendarFromBlocks(planResult.value.blocks, calendarWeekOffset.value)
    }
  }
}

function calendarNextWeek() {
  if (calendarWeekOffset.value < calendarTotalWeeks.value - 1) {
    calendarWeekOffset.value++
    if (planResult.value && planResult.value.blocks) {
      buildCalendarFromBlocks(planResult.value.blocks, calendarWeekOffset.value)
    }
  }
}

/* ── Tip banner ── */
const showTip = ref(true)

// Default: time slots starting from 07:00
const defaultSlots = Array.from({ length: 17 }, (_, i) => String(i + 7).padStart(2, '0') + ':00')
const timeSlots = ref([...defaultSlots])

/* ── Course blocks on calendar ── (empty by default, populated from plan) */
const courseBlocks = ref([])

const legends = ref([])


</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA]">
    <!-- Header -->
    <HeaderLoggedIn userName="小凌" />

    <!-- Body: sidebar + content -->
    <div class="flex pt-20">
      <!-- Sidebar -->
      <ScheduleSidebar userName="小凌" :streakDays="7" activeItem="我的課表" />

      <!-- Main content -->
      <main class="ml-[260px] flex-1 px-16 py-5">
        <div class="mx-auto flex max-w-[1120px] flex-col gap-5">
          <!-- Hero -->
          <ScheduleHero :weekLabel="weekLabel" title="你的本週學習排程" :description="heroDescription"
            :studyHours="heroStudyHours" :studyGoal="heroStudyGoal" :completedUnits="12" unitsNote="本月累計"
            :streakDays="7" :hasSchedule="hasSchedule" @plan="openDialog" />

          <!-- Tip banner -->
          <div v-if="showTip && hasSchedule"
            class="flex items-center justify-between rounded-[10px] border border-[#F5D87A] bg-[#FFFBEC] px-[17px] py-[11px]">
            <p class="text-[13px] text-[#7A5500]">
              <span class="font-bold">提示：</span>如果想要重新編輯行事曆，請按上方的「編輯安排學習時間」按鈕，即可調整課程與時段。
            </p>
            <button
              class="shrink-0 text-[12px] font-medium text-[#B07A20] transition-colors duration-150 hover:text-[#7A5500]"
              @click="showTip = false">
              知道了 ×
            </button>
          </div>

          <!-- Calendar -->
          <ScheduleCalendar :days="days" :timeSlots="timeSlots" :courseBlocks="courseBlocks" :legends="legends"
            :currentWeekOffset="calendarWeekOffset" :totalWeeks="calendarTotalWeeks" @prev-week="calendarPrevWeek"
            @next-week="calendarNextWeek" />
        </div>
      </main>
    </div>

    <!-- Plan Dialog -->
    <SchedulePlanDialog v-if="isPlanDialogOpen" :startStep="dialogStartStep" :savedTimeSlots="savedTimeSlots"
      :savedSelectedCourseIds="savedSelectedCourseIds" :savedBlockedSlots="savedBlockedSlots"
      @close="isPlanDialogOpen = false" @completed="onPlanCompleted" />

    <!-- Plan result banner -->
    <div v-if="planResult" class="ml-[260px] px-16">
      <div class="mx-auto mb-4 max-w-[1120px] rounded-xl border border-[#D4EFDF] bg-[#EAFAF1] px-5 py-4">
        <div class="flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-[#1A5C3A] text-xs text-white">✓</span>
          <p class="text-[13px] font-bold text-[#1A5C3A]">學習計畫已建立！</p>
        </div>
        <p class="mt-2 text-[12px] text-[#555]">每週排入 {{ planResult.weeklyHours }} 小時，共 {{ planResult.courses.length }}
          門課程。課表已同步至行事曆。</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="ml-[260px]">
      <Footer />
    </div>
  </div>
</template>
