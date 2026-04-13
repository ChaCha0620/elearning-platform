<script setup>
defineProps({
  notes: {
    type: Array,
    default: () => []
    /* note: { id, timestamp, text, chapterRef } */
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 py-4">
    <!-- Section label -->
    <div class="flex items-center gap-2">
      <span
        class="inline-flex size-5 items-center justify-center rounded-[5px] bg-[#1B3A5C] text-[10px] text-white">📖</span>
      <p class="text-[12px] font-bold text-[#1B3A5C]">課堂筆記</p>
      <span class="text-[11px] text-[#BBB]">· 僅限本課程章節</span>
    </div>

    <!-- Note input -->
    <div class="flex flex-col gap-[6px] rounded-xl border border-dashed border-[#D1D5DB] bg-[#FAFBFC] p-3">
      <textarea rows="3" placeholder="記下這個章節的重點，或按播放器筆記按鈕新增時間軸筆記…"
        class="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[13px] text-[#333] placeholder-[#BBB] outline-none transition-colors duration-150 focus:border-[#1B3A5C]/40" />
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-[#BBB]">⌘+Enter 快速儲存</span>
        <button
          class="rounded-[6px] bg-[#1B3A5C] px-4 py-[5px] text-[12px] font-semibold text-white transition-colors duration-150 hover:bg-[#16324E]">
          儲存筆記
        </button>
      </div>
    </div>

    <!-- Existing notes -->
    <div v-if="notes.length" class="flex flex-col gap-3">
      <div v-for="note in notes" :key="note.id"
        class="group relative rounded-lg border-l-[3px] border-[#1B3A5C] bg-[#FAFBFC] px-4 py-3 transition-colors duration-150 hover:bg-[#F3F5F7]">
        <div class="mb-[6px] flex items-center gap-2">
          <span class="rounded bg-[#1B3A5C] px-[7px] py-[2px] font-mono text-[11px] font-semibold text-white">
            {{ note.timestamp }}
          </span>
          <span v-if="note.chapterRef" class="text-[11px] text-[#888]">{{ note.chapterRef }}</span>
        </div>
        <p class="text-[13px] leading-[20px] text-[#333]">{{ note.text }}</p>
        <!-- Delete button -->
        <button
          class="absolute right-3 top-3 grid size-5 place-items-center rounded text-[14px] text-[#CCC] opacity-0 transition-all duration-150 hover:text-[#EF4444] group-hover:opacity-100">
          ×
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="py-6 text-center">
      <p class="text-[13px] text-[#BBB]">尚未新增課堂筆記，開始記錄吧！</p>
    </div>
  </div>
</template>
