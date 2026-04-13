<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import { useCart } from '../../composables/useCart.js'

const router = useRouter()

const props = defineProps({
  progress: { type: Number, default: 45 },
  userName: { type: String, default: 'L' },
  backLabel: { type: String, default: '返回個人主頁' },
  showBack: { type: Boolean, default: true },
  /** All notes data for the notes dropdown */
  allNotes: { type: Array, default: () => [] }
})

const { logout } = useAuth()
const { cartCount } = useCart()

const showNotesPanel = ref(false)
const showUserMenu = ref(false)
const currentPage = ref(0)
const pageSize = 5

const totalPages = computed(() => Math.ceil(props.allNotes.length / pageSize))
const pagedNotes = computed(() => {
  const start = currentPage.value * pageSize
  return props.allNotes.slice(start, start + pageSize)
})

function toggleNotes() {
  showNotesPanel.value = !showNotesPanel.value
  if (showNotesPanel.value) currentPage.value = 0
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

defineExpose({ showNotesPanel })
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-30 border-b border-[#D9DDE4] bg-[#F8F9FA]">
    <div class="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 md:px-16">
      <!-- Left: back + logo -->
      <div class="flex items-center gap-4">
        <a v-if="showBack" href="#"
          class="flex items-center gap-[7px] rounded-lg border border-[#E5E7EB] px-[13px] py-[6px] text-[12px] font-medium text-[#666] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
          <i class="fa-solid fa-chevron-left text-[9px]"></i>
          {{ backLabel }}
        </a>
        <a href="#" class="text-[20px] font-extrabold tracking-[-0.8px] text-black">學易點.</a>
      </div>

      <!-- Right: progress + notes + avatar -->
      <div class="flex items-center gap-4">
        <!-- Progress -->
        <div class="flex items-center gap-[7px] rounded-lg border border-[#E5E7EB] px-[13px] py-[6px]">
          <div class="h-[3px] w-[52px] rounded-full bg-[#E5E7EB]">
            <div class="h-full rounded-full bg-[#1B3A5C] transition-all duration-500"
              :style="{ width: progress + '%' }" />
          </div>
          <span class="text-[11px] text-[#666]">{{ progress }}% 完成</span>
        </div>
        <!-- Notes button + dropdown -->
        <div class="relative">
          <button @click="toggleNotes"
            class="flex items-center gap-[6px] rounded-lg border border-[#E5E7EB] px-[10px] py-[6px] text-[12px] font-medium text-[#666] transition-all duration-200 hover:bg-white hover:shadow-sm"
            :class="{ 'bg-white shadow-sm border-[#1B3A5C]/30 text-[#1B3A5C]': showNotesPanel }">
            <i class="fa-solid fa-file-lines text-[11px]"></i>
            本課筆記
          </button>

          <!-- Notes dropdown panel -->
          <div v-if="showNotesPanel"
            class="absolute right-0 top-[calc(100%+8px)] z-50 w-[360px] rounded-2xl border border-[#E5E7EB] bg-white shadow-lg">
            <div class="flex items-center justify-between border-b border-[#F0F2F5] px-5 py-4">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex size-5 items-center justify-center rounded-[5px] bg-[#1B3A5C] text-[10px] text-white">📖</span>
                <p class="text-[14px] font-bold text-[#111]">本課筆記</p>
              </div>
              <button @click="showNotesPanel = false"
                class="text-[12px] text-[#888] transition-colors hover:text-[#555]">✕</button>
            </div>
            <div class="max-h-[400px] overflow-y-auto px-5 py-3">
              <div v-if="allNotes.length === 0" class="py-8 text-center text-[13px] text-[#BBB]">
                尚未新增任何筆記
              </div>
              <div v-else class="flex flex-col gap-2">
                <div v-for="(note, i) in pagedNotes" :key="currentPage + '-' + i"
                  class="flex cursor-pointer items-start gap-[10px] rounded-[10px] border-l-[3px] border-[#1B3A5C] bg-[#F9FAFB] px-3 py-[11px] transition-all duration-200 hover:bg-[#F3F5F7]">
                  <div
                    class="mt-0.5 shrink-0 rounded-[5px] px-[6px] py-[2px] text-[10px] font-bold tracking-[0.2px] text-white"
                    :class="note.color || 'bg-[#1B3A5C]'">
                    {{ note.time }}
                  </div>
                  <div class="flex min-w-0 flex-col gap-[3px]">
                    <p class="truncate text-[12px] text-[#111]">{{ note.text }}</p>
                    <p class="text-[10px] text-[#BBB]">{{ note.chapter }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-[#F0F2F5] px-5 py-3">
              <button @click="currentPage--" :disabled="currentPage === 0"
                class="rounded-md px-3 py-[5px] text-[12px] font-medium transition-colors duration-150"
                :class="currentPage === 0 ? 'text-[#CCC] cursor-not-allowed' : 'text-[#1B3A5C] hover:bg-[#EEF2F7]'">
                ← 上一頁
              </button>
              <span class="text-[11px] text-[#888]">{{ currentPage + 1 }} / {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage >= totalPages - 1"
                class="rounded-md px-3 py-[5px] text-[12px] font-medium transition-colors duration-150"
                :class="currentPage >= totalPages - 1 ? 'text-[#CCC] cursor-not-allowed' : 'text-[#1B3A5C] hover:bg-[#EEF2F7]'">
                下一頁 →
              </button>
            </div>

          </div>
        </div>
        <!-- Shopping cart -->
        <button class="relative text-[#1B3A5C] transition-colors duration-200 hover:text-[#2d5f97]">
          <i class="fa-solid fa-bag-shopping text-[20px]"></i>
          <span v-if="cartCount > 0"
            class="absolute -right-2 -top-2 flex size-[18px] items-center justify-center rounded-full bg-[#E74C3C] text-[10px] font-bold leading-none text-white shadow-sm">
            {{ cartCount }}
          </span>
        </button>

        <!-- Avatar + dropdown -->
        <div class="relative" @focusout="closeUserMenu">
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
      </div>
    </div>

    <!-- Click outside overlay -->
    <div v-if="showNotesPanel" class="fixed inset-0 z-40" @click="showNotesPanel = false" />
  </header>
</template>
