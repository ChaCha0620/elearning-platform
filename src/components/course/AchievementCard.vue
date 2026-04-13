<script setup>
defineProps({
  badge: { type: String, default: 'React 架構大師' },
  description: { type: String, default: '' },
  reward: { type: String, default: '8折券' },
  progressCurrent: { type: Number, default: 45 },
  progressTarget: { type: Number, default: 90 },
  hint: { type: String, default: '' }
})

const progressWidth = (current, target) => Math.min((current / target) * 100, 100)
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white relative">
    <!-- Decorative radial -->
    <div class="pointer-events-none absolute -right-5 -top-5 size-[120px] rounded-full"
      style="background: radial-gradient(circle, rgba(27,58,92,0.05) 0%, transparent 70%);" />

    <div class="relative z-10 p-[22px]">
      <!-- Label -->
      <p class="text-[14px] font-bold uppercase tracking-[0.8px] text-[#1B3A5C]">✦ 即將解鎖的成就</p>

      <!-- Badge + info -->
      <div class="mt-4 flex items-start gap-4">
        <!-- Badge icon (placeholder) -->
        <div class="relative shrink-0">
          <div class="grid size-[60px] place-items-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            style="background: radial-gradient(circle at 35% 30%, #C5CDD6 0%, #9DA6B0 100%);">
            <span class="text-[22px] text-[rgba(180,188,195,0.8)]">⬡</span>
            <div class="absolute -left-[6px] top-[10px] size-[5px] rounded-full bg-[#BBB] opacity-40" />
            <div class="absolute -top-1 right-[10px] size-1 rounded-full bg-[#BBB] opacity-40" />
            <div class="absolute bottom-[10px] right-[8px] size-1 rounded-full bg-[#BBB] opacity-40" />
          </div>
          <!-- Lock -->
          <div
            class="absolute -bottom-[4px] -right-[2px] grid size-5 place-items-center rounded-[10px] border-2 border-white bg-white">
            <i class="fa-solid fa-lock text-[10px] text-[#888]"></i>
          </div>
        </div>

        <!-- Text -->
        <div class="flex flex-col gap-1">
          <h3 class="text-[14px] font-bold text-[#111]">{{ badge }}</h3>
          <p class="text-[12px] leading-[19.2px] text-[#888]">
            完成度達 <span class="font-bold text-[#111]">{{ progressTarget }}%</span> 且繳交作業，即可解鎖此徽章並獲得
          </p>
          <span class="inline-block w-fit rounded px-[5px] bg-[#FFF9EC] text-[12px] font-bold text-[#92600A]">
            {{ reward }}
          </span>
        </div>
      </div>

      <!-- Progress -->
      <div class="mt-5 flex flex-col gap-[6px]">
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-[#888]">解鎖進度</span>
          <span class="text-[11px] font-bold text-[#1B3A5C]">{{ progressCurrent }}%</span>
        </div>
        <div class="relative">
          <div class="h-[6px] w-full overflow-hidden rounded-[3px] bg-[#F0F2F5]">
            <div class="h-full rounded-[3px] bg-gradient-to-r from-[#1B3A5C] to-[#3B82F6] transition-all duration-500"
              :style="{ width: progressWidth(progressCurrent, progressTarget) + '%' }" />
          </div>
          <!-- Target dot marker at progressTarget% -->
          <div class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            :style="{ left: (progressTarget / 100 * 100) + '%' }">
            <div class="size-[8px] rounded-full border-[1.5px] border-[#BBB] bg-white" />
            <span class="absolute top-[10px] text-[10px] text-[#999]">{{ progressTarget }}%</span>
          </div>
        </div>
        <div class="h-3" />
        <p class="text-[10px] text-[#BBB]">{{ hint }}</p>
      </div>
    </div>
  </div>
</template>
