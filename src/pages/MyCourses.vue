<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderLoggedIn from '../components/common/HeaderLoggedIn.vue'
import Footer from '../components/common/Footer.vue'
import ScheduleSidebar from '../components/schedule/ScheduleSidebar.vue'
import { purchasedCourses } from '../data/coursesHistory.js'

const router = useRouter()

/* 把共用假資料映射成已購課程頁需要的格式 */
const statusMap = { completed: '已完成', 'in-progress': '進行中', 'not-started': '尚未開始' }

const courses = computed(() =>
  purchasedCourses.map((c) => ({
    id: c.id,
    title: c.title,
    instructor: c.instructor,
    totalChapters: c.totalChapters,
    completedChapters: c.completedChapters,
    progressPercent: c.progress,
    status: statusMap[c.status] || c.status,
    thumb: c.thumb,
  }))
)

function goToCourse(course) {
  router.push({ name: 'courseDetail', params: { id: course.id } })
}
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA]">
    <!-- Header -->
    <HeaderLoggedIn userName="小凌" />

    <!-- Body: sidebar + content -->
    <div class="flex pt-20">
      <!-- Sidebar -->
      <ScheduleSidebar userName="小凌" :streakDays="7" activeItem="已購課程" />

      <!-- Main content -->
      <main class="ml-[260px] flex-1 px-16 py-9">
        <div class="mx-auto flex max-w-[1120px] flex-col gap-9">
          <!-- Hero -->
          <section>
            <h1 class="text-[32px] font-black leading-[42px] tracking-[-0.64px] text-[#111]">已購課程</h1>
            <p class="mt-2 text-sm font-medium leading-[21px] tracking-[0.14px] text-[#555]">
              管理你購買的所有課程，隨時繼續學習。
            </p>
          </section>

          <!-- Course grid -->
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="course in courses" :key="course.id"
              class="group cursor-pointer overflow-hidden rounded-xl border border-[#E4E6EA] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              @click="goToCourse(course)">
              <!-- Thumbnail -->
              <div class="relative h-[180px] overflow-hidden">
                <img :src="course.thumb" :alt="course.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span :class="[
                  'absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold',
                  course.status === '進行中'
                    ? 'bg-[#3672B5] text-white'
                    : course.status === '已完成'
                      ? 'bg-[#1A5C3A] text-white'
                      : 'bg-[#F3F4F6] text-[#888]'
                ]">
                  {{ course.status }}
                </span>
              </div>

              <!-- Info -->
              <div class="p-5">
                <h3 class="text-base font-bold leading-6 text-[#111]">{{ course.title }}</h3>
                <p class="mt-1 text-sm text-[#999]">{{ course.instructor }}</p>

                <!-- Progress -->
                <div class="mt-4">
                  <div class="mb-1.5 flex items-center justify-between text-xs text-[#555]">
                    <span>{{ course.completedChapters }} / {{ course.totalChapters }} 章節</span>
                    <span class="font-semibold text-[#3672B5]">{{ course.progressPercent }}%</span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div class="h-full rounded-full bg-[#3672B5] transition-all duration-500"
                      :style="{ width: course.progressPercent + '%' }"></div>
                  </div>
                </div>

                <!-- CTA -->
                <button
                  class="mt-4 w-full rounded-lg bg-[#F8F9FA] py-2 text-sm font-medium text-[#3672B5] transition-all duration-200 hover:bg-[#EDF2F7]">
                  繼續學習 →
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="courses.length === 0" class="py-20 text-center">
            <p class="text-lg text-[#999]">你目前沒有已購課程</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <div class="ml-[260px]">
      <Footer />
    </div>
  </div>
</template>
