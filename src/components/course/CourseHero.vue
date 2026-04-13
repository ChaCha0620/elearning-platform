<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  status: { type: String, default: '進行中' },
  title: { type: String, default: '' },
  instructor: { type: String, default: '' },
  totalChapters: { type: Number, default: 28 },
  totalHours: { type: String, default: '14.5' },
  completedChapters: { type: Number, default: 12 },
  remainingChapters: { type: Number, default: 16 },
  progressPercent: { type: Number, default: 45 },
  estimatedHours: { type: String, default: '7.8' },
  sections: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="w-full overflow-hidden rounded-[20px] bg-[#0D2238] relative">
    <!-- Radial glow background -->
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div class="h-[280px] w-full rounded-full opacity-100"
        style="background: radial-gradient(ellipse at center, rgba(27,98,200,0.18) 0%, rgba(14,49,100,0.09) 35%, transparent 70%);" />
    </div>

    <div
      class="relative z-10 flex flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between md:px-11 md:py-10">
      <!-- Left content -->
      <div class="flex flex-1 flex-col gap-[15px]">
        <!-- Status badge -->
        <span
          class="inline-flex w-fit items-center gap-[6px] rounded-full border border-white/[0.12] bg-white/[0.1] px-3 py-[4px] text-[11px] font-semibold uppercase tracking-[0.66px] text-white/70">
          <span class="size-[6px] rounded-full bg-[#4ADE80]" />
          {{ status }}
        </span>

        <!-- Title -->
        <h1 class="text-[28px] font-black leading-[33.6px] tracking-[-0.98px] text-white">
          {{ title }}
        </h1>

        <!-- Meta -->
        <p class="text-[13px] text-white/45">
          講師：{{ instructor }} · 共 {{ totalChapters }} 章 · 約 {{ totalHours }} 小時
        </p>

        <!-- Progress stats -->
        <div class="flex flex-wrap items-center gap-8">
          <span class="text-[13px] font-semibold text-white/85">已完成 {{ progressPercent }}%</span>
          <span class="text-[13px] text-white/40">第 {{ completedChapters }} / {{ totalChapters }} 章</span>
          <span class="text-[12px] font-semibold text-[#4ADE80]">還剩 {{ remainingChapters }} 章</span>
        </div>

        <!-- Progress bar with chapter dots -->
        <div class="flex flex-col gap-2">
          <div class="relative">
            <!-- Bar track -->
            <div class="h-2 w-full overflow-hidden rounded bg-white/10">
              <div class="h-full rounded bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-700"
                :style="{ width: progressPercent + '%' }" />
            </div>

            <!-- Chapter dot markers on the bar -->
            <div v-for="(sec, i) in sections" :key="'dot-' + i"
              class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              :style="{ left: ((i + 1) / sections.length * 100) + '%' }">
              <!-- Dot -->
              <div class="size-[10px] rounded-full border-2 transition-all duration-300" :class="{
                'border-[#4ADE80] bg-[#4ADE80]': sec.status === 'done',
                'border-[#60A5FA] bg-[#60A5FA] shadow-[0_0_6px_rgba(96,165,250,0.6)]': sec.status === 'current',
                'border-white/30 bg-white/15': sec.status === 'locked'
              }" />
              <!-- Chapter info below dot -->
              <div class="absolute top-[14px] flex flex-col items-center whitespace-nowrap">
                <span class="text-[10px] transition-all duration-200" :class="{
                  'font-semibold text-[#4ADE80]': sec.status === 'done',
                  'font-semibold text-[#93C5FD]': sec.status === 'current',
                  'text-white/35': sec.status === 'locked'
                }">
                  {{ sec.label }}
                </span>
                <span v-if="sec.chapters" class="text-[9px] text-white/30">{{ sec.chapters }}</span>
                <span class="text-[9px]" :class="{
                  'text-[#4ADE80]/70': sec.status === 'done',
                  'text-[#93C5FD]/70': sec.status === 'current',
                  'text-white/25': sec.status === 'locked'
                }">
                  {{ sec.status === 'done' ? '已完成' : sec.percent + '%' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Spacer for chapter labels below dots -->
          <div class="h-10" />
        </div>
      </div>

      <!-- Right side: CTA + estimated time -->
      <div class="flex flex-col items-center gap-[14px] pt-1 md:min-w-[140px]">
        <!-- Continue button -->
        <button @click="router.push('/course/1/player')"
          class="flex items-center gap-[10px] rounded-[14px] bg-[#2563EB] p-4 shadow-[0_8px_28px_rgba(37,99,235,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] active:translate-y-0 cursor-pointer">
          <span class="grid size-9 place-items-center rounded-full bg-white/15">
            <i class="fa-solid fa-play text-[12px] text-white"></i>
          </span>
          <span class="flex flex-col items-start">
            <span class="text-[15px] font-extrabold leading-[22.5px] tracking-[-0.3px] text-white">繼續播放</span>
            <span class="text-[11px] font-medium text-white/65">從第 {{ completedChapters }} 章開始</span>
          </span>
        </button>

        <!-- Estimated time -->
        <div class="w-full rounded-[10px] border border-white/10 bg-white/[0.07] p-4 text-center">
          <p class="text-[10px] uppercase tracking-[0.6px] text-white/40">預估完課時間</p>
          <p class="text-[18px] font-black tracking-[-0.54px] text-white">{{ estimatedHours }} 小時</p>
          <p class="text-[10px] text-white/35">按目前學習速度</p>
        </div>
      </div>
    </div>
  </section>
</template>
