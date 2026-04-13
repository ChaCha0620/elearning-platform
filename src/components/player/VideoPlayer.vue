<script setup>
defineProps({
  lessonLabel: { type: String, default: '' },
  instructor: { type: String, default: '' },
  instructorTitle: { type: String, default: '' },
  currentTime: { type: String, default: '10:45' },
  totalTime: { type: String, default: '31:45' },
  progressPercent: { type: Number, default: 33 }
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded bg-black">
    <!-- Video area with gradient background -->
    <div class="relative aspect-video w-full"
      style="background: linear-gradient(168deg, #1B3A5C 8%, #2C5280 42%, #1A2E48 92%);">

      <!-- Lesson label (top-left) -->
      <div
        class="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/55 px-3 py-[6px]">
        <span class="size-[6px] rounded-full bg-[#EF4444] opacity-90" />
        <span class="text-[11px] font-medium text-white/80">{{ lessonLabel }}</span>
      </div>

      <!-- Resolution badge (top-right) -->
      <div
        class="absolute right-4 top-4 rounded-[6px] border border-white/[0.08] bg-black/55 px-[9px] py-[9px] text-[10px] font-bold tracking-[0.6px] text-white/60">
        1080P
      </div>

      <!-- Code snippet overlay (center) -->
      <div
        class="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] border border-white/[0.12] bg-white/[0.08] px-9 py-7 font-mono text-[13px] leading-[24.7px]">
        <p class="text-[#7BA3FF]">// useContext 深度整合範例</p>
        <p>
          <span class="text-[#E8A5FF]">const</span>
          <span class="text-[#FFB3BA]"> ThemeContext</span>
          <span class="text-white/85"> = </span>
          <span class="text-[#85D7FF]">createContext</span>
          <span class="text-white/85">(null);</span>
        </p>
        <p class="mt-1">
          <span class="text-[#E8A5FF]">function</span>
          <span class="text-white/85"> </span>
          <span class="text-[#85D7FF]">App</span>
          <span class="text-white/85">() {</span>
        </p>
        <p class="pl-5">
          <span class="text-[#E8A5FF]">const</span>
          <span class="text-white/85"> context = </span>
          <span class="text-[#85D7FF]">useContext</span>
          <span class="text-white/85">(ThemeContext);</span>
        </p>
        <p class="text-white/85">}</p>
      </div>

      <!-- Play button overlay (center) -->
      <button
        class="absolute left-1/2 top-1/2 z-10 grid size-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 transition-all duration-200 hover:scale-110 hover:bg-black/60 active:scale-95">
        <i class="fa-solid fa-play ml-1 text-[18px] text-white"></i>
      </button>

      <!-- Instructor badge (bottom-left) -->
      <div
        class="absolute bottom-[70px] left-4 flex items-center gap-[9px] rounded-[10px] border border-white/[0.08] bg-black/50 px-3 py-[6px]">
        <div class="grid size-[30px] place-items-center rounded-full"
          style="background: linear-gradient(135deg, #3B82F6, #1B3A5C);">
          <span class="text-[12px] font-bold text-white">陳</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[12px] font-semibold text-white">{{ instructor }}</span>
          <span class="text-[10px] text-white/50">{{ instructorTitle }}</span>
        </div>
      </div>

      <!-- Bottom gradient + controls -->
      <div
        class="absolute inset-x-0 bottom-0 flex flex-col gap-[10px] bg-gradient-to-t from-black/[0.88] via-black/40 via-60% to-transparent px-4 pb-4 pt-10">
        <!-- Progress bar -->
        <div class="group relative h-1 w-full cursor-pointer rounded-[3px] bg-white/[0.18]">
          <div class="absolute inset-y-0 left-0 rounded-[3px] bg-white/12" style="width: 57%;" />
          <div class="absolute inset-y-0 left-0 rounded-[3px] bg-[#3B82F6] transition-all"
            :style="{ width: progressPercent + '%' }" />
          <!-- Chapter markers -->
          <span class="absolute top-[-0.5px] size-[5px] rounded-full bg-white/45" style="left: 9%;" />
          <span class="absolute top-[-0.5px] size-[5px] rounded-full bg-white/45" style="left: 27%;" />
          <span class="absolute top-[-0.5px] size-[5px] rounded-full bg-white/45" style="left: 46%;" />
          <span class="absolute top-[-0.5px] size-[5px] rounded-full bg-white/45" style="left: 67%;" />
          <span class="absolute top-[-0.5px] size-[5px] rounded-full bg-white/45" style="left: 82%;" />
          <!-- Hover dots -->
          <span class="absolute top-[-1px] size-[6px] rounded-full border border-[rgba(59,130,246,0.5)] bg-[#3B82F6]"
            style="left: 11%;" />
          <span class="absolute top-[-1px] size-[6px] rounded-full border border-[rgba(59,130,246,0.5)] bg-[#3B82F6]"
            style="left: 34%;" />
          <!-- Playhead -->
          <div
            class="absolute top-[-3px] size-[10px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-all group-hover:scale-125"
            :style="{ left: `calc(${progressPercent}% - 5px)` }" />
        </div>

        <!-- Control bar -->
        <div class="flex items-center">
          <!-- Left controls -->
          <div class="flex items-center gap-0">
            <!-- Play/Pause -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-white transition-colors duration-150 hover:bg-white/10">
              <i class="fa-solid fa-play text-[11px]"></i>
            </button>
            <!-- Rewind 10 -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-white transition-colors duration-150 hover:bg-white/10">
              <i class="fa-solid fa-backward text-[12px]"></i>
            </button>
            <!-- Forward 10 -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-white transition-colors duration-150 hover:bg-white/10">
              <i class="fa-solid fa-forward text-[12px]"></i>
            </button>

            <!-- Volume -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-white transition-colors duration-150 hover:bg-white/10">
              <i class="fa-solid fa-volume-high text-[12px]"></i>
            </button>

            <!-- Time -->
            <span class="ml-2 font-mono text-[12px] text-[#666]">{{ currentTime }} / {{ totalTime }}</span>
          </div>

          <!-- Right controls -->
          <div class="ml-auto flex items-center gap-0">
            <!-- Subtitles -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-white transition-colors duration-150 hover:bg-white/10">
              <i class="fa-solid fa-closed-captioning text-[12px]"></i>
            </button>
            <!-- Speed -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-[11px] font-bold text-white transition-colors duration-150 hover:bg-white/10">
              1×
            </button>
            <!-- Fullscreen -->
            <button
              class="grid size-8 place-items-center rounded-[6px] text-white transition-colors duration-150 hover:bg-white/10">
              <i class="fa-solid fa-expand text-[12px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
