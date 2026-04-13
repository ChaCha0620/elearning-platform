<script setup>
defineProps({
  type: { type: String, default: 'video' },
  title: { type: String, default: '' },
  duration: { type: String, default: '' },
  status: { type: String, default: 'locked' },
  isCurrent: { type: Boolean, default: false },
  isAssignment: { type: Boolean, default: false }
})
</script>

<template>
  <!-- Assignment row (dashed border) -->
  <div v-if="isAssignment"
    class="flex items-center gap-3 rounded-[12px] border border-dashed border-[#E2E2E2] bg-[#F3F3F3] px-[17px] py-3 transition-all duration-200 hover:bg-[#EDEDED]">
    <div class="grid size-9 place-items-center rounded-[10px] bg-[rgba(150,150,150,0.1)]">
      <i class="fa-solid fa-pen-to-square text-[14px] text-[#9D9D9D]"></i>
    </div>
    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <p class="text-[13px] font-bold text-[#9D9D9D]">{{ title }}</p>
      <p class="text-[11px] text-[#B5B5B5]">{{ duration }}</p>
    </div>
    <span
      class="flex items-center gap-1 rounded-[6px] bg-[rgba(138,138,138,0.12)] px-[10px] py-[5px] text-[11px] font-bold text-[#9D9D9D]">
      待繳交
      <i class="fa-solid fa-chevron-right text-[9px]"></i>
    </span>
  </div>

  <!-- Normal lesson row -->
  <div v-else class="flex items-center gap-3 rounded-[10px] px-3 py-[10px] transition-all duration-200 cursor-pointer"
    :class="{
      'bg-[#EEF2F7]': isCurrent,
      'hover:bg-[#F5F6F8]': !isCurrent,
      'opacity-50': status === 'locked'
    }">
    <!-- Icon -->
    <div class="grid size-7 shrink-0 place-items-center rounded-[7px]" :class="{
      'bg-[#D4EFE1]': status === 'done',
      'bg-[#EEF2F7]': status === 'current' || isCurrent,
      'bg-[#F0F2F5]': status === 'locked'
    }">
      <i v-if="type === 'video'" class="fa-solid fa-play text-[11px]"
        :class="{ 'text-[#1A5C3A]': status === 'done', 'text-[#1B3A5C]': status === 'current', 'text-[#BBB]': status === 'locked' }"></i>
      <i v-else class="fa-solid fa-circle-question text-[12px]"
        :class="{ 'text-[#1A5C3A]': status === 'done', 'text-[#1B3A5C]': status === 'current', 'text-[#BBB]': status === 'locked' }"></i>
    </div>

    <!-- Content -->
    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <div class="flex items-center gap-2">
        <p class="text-[13px]" :class="{
          'text-[#111]': status !== 'locked' && !isCurrent,
          'font-semibold text-[#1B3A5C]': isCurrent,
          'text-[#BBB]': status === 'locked'
        }">
          {{ title }}
        </p>
        <span v-if="isCurrent"
          class="rounded px-[6px] py-[1px] bg-[#1B3A5C] text-[9px] font-bold uppercase tracking-[0.36px] text-white">
          目前進度
        </span>
      </div>
      <p class="text-[11px] text-[#BBB]">{{ duration }}</p>
    </div>

    <!-- Status icon -->
    <div class="shrink-0">
      <div v-if="status === 'done'" class="grid size-5 place-items-center rounded-[10px] bg-[#1A5C3A]">
        <i class="fa-solid fa-check text-[8px] text-white"></i>
      </div>
      <div v-else-if="isCurrent"
        class="grid size-5 place-items-center rounded-[10px] bg-[#1B3A5C] shadow-[0_0_0_0_rgba(27,58,92,0.15)]">
        <i class="fa-solid fa-pause text-[7px] text-white"></i>
      </div>
      <!-- Locked -->
      <div v-else class="grid size-5 place-items-center rounded-[10px] border border-[#E5E7EB] bg-[#F0F2F5]">
        <span class="size-[5px] rounded-full bg-[#BBB]" />
      </div>
    </div>
  </div>
</template>
