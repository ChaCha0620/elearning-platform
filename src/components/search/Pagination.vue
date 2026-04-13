<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:currentPage'])

function goTo(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}
</script>

<template>
  <nav class="flex items-center justify-center gap-2">
    <button type="button"
      class="rounded-lg border border-[#E4E6EA] bg-white px-3 py-1.5 text-xs text-[#555555] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F9FA] hover:shadow-sm"
      @click="goTo(currentPage - 1)">
      上一頁
    </button>

    <button v-for="page in totalPages" :key="page" type="button"
      class="grid size-8 place-items-center rounded-lg border text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
      :class="page === currentPage ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white shadow-md' : 'border-[#E4E6EA] bg-white text-[#555555] hover:bg-[#F8F9FA]'"
      @click="goTo(page)">
      {{ page }}
    </button>

    <button type="button"
      class="rounded-lg border border-[#E4E6EA] bg-white px-3 py-1.5 text-xs text-[#555555] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F9FA] hover:shadow-sm"
      @click="goTo(currentPage + 1)">
      下一頁
    </button>
  </nav>
</template>
