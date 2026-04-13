<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
let observer = null
onMounted(() => {
  const el = document.getElementById('home-how-it-works')
  if (!el) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { visible.value = true; observer.disconnect() }
  }, { threshold: 0.15 })
  observer.observe(el)
})
onUnmounted(() => { if (observer) observer.disconnect() })

const steps = [
  {
    num: '01',
    title: '精準測驗',
    desc: '透過我們設計的能力矩陣測驗，精準找出你的技能缺口或潛在天賦。測驗時間約 10 分鐘，涵蓋邏輯、設計思維與技術能力。',
    icon: 'clipboard-check'
  },
  {
    num: '02',
    title: '專屬推薦',
    desc: '根據測驗結果，AI 系統即時生成你的個人化學習藍圖，提供精選課程路徑，並清楚說明每一步的學習目標與預計時程。',
    icon: 'wand-magic-sparkles'
  },
  {
    num: '03',
    title: '沉浸學習',
    desc: '依自身節奏進行彈性模組課程，搭配即時作業評測與完課里程碑獎勵制度，讓學習動力持續不中斷。',
    icon: 'book-open-reader'
  }
]
</script>

<template>
  <section id="home-how-it-works" class="bg-white px-16 py-[120px]">
    <div class="mx-auto max-w-[1312px]">
      <!-- Section label -->
      <div class="mb-16 flex items-center gap-4 transition-all duration-700 ease-out"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
        <span class="text-sm font-medium leading-[21px] tracking-[0.14px] text-[#999]">運作流程</span>
        <div class="h-px flex-1 bg-[#E4E6EA]"></div>
      </div>

      <!-- Heading row -->
      <div class="mb-16 flex items-center justify-between transition-all duration-700 ease-out"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        :style="{ transitionDelay: '120ms' }">
        <h2 class="text-[48px] font-black leading-[60px] text-black">三步驟，找到你的學習藍圖。</h2>
        <p class="w-[320px] text-right text-sm font-medium leading-[21px] tracking-[0.14px] text-[#555]">
          "學易點"不是另一個課程平台，<br />而是一套專屬於你的學習導航系統。
        </p>
      </div>

      <!-- Step cards -->
      <div class="flex items-start justify-between">
        <div v-for="(step, si) in steps" :key="step.num"
          class="flex w-[349px] flex-col items-start gap-5 transition-all duration-700 ease-out"
          :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
          :style="{ transitionDelay: (240 + si * 150) + 'ms' }">
          <!-- Step number + icon -->
          <div class="flex w-full items-start justify-between">
            <span class="text-[22px] font-medium leading-8 text-[#999]">步驟 {{ step.num }}</span>
            <!-- Icons -->
            <i v-if="step.icon === 'clipboard-check'" class="fa-solid fa-clipboard-check text-[24px] text-[#999]"></i>
            <i v-else-if="step.icon === 'wand-magic-sparkles'"
              class="fa-solid fa-wand-magic-sparkles text-[24px] text-[#999]"></i>
            <i v-else class="fa-solid fa-book-open-reader text-[24px] text-[#999]"></i>
          </div>

          <!-- Divider -->
          <div class="h-px w-full bg-[#999] transition-all duration-700 ease-out"
            :class="visible ? 'scale-x-100' : 'scale-x-0'"
            :style="{ transformOrigin: 'left', transitionDelay: (400 + si * 150) + 'ms' }"></div>

          <!-- Title -->
          <h3 class="text-[22px] font-bold leading-8 text-black">{{ step.title }}</h3>

          <!-- Description -->
          <p class="w-[345px] text-sm font-medium leading-[21px] tracking-[0.14px] text-[#555]">
            {{ step.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
