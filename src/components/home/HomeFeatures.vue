<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboarding } from '../../composables/useOnboarding.js'

const router = useRouter()
const { startTour } = useOnboarding()
const emit = defineEmits(['open-quiz'])

const sectionRef = ref(null)
const visible = ref(false)

let observer = null
onMounted(() => {
  const el = document.getElementById('home-features')
  if (!el) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { visible.value = true; observer.disconnect() }
  }, { threshold: 0.15 })
  observer.observe(el)
})
onUnmounted(() => { if (observer) observer.disconnect() })

const cards = [
  {
    id: 'strengthen',
    tag: '精準推課',
    title: '找到你最需要的課',
    desc: '依據你的職位與技能缺口，智慧推薦最適合的學習路徑。不再盲目選課，每一堂都精準補強你的能力。',
    link: '開始精準推薦',
    dark: false
  },
  {
    id: 'explore',
    tag: '斜槓探索 / 轉職',
    title: '探索斜槓潛力',
    desc: '專為想轉職或尋找隱藏天賦的新手打造。透過天賦探索問卷，發現你從未想過的職涯可能性。',
    link: '開始天賦探索',
    dark: true
  }
]

function goToSearch(cardId) {
  if (cardId === 'explore') {
    emit('open-quiz')
    return
  }
  if (cardId === 'strengthen') {
    startTour()
  }
  router.push({ name: 'search', query: { focus: '1' } })
}
</script>

<template>
  <section id="home-features" class="bg-[#F8F9FA] px-16 py-[120px]">
    <div class="mx-auto max-w-[1312px]">
      <!-- Section label -->
      <div class="mb-[52px] flex items-center gap-4 transition-all duration-700 ease-out"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'">
        <span class="text-sm font-medium leading-[21px] tracking-[0.14px] text-[#999]">從這裡出發</span>
        <div class="h-px flex-1 bg-[#E4E6EA]"></div>
      </div>

      <!-- Heading -->
      <h2 class="mb-[52px] text-[48px] font-black leading-[60px] text-[#111] transition-all duration-700 ease-out"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        :style="{ transitionDelay: '120ms' }">選擇你的學習路徑</h2>

      <!-- Cards -->
      <div class="flex items-center justify-between gap-6">
        <div v-for="(card, ci) in cards" :key="card.id" :class="[
          'flex h-[320px] w-[568px] flex-col items-start justify-between rounded-xl pl-[45px] py-[49px] pr-[1px] transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1',
          card.dark
            ? 'bg-[#3672B5] hover:bg-[#2d5f97]'
            : 'border border-[#E4E6EA] bg-white'
        ]" :style="{ transitionDelay: visible ? (240 + ci * 150) + 'ms' : '0ms' }"
          :class-extra="visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-[0.97]'">
          <div
            :class="['transition-all duration-700 ease-out', visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0']"
            :style="{ transitionDelay: (240 + ci * 150) + 'ms' }">
            <div class="flex flex-col items-start gap-[18px]">
              <span
                :class="['text-sm font-medium leading-[21px] tracking-[0.14px]', card.dark ? 'text-white' : 'text-[#999]']">
                {{ card.tag }}
              </span>
              <h3
                :class="['text-[30px] font-extrabold leading-[34.5px] tracking-[-0.9px]', card.dark ? 'text-white' : 'text-black']">
                {{ card.title }}
              </h3>
              <p
                :class="['w-[315px] text-sm font-medium leading-[21px] tracking-[0.14px]', card.dark ? 'text-white' : 'text-[#555]']">
                {{ card.desc }}
              </p>
            </div>
            <button :class="[
              'mt-6 flex items-center gap-2 text-sm font-medium leading-[21px] tracking-[0.14px] transition-all duration-200 hover:gap-3',
              card.dark ? 'text-white' : 'text-[#3672B5]'
            ]" @click="goToSearch(card.id)">
              {{ card.link }}
              <span class="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
