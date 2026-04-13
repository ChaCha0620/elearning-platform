<script setup>
import { computed } from 'vue'
import BaseButton from '../common/BaseButton.vue'
import { useCart } from '../../composables/useCart.js'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  matchInfo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['toggle', 'prereq'])

const { isInCart } = useCart()

const added = computed(() => isInCart(props.course.id))
const actionVariant = computed(() => (added.value ? 'green' : 'navy'))

const frameworkStyles = {
  'React': 'border-[#B5E5F5] bg-[#E8F7FD] text-[#0A7EA4]',
  'Vue': 'border-[#A8E6C8] bg-[#E8F8F0] text-[#34805A]',
  'Tailwind': 'border-[#A5F3FC] bg-[#E5F6FA] text-[#0E7490]',
  'Bootstrap': 'border-[#DDD6FE] bg-[#F0E8F8] text-[#6D28D9]',
  'TypeScript': 'border-[#BFDBFE] bg-[#E8EFF8] text-[#2563EB]',
  'Next.js': 'border-[#D4D4D4] bg-[#F0F0F0] text-[#111]',
  'Nuxt': 'border-[#6EE7B7] bg-[#E5FAF0] text-[#059669]',
  'JavaScript': 'border-[#FDE68A] bg-[#FEF9E7] text-[#92600A]',
  'Figma': 'border-[#DDD6FE] bg-[#F3E8FF] text-[#7C3AED]',
  'Node.js': 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
}

const frameworkClass = computed(() => {
  return 'border ' + (frameworkStyles[props.course.framework] || 'border-[#E4E6EA] bg-[#F8F9FA] text-[#666]')
})

function handleClick() {
  if (!added.value && props.course.module === '實戰') {
    emit('prereq', props.course)
  } else {
    emit('toggle', props.course.id)
  }
}
</script>

<template>
  <article
    class="group overflow-hidden rounded-[14px] border border-[#E4E6EA] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
    <div class="relative h-40 overflow-hidden">
      <img :src="course.image" :alt="course.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span class="rounded border bg-white px-2 py-1 text-[10px] font-bold"
          :class="course.level === '實戰' ? 'border-[rgba(180,83,9,0.25)] text-[#B45309]' : course.level === '進階' ? 'border-[rgba(27,58,92,0.19)] text-[#1B3A5C]' : 'border-[rgba(74,124,89,0.19)] text-[#4A7C59]'">
          {{ course.level }}
        </span>
        <span v-if="course.framework" class="rounded px-2 py-1 text-[10px] font-bold" :class="frameworkClass">
          {{ course.framework }}
        </span>
      </div>
      <div v-if="matchInfo && matchInfo.isTop" class="absolute right-3 top-3">
        <span class="rounded bg-[#1B3A5C] px-2 py-1 text-[10px] font-bold text-white shadow-sm">⭐ 最推薦</span>
      </div>
      <div v-else-if="matchInfo && matchInfo.matchPercent >= 60" class="absolute right-3 top-3">
        <span class="rounded bg-[#3672B5] px-2 py-1 text-[10px] font-bold text-white shadow-sm">符合度 {{
          matchInfo.matchPercent }}%</span>
      </div>
      <div v-else-if="matchInfo && matchInfo.matchPercent >= 20" class="absolute right-3 top-3">
        <span class="rounded bg-[#94A3B8] px-2 py-1 text-[10px] font-bold text-white shadow-sm">符合度 {{
          matchInfo.matchPercent }}%</span>
      </div>
      <div v-else-if="course.isHot" class="absolute right-3 top-3">
        <span class="rounded bg-[#EF4444] px-2 py-1 text-[10px] font-bold text-white shadow-sm">🔥 熱門</span>
      </div>
      <div v-else-if="course.isNew" class="absolute right-3 top-3">
        <span class="rounded bg-[#10B981] px-2 py-1 text-[10px] font-bold text-white shadow-sm">✨ 新課</span>
      </div>
    </div>

    <div class="space-y-3 px-[18px] pb-[18px] pt-[17px]">
      <h4 class="line-clamp-1 text-[15px] font-extrabold leading-[19.5px] text-[#111111]">{{ course.title }}</h4>
      <p class="line-clamp-1 text-xs leading-[18.6px] text-[#555555]">{{ course.description }}</p>
      <div v-if="course.tags && course.tags.length" class="flex flex-wrap gap-1.5">
        <span v-for="tag in course.tags" :key="tag"
          class="rounded border border-[#E4E6EA] bg-[#F8F9FA] px-2 py-0.5 text-[10px] font-medium text-[#666]">
          {{ tag }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="course.rating" class="flex items-center gap-0.5">
          <i v-for="s in 5" :key="s" class="text-[10px]"
            :class="s <= Math.round(course.rating) ? 'fa-solid fa-star text-[#F59E0B]' : 'fa-solid fa-star text-[#E5E7EB]'"></i>
          <span class="ml-0.5 text-[11px] font-semibold text-[#555]">{{ course.rating }}</span>
        </div>
        <span v-if="course.students" class="text-[10px] text-[#999]">{{ course.students.toLocaleString() }} 位學生</span>
      </div>
      <p class="text-[11px] leading-[16.5px] text-[#999999]">{{ course.meta }} · {{ course.provider }}</p>

      <div class="flex items-center justify-between pt-1">
        <p class="text-[30px] font-black leading-[1] tracking-[-0.6px] text-[#111111]">{{ course.price }}</p>
        <BaseButton :label="added ? '✓ 已加入' : '+ 加入'" :variant="actionVariant" size="sm" @click="handleClick" />
      </div>
    </div>
  </article>
</template>
