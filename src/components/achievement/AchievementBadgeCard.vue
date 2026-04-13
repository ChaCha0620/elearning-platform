<script setup>
defineProps({
  /** 'unlocked' | 'locked' */
  status: { type: String, default: 'locked' },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  /** Symbol shown in the badge circle */
  symbol: { type: String, default: '⬡' },
  /** Progress 0-100, only used when locked */
  progress: { type: Number, default: 0 },
  /** Remaining % text, e.g. "再完成 15% 即可解鎖" */
  remainText: { type: String, default: '' },
  /** Reward label for unlocked cards */
  rewardLabel: { type: String, default: '' },
  /** Reward note for unlocked cards */
  rewardNote: { type: String, default: '' }
})
</script>

<template>
  <!-- Unlocked card -->
  <div v-if="status === 'unlocked'"
    class="flex flex-col items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-[21px] transition-shadow duration-200 hover:shadow-md">
    <!-- Badge circle – unlocked (dark blue) -->
    <div class="relative size-[72px] shrink-0">
      <div
        class="grid size-[72px] place-items-center rounded-full border-2 border-[#2C5280] shadow-[0_4px_20px_rgba(27,58,92,0.2)]"
        style="background: radial-gradient(circle at 35% 30%, rgba(27,58,92,0.8), rgba(27,58,92,1));">
        <span class="text-[26px] leading-[26px] text-[rgba(255,255,255,0.9)]">{{ symbol }}</span>
        <!-- Shine accent -->
        <div class="pointer-events-none absolute left-3 top-1 h-3 w-5 -rotate-[20deg] bg-[rgba(255,255,255,0.22)]" />
      </div>
      <!-- Sparkle dots -->
      <div class="absolute -top-1 right-0 size-[5px] rounded-full bg-[#F5C842] opacity-80" />
      <div class="absolute -left-[6px] top-2 size-[3px] rounded-full bg-[#F5C842] opacity-60" />
      <div class="absolute bottom-0 right-0 size-1 rounded-full bg-[#A8D8C4] opacity-70" />
    </div>

    <!-- Title -->
    <span class="text-center text-[14px] font-bold leading-[21px] tracking-[-0.14px] text-[#111]">
      {{ name }}
    </span>

    <!-- Description -->
    <span class="text-center text-[11px] leading-[16.5px] text-[#BBB]">
      {{ description }}
    </span>

    <!-- Reward coupon -->
    <div v-if="rewardLabel"
      class="flex w-full items-center gap-3 rounded-lg border border-dashed border-[#F5C842] bg-[#FFFBEC] px-[13px] py-[9px]">
      <div class="flex flex-col">
        <span class="text-[11px] font-bold leading-[16.5px] text-[#92600A]">{{ rewardLabel }}</span>
        <span class="text-[10px] leading-[15px] text-[#B07A20]">{{ rewardNote }}</span>
      </div>
      <!-- Ticket icon -->
      <i class="fa-solid fa-ticket ml-auto text-[20px] shrink-0 text-[#D4A017]"></i>
    </div>
  </div>

  <!-- Locked card -->
  <div v-else
    class="flex flex-col items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-[21px] py-[25px] opacity-[0.78] transition-opacity duration-200 hover:opacity-100">
    <!-- Badge circle – locked (grey) -->
    <div class="relative size-[72px] shrink-0">
      <div class="grid size-[72px] place-items-center rounded-full border-2 border-[#D0D5DB]"
        style="background: radial-gradient(circle at 35% 30%, #D8DCE0, #BEC4CB);">
        <span class="text-[26px] leading-[26px] text-[rgba(150,155,160,0.9)]">{{ symbol }}</span>
      </div>
      <!-- Lock badge -->
      <div
        class="absolute bottom-0 right-0 grid size-5 place-items-center rounded-[10px] border-2 border-white bg-[#E5E7EB]">
        <i class="fa-solid fa-lock text-[8px] text-[#888]"></i>
      </div>
    </div>

    <!-- Title -->
    <span class="text-center text-[14px] font-bold leading-[21px] tracking-[-0.14px] text-[#888]">
      {{ name }}
    </span>

    <!-- Description -->
    <span class="text-center text-[11px] leading-[16.5px] text-[#BBB]">
      {{ description }}
    </span>

    <!-- Progress area -->
    <div class="w-full">
      <div class="flex items-center justify-between">
        <span class="text-[10px] leading-[15px] text-[#BBB]">完成度</span>
        <span class="text-[10px] font-semibold leading-[15px] text-[#444]">{{ progress }}%</span>
      </div>
      <div class="mt-[5px] h-1 w-full overflow-hidden rounded-sm bg-[#ECEEF1]">
        <div class="h-full rounded-sm bg-[#C5CDD6] transition-all duration-500" :style="{ width: progress + '%' }" />
      </div>
      <p class="mt-[5px] text-center text-[10px] leading-[15px] text-[#BBB]">
        {{ remainText }}
      </p>
    </div>
  </div>
</template>
