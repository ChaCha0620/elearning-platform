<script setup>
defineProps({
  weekLabel: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  studyHours: { type: String, default: '0' },
  studyGoal: { type: String, default: '' },
  completedUnits: { type: Number, default: 0 },
  unitsNote: { type: String, default: '' },
  streakDays: { type: Number, default: 0 },
  hasSchedule: { type: Boolean, default: false }
})

const emit = defineEmits(['plan'])
</script>

<template>
  <section class="flex flex-wrap items-center gap-x-16 gap-y-5">
    <!-- Left: texts -->
    <div class="min-w-0 shrink-0">
      <div class="mb-[6px] flex items-center gap-[5px]">
        <span class="text-[11px] font-semibold tracking-[1.1px] text-[#1B3A5C]">✦</span>
        <span class="text-[11px] font-semibold uppercase tracking-[1.1px] text-[#1B3A5C]">{{ weekLabel }}</span>
      </div>
      <h1 class="text-[32px] font-black leading-[35px] tracking-[-1.28px] text-[#111]">{{ title }}</h1>
      <p class="mt-2 text-[14px] text-[#888]">{{ description }}</p>
    </div>

    <!-- Stat pills (always visible) -->
    <div class="flex items-center gap-[10px]">
      <!-- 本週學習 -->
      <div class="flex w-[120px] flex-col gap-1 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4">
        <span class="text-[11px] font-semibold uppercase tracking-[0.55px] text-[#888]">本週學習</span>
        <p class="text-[24px] font-black leading-[26px] tracking-[-0.96px] text-[#111]">
          {{ studyHours }} <span class="text-[16px]">小時</span>
        </p>
        <span class="text-[11px] text-[#BBB]">{{ studyGoal || '尚未設定' }}</span>
      </div>
      <!-- 完成單元 -->
      <div class="flex w-[120px] flex-col gap-1 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4">
        <span class="text-[11px] font-semibold uppercase tracking-[0.55px] text-[#888]">完成單元</span>
        <p class="text-[24px] font-black leading-[26px] tracking-[-0.96px] text-[#111]">{{ completedUnits }}</p>
        <span class="text-[11px] text-[#BBB]">{{ unitsNote }}</span>
      </div>
      <!-- 連續學習 -->
      <div class="flex w-[120px] flex-col gap-1 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4">
        <span class="text-[11px] font-semibold uppercase tracking-[0.55px] text-[#888]">連續學習</span>
        <p class="text-[24px] font-black leading-[26px] tracking-[-0.96px] text-[#111]">
          {{ streakDays }} <span class="text-[16px]">天</span>
        </p>
      </div>
    </div>

    <!-- CTA Button -->
    <button
      class="flex items-center gap-1 rounded-[10px] px-3 py-[10px] text-[13px] font-bold text-white transition-colors duration-150"
      :class="hasSchedule
        ? 'bg-[#E67E22] hover:bg-[#CF6D17] active:bg-[#B35E14]'
        : 'bg-[#3672B5] hover:bg-[#2E6099] active:bg-[#1B3A5C]'" @click="emit('plan')">
      <i class="fa-regular fa-clock text-[16px]"></i>
      {{ hasSchedule ? '編輯安排學習時間' : '開始安排學習時間' }}
    </button>
  </section>
</template>
