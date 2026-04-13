<script setup>
import { ref } from 'vue'
import ScheduleCourseBlock from './ScheduleCourseBlock.vue'

const props = defineProps({
  days: {
    type: Array,
    default: () => []
    /* { dayLabel, dateNum, dateSuffix, isToday } */
  },
  timeSlots: {
    type: Array,
    default: () => []
    /* string[], e.g. ['14:00','15:00',...] */
  },
  courseBlocks: {
    type: Array,
    default: () => []
    /* { id, dayIndex(0-6), startSlotIndex, spanSlots, title, chapter, timeRange, color } */
  },
  legends: {
    type: Array,
    default: () => []
    /* { label, color } */
  },
  currentWeekOffset: {
    type: Number,
    default: 0
  },
  totalWeeks: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['prev-week', 'next-week'])

const activeNav = ref('本週')
</script>

<template>
  <section class="flex flex-col gap-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between">
      <!-- Title + badge -->
      <div class="flex items-center gap-[10px]">
        <h2 class="text-[16px] font-bold tracking-[-0.32px] text-[#111]">智慧排程行事曆</h2>
        <span class="rounded-full bg-[#EEF2F7] px-[10px] py-[2px] text-[11px] font-semibold text-[#1B3A5C]">週視圖</span>
      </div>

      <!-- Right controls -->
      <div class="flex items-center gap-3">
        <!-- Legend -->
        <div class="flex items-center gap-3">
          <div v-for="legend in legends" :key="legend.label" class="flex items-center gap-[5px]">
            <span class="size-[10px] rounded-[2px]" :style="{ backgroundColor: legend.color }" />
            <span class="text-[11px] text-[#888]">{{ legend.label }}</span>
          </div>
        </div>

        <!-- Week nav -->
        <div class="flex items-center gap-0">
          <button
            class="rounded-lg border border-[#E5E7EB] px-3 py-[7px] text-[12px] text-[#444] transition-colors duration-150 hover:bg-[#F8F9FA] disabled:opacity-30"
            :disabled="currentWeekOffset === 0" @click="emit('prev-week')">
            ‹ 上週
          </button>
          <button class="rounded-lg px-3 py-[7px] text-[12px] font-semibold transition-colors duration-150"
            :class="currentWeekOffset === 0 ? 'bg-[#1B3A5C] text-white hover:bg-[#16324E]' : 'bg-[#1B3A5C] text-white hover:bg-[#16324E]'">
            第 {{ currentWeekOffset + 1 }} 週
          </button>
          <button
            class="rounded-lg border border-[#E5E7EB] px-3 py-[7px] text-[12px] text-[#444] transition-colors duration-150 hover:bg-[#F8F9FA] disabled:opacity-30"
            :disabled="currentWeekOffset >= totalWeeks - 1" @click="emit('next-week')">
            下週 ›
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <!-- Scrollable area (header + time rows share same scroll context for alignment) -->
      <div class="max-h-[600px] overflow-y-auto">
        <!-- Day headers (sticky) -->
        <div class="sticky top-0 z-10 grid border-b border-[#E5E7EB] bg-white"
          :style="{ gridTemplateColumns: '56px repeat(7, 1fr)' }">
          <!-- Empty corner -->
          <div class="border-r border-[#E5E7EB]" />

          <div v-for="(day, i) in days" :key="i"
            class="flex flex-col gap-1 border-r border-[#E5E7EB] px-3 pt-[14px] pb-3 last:border-r-0"
            :class="day.isToday ? 'bg-[#EEF2F7]' : ''">
            <span class="text-[11px] font-semibold uppercase tracking-[0.55px]"
              :class="day.isToday ? 'text-[#1B3A5C]' : 'text-[#888]'">
              {{ day.dayLabel }}
            </span>
            <span class="text-[18px] font-extrabold tracking-[-0.54px]"
              :class="day.isToday ? 'text-[#1B3A5C]' : (i >= 5 ? 'text-[#BBB]' : 'text-[#111]')">
              {{ day.dateNum }}<span class="text-[11px] font-normal text-[#888]">{{ day.dateSuffix }}</span>
            </span>
          </div>
        </div>

        <!-- Time rows -->
        <div class="relative">
          <div v-for="(slot, si) in timeSlots" :key="si" class="grid border-b border-[#F0F2F5] last:border-b-0"
            :style="{ gridTemplateColumns: '56px repeat(7, 1fr)', height: '72px' }">
            <!-- Time label -->
            <div class="flex items-start justify-end border-r border-[#E5E7EB] pr-[10px] pt-2">
              <span class="text-[10px] tracking-[0.3px] text-[#BBB]">{{ slot }}</span>
            </div>
            <!-- Day cells -->
            <div v-for="di in 7" :key="di" class="border-r border-[#F0F2F5] last:border-r-0"
              :class="days[di - 1]?.isToday ? 'bg-[#EEF2F7]/30' : ''" />
          </div>

          <!-- Course blocks (absolutely positioned) -->
          <ScheduleCourseBlock v-for="block in courseBlocks" :key="block.id" :title="block.title"
            :chapter="block.chapter" :timeRange="block.timeRange" :color="block.color" :style="{
              top: (block.startSlotIndex * 72 + block.offsetPx) + 'px',
              left: `calc(56px + ${block.dayIndex} * ((100% - 56px) / 7))`,
              width: `calc((100% - 56px) / 7)`,
              height: block.spanSlots * 72 + 'px'
            }" />
        </div>
      </div>
    </div>
  </section>
</template>
