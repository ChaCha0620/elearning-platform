<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import { useCart } from '../composables/useCart.js'

const router = useRouter()
const { cartCourses, cartCount, removeFromCart } = useCart()

const totalPrice = computed(() => {
  let sum = 0
  for (const c of cartCourses.value) {
    const num = parseInt(String(c.price).replace(/[^\d]/g, ''), 10)
    if (!isNaN(num)) sum += num
  }
  return sum
})

const discount = computed(() => Math.round(totalPrice.value * 0.05))
const finalPrice = computed(() => totalPrice.value - discount.value)
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] pt-20">
    <Header />

    <main class="mx-auto max-w-[960px] px-6 py-12">
      <!-- Breadcrumb -->
      <nav class="mb-8 flex items-center gap-2 text-sm text-[#999]">
        <router-link :to="{ name: 'home' }" class="transition-colors hover:text-[#3672B5]">首頁</router-link>
        <i class="fa-solid fa-chevron-right text-[10px]"></i>
        <span class="text-[#555]">結帳</span>
      </nav>

      <h1 class="text-[32px] font-black tracking-[-0.64px] text-[#111]">確認訂單</h1>
      <p class="mt-1 text-sm text-[#888]">請確認以下課程內容，確認無誤後即可完成結帳</p>

      <!-- Empty state -->
      <div v-if="cartCount === 0" class="mt-16 flex flex-col items-center gap-4 text-center">
        <div class="flex size-20 items-center justify-center rounded-full bg-[#F0F2F5]">
          <i class="fa-solid fa-bag-shopping text-[32px] text-[#CCC]"></i>
        </div>
        <p class="text-lg font-bold text-[#555]">購物車是空的</p>
        <p class="text-sm text-[#999]">快去探索課程，找到適合你的學習路徑吧！</p>
        <button @click="router.push({ name: 'search' })"
          class="mt-2 rounded-lg bg-[#3672B5] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2d5f97] hover:shadow-lg">
          探索課程
        </button>
      </div>

      <!-- Cart contents -->
      <div v-else class="mt-8 flex gap-8">
        <!-- Left: Course list -->
        <div class="flex-1 space-y-4">
          <div class="rounded-xl border border-[#E4E6EA] bg-white">
            <div class="border-b border-[#E4E6EA] px-6 py-4">
              <h2 class="text-sm font-bold text-[#111]">已選課程 ({{ cartCount }})</h2>
            </div>
            <div class="divide-y divide-[#F0F2F5]">
              <div v-for="course in cartCourses" :key="course.id" class="flex items-center gap-4 px-6 py-4">
                <!-- Thumbnail -->
                <div class="size-16 shrink-0 overflow-hidden rounded-lg bg-[#F0F2F5]">
                  <img v-if="course.image" :src="course.image" :alt="course.title" class="size-full object-cover" />
                  <div v-else class="flex size-full items-center justify-center">
                    <i class="fa-solid fa-book text-[#CCC]"></i>
                  </div>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="truncate text-sm font-bold text-[#111]">{{ course.title }}</p>
                  <p class="mt-0.5 text-xs text-[#999]">{{ course.provider || '學易點 官方' }}</p>
                </div>
                <!-- Price -->
                <p class="shrink-0 text-sm font-extrabold text-[#111]">{{ course.price }}</p>
                <!-- Remove -->
                <button @click="removeFromCart(course.id)"
                  class="flex size-8 shrink-0 items-center justify-center rounded-full text-[#CCC] transition-colors hover:bg-[#FEE2E2] hover:text-[#EF4444]">
                  <i class="fa-solid fa-xmark text-[12px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="w-[320px] shrink-0">
          <div class="sticky top-24 space-y-4">
            <div class="rounded-xl border border-[#E4E6EA] bg-white p-6">
              <h3 class="text-sm font-bold text-[#111]">訂單摘要</h3>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[#888]">小計 ({{ cartCount }} 門課程)</span>
                  <span class="text-[#111]">NT${{ totalPrice.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[#888]">平台優惠 (5%)</span>
                  <span class="text-[#10B981]">-NT${{ discount.toLocaleString() }}</span>
                </div>
                <div class="border-t border-[#E4E6EA] pt-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-[#111]">合計</span>
                    <span class="text-[24px] font-black tracking-[-0.48px] text-[#111]">NT${{
                      finalPrice.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <button
                class="mt-6 w-full rounded-lg bg-[#3672B5] py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2d5f97] hover:shadow-lg active:translate-y-0">
                確認結帳
              </button>

              <p class="mt-3 text-center text-[11px] text-[#BBB]">
                <i class="fa-solid fa-lock mr-1"></i>
                安全加密付款 · 7 天鑑賞期
              </p>
            </div>

            <button @click="router.push({ name: 'search' })"
              class="w-full text-center text-sm font-medium text-[#3672B5] transition-colors hover:text-[#2d5f97]">
              ← 繼續選課
            </button>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
