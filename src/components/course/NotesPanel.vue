<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  notes: { type: Array, default: () => [] },
  allNotes: { type: Array, default: () => [] }
})

const expanded = ref(false)
const currentPage = ref(0)
const pageSize = 5

const totalPages = computed(() => expanded.value ? Math.ceil(props.allNotes.length / pageSize) : 1)
const displayNotes = computed(() => {
  if (!expanded.value) return props.notes
  const start = currentPage.value * pageSize
  return props.allNotes.slice(start, start + pageSize)
})

function toggleExpand() {
  expanded.value = !expanded.value
  currentPage.value = 0
}
</script>

<template>
  <div class="min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white px-[22px] pb-3 pt-[22px]">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          class="inline-flex size-5 items-center justify-center rounded-[5px] bg-[#1B3A5C] text-[10px] text-white">📖</span>
        <p class="text-[11px] font-bold uppercase tracking-[0.8px] text-[#1B3A5C]">本課筆記</p>
        <span v-if="expanded"
          class="rounded-full bg-[#EEF2F7] px-[7px] py-[1px] text-[10px] font-semibold text-[#1B3A5C]">
          {{ allNotes.length }} 則
        </span>
      </div>
      <button @click="toggleExpand"
        class="text-[11px] font-medium text-[#1B3A5C] transition-colors duration-200 hover:text-[#2563EB]">
        {{ expanded ? '收合筆記 ↑' : '展開本課筆記 →' }}
      </button>
    </div>

    <!-- Notes list -->
    <div class="mt-[14px] flex flex-col gap-2">
      <div v-for="(note, i) in displayNotes" :key="currentPage + '-' + i"
        class="flex items-start gap-[10px] rounded-[10px] border-l-[3px] border-[#1B3A5C] bg-[#F9FAFB] px-3 py-[11px] transition-all duration-200 hover:bg-[#F3F5F7] cursor-pointer">
        <!-- Timestamp badge -->
        <div class="mt-0.5 shrink-0 rounded-[5px] px-[6px] py-[2px] text-[10px] font-bold tracking-[0.2px] text-white"
          :class="note.color || 'bg-[#1B3A5C]'">
          {{ note.time }}
        </div>
        <!-- Content -->
        <div class="flex min-w-0 flex-col gap-[3px]">
          <p class="text-[12px] text-[#111] truncate">{{ note.text }}</p>
          <p class="text-[10px] text-[#BBB]">{{ note.chapter }}</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="expanded && totalPages > 1"
      class="mt-3 flex items-center justify-between border-t border-[#F0F2F5] pt-3">
      <button @click="currentPage--" :disabled="currentPage === 0"
        class="rounded-md px-2 py-[4px] text-[11px] font-medium transition-colors duration-150"
        :class="currentPage === 0 ? 'text-[#CCC] cursor-not-allowed' : 'text-[#1B3A5C] hover:bg-[#EEF2F7]'">
        ← 上一頁
      </button>
      <span class="text-[10px] text-[#888]">{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage >= totalPages - 1"
        class="rounded-md px-2 py-[4px] text-[11px] font-medium transition-colors duration-150"
        :class="currentPage >= totalPages - 1 ? 'text-[#CCC] cursor-not-allowed' : 'text-[#1B3A5C] hover:bg-[#EEF2F7]'">
        下一頁 →
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!displayNotes.length" class="py-6 text-center">
      <p class="text-[12px] text-[#BBB]">尚未新增本課筆記</p>
    </div>
  </div>
</template>
