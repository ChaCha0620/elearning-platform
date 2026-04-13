<script setup>
import { ref } from 'vue'
import LessonRow from './LessonRow.vue'

const props = defineProps({
  index: { type: Number, default: 0 },
  title: { type: String, default: '' },
  meta: { type: String, default: '' },
  status: { type: String, default: 'locked' },
  lessons: { type: Array, default: () => [] },
  defaultOpen: { type: Boolean, default: false }
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}

const iconColors = {
  done: 'bg-[#1A5C3A]',
  current: 'bg-[#1B3A5C] shadow-[0_0_0_0_rgba(27,58,92,0.12)]',
  locked: 'bg-[#F0F2F5]'
}

const badgeStyles = {
  done: 'bg-[#D4EFE1] text-[#1A5C3A] font-bold',
  current: 'bg-[#EEF2F7] text-[#1B3A5C] font-bold',
  locked: 'bg-[#F0F2F5] text-[#888] font-semibold'
}

const badgeText = {
  done: '已完成',
  current: '▶ 進行中',
  locked: '尚未開始'
}

const borderClass = {
  done: 'border-[#E5E7EB]',
  current: 'border-[#1B3A5C] shadow-[0_4px_20px_rgba(27,58,92,0.1)]',
  locked: 'border-[#E5E7EB]'
}
</script>

<template>
  <div class="overflow-hidden rounded-[14px] border bg-white transition-shadow duration-200"
    :class="borderClass[status]">
    <!-- Header button -->
    <button @click="toggle"
      class="flex w-full items-center gap-[14px] px-5 py-4 text-left transition-colors duration-150 hover:bg-[#FAFBFC]">
      <!-- Module icon circle -->
      <div class="grid size-8 shrink-0 place-items-center rounded-full" :class="iconColors[status]">
        <i v-if="status === 'done'" class="fa-solid fa-check text-[12px] text-white"></i>
        <i v-else-if="status === 'current'" class="fa-solid fa-play text-[9px] text-white"></i>
        <i v-else class="fa-solid fa-lock text-[10px] text-[#888]"></i>
      </div>

      <!-- Title + meta -->
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <p class="text-[14px] font-bold tracking-[-0.14px] text-[#111]"
          :class="{ 'font-semibold': status === 'locked' }">
          {{ title }}
        </p>
        <p class="text-[11px] font-medium text-[#888]">{{ meta }}</p>
      </div>

      <!-- Badge + chevron -->
      <div class="flex shrink-0 items-center gap-[10px]">
        <span class="rounded-[6px] px-[10px] py-[2px] text-[11px]" :class="badgeStyles[status]">
          {{ badgeText[status] }}
        </span>
        <i class="fa-solid fa-chevron-down text-[11px] text-[#888] transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"></i>
      </div>
    </button>

    <!-- Lessons (collapsible) -->
    <div v-show="isOpen" class="border-t border-[#F0F2F5] px-5 pb-3 pt-3">
      <div class="flex flex-col gap-1">
        <LessonRow v-for="(lesson, i) in lessons" :key="i" v-bind="lesson" />
      </div>

      <!-- Completed banner -->
      <div v-if="status === 'done'"
        class="mt-2 flex items-center rounded-lg bg-[#D4EFE1] px-3 py-2 text-[11px] font-medium text-[#1A5C3A]">
        本單元已全數完成！
      </div>
    </div>
  </div>
</template>
