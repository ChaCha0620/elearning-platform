import { ref } from "vue";

const isTourActive = ref(false);
const currentStep = ref(0);

export function useOnboarding() {
  function startTour() {
    isTourActive.value = true;
    currentStep.value = 1;
  }

  function nextStep() {
    currentStep.value++;
  }

  function endTour() {
    isTourActive.value = false;
    currentStep.value = 0;
  }

  return {
    isTourActive,
    currentStep,
    startTour,
    nextStep,
    endTour,
  };
}
