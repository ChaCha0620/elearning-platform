<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboarding } from '../../composables/useOnboarding.js'

const router = useRouter()
const { startTour } = useOnboarding()
const emit = defineEmits(['open-quiz'])

const current = ref(0)
const direction = ref('next')
const transitioning = ref(false)

const scenarios = [
  {
    id: 'explore',
    tag: '還沒有方向',
    tagColor: '#8B5CF6',
    icon: 'fa-solid fa-compass',
    emoji: '🧭',
    title: '不確定自己適合什麼？先測再說。',
    subtitle: '回答一系列情境題，系統會根據你的背景、擅長能力與性向，分析你最適合的職涯路線，並推薦對應的課程組合包。',
    features: ['情境式互動測驗', '個人化路線分析', '專屬課程組合推薦'],
    primary: { text: '開始斜槓潛力測驗', icon: 'fa-solid fa-play', action: 'quiz' },
    secondary: { text: '瀏覽六大學習路線', action: 'browse-paths' },
  },
  {
    id: 'search',
    tag: '已經有目標',
    tagColor: '#3672B5',
    icon: 'fa-solid fa-magnifying-glass',
    emoji: '🎯',
    title: '知道想學什麼，幫你最快找到合適的課。',
    subtitle: '透過難度（基礎／進階／實戰）、領域（前端、後端、UI/UX、資料科學…）與價格篩選，搭配智慧診斷評分，第一次就選對課。',
    features: ['6 大領域 × 3 級難度', '價格區間篩選', '智慧課程診斷'],
    primary: { text: '開始搜尋課程', icon: 'fa-solid fa-search', action: 'search-tour' },
    secondary: { text: '不確定程度？先做測驗', action: 'quiz' },
  },
  {
    id: 'progress',
    tag: '已經在學了',
    tagColor: '#059669',
    icon: 'fa-solid fa-chart-radar',
    emoji: '📊',
    title: '想知道學到哪了？看看你的技能雷達圖。',
    subtitle: '追蹤前端、後端、UI/UX、資料科學等 6 大技能維度的掌握度，對比目標分數找出能力缺口，精準安排下一步要補什麼。',
    features: ['6 維度技能雷達', '能力缺口分析', '學習進度追蹤'],
    primary: { text: '查看我的能力指標', icon: 'fa-solid fa-chart-line', action: 'skills' },
    secondary: { text: '回顧已購課程進度', action: 'my-courses' },
  },
]

const total = scenarios.length

function goTo(i) {
  if (transitioning.value || i === current.value) return
  direction.value = i > current.value ? 'next' : 'prev'
  transitioning.value = true
  current.value = i
  setTimeout(() => { transitioning.value = false }, 420)
}
function next() {
  if (transitioning.value) return
  direction.value = 'next'
  transitioning.value = true
  current.value = (current.value + 1) % total
  setTimeout(() => { transitioning.value = false }, 420)
}
function prev() {
  if (transitioning.value) return
  direction.value = 'prev'
  transitioning.value = true
  current.value = (current.value - 1 + total) % total
  setTimeout(() => { transitioning.value = false }, 420)
}

function handleAction(action) {
  switch (action) {
    case 'quiz':
      emit('open-quiz')
      break
    case 'browse-paths':
      router.push({ name: 'search' })
      break
    case 'search-tour':
      startTour()
      router.push({ name: 'search', query: { focus: '1' } })
      break
    case 'skills':
      router.push({ name: 'skillMetrics' })
      break
    case 'my-courses':
      router.push({ name: 'myCourses' })
      break
  }
}
</script>

