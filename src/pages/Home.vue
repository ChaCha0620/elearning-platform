<script setup>
import { ref } from 'vue'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import UserScenarioCarousel from '../components/home/UserScenarioCarousel.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeFeatures from '../components/home/HomeFeatures.vue'
import HomeHowItWorks from '../components/home/HomeHowItWorks.vue'
import SideHustleQuiz from '../components/home/SideHustleQuiz.vue'

const showQuiz = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F8F9FA]">
    <Header />
    <main class="flex-1 pt-20">
      <UserScenarioCarousel
        @open-quiz="showQuiz = true"
      />
      <HomeHero />
      <HomeFeatures @open-quiz="showQuiz = true" />
      <HomeHowItWorks />
    </main>
    <Footer />
  </div>

  <SideHustleQuiz v-if="showQuiz" @close="showQuiz = false" />
</template>
