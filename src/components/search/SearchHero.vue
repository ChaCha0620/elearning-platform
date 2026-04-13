<script setup>
defineProps({
  keyword: {
    type: String,
    default: ''
  },
  totalCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['back'])
</script>

<template>
  <section class="space-y-4">
    <button type="button"
      class="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-[13px] py-[6px] text-xs font-medium text-[#666666] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F9FA] hover:shadow-sm active:translate-y-0"
      @click="emit('back')">
      <i class="fa-solid fa-chevron-left text-[10px]"></i>
      返回大廳
    </button>

    <div>
      <h3 class="text-base font-bold tracking-[-0.32px] text-[#111111]">「{{ keyword || 'css' }}」的搜尋結果</h3>
      <p class="mt-1 text-[13px] leading-[19.5px] text-[#888888]">
        共找到 <span class="font-bold text-[#1B3A5C]">{{ totalCount }}</span> 門課程
      </p>
    </div>
  </section>
</template>
