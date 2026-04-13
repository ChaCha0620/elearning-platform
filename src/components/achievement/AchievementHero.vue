<script setup>
defineProps({
  label: { type: String, default: '✦ 前端架構大師' },
  title: { type: String, default: '你的成就與獎勵' },
  description: { type: String, default: '1 枚已解鎖 · 3 枚待達成 · 解鎖即獲得專屬折價券' }
})
</script>

<template>
  <div class="flex items-center">
    <div class="flex flex-col gap-[8px]">
      <!-- Label -->
      <span class="text-[11px] font-semibold uppercase tracking-[1.1px] text-[#1B3A5C]">
        {{ label }}
      </span>
      <!-- Heading -->
      <h1 class="text-[32px] font-black leading-[35.2px] tracking-[-1.28px] text-[#111]">
        {{ title }}
      </h1>
      <!-- Description -->
      <p class="text-[14px] leading-[21px] text-[#888]">
        {{ description }}
      </p>
    </div>
  </div>
</template>
