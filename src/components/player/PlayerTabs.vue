<script setup>
import { ref, computed } from 'vue'
import PlayerNotes from './PlayerNotes.vue'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => ['課堂筆記', '討論Q&A', '本章附件']
  },
  notes: { type: Array, default: () => [] },
  qaItems: { type: Array, default: () => [] },
  attachments: { type: Array, default: () => [] }
})

const activeIndex = ref(0)

// ── QA state ──
const qaSearch = ref('')
const qaSortDesc = ref(true)
const qaPage = ref(0)
const qaPageSize = 5

const filteredQA = computed(() => {
  let items = [...props.qaItems]
  if (qaSearch.value.trim()) {
    const q = qaSearch.value.trim().toLowerCase()
    items = items.filter(i => i.question.toLowerCase().includes(q) || i.author.toLowerCase().includes(q))
  }
  items.sort((a, b) => qaSortDesc.value ? b.sortOrder - a.sortOrder : a.sortOrder - b.sortOrder)
  return items
})

const qaTotalPages = computed(() => Math.max(1, Math.ceil(filteredQA.value.length / qaPageSize)))
const pagedQA = computed(() => {
  const start = qaPage.value * qaPageSize
  return filteredQA.value.slice(start, start + qaPageSize)
})

function onQASearchOrSort() {
  qaPage.value = 0
}

function fileIcon(type) {
  if (type === 'pdf') return '📄'
  if (type === 'zip') return '📦'
  if (type === 'image') return '🖼️'
  return '📎'
}
</script>

