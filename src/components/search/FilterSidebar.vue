<script setup>
const props = defineProps({
  levels: {
    type: Array,
    default: () => []
  },
  selectedLevel: {
    type: String,
    default: '全部'
  },
  domainGroups: {
    type: Array,
    default: () => []
  },
  selectedDomain: {
    type: String,
    default: '全部'
  },
  showLevelFilter: {
    type: Boolean,
    default: true
  },
  availableDomains: {
    type: Set,
    default: () => new Set()
  },
  priceRanges: {
    type: Array,
    default: () => []
  },
  selectedPrice: {
    type: String,
    default: '全部'
  },
  showPriceFilter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:selectedLevel', 'update:selectedDomain', 'update:selectedPrice'])
</script>

<template>
  <aside class="fixed left-0 top-20 z-30 w-[260px] overflow-y-auto border-r border-[#E4E6EA] bg-white" style="height: calc(100vh - 80px);">
    <div class="space-y-7 px-6 py-5">
      <section v-if="showLevelFilter">
        <h3 class="text-[10px] font-bold uppercase tracking-[1.2px] text-[#999999]">篩選條件</h3>
        <div class="mt-2.5 space-y-2.5">
          <p class="text-xs font-semibold text-[#555555]">難易度</p>
          <button v-for="level in levels" :key="level" type="button"
            class="flex h-[34px] w-full items-center gap-2.5 rounded-md pl-2.5 text-left text-[13px] transition-all duration-200"
            :class="selectedLevel === level ? 'bg-[#EEF2F7] text-[#111111]' : 'hover:bg-[#F8F9FA] text-[#555555]'"
            @click="emit('update:selectedLevel', level)">
            <span class="grid size-3.5 place-items-center rounded-[4px] border text-[8px]"
              :class="selectedLevel === level ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white' : 'border-[#E4E6EA] bg-white text-transparent'">
              ✓
            </span>
            <span :class="selectedLevel === level ? 'font-semibold' : 'font-normal'">{{ level }}</span>
          </button>
        </div>
      </section>

      <section v-if="showPriceFilter && priceRanges.length">
        <div class="space-y-2.5">
          <p class="text-xs font-semibold text-[#555555]">價格範圍</p>
          <button v-for="range in priceRanges" :key="range.label" type="button"
            class="flex h-[34px] w-full items-center gap-2.5 rounded-md pl-2.5 text-left text-[13px] transition-all duration-200"
            :class="selectedPrice === range.label ? 'bg-[#EEF2F7] text-[#111111]' : 'hover:bg-[#F8F9FA] text-[#555555]'"
            @click="emit('update:selectedPrice', range.label)">
            <span class="grid size-3.5 place-items-center rounded-[4px] border text-[8px]"
              :class="selectedPrice === range.label ? 'border-[#1B3A5C] bg-[#1B3A5C] text-white' : 'border-[#E4E6EA] bg-white text-transparent'">
              ✓
            </span>
            <span :class="selectedPrice === range.label ? 'font-semibold' : 'font-normal'">{{ range.label }}</span>
          </button>
        </div>
      </section>

      <section>
        <h3 class="text-[10px] font-bold uppercase tracking-[1.2px] text-[#999999]">探索領域</h3>
        <div class="mt-3 space-y-2">
          <!-- 全部（獨立於領域群組之上） -->
          <button type="button"
            class="flex h-[34px] w-full items-center rounded-md px-2.5 text-[13px] transition-all duration-200"
            :class="selectedDomain === '全部' ? 'bg-[#EEF2F7] font-semibold text-[#1B3A5C]' : 'text-[#555555] hover:bg-[#F8F9FA]'"
            @click="emit('update:selectedDomain', '全部')">
            全部
          </button>

          <div v-for="group in domainGroups" :key="group.name" class="rounded-[7px]">
            <div class="flex items-center gap-2.5 rounded-[7px] px-2.5 py-2.5">
              <span class="text-[11px] opacity-50">{{ group.icon }}</span>
              <div class="flex-1">
                <p class="text-[13px] font-bold leading-4 text-[#111111]">{{ group.name }}</p>
                <p class="text-[10px] text-[#999999]">{{ group.en }}</p>
              </div>
            </div>
            <div class="ml-5 space-y-0.5 pl-2.5">
              <button v-for="item in group.items" :key="item" type="button"
                class="flex h-[34px] w-full items-center rounded-md px-2.5 text-left text-[13px] transition-all duration-200"
                :class="selectedDomain === item && availableDomains.has(item) ? 'bg-[#EEF2F7] font-semibold text-[#1B3A5C]' : 'text-[#555555] hover:bg-[#F8F9FA]'"
                @click="availableDomains.has(item) && emit('update:selectedDomain', item)">
                {{ item }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>
