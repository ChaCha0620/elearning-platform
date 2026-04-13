import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import SearchCourses from "../pages/SearchCourses.vue";
import CourseDetail from "../pages/CourseDetail.vue";
import CoursePlayer from "../pages/CoursePlayer.vue";
import Dashboard from "../pages/Dashboard.vue";
import Schedule from "../pages/Schedule.vue";
import Achievements from "../pages/Achievements.vue";
import MyCourses from "../pages/MyCourses.vue";
import SkillMetrics from "../pages/dashboard/SkillMetrics.vue";
import AllNotes from "../pages/AllNotes.vue";
import Checkout from "../pages/Checkout.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/search", name: "search", component: SearchCourses },
  { path: "/course/:id", name: "courseDetail", component: CourseDetail },
  { path: "/course/:id/player", name: "coursePlayer", component: CoursePlayer },
  {
    path: "/dashboard",
    component: Dashboard,
    children: [
      { path: "schedule", name: "schedule", component: Schedule },
      { path: "achievements", name: "achievements", component: Achievements },
      { path: "my-courses", name: "myCourses", component: MyCourses },
      { path: "skills", name: "skillMetrics", component: SkillMetrics },
    ],
  },
  { path: "/all-notes", name: "allNotes", component: AllNotes },
  { path: "/checkout", name: "checkout", component: Checkout },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
