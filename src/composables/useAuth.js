import { ref, readonly } from "vue";

const isLoggedIn = ref(false);
const userName = ref("");

const VALID_ACCOUNT = "uiux";
const VALID_PASSWORD = "03";
const DISPLAY_NAME = "小凌";

function login(account, password) {
  if (account === VALID_ACCOUNT && password === VALID_PASSWORD) {
    isLoggedIn.value = true;
    userName.value = DISPLAY_NAME;
    return true;
  }
  return false;
}

function logout() {
  isLoggedIn.value = false;
  userName.value = "";
}

export function useAuth() {
  return {
    isLoggedIn: readonly(isLoggedIn),
    userName: readonly(userName),
    login,
    logout,
  };
}
