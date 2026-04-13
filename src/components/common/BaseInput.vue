<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜尋課程'
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (v) => {
  localValue.value = v
})

function onInput(event) {
  localValue.value = event.target.value
}

function doSubmit() {
  emit('submit', localValue.value)
  emit('update:modelValue', localValue.value)
}
</script>

<template>
  <div
    class="flex h-[41px] w-full items-center rounded-[8px] border border-[#999999] bg-white px-5 transition-colors duration-200 focus-within:border-[#3672B5]">
    <input :value="localValue" :placeholder="placeholder"
      class="h-full flex-1 border-none bg-transparent text-sm font-medium tracking-[0.14px] text-[#555555] outline-none placeholder:text-[#999999]"
      @input="onInput" @keydown.enter="doSubmit" />
    <button type="button"
      class="grid size-6 place-items-center text-[#999999] transition-transform duration-200 hover:scale-110 hover:text-[#3672B5]"
      aria-label="搜尋" @click="doSubmit">
      <i class="fa-solid fa-magnifying-glass text-[16px]"></i>
    </button>
  </div>
</template>