<template>
  <div>
    <!-- Tab bar -->
    <div class="border-b border-[#E5E7EB]">
      <nav class="flex gap-0">
        <button v-for="(tab, i) in tabs" :key="i"
          class="relative px-5 py-[10px] text-[13px] font-medium transition-colors duration-150" :class="activeIndex === i
            ? 'font-bold text-[#1B3A5C]'
            : 'text-[#888] hover:text-[#555]'" @click="activeIndex = i">
          {{ tab }}
          <span v-if="activeIndex === i" class="absolute inset-x-0 bottom-0 h-[2px] bg-[#1B3A5C]" />
        </button>
      </nav>
    </div>

    <!-- Tab content -->
    <!-- 我的筆記 -->
    <div v-if="activeIndex === 0">
      <PlayerNotes :notes="notes" />
    </div>

    <!-- 討論Q&A -->
    <div v-else-if="activeIndex === 1" class="flex flex-col gap-4 py-4">
      <!-- Ask question -->
      <div class="flex flex-col gap-[6px]">
        <textarea rows="2" placeholder="輸入你的問題…"
          class="w-full resize-none rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-[13px] text-[#333] placeholder-[#BBB] outline-none transition-colors duration-150 focus:border-[#1B3A5C]/40 focus:bg-white" />
        <div class="flex justify-end">
          <button
            class="rounded-[6px] bg-[#1B3A5C] px-4 py-[5px] text-[12px] font-semibold text-white transition-colors duration-150 hover:bg-[#16324E]">
            發表問題
          </button>
        </div>
      </div>

      <!-- Search + Sort -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#BBB]"></i>
          <input v-model="qaSearch" @input="onQASearchOrSort" type="text" placeholder="搜尋問題…"
            class="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] py-[7px] pl-8 pr-3 text-[12px] text-[#333] placeholder-[#BBB] outline-none transition-colors duration-150 focus:border-[#1B3A5C]/40 focus:bg-white" />
        </div>
        <div class="relative shrink-0">
          <select v-model="qaSortDesc" @change="onQASearchOrSort"
            class="appearance-none rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] py-[7px] pl-3 pr-7 text-[12px] font-medium text-[#555] outline-none transition-colors duration-150 focus:border-[#1B3A5C]/40">
            <option :value="true">新到舊</option>
            <option :value="false">舊到新</option>
          </select>
          <i
            class="fa-solid fa-chevron-down pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#999]"></i>
        </div>
      </div>

      <!-- QA list -->
      <div class="flex flex-col gap-3">
        <div v-for="item in pagedQA" :key="item.id"
          class="rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] p-4 transition-colors duration-150 hover:border-[#E5E7EB]">
          <!-- Question -->
          <div class="flex items-start gap-3">
            <div
              class="grid size-8 shrink-0 place-items-center rounded-full bg-[#EEF2F7] text-[12px] font-bold text-[#1B3A5C]">
              {{ item.avatar }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-center gap-2">
                <span class="text-[13px] font-semibold text-[#333]">{{ item.author }}</span>
                <span class="text-[11px] text-[#BBB]">{{ item.time }}</span>
              </div>
              <p class="text-[13px] leading-[20px] text-[#333]">{{ item.question }}</p>
              <!-- Pending badge -->
              <div v-if="!item.replies || !item.replies.length" class="mt-2">
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-[10px] py-[3px] text-[11px] font-semibold text-[#E67E22]">
                  <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                  待講師回答
                </span>
              </div>
            </div>
          </div>

          <!-- Replies -->
          <div v-if="item.replies && item.replies.length"
            class="mt-3 flex flex-col gap-3 border-t border-[#F0F0F0] pt-3 pl-11">
            <div v-for="reply in item.replies" :key="reply.id" class="flex items-start gap-3">
              <div class="grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                :class="reply.isInstructor ? 'bg-[#1B3A5C] text-white' : 'bg-[#EEF2F7] text-[#1B3A5C]'">
                {{ reply.avatar }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <span class="text-[12px] font-semibold text-[#333]">{{ reply.author }}</span>
                  <span v-if="reply.isInstructor"
                    class="rounded bg-[#EEF2F7] px-[6px] py-[1px] text-[10px] font-semibold text-[#1B3A5C]">講師</span>
                  <span class="text-[11px] text-[#BBB]">{{ reply.time }}</span>
                </div>
                <p class="text-[12px] leading-[18px] text-[#555]">{{ reply.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <p v-if="!filteredQA.length && qaSearch.trim()" class="py-6 text-center text-[13px] text-[#BBB]">
        找不到符合「{{ qaSearch }}」的問題
      </p>
      <p v-if="!qaItems.length" class="py-8 text-center text-[13px] text-[#BBB]">目前還沒有討論，成為第一個發問的人吧！</p>

      <!-- Pagination -->
      <div v-if="qaTotalPages > 1" class="flex items-center justify-between border-t border-[#F0F2F5] pt-3">
        <button @click="qaPage--" :disabled="qaPage === 0"
          class="rounded-md px-3 py-[5px] text-[12px] font-medium transition-colors duration-150"
          :class="qaPage === 0 ? 'text-[#CCC] cursor-not-allowed' : 'text-[#1B3A5C] hover:bg-[#EEF2F7]'">
          ← 上一頁
        </button>
        <span class="text-[11px] text-[#888]">{{ qaPage + 1 }} / {{ qaTotalPages }}</span>
        <button @click="qaPage++" :disabled="qaPage >= qaTotalPages - 1"
          class="rounded-md px-3 py-[5px] text-[12px] font-medium transition-colors duration-150"
          :class="qaPage >= qaTotalPages - 1 ? 'text-[#CCC] cursor-not-allowed' : 'text-[#1B3A5C] hover:bg-[#EEF2F7]'">
          下一頁 →
        </button>
      </div>
    </div>

    <!-- 本章附件 -->
    <div v-else-if="activeIndex === 2" class="flex flex-col gap-3 py-4">
      <div v-for="att in attachments" :key="att.id"
        class="group flex items-center gap-3 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 transition-colors duration-150 hover:border-[#E5E7EB]">
        <span class="text-[18px]">{{ fileIcon(att.type) }}</span>
        <div class="flex-1">
          <p class="text-[13px] font-medium text-[#333]">{{ att.name }}</p>
          <p class="text-[11px] text-[#BBB]">{{ att.size }}</p>
        </div>
        <button
          class="rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-[4px] text-[11px] font-semibold text-[#1B3A5C] opacity-0 transition-all duration-150 hover:bg-[#EEF2F7] group-hover:opacity-100">
          下載
        </button>
      </div>
      <p v-if="!attachments.length" class="py-8 text-center text-[13px] text-[#BBB]">本章節暫無附件</p>
    </div>
  </div>
</template>
