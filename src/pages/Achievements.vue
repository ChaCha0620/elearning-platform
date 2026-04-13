<script setup>
import HeaderLoggedIn from '../components/common/HeaderLoggedIn.vue'
import Footer from '../components/common/Footer.vue'
import ScheduleSidebar from '../components/schedule/ScheduleSidebar.vue'
import AchievementHero from '../components/achievement/AchievementHero.vue'
import AchievementGrid from '../components/achievement/AchievementGrid.vue'

/* ── 勳章資料（對齊實際課程與學習狀態） ── */
const badges = [
  /* ── 已解鎖 ── */
  {
    name: '前端基石',
    description: '完成「HTML/CSS 與網頁切版」和「JavaScript 核心語法與非同步」',
    symbol: '⬡',
    status: 'unlocked',
    progress: 100,
    remainText: '',
    rewardLabel: '9折・折價券',
    rewardNote: '可使用 · 30 天內有效'
  },
  {
    name: 'CSS 魔法師',
    description: '完成「CSS 進階：動畫、變數與架構設計」',
    symbol: '✦',
    status: 'unlocked',
    progress: 100,
    remainText: '',
    rewardLabel: '精選課程 NT$100 折扣',
    rewardNote: '可使用 · 60 天內有效'
  },
  {
    name: '原型達人',
    description: '完成「互動原型與 Usability Testing」',
    symbol: '◈',
    status: 'unlocked',
    progress: 100,
    remainText: '',
    rewardLabel: '8折・折價券',
    rewardNote: '可使用 · 30 天內有效'
  },
  {
    name: '學習先鋒',
    description: '累計購買 10 堂以上課程',
    symbol: '🏅',
    status: 'unlocked',
    progress: 100,
    remainText: '',
    rewardLabel: '限定頭像框',
    rewardNote: '已套用至個人資料'
  },
  /* ── 進行中 ── */
  {
    name: 'React 架構大師',
    description: '完成「React 狀態管理與系統架構」',
    symbol: '⚛',
    status: 'locked',
    progress: 45,
    remainText: '課程進度 45%，繼續加油',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: '設計新星',
    description: '完成 3 堂 UI/UX 基礎課程',
    symbol: '◎',
    status: 'locked',
    progress: 40,
    remainText: '已完成 1/3 堂，還需 2 堂',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: 'Figma 高手',
    description: '完成「Figma 介面設計入門」',
    symbol: '△',
    status: 'locked',
    progress: 60,
    remainText: '課程進度 60%，快完成了',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: '全端探索者',
    description: '完成至少 1 堂後端開發課程',
    symbol: '⬢',
    status: 'locked',
    progress: 35,
    remainText: 'Node.js 進度 35%',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: '設計系統師',
    description: '完成「設計系統建構與管理」',
    symbol: '❖',
    status: 'locked',
    progress: 15,
    remainText: '課程進度 15%，持續學習中',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: 'TypeScript 精通',
    description: '完成「TypeScript 全面入門與實戰」',
    symbol: 'TS',
    status: 'locked',
    progress: 0,
    remainText: '尚未開始，購買後即可挑戰',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: '跨域學習者',
    description: '在 3 個以上領域各完成至少 1 堂課',
    symbol: '🌐',
    status: 'locked',
    progress: 67,
    remainText: '已達成 2/3 個領域',
    rewardLabel: '',
    rewardNote: ''
  },
  {
    name: '連續學習 7 天',
    description: '連續 7 天登入並完成學習',
    symbol: '🔥',
    status: 'unlocked',
    progress: 100,
    remainText: '',
    rewardLabel: '學習動力徽章',
    rewardNote: '成就永久保留'
  }
]

const unlockedCount = badges.filter(b => b.status === 'unlocked').length
const lockedCount = badges.filter(b => b.status === 'locked').length
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA]">
    <!-- Header -->
    <HeaderLoggedIn userName="小凌" />

    <!-- Body: sidebar + content -->
    <div class="flex pt-20">
      <!-- Sidebar (reuse schedule sidebar with active = 成就背包) -->
      <ScheduleSidebar userName="小凌" :streakDays="7" activeItem="成就背包" />

      <!-- Main content -->
      <main class="ml-[260px] flex-1 px-16 py-9">
        <div class="mx-auto flex max-w-[1120px] flex-col gap-9">
          <!-- Hero -->
          <AchievementHero label="✦ 成就背包" title="你的成就與獎勵" :description="`${unlockedCount} 枚已解鎖 · ${lockedCount} 枚待達成 · 解鎖即獲得專屬獎勵`" />

          <!-- Badge grid -->
          <AchievementGrid :badges="badges" :totalCount="20" />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <div class="ml-[260px]">
      <Footer />
    </div>
  </div>
</template>
