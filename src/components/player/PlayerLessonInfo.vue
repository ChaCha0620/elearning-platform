<script setup>
defineProps({
  chapterLabel: { type: String, default: '' },
  title: { type: String, default: '' },
  duration: { type: String, default: '' },
  instructor: { type: String, default: '' },
  updatedAt: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-col gap-3 border-b border-[#E5E7EB] px-0 py-5">
    <div class="flex flex-wrap items-center gap-3">
      <span class="rounded bg-[#EEF2F7] px-[10px] py-[3px] text-[11px] font-bold tracking-[0.5px] text-[#1B3A5C]">
        {{ chapterLabel }}
      </span>
      <h2 class="text-[18px] font-extrabold text-[#111]">{{ title }}</h2>
    </div>
    <div class="flex flex-wrap items-center gap-4 text-[13px] text-[#888]">
      <span class="flex items-center gap-[5px]">
        <i class="fa-regular fa-clock text-[11px] text-[#BBB]"></i>
        {{ duration }}
      </span>
      <span class="flex items-center gap-[5px]">
        <i class="fa-regular fa-user text-[11px] text-[#BBB]"></i>
        {{ instructor }}
      </span>
      <span class="flex items-center gap-[5px]">
        <i class="fa-regular fa-calendar text-[11px] text-[#BBB]"></i>
        {{ updatedAt }}
      </span>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-[5px] text-[12px] font-medium text-[#555] transition-colors duration-150 hover:bg-[#EEF2F7] active:bg-[#E5E7EB]">
        <span class="text-[12px] text-[#999]">⚑</span>
        回報問題
      </button>
    </div>
  </div>
</template>
