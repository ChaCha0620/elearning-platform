<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const heroVisible = ref(false)

onMounted(() => {
  setTimeout(() => { heroVisible.value = true }, 100)
})

const stats = [
  { value: '2,800+', label: '活躍學員' },
  { value: '120+', label: '精選課程' },
  { value: '94%', label: '完課率' }
]

function scrollToFeatures() {
  const el = document.getElementById('home-features')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function scrollToHowItWorks() {
  const el = document.getElementById('home-how-it-works')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="overflow-clip bg-[#F8F9FA] px-16 pt-20">
    <div class="mx-auto flex max-w-[1312px] items-center gap-[67px]">
      <!-- Left content -->
      <div class="flex shrink-0 flex-col items-start gap-10">
        <!-- Tag -->
        <div
          class="flex items-center gap-2 rounded-md border border-[#E4E6EA] px-[22px] py-[10px] transition-all duration-700 ease-out"
          :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: '0ms' }">
          <span class="size-[6px] rounded-[3px] bg-[#1B3A5C]"></span>
          <span class="text-[22px] font-medium leading-8 text-[#555]">資訊 × 設計 × 職涯</span>
        </div>

        <!-- Heading -->
        <h1 class="font-black text-[64px] leading-[84px] transition-all duration-700 ease-out"
          :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          :style="{ transitionDelay: '120ms' }">
          <span class="block text-black">找出你下一步</span>
          <span class="block text-[#3672B5]">該學什麼。</span>
        </h1>

        <!-- Description -->
        <p class="text-sm font-medium leading-[21px] tracking-[0.14px] text-[#555] transition-all duration-700 ease-out"
          :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: '240ms' }">
          專為資訊與設計人才打造的進修與轉職導航平台。 透過精準測驗，找到屬於你的學習藍圖。
        </p>

        <!-- CTAs -->
        <div class="flex cursor-pointer items-center gap-8 transition-all duration-700 ease-out"
          :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: '360ms' }">
          <button
            class="rounded-lg bg-[#3672B5] px-[22px] py-[10px] text-sm font-medium leading-[21px] tracking-[0.14px] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2d5f97] hover:shadow-lg active:translate-y-0"
            @click="scrollToFeatures">
            立即開始測驗
          </button>
          <button
            class="text-sm font-medium leading-[21px] tracking-[0.14px] text-[#555] transition-colors duration-200 hover:text-[#3672B5]"
            @click="scrollToHowItWorks">
            了解運作方式 →
          </button>
        </div>

        <!-- Stats -->
        <div class="flex w-full items-center gap-6 border-t border-[#E4E6EA] pt-6 transition-all duration-700 ease-out"
          :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: '480ms' }">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-start gap-[2px]">
            <span class="text-[22px] font-extrabold leading-[33px] tracking-[-0.66px] text-black">{{ stat.value
            }}</span>
            <span class="text-xs font-normal leading-[18px] text-[#999]">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Right image -->
      <div class="flex flex-1 items-center self-stretch transition-all duration-1000 ease-out"
        :class="heroVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-12 scale-[0.96] opacity-0'"
        :style="{ transitionDelay: '200ms' }">
        <div class="h-full w-full overflow-hidden rounded-xl bg-white">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=824&h=549&fit=crop" alt="學習情境"
            class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>
