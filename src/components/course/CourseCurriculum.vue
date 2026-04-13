<script setup>
import { ref } from 'vue'
import ModuleAccordion from './ModuleAccordion.vue'

defineProps({
  totalUnits: { type: Number, default: 5 },
  totalChapters: { type: Number, default: 28 },
  totalAssignments: { type: Number, default: 3 },
  modules: { type: Array, default: () => [] },
  lockedCount: { type: Number, default: 2 }
})

const allExpanded = ref(false)

function toggleAll() {
  allExpanded.value = !allExpanded.value
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <!-- Section header -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-[3px]">
        <h2 class="text-[17px] font-extrabold tracking-[-0.425px] text-[#111]">課程內容與作業</h2>
        <p class="text-[12px] text-[#888]">
          共 {{ totalUnits }} 個單元 · {{ totalChapters }} 個章節 · {{ totalAssignments }} 份作業
        </p>
      </div>
      <button @click="toggleAll"
        class="rounded-lg border border-[#E5E7EB] px-4 py-[7px] text-[12px] font-medium text-[#444] transition-all duration-200 hover:bg-[#F5F6F8] hover:shadow-sm">
        {{ allExpanded ? '全部收起' : '全部展開' }}
      </button>
    </div>

    <!-- Modules list -->
    <div class="flex flex-col gap-3">
      <ModuleAccordion v-for="(mod, i) in modules" :key="i" v-bind="mod"
        :default-open="allExpanded || mod.defaultOpen" />
    </div>


  </section>
</template>
