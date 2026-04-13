import { ref, computed } from "vue";

/* 模組級單例，所有元件共用同一份購物車 */
const cartIds = ref(new Set());
const cartCourseMap = ref(new Map());

export function useCart() {
  const cartCount = computed(() => cartIds.value.size);

  const cartCourses = computed(() => Array.from(cartCourseMap.value.values()));

  function addToCart(courseId, courseData) {
    const next = new Set(cartIds.value);
    next.add(courseId);
    cartIds.value = next;
    if (courseData) {
      const nextMap = new Map(cartCourseMap.value);
      nextMap.set(courseId, courseData);
      cartCourseMap.value = nextMap;
    }
  }

  function removeFromCart(courseId) {
    const next = new Set(cartIds.value);
    next.delete(courseId);
    cartIds.value = next;
    const nextMap = new Map(cartCourseMap.value);
    nextMap.delete(courseId);
    cartCourseMap.value = nextMap;
  }

  function toggleCart(courseId, courseData) {
    if (cartIds.value.has(courseId)) {
      removeFromCart(courseId);
    } else {
      addToCart(courseId, courseData);
    }
  }

  function isInCart(courseId) {
    return cartIds.value.has(courseId);
  }

  return {
    cartCount,
    cartIds,
    cartCourses,
    addToCart,
    removeFromCart,
    toggleCart,
    isInCart,
  };
}
