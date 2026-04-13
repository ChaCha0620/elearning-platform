<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart'
import { bundles } from '../../data/bundles.js'

const router = useRouter()
const { addToCart, isInCart } = useCart()

const props = defineProps({
  autoPlay: { type: Boolean, default: true },
  interval: { type: Number, default: 6000 },
})

const current = ref(0)
const direction = ref('next')
const isHovered = ref(false)
const isTransitioning = ref(false)
let timer = null

const total = bundles.length
const bundle = computed(() => bundles[current.value])

function goTo(i) {
  if (isTransitioning.value) return
  direction.value = i > current.value ? 'next' : 'prev'
  isTransitioning.value = true
  current.value = i
  resetTimer()
  setTimeout(() => { isTransitioning.value = false }, 480)
}
function next() {
  if (isTransitioning.value) return
  direction.value = 'next'
  isTransitioning.value = true
  current.value = (current.value + 1) % total
  resetTimer()
  setTimeout(() => { isTransitioning.value = false }, 480)
}
function prev() {
  if (isTransitioning.value) return
  direction.value = 'prev'
  isTransitioning.value = true
  current.value = (current.value - 1 + total) % total
  resetTimer()
  setTimeout(() => { isTransitioning.value = false }, 480)
}

function startTimer() {
  if (!props.autoPlay) return
  stopTimer()
  timer = setInterval(() => { if (!isHovered.value) next() }, props.interval)
}
function stopTimer() { if (timer) { clearInterval(timer); timer = null } }
function resetTimer() { stopTimer(); startTimer() }

onMounted(startTimer)
onBeforeUnmount(stopTimer)

function addBundleToCart(b) {
  const disc = b.discountPercent / 100
  b.courses.forEach(c => {
    if (!isInCart(c.id)) {
      addToCart(c.id, {
        id: c.id, title: c.title,
        price: Math.round(c.price * (1 - disc)),
        originalPrice: c.price, image: '',
      })
    }
  })
}
function allInCart(b) { return b.courses.every(c => isInCart(c.id)) }
function fmt(n) { return 'NT$' + n.toLocaleString() }
</script>

