<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const emit = defineEmits(['close', 'loggedIn'])

const { login } = useAuth()

const account = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

function handleLogin() {
  errorMsg.value = ''
  if (!account.value || !password.value) {
    errorMsg.value = '請輸入帳號與密碼'
    return
  }
  isLoading.value = true
  setTimeout(() => {
    const success = login(account.value, password.value)
    isLoading.value = false
    if (success) {
      account.value = ''
      password.value = ''
      emit('loggedIn')
      emit('close')
    } else {
      errorMsg.value = '帳號或密碼錯誤'
    }
  }, 1200)
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click="handleOverlayClick">
      <!-- Modal card -->
      <div class="relative w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl">
        <!-- Close button -->
        <button
          class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-[#999] transition-colors hover:bg-[#F3F4F6] hover:text-[#333]"
          @click="emit('close')">
          <i class="fa-solid fa-xmark text-[18px]"></i>
        </button>

        <!-- Title -->
        <h2 class="mb-6 text-center text-2xl font-bold text-[#111]">登入 / 註冊</h2>

        <!-- Form -->
        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <!-- Account -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#555]">帳號</label>
            <input v-model="account" type="text" placeholder="請輸入帳號" autocomplete="username"
              class="rounded-lg border border-[#D9DDE4] bg-white px-4 py-2.5 text-sm text-[#111] outline-none transition-all placeholder:text-[#BBB] focus:border-[#3672B5] focus:ring-2 focus:ring-[#3672B5]/20" />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#555]">密碼</label>
            <input v-model="password" type="password" placeholder="請輸入密碼" autocomplete="current-password"
              class="rounded-lg border border-[#D9DDE4] bg-white px-4 py-2.5 text-sm text-[#111] outline-none transition-all placeholder:text-[#BBB] focus:border-[#3672B5] focus:ring-2 focus:ring-[#3672B5]/20" />
          </div>

          <!-- Error message -->
          <p v-if="errorMsg" class="text-center text-sm font-medium text-[#E74C3C]">
            {{ errorMsg }}
          </p>

          <!-- Login button -->
          <button type="submit" :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3672B5] py-2.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(54,114,181,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2d5f97] hover:shadow-[0_10px_18px_rgba(54,114,181,0.28)] active:translate-y-0"
            :class="{ 'opacity-70 cursor-not-allowed': isLoading }">
            <i v-if="isLoading" class="fa-solid fa-spinner fa-spin text-[14px]"></i>
            {{ isLoading ? '登入中...' : '登入' }}
          </button>

          <!-- Register button -->
          <button type="button"
            class="w-full rounded-lg border border-[#D9DDE4] bg-white py-2.5 text-sm font-semibold text-[#555] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F9FA] hover:shadow-sm active:translate-y-0"
            @click="errorMsg = '註冊功能尚未開放，敬請期待！'">
            註冊新帳號
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
