<script setup>
import { computed } from 'vue'
import AchievementBadgeCard from './AchievementBadgeCard.vue'

const props = defineProps({
  badges: { type: Array, default: () => [] },
  totalCount: { type: Number, default: 24 }
})

const unlocked = computed(() => props.badges.filter(b => b.status === 'unlocked'))
const locked = computed(() => props.badges.filter(b => b.status === 'locked'))
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 已解鎖成就 -->
    <div v-if="unlocked.length">
      <div class="mb-4 flex items-center gap-3">
        <span class="flex items-center gap-1.5 text-sm font-bold text-[#111]">
          <i class="fa-solid fa-trophy text-[#F5C842]"></i>
          已解鎖
        </span>
        <span class="rounded-full bg-[#1B3A5C] px-2 py-0.5 text-[10px] font-bold text-white">{{ unlocked.length }}</span>
        <div class="h-px flex-1 bg-[#E4E6EA]"></div>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <AchievementBadgeCard v-for="badge in unlocked" :key="badge.name" :status="badge.status" :name="badge.name"
          :description="badge.description" :symbol="badge.symbol" :progress="badge.progress"
          :remainText="badge.remainText" :rewardLabel="badge.rewardLabel" :rewardNote="badge.rewardNote" />
      </div>
    </div>

    <!-- 待達成成就 -->
    <div v-if="locked.length">
      <div class="mb-4 flex items-center gap-3">
        <span class="flex items-center gap-1.5 text-sm font-bold text-[#888]">
          <i class="fa-solid fa-lock text-[11px] text-[#BBB]"></i>
          待達成
        </span>
        <span class="rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#888]">{{ locked.length }}</span>
        <div class="h-px flex-1 bg-[#E4E6EA]"></div>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <AchievementBadgeCard v-for="badge in locked" :key="badge.name" :status="badge.status" :name="badge.name"
          :description="badge.description" :symbol="badge.symbol" :progress="badge.progress"
          :remainText="badge.remainText" :rewardLabel="badge.rewardLabel" :rewardNote="badge.rewardNote" />

        <!-- Explore more CTA card -->
        <div
          class="flex flex-col items-center justify-center gap-[10px] rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-6 transition-colors duration-200 hover:border-[#3672B5]/40 hover:bg-[#EEF2F7]/50 cursor-pointer">
          <div class="grid size-12 place-items-center rounded-full bg-[#EEF2F7]">
            <i class="fa-solid fa-plus text-[16px] text-[#1B3A5C]"></i>
          </div>
          <span class="text-[13px] font-semibold leading-[19.5px] text-[#1B3A5C]">
            探索更多成就
          </span>
          <span class="text-center text-[11px] leading-[16.5px] text-[#BBB]">
            共 {{ totalCount }} 個成就等你解鎖
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