<template>
  <section
    class="carousel-wrap relative w-full"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    aria-roledescription="carousel"
    aria-label="課程組合包"
  >
    <!-- ── Slide area ── -->
    <div class="relative overflow-hidden">
      <Transition :name="direction === 'next' ? 'hero-next' : 'hero-prev'" mode="out-in">
        <div
          :key="bundle.id"
          class="banner-slide relative flex min-h-[340px] items-center overflow-hidden"
          :style="{
            background: `linear-gradient(135deg, ${bundle.color} 0%, ${bundle.color}DD 50%, ${bundle.color}99 100%)`
          }"
        >
          <!-- Decorative circles -->
          <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute -right-16 -top-16 size-[320px] rounded-full opacity-[0.08]"
              style="background: white"></div>
            <div class="absolute -bottom-20 -left-10 size-[240px] rounded-full opacity-[0.06]"
              style="background: white"></div>
            <div class="absolute right-[30%] top-[10%] size-[100px] rounded-full opacity-[0.05]"
              style="background: white"></div>
          </div>

          <div class="relative z-10 mx-auto flex w-full max-w-[1312px] items-center gap-10 px-6 py-10 md:gap-16 md:px-16 md:py-14">
            <!-- ─ Left: text content ─ -->
            <div class="flex flex-1 flex-col gap-5">
              <!-- Path label + icon -->
              <div class="flex items-center gap-3">
                <span class="grid size-11 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <i :class="bundle.icon" class="text-lg text-white"></i>
                </span>
                <div>
                  <span class="text-[11px] font-bold uppercase tracking-[1.5px] text-white/60">學習路線</span>
                  <p class="text-sm font-semibold text-white/90">{{ bundle.subtitle }}</p>
                </div>
              </div>

              <!-- Title -->
              <h2 class="text-[28px] font-black leading-[1.2] tracking-[-0.5px] text-white md:text-[34px]">
                {{ bundle.name }}
              </h2>

              <!-- Description -->
              <p class="max-w-[420px] text-[15px] leading-relaxed text-white/80">
                {{ bundle.description }}
              </p>

              <!-- Tags row -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm">
                  <i class="fa-solid fa-book-open text-[10px]"></i>
                  {{ bundle.courses.length }} 門課程
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm">
                  <i class="fa-solid fa-tag text-[10px]"></i>
                  {{ bundle.tagline }}
                </span>
              </div>

              <!-- Price + CTA -->
              <div class="flex flex-wrap items-center gap-4 pt-1">
                <div class="flex items-baseline gap-2.5">
                  <span class="text-[15px] text-white/50 line-through">{{ fmt(bundle.totalOriginalPrice) }}</span>
                  <span class="text-[30px] font-black tracking-tight text-white">{{ fmt(bundle.discountedPrice) }}</span>
                </div>
                <span class="rounded-md bg-white/20 px-2.5 py-1 text-[12px] font-bold text-white backdrop-blur-sm">
                  <i class="fa-solid fa-arrow-down mr-1 text-[10px]"></i>省 {{ bundle.discountPercent }}%
                </span>
              </div>

              <div class="flex items-center gap-3 pt-1">
                <button
                  v-if="!allInCart(bundle)"
                  @click="addBundleToCart(bundle)"
                  class="rounded-lg bg-white px-6 py-2.5 text-[14px] font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                  :style="{ color: bundle.color }"
                >
                  <i class="fa-solid fa-cart-plus mr-1.5 text-[12px]"></i>
                  整組加入購物車
                </button>
                <button
                  v-else
                  disabled
                  class="cursor-default rounded-lg bg-white/30 px-6 py-2.5 text-[14px] font-bold text-white backdrop-blur-sm"
                >
                  <i class="fa-solid fa-check mr-1.5 text-[12px]"></i>
                  已加入購物車
                </button>
                <button
                  @click="router.push({ name: 'search' })"
                  class="rounded-lg border-2 border-white/30 px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
                >
                  查看課程 →
                </button>
              </div>
            </div>

            <!-- ─ Right: mini course cards ─ -->
            <div class="hidden flex-col gap-3 md:flex md:w-[320px] md:shrink-0 lg:w-[360px]">
              <div
                v-for="(c, i) in bundle.courses"
                :key="c.id"
                class="course-mini flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm"
                :style="{ marginLeft: i % 2 === 0 ? '0' : '12px' }"
              >
                <span
                  class="grid size-9 shrink-0 place-items-center rounded-lg text-[13px] font-black text-white"
                  :style="{ backgroundColor: bundle.color }"
                >
                  {{ i + 1 }}
                </span>
                <div class="flex flex-1 flex-col overflow-hidden">
                  <span class="truncate text-[13px] font-semibold text-[#222]">{{ c.title }}</span>
                  <span class="text-[11px] text-[#999]">{{ fmt(c.price) }}</span>
                </div>
                <i class="fa-solid fa-circle-play shrink-0 text-lg opacity-30" :style="{ color: bundle.color }"></i>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ── Arrows ── -->
      <button
        @click="prev"
        class="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/35 md:left-5 md:size-11"
        aria-label="上一個"
      ><i class="fa-solid fa-chevron-left text-sm"></i></button>
      <button
        @click="next"
        class="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/35 md:right-5 md:size-11"
        aria-label="下一個"
      ><i class="fa-solid fa-chevron-right text-sm"></i></button>

      <!-- ── Dots (overlaid inside) ── -->
      <div class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" role="tablist">
        <button
          v-for="(b, i) in bundles"
          :key="b.id"
          @click="goTo(i)"
          class="h-[5px] rounded-full transition-all duration-300"
          :class="i === current
            ? 'w-7 bg-white shadow-sm'
            : 'w-[5px] bg-white/40 hover:bg-white/70'"
          :aria-label="`${b.name}`"
          :aria-selected="i === current"
          role="tab"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-next-enter-active, .hero-next-leave-active,
.hero-prev-enter-active, .hero-prev-leave-active {
  transition: all 0.42s cubic-bezier(0.4, 0, 0.2, 1);
}
.hero-next-enter-from { opacity: 0; transform: translateX(60px); }
.hero-next-leave-to   { opacity: 0; transform: translateX(-60px); }
.hero-prev-enter-from { opacity: 0; transform: translateX(-60px); }
.hero-prev-leave-to   { opacity: 0; transform: translateX(60px); }

.course-mini {
  animation: fadeSlideUp 0.5s ease both;
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
