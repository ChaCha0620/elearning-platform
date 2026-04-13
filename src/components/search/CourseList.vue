<script setup>
import { computed } from 'vue'
import CourseCard from './CourseCard.vue'

const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  },
  matchResults: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['toggle', 'prereq'])

function getMatchInfo(courseId) {
  if (!props.matchResults || !props.matchResults.items) return null
  return props.matchResults.items.find(i => i.courseId === courseId) || null
}
</script>

<template>
  <section class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
    <CourseCard v-for="course in courses" :key="course.id" :course="course" :matchInfo="getMatchInfo(course.id)"
      @toggle="emit('toggle', $event)" @prereq="emit('prereq', $event)" />
  </section>
</template>
