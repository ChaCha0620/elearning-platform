<script setup>
defineProps({
  title: { type: String, default: '' },
  chapter: { type: String, default: '' },
  timeRange: { type: String, default: '' },
  color: { type: String, default: '#1B3A5C' }
})
</script>

<template>
  <div
    class="absolute inset-x-1 cursor-pointer overflow-hidden rounded-lg shadow-[0_2px_8px_rgba(27,58,92,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    :style="{ backgroundColor: color }">
    <!-- Left accent bar -->
    <div class="absolute inset-y-0 left-0 w-[3px] rounded-l-lg bg-white/35" />

    <div class="flex h-full flex-col justify-between px-3 py-[10px]">
      <div class="flex flex-col gap-[3px]">
        <span class="text-[11px] font-bold leading-[16.5px] tracking-[0.11px] text-white/90">{{ title }}</span>
        <span class="text-[10px] leading-[14px] text-white/60">{{ chapter }}</span>
      </div>
      <span class="text-[10px] text-white/55">{{ timeRange }}</span>
    </div>
  </div>
</template>