<template>
  <section
    class="relative w-full bg-[#F8F9FA] px-6 pb-2 pt-6 md:px-16 md:pt-8"
    aria-roledescription="carousel"
    aria-label="使用者情境輪播"
  >
    <div class="mx-auto max-w-[1312px]">
      <!-- Header row -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="size-1.5 rounded-full bg-[#3672B5]"></span>
          <span class="text-[13px] font-semibold tracking-wide text-[#888]">你現在在哪個階段？</span>
        </div>
        <div class="flex items-center gap-1.5 text-[13px] font-medium text-[#AAA]">
          <span class="text-[#555]">{{ current + 1 }}</span>
          <span>/</span>
          <span>{{ total }}</span>
        </div>
      </div>

      <!-- Card area -->
      <div class="relative">
        <!-- Arrows -->
        <button
          @click="prev"
          class="absolute -left-4 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-[#E4E6EA] bg-white text-[#555] shadow-sm transition-all duration-200 hover:shadow-md md:-left-5 md:size-10"
          aria-label="上一個情境"
        ><i class="fa-solid fa-chevron-left text-xs"></i></button>
        <button
          @click="next"
          class="absolute -right-4 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-[#E4E6EA] bg-white text-[#555] shadow-sm transition-all duration-200 hover:shadow-md md:-right-5 md:size-10"
          aria-label="下一個情境"
        ><i class="fa-solid fa-chevron-right text-xs"></i></button>

        <!-- Card -->
        <div class="overflow-hidden rounded-2xl" aria-live="polite">
          <Transition :name="direction === 'next' ? 'sc-next' : 'sc-prev'" mode="out-in">
            <div
              :key="scenarios[current].id"
              class="relative flex flex-col overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:flex-row"
            >
              <!-- Top accent bar -->
              <div
                class="absolute left-0 top-0 h-[3px] w-full"
                :style="{ backgroundColor: scenarios[current].tagColor }"
              ></div>

              <!-- Left: content -->
              <div class="flex flex-1 flex-col gap-4 px-7 py-7 md:px-9 md:py-8">
                <!-- Tag -->
                <span
                  class="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-[5px] text-[12px] font-bold text-white"
                  :style="{ backgroundColor: scenarios[current].tagColor }"
                >
                  <i :class="scenarios[current].icon" class="text-[10px]"></i>
                  {{ scenarios[current].tag }}
                </span>

                <!-- Title -->
                <h3 class="text-[20px] font-extrabold leading-[1.35] tracking-[-0.3px] text-[#1A1A1A] md:text-[22px]">
                  {{ scenarios[current].title }}
                </h3>

                <!-- Subtitle -->
                <p class="max-w-[520px] text-[14px] leading-[1.7] text-[#666]">
                  {{ scenarios[current].subtitle }}
                </p>

                <!-- Feature pills -->
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    v-for="f in scenarios[current].features"
                    :key="f"
                    class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-[4px] text-[11px] font-semibold"
                    :style="{
                      borderColor: scenarios[current].tagColor + '30',
                      color: scenarios[current].tagColor,
                      backgroundColor: scenarios[current].tagColor + '08'
                    }"
                  >
                    <i class="fa-solid fa-check text-[8px]"></i>
                    {{ f }}
                  </span>
                </div>

                <!-- CTAs -->
                <div class="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    @click="handleAction(scenarios[current].primary.action)"
                    class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    :style="{ backgroundColor: scenarios[current].tagColor }"
                  >
                    <i :class="scenarios[current].primary.icon" class="text-[11px]"></i>
                    {{ scenarios[current].primary.text }}
                  </button>
                  <button
                    @click="handleAction(scenarios[current].secondary.action)"
                    class="rounded-lg border border-[#E0E2E7] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#555] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C0C4CC] hover:shadow-sm active:translate-y-0"
                  >
                    {{ scenarios[current].secondary.text }}
                  </button>
                </div>
              </div>

              <!-- Right: illustration area -->
              <div
                class="relative hidden items-center justify-center overflow-hidden md:flex md:w-[260px] md:shrink-0 lg:w-[300px]"
                :style="{
                  background: `linear-gradient(145deg, ${scenarios[current].tagColor}0C 0%, ${scenarios[current].tagColor}18 50%, ${scenarios[current].tagColor}08 100%)`
                }"
              >
                <!-- Decorative bg shapes -->
                <div class="pointer-events-none absolute inset-0">
                  <div class="absolute -right-6 -top-6 size-[120px] rounded-full"
                    :style="{ backgroundColor: scenarios[current].tagColor + '0C' }"></div>
                  <div class="absolute -bottom-5 -left-5 size-[80px] rounded-full"
                    :style="{ backgroundColor: scenarios[current].tagColor + '0A' }"></div>
                  <div class="absolute right-8 bottom-10 size-[50px] rounded-full"
                    :style="{ backgroundColor: scenarios[current].tagColor + '08' }"></div>
                </div>

                <!-- ===== Illustration: 還沒有方向 ===== -->
                <svg v-if="scenarios[current].id === 'explore'" viewBox="0 0 240 200" class="relative z-10 w-[210px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- ground -->
                  <ellipse cx="120" cy="182" rx="85" ry="10" :fill="scenarios[current].tagColor + '15'" />
                  <!-- body -->
                  <rect x="102" y="100" width="36" height="52" rx="8" :fill="scenarios[current].tagColor" opacity="0.85" />
                  <!-- arms -->
                  <rect x="82" y="104" width="20" height="8" rx="4" :fill="scenarios[current].tagColor" opacity="0.7" />
                  <rect x="138" y="104" width="20" height="8" rx="4" :fill="scenarios[current].tagColor" opacity="0.7" />
                  <!-- hands up gesture -->
                  <circle cx="78" cy="97" r="6" :fill="'#FBBF7A'" />
                  <circle cx="162" cy="97" r="6" :fill="'#FBBF7A'" />
                  <!-- head -->
                  <circle cx="120" cy="78" r="24" :fill="'#FFD9A0'" />
                  <!-- hair -->
                  <path d="M96 72c0-16 12-28 24-28s24 12 24 28" :fill="scenarios[current].tagColor" opacity="0.6" />
                  <!-- eyes  -->
                  <circle cx="112" cy="78" r="3" fill="#333" />
                  <circle cx="128" cy="78" r="3" fill="#333" />
                  <!-- mouth (confused) -->
                  <path d="M113 90 c2 3 12 3 14 0" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" />
                  <!-- legs -->
                  <rect x="106" y="152" width="12" height="28" rx="5" :fill="scenarios[current].tagColor" opacity="0.65" />
                  <rect x="122" y="152" width="12" height="28" rx="5" :fill="scenarios[current].tagColor" opacity="0.65" />
                  <!-- question marks floating -->
                  <text x="60" y="55" :fill="scenarios[current].tagColor" font-size="22" font-weight="bold" opacity="0.6">?</text>
                  <text x="170" y="48" :fill="scenarios[current].tagColor" font-size="18" font-weight="bold" opacity="0.45">?</text>
                  <text x="46" y="88" :fill="scenarios[current].tagColor" font-size="15" font-weight="bold" opacity="0.35">?</text>
                  <!-- signpost -->
                  <rect x="186" y="90" width="4" height="92" rx="2" fill="#C4B5A0" />
                  <rect x="178" y="90" width="40" height="16" rx="4" :fill="scenarios[current].tagColor" opacity="0.55" />
                  <rect x="160" y="112" width="40" height="16" rx="4" :fill="scenarios[current].tagColor" opacity="0.35" />
                  <!-- arrow on signs -->
                  <path d="M210 98 l6 0 l-3-4z" fill="white" opacity="0.8" />
                  <path d="M165 120 l-6 0 l3 4z" fill="white" opacity="0.6" />
                  <!-- sparkles -->
                  <circle cx="50" cy="40" r="2.5" fill="#FBBF24" opacity="0.7" />
                  <circle cx="185" cy="30" r="2" fill="#FBBF24" opacity="0.5" />
                </svg>

                <!-- ===== Illustration: 已經有目標 ===== -->
                <svg v-else-if="scenarios[current].id === 'search'" viewBox="0 0 240 200" class="relative z-10 w-[210px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- ground -->
                  <ellipse cx="120" cy="184" rx="90" ry="10" :fill="scenarios[current].tagColor + '15'" />
                  <!-- desk -->
                  <rect x="40" y="136" width="160" height="8" rx="3" fill="#D4C4A8" />
                  <rect x="52" y="144" width="8" height="40" rx="2" fill="#C4B5A0" />
                  <rect x="180" y="144" width="8" height="40" rx="2" fill="#C4B5A0" />
                  <!-- monitor -->
                  <rect x="75" y="88" width="90" height="52" rx="6" :fill="scenarios[current].tagColor" opacity="0.15" />
                  <rect x="75" y="88" width="90" height="52" rx="6" :stroke="scenarios[current].tagColor" stroke-width="3" opacity="0.5" />
                  <rect x="112" y="140" width="16" height="0" rx="2" :fill="scenarios[current].tagColor" opacity="0.3" />
                  <!-- screen content: search bar -->
                  <rect x="86" y="98" width="68" height="10" rx="5" fill="white" opacity="0.9" />
                  <circle cx="148" cy="103" r="4" :fill="scenarios[current].tagColor" opacity="0.6" />
                  <!-- screen content: course cards -->
                  <rect x="86" y="114" width="30" height="18" rx="3" fill="white" opacity="0.6" />
                  <rect x="120" y="114" width="30" height="18" rx="3" fill="white" opacity="0.6" />
                  <!-- checkmarks on cards -->
                  <path d="M96 122 l3 3 l6-6" :stroke="scenarios[current].tagColor" stroke-width="2" stroke-linecap="round" fill="none" />
                  <!-- person sitting -->
                  <circle cx="120" cy="50" r="20" fill="#FFD9A0" />
                  <!-- hair -->
                  <path d="M100 44c0-14 10-24 20-24s20 10 20 24" :fill="scenarios[current].tagColor" opacity="0.5" />
                  <!-- eyes (focused) -->
                  <ellipse cx="113" cy="50" rx="2.5" ry="3" fill="#333" />
                  <ellipse cx="127" cy="50" rx="2.5" ry="3" fill="#333" />
                  <!-- glasses -->
                  <circle cx="113" cy="50" r="7" :stroke="scenarios[current].tagColor" stroke-width="1.5" fill="none" opacity="0.5" />
                  <circle cx="127" cy="50" r="7" :stroke="scenarios[current].tagColor" stroke-width="1.5" fill="none" opacity="0.5" />
                  <line x1="120" y1="50" x2="120" y2="50" :stroke="scenarios[current].tagColor" stroke-width="1.5" opacity="0.5" />
                  <!-- smile -->
                  <path d="M114 58 c2 3 10 3 12 0" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  <!-- body (seated) -->
                  <rect x="106" y="70" width="28" height="40" rx="7" :fill="scenarios[current].tagColor" opacity="0.8" />
                  <!-- arms on desk -->
                  <rect x="85" y="110" width="24" height="8" rx="4" :fill="scenarios[current].tagColor" opacity="0.6" />
                  <rect x="131" y="110" width="24" height="8" rx="4" :fill="scenarios[current].tagColor" opacity="0.6" />
                  <!-- hands -->
                  <circle cx="85" cy="114" r="5" fill="#FBBF7A" />
                  <circle cx="155" cy="114" r="5" fill="#FBBF7A" />
                  <!-- magnifying glass floating -->
                  <circle cx="198" cy="45" r="14" :stroke="scenarios[current].tagColor" stroke-width="3" fill="white" opacity="0.7" />
                  <line x1="208" y1="55" x2="218" y2="65" :stroke="scenarios[current].tagColor" stroke-width="3" stroke-linecap="round" opacity="0.7" />
                  <!-- sparkles -->
                  <circle cx="38" cy="60" r="3" fill="#FBBF24" opacity="0.5" />
                  <circle cx="195" cy="22" r="2" fill="#FBBF24" opacity="0.6" />
                  <path d="M42 30 l2-6 l2 6 l-2 6z" fill="#FBBF24" opacity="0.4" />
                </svg>

                <!-- ===== Illustration: 已經在學了 ===== -->
                <svg v-else viewBox="0 0 240 200" class="relative z-10 w-[210px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- ground -->
                  <ellipse cx="120" cy="186" rx="90" ry="10" :fill="scenarios[current].tagColor + '15'" />
                  <!-- chart bars -->
                  <rect x="40" y="130" width="24" height="50" rx="4" :fill="scenarios[current].tagColor" opacity="0.2" />
                  <rect x="70" y="110" width="24" height="70" rx="4" :fill="scenarios[current].tagColor" opacity="0.35" />
                  <rect x="100" y="90" width="24" height="90" rx="4" :fill="scenarios[current].tagColor" opacity="0.5" />
                  <rect x="130" y="68" width="24" height="112" rx="4" :fill="scenarios[current].tagColor" opacity="0.65" />
                  <rect x="160" y="48" width="24" height="132" rx="4" :fill="scenarios[current].tagColor" opacity="0.8" />
                  <!-- growth line -->
                  <path d="M52 125 L82 105 L112 85 L142 62 L172 42" :stroke="scenarios[current].tagColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                  <!-- dots on line -->
                  <circle cx="52" cy="125" r="4" :fill="scenarios[current].tagColor" opacity="0.4" />
                  <circle cx="82" cy="105" r="4" :fill="scenarios[current].tagColor" opacity="0.5" />
                  <circle cx="112" cy="85" r="4" :fill="scenarios[current].tagColor" opacity="0.6" />
                  <circle cx="142" cy="62" r="4" :fill="scenarios[current].tagColor" opacity="0.75" />
                  <circle cx="172" cy="42" r="5" :fill="scenarios[current].tagColor" />
                  <!-- flag at peak -->
                  <rect x="172" y="22" width="3" height="22" rx="1" :fill="scenarios[current].tagColor" />
                  <path d="M175 22 l18 7 l-18 7z" :fill="scenarios[current].tagColor" opacity="0.9" />
                  <!-- person climbing/celebrating on top -->
                  <circle cx="164" cy="16" r="12" fill="#FFD9A0" />
                  <!-- hair -->
                  <path d="M152 12c0-8 6-14 12-14s12 6 12 14" :fill="scenarios[current].tagColor" opacity="0.5" />
                  <!-- eyes (happy) -->
                  <path d="M159 15 c0-2 2-3 3-1" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  <path d="M167 15 c0-2 2-3 3-1" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  <!-- big smile -->
                  <path d="M159 20 c2 4 8 4 10 0" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  <!-- star sparkles near flag -->
                  <path d="M200 15 l2-5 l2 5 l-2 5z" fill="#FBBF24" opacity="0.7" />
                  <circle cx="198" cy="32" r="2" fill="#FBBF24" opacity="0.5" />
                  <circle cx="210" cy="8" r="2.5" fill="#FBBF24" opacity="0.6" />
                  <!-- small sparkles -->
                  <circle cx="28" cy="100" r="2" fill="#FBBF24" opacity="0.4" />
                  <path d="M32 140 l1.5-4 l1.5 4 l-1.5 4z" fill="#FBBF24" opacity="0.3" />
                  <!-- radar hint (small hexagon) -->
                  <polygon points="35,45 50,35 65,45 65,60 50,70 35,60" :stroke="scenarios[current].tagColor" stroke-width="1.5" fill="none" opacity="0.25" />
                  <polygon points="42,49 50,43 58,49 58,57 50,63 42,57" :fill="scenarios[current].tagColor" opacity="0.12" />
                </svg>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Dots -->
        <div class="mt-3 flex items-center justify-center gap-2">
          <button
            v-for="(s, i) in scenarios"
            :key="s.id"
            @click="goTo(i)"
            class="h-[5px] rounded-full transition-all duration-300"
            :class="i === current ? 'w-6' : 'w-[5px] bg-[#D5D8DE] hover:bg-[#B0B5BD]'"
            :style="i === current ? { backgroundColor: scenarios[current].tagColor } : {}"
            :aria-label="`情境：${s.tag}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sc-next-enter-active, .sc-next-leave-active,
.sc-prev-enter-active, .sc-prev-leave-active {
  transition: all 0.38s cubic-bezier(0.4, 0, 0.2, 1);
}
.sc-next-enter-from { opacity: 0; transform: translateX(50px); }
.sc-next-leave-to   { opacity: 0; transform: translateX(-50px); }
.sc-prev-enter-from { opacity: 0; transform: translateX(-50px); }
.sc-prev-leave-to   { opacity: 0; transform: translateX(50px); }
</style>
