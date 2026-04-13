<script setup>
const props = defineProps({
  courseTitle: { type: String, default: '' },
  progressPercent: { type: Number, default: 0 },
  sections: {
    type: Array,
    default: () => []
    /* section: { title, completedCount, totalCount, lessons: [{ id, label, title, duration, status: 'done'|'current'|'locked' }] } */
  }
})
</script>

<template>
  <aside class="flex h-full w-[300px] shrink-0 flex-col border-l border-[#E5E7EB] bg-white">
    <!-- Header -->
    <div class="border-b border-[#E5E7EB] px-5 py-4">
      <div class="mb-[6px] flex items-center gap-[6px]">
        <span class="text-[11px] text-[#3B82F6]">✦</span>
        <span class="text-[11px] font-semibold tracking-[0.5px] text-[#1B3A5C]/60">課程章節</span>
      </div>
      <h3 class="text-[14px] font-bold text-[#111]">{{ courseTitle }}</h3>
      <!-- Progress bar -->
      <div class="mt-2 flex items-center gap-2">
        <div class="h-[4px] flex-1 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div class="h-full rounded-full bg-[#1B3A5C] transition-all" :style="{ width: progressPercent + '%' }" />
        </div>
        <span class="text-[11px] font-semibold text-[#1B3A5C]">{{ progressPercent }}%</span>
      </div>
    </div>

    <!-- Scrollable lesson list -->
    <div class="flex-1 overflow-y-auto">
      <div v-for="(section, si) in sections" :key="si">
        <!-- Section header -->
        <div class="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-[10px]">
          <span class="text-[12px] font-semibold text-[#111]">{{ section.title }}</span>
          <span class="text-[11px] text-[#888]">{{ section.completedCount }}/{{ section.totalCount }}</span>
        </div>
        <!-- Lessons -->
        <ul>
          <li v-for="lesson in section.lessons" :key="lesson.id"
            class="flex cursor-pointer items-center gap-3 border-b border-[#F7F7F7] px-5 py-[10px] transition-colors duration-150 hover:bg-[#F0F4F8]"
            :class="{
              'border-l-[3px] border-l-[#1B3A5C] bg-[#EEF2F7] pl-[17px]': lesson.status === 'current',
              'opacity-50': lesson.status === 'locked'
            }">
            <!-- Status icon -->
            <span v-if="lesson.status === 'done'"
              class="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#1A5C3A]">
              <i class="fa-solid fa-check text-[8px] text-white"></i>
            </span>
            <span v-else-if="lesson.status === 'current'" class="size-[8px] shrink-0 rounded-full bg-[#3B82F6]" />
            <span v-else class="size-[8px] shrink-0 rounded-full bg-[#CCC]" />

            <!-- Lesson info -->
            <div class="min-w-0 flex-1">
              <p class="text-[11px] text-[#888]">{{ lesson.label }}</p>
              <p class="truncate text-[12px]"
                :class="lesson.status === 'current' ? 'font-bold text-[#1B3A5C]' : 'font-medium text-[#333]'">
                {{ lesson.title }}
              </p>
            </div>

            <!-- Duration -->
            <span class="shrink-0 text-[11px] text-[#999]">{{ lesson.duration }}</span>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>
