<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import LoginModal from './LoginModal.vue'
import { useAuth } from '../../composables/useAuth.js'
import { useCart } from '../../composables/useCart.js'

const router = useRouter()

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['search'])

const { isLoggedIn, userName, logout } = useAuth()
const { cartCount } = useCart()

const showLoginModal = ref(false)
const showUserMenu = ref(false)

function handleLoggedIn() {
  showLoginModal.value = false
  router.push({ name: 'home' })
}

function handleLogout() {
  showUserMenu.value = false
  logout()
  router.push({ name: 'home' })
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    showUserMenu.value = false
  }
}

function handleSearch(value) {
  if (!value || !value.trim()) return
  if (router.currentRoute.value.name === 'search') {
    emit('search', value)
  } else {
    router.push({ name: 'search', query: { q: value } })
  }
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-30 border-b border-[#D9DDE4] bg-[#F8F9FA]/95 backdrop-blur">
    <div class="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-6 px-4 md:px-10 lg:px-16">
      <router-link :to="{ name: 'home' }" class="flex shrink-0 items-center gap-2 text-[20px] font-extrabold tracking-[-0.8px] text-black">
        <img src="/image.png" alt="學易點 Logo" class="h-8 w-auto" />
        學易點.
      </router-link>

      <div class="w-full max-w-[471px]">
        <BaseInput :model-value="keyword" placeholder="搜尋課程" @submit="handleSearch" />
      </div>

      <nav class="hidden items-center gap-9 md:flex">
        <router-link :to="{ name: 'search' }"
          class="text-sm font-medium tracking-[0.14px] text-[#555555] transition-colors duration-200 hover:text-[#1B3A5C]">
          探索課程
        </router-link>
        <!-- Shopping cart -->
        <router-link :to="{ name: 'checkout' }"
          class="relative text-[#1B3A5C] transition-colors duration-200 hover:text-[#2d5f97]">
          <i class="fa-solid fa-bag-shopping text-[20px]"></i>
          <span v-if="cartCount > 0"
            class="absolute -right-2 -top-2 flex size-[18px] items-center justify-center rounded-full bg-[#E74C3C] text-[10px] font-bold leading-none text-white shadow-sm">
            {{ cartCount }}
          </span>
        </router-link>

        <!-- Logged-out: show login button -->
        <BaseButton v-if="!isLoggedIn" label="登入 / 註冊" variant="primary" size="md" @click="showLoginModal = true" />

        <!-- Logged-in: avatar + dropdown -->
        <div v-else class="relative" @focusout="closeUserMenu">
          <button
            class="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-all duration-200 hover:bg-[#EDF2F7]"
            @click="toggleUserMenu">
            <span
              class="flex size-8 items-center justify-center rounded-full bg-[#1B3A5C] text-sm font-bold text-white">
              {{ userName.charAt(0) }}
            </span>
            <span class="text-sm font-medium text-[#333]">{{ userName }}</span>
            <i class="fa-solid fa-chevron-down text-[11px] text-[#999] transition-transform duration-200"
              :class="{ 'rotate-180': showUserMenu }"></i>
          </button>

          <!-- Dropdown menu -->
          <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-100 ease-in"
            leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
            <div v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-[240px] origin-top-right overflow-hidden rounded-xl border border-[#E4E6EA] bg-white shadow-xl">

              <!-- User profile header -->
              <div class="px-5 pt-5 pb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#E5E7EB] bg-[#EEF2F7]">
                    <i class="fa-solid fa-circle-user text-[28px] text-[#BBB]"></i>
                  </div>
                  <div class="flex flex-col gap-[2px]">
                    <span class="text-[13px] text-[#888]">Hi,</span>
                    <span class="text-[16px] font-bold tracking-[-0.32px] text-[#111]">{{ userName }}</span>
                  </div>
                </div>
                <!-- Streak badge -->
                <div class="mt-3 inline-flex rounded-md border border-[#F5D87A] bg-[#FFF9EC] px-[11px] py-[5px]">
                  <span class="text-[11px] font-semibold text-[#92600A]">連續學習 7 天</span>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-[#E4E6EA]"></div>

              <!-- Nav items -->
              <nav class="flex flex-col gap-[2px] px-3 py-2">
                <router-link :to="{ name: 'schedule' }"
                  class="flex items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#555] transition-colors hover:bg-[#F8F9FA] hover:text-[#333]"
                  @click="showUserMenu = false">
                  <i class="fa-regular fa-calendar-days text-[14px]"></i>
                  我的課表
                </router-link>
                <router-link :to="{ name: 'myCourses' }"
                  class="flex items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#555] transition-colors hover:bg-[#F8F9FA] hover:text-[#333]"
                  @click="showUserMenu = false">
                  <i class="fa-solid fa-book-open text-[14px]"></i>
                  已購課程
                </router-link>
                <router-link :to="{ name: 'skillMetrics' }"
                  class="flex items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#555] transition-colors hover:bg-[#F8F9FA] hover:text-[#333]"
                  @click="showUserMenu = false">
                  <i class="fa-solid fa-chart-line text-[14px]"></i>
                  能力指標
                </router-link>
                <router-link :to="{ name: 'achievements' }"
                  class="flex items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#555] transition-colors hover:bg-[#F8F9FA] hover:text-[#333]"
                  @click="showUserMenu = false">
                  <i class="fa-solid fa-trophy text-[14px]"></i>
                  成就背包
                </router-link>
                <a href="#"
                  class="flex items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#555] transition-colors hover:bg-[#F8F9FA] hover:text-[#333]">
                  <i class="fa-solid fa-gear text-[14px]"></i>
                  帳號設定
                </a>
              </nav>

              <!-- Divider + Logout -->
              <div class="border-t border-[#E4E6EA]"></div>
              <div class="px-3 py-2">
                <button
                  class="flex w-full items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#E74C3C] transition-colors hover:bg-[#FEF2F2]"
                  @click="handleLogout">
                  <i class="fa-solid fa-right-from-bracket text-[14px]"></i>
                  登出
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </nav>
    </div>
  </header>

  <!-- Login Modal -->
  <LoginModal v-if="showLoginModal" @close="showLoginModal = false" @logged-in="handleLoggedIn" />
</template>
