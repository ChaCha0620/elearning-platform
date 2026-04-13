<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  full: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const emit = defineEmits(['click'])

const variantClass = computed(() => {
  const map = {
    primary: 'bg-[#3672B5] text-white hover:bg-[#2d5f97] active:bg-[#244d7a] shadow-[0_6px_14px_rgba(54,114,181,0.24)] hover:shadow-[0_10px_18px_rgba(54,114,181,0.28)]',
    navy: 'bg-[#1B3A5C] text-white hover:bg-[#17314d] active:bg-[#11263d] shadow-[0_6px_14px_rgba(27,58,92,0.24)] hover:shadow-[0_10px_18px_rgba(27,58,92,0.28)]',
    green: 'bg-[#4A7C59] text-white hover:bg-[#3e684b] active:bg-[#32533c] shadow-[0_6px_14px_rgba(74,124,89,0.24)] hover:shadow-[0_10px_18px_rgba(74,124,89,0.28)]',
    ghost: 'bg-white text-[#555555] border border-[#E5E7EB] hover:bg-[#F8F9FA] active:bg-[#EEF2F7]'
  }

  return map[props.variant] || map.primary
})

const sizeClass = computed(() => {
  const map = {
    sm: 'h-9 px-4 text-xs rounded-[8px]',
    md: 'h-10 px-[22px] text-sm rounded-[10px]'
  }

  return map[props.size] || map.md
})

function handleClick(event) {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button :type="type" :disabled="disabled" :class="[
    'inline-flex items-center justify-center gap-1.5 font-semibold tracking-[0.14px] transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
    variantClass,
    sizeClass,
    full ? 'w-full' : ''
  ]" @click="handleClick">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>
