<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const isLoggingOut = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  await new Promise(resolve => setTimeout(resolve, 1200))
  logout()
  router.push('/')
}

defineProps({
  userName: { type: String, default: '' },
  streakDays: { type: Number, default: 0 },
  activeItem: { type: String, default: '我的課表' }
})

const navItems = [
  {
    label: '我的課表',
    icon: 'calendar',
    route: { name: 'schedule' }
  },
  {
    label: '已購課程',
    icon: 'book',
    route: { name: 'myCourses' }
  },
  {
    label: '能力指標',
    icon: 'chart',
    route: { name: 'skillMetrics' }
  },
  {
    label: '成就背包',
    icon: 'trophy',
    route: { name: 'achievements' }
  },
  {
    label: '帳號設定',
    icon: 'settings',
    route: null
  }
]
</script>

<template>
  <aside class="fixed left-0 top-20 z-30 flex w-[260px] flex-col border-r border-[#E5E7EB] bg-white"
    style="height: calc(100vh - 80px);">
    <!-- User profile -->
    <div class="px-7 pt-7 pb-4">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
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
      <div v-if="streakDays > 0"
        class="mt-4 inline-flex rounded-md border border-[#F5D87A] bg-[#FFF9EC] px-[11px] py-[5px]">
        <span class="text-[11px] font-semibold text-[#92600A]">連續學習 {{ streakDays }} 天</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-[2px] px-4 pt-1">
      <component v-for="item in navItems" :key="item.label" :is="item.route ? 'router-link' : 'button'"
        v-bind="item.route ? { to: item.route } : {}"
        class="flex items-center gap-2 rounded-[10px] px-[14px] py-[11px] text-[14px] tracking-[-0.14px] transition-colors duration-150"
        :class="[
          activeItem === item.label
            ? 'bg-[#EEF2F7] font-semibold text-[#3672B5]'
            : item.route
              ? 'font-normal text-[#555] hover:bg-[#F8F9FA] hover:text-[#333]'
              : 'font-normal text-[#555] hover:bg-[#F8F9FA] hover:text-[#333]'
        ]">
        <i v-if="item.icon === 'calendar'" class="fa-regular fa-calendar-days text-[14px]"></i>
        <i v-else-if="item.icon === 'book'" class="fa-solid fa-book-open text-[14px]"></i>
        <i v-else-if="item.icon === 'chart'" class="fa-solid fa-chart-line text-[14px]"></i>
        <i v-else-if="item.icon === 'trophy'" class="fa-solid fa-trophy text-[14px]"></i>
        <i v-else class="fa-solid fa-gear text-[14px]"></i>

        {{ item.label }}

        <!-- Active dot -->
        <span v-if="activeItem === item.label" class="ml-auto size-[5px] rounded-full bg-[#3672B5]" />
      </component>
    </nav>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Logout button -->
    <div class="px-4 pb-6">
      <button @click="handleLogout" :disabled="isLoggingOut"
        class="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] px-[14px] py-[11px] text-[14px] font-medium text-[#888] transition-colors duration-150 hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-60">
        <i v-if="isLoggingOut" class="fa-solid fa-spinner fa-spin text-[14px] text-red-400"></i>
        <i v-else class="fa-solid fa-right-from-bracket text-[14px]"></i>
        {{ isLoggingOut ? '登出中...' : '登出' }}
      </button>
    </div>
  </aside>
</template>
