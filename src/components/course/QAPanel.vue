<script setup>
defineProps({
  questions: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="rounded-2xl border border-[#E5E7EB] bg-white px-[22px] pb-5 pt-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <p class="text-[10px] font-bold uppercase tracking-[0.8px] text-[#888]">同學常問的問題</p>
      <button class="text-[11px] font-medium text-[#1B3A5C] transition-colors duration-200 hover:text-[#2563EB]">
        前往討論區 →
      </button>
    </div>

    <!-- Q&A list -->
    <div class="mt-4 flex flex-col gap-[10px]">
      <div v-for="(qa, i) in questions" :key="i"
        class="rounded-[10px] border border-[#F0F2F5] bg-[#F9FAFB] px-[15px] pb-2 pt-3">
        <!-- Question -->
        <div class="flex items-start gap-2">
          <span class="shrink-0 rounded px-[5px] py-px text-[10px] font-extrabold bg-[#EEF2F7] text-[#1B3A5C]">Q</span>
          <p class="text-[12px] font-semibold leading-[18.6px] text-[#111]">{{ qa.question }}</p>
        </div>
        <!-- Answer -->
        <div class="mt-2 flex items-start gap-2 pl-[2px]">
          <span class="shrink-0 rounded px-[5px] py-px text-[10px] font-extrabold bg-[#D4EFE1] text-[#1A5C3A]">A</span>
          <p class="text-[11px] leading-[17px] text-[#444]">{{ qa.answer }}</p>
        </div>
        <!-- Footer -->
        <div class="mt-2 flex items-center justify-between border-t border-[#F0F2F5] pt-[10px]">
          <div class="flex items-center gap-1">
            <i class="fa-regular fa-thumbs-up text-[12px] text-[#BBB]"></i>
            <span class="text-[10px] text-[#BBB]">{{ qa.helpfulCount }} 人覺得有幫助</span>
          </div>
          <span v-if="qa.instructorReplied"
            class="rounded px-[6px] py-[1px] bg-[#D4EFE1] text-[10px] font-semibold text-[#1A5C3A]">
            ✓ 講師回覆
          </span>
        </div>
      </div>
    </div>

    <!-- Ask question button -->
    <button
      class="mt-3 flex w-full items-center justify-center gap-[6px] rounded-[10px] border border-dashed border-[#E5E7EB] py-[10px] text-[12px] font-medium text-[#444] transition-all duration-200 hover:border-[#1B3A5C] hover:bg-[#F9FAFB] hover:text-[#1B3A5C]">
      <i class="fa-solid fa-plus text-[12px]"></i>
      提問新問題
    </button>
  </div>
</template>
