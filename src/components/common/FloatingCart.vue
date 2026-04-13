<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart.js'

const router = useRouter()
const { cartCourses, cartCount, removeFromCart } = useCart()
const showDetail = ref(false)

const totalPrice = computed(() => {
  let sum = 0
  for (const c of cartCourses.value) {
    const num = parseInt(String(c.price).replace(/[^\d]/g, ''), 10)
    if (!isNaN(num)) sum += num
  }
  return sum.toLocaleString()
})

function toggleDetail() {
  showDetail.value = !showDetail.value
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-400 ease-out" enter-from-class="opacity-0 translate-y-6"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-250 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-6">
      <div v-if="cartCount > 0" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <!-- 展開的課程清單 -->
        <Transition enter-active-class="transition duration-250 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95">
          <div v-if="showDetail"
            class="w-[360px] overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-[0_16px_48px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)]">
            <div class="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <p class="text-[13px] font-semibold text-white/70">已選課程</p>
              <button @click="showDetail = false"
                class="flex size-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/70">
                <i class="fa-solid fa-xmark text-[12px]"></i>
              </button>
            </div>
            <div class="max-h-[240px] overflow-y-auto">
              <div v-for="c in cartCourses" :key="c.id"
                class="flex items-center gap-3 border-b border-white/5 px-5 py-3 last:border-0">
                <div class="flex-1 min-w-0">
                  <p class="truncate text-[13px] font-medium text-white/90">{{ c.title }}</p>
                  <p class="mt-0.5 text-[12px] text-white/40">{{ c.price }}</p>
                </div>
                <button @click="removeFromCart(c.id)"
                  class="flex size-7 shrink-0 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-red-400">
                  <i class="fa-solid fa-xmark text-[12px]"></i>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 浮動購物車列 -->
        <div
          class="flex items-center gap-0 overflow-hidden rounded-[14px] bg-[#111] pl-5 shadow-[0_16px_48px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.06)]">
          <!-- 購物車圖標 + 已選模組 -->
          <button @click="toggleDetail" class="flex items-center gap-3 py-3 pr-1 transition-colors hover:opacity-80">
            <div class="relative">
              <i class="fa-solid fa-cart-shopping text-[20px] text-white"></i>
              <span
                class="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#F59E0B] text-[9px] font-extrabold text-white">
                {{ cartCount }}
              </span>
            </div>
            <span class="text-[12px] font-medium text-white/50 whitespace-nowrap">已選擇 {{ cartCount }} 個模組</span>
            <i class="fa-solid fa-chevron-down text-[10px] text-white/30 transition-transform duration-200"
              :class="showDetail ? 'rotate-180' : ''"></i>
          </button>

          <!-- 分隔線 -->
          <div class="mx-4 h-8 w-px bg-white/10"></div>

          <!-- 總計 -->
          <div class="flex items-baseline gap-1.5 whitespace-nowrap">
            <span class="text-[12px] text-white/40">總計</span>
            <span class="text-[22px] font-black leading-none tracking-tight text-white">NT${{ totalPrice }}</span>
          </div>

          <!-- 分隔線 -->
          <div class="mx-4 h-8 w-px bg-white/10"></div>

          <!-- 前往結帳 -->
          <button @click="router.push({ name: 'checkout' })"
            class="mr-2 flex items-center gap-2 rounded-[9px] bg-white px-5 py-2.5 text-[14px] font-extrabold text-[#111] transition-all duration-150 hover:bg-[#F3F4F6] active:scale-[0.97]">
            前往結帳
            <i class="fa-solid fa-chevron-right text-[12px]"></i>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
