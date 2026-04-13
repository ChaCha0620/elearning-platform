<script setup>
import { ref } from 'vue'
import CourseHeaderNav from '../components/course/CourseHeaderNav.vue'
import VideoPlayer from '../components/player/VideoPlayer.vue'
import LessonPlaylist from '../components/player/LessonPlaylist.vue'
import PlayerLessonInfo from '../components/player/PlayerLessonInfo.vue'
import PlayerTabs from '../components/player/PlayerTabs.vue'
import Footer from '../components/common/Footer.vue'

const headerRef = ref(null)

const courseTitle = 'React 進階：狀態管理'
const progressPercent = 45

const sections = [
  {
    title: '基礎概念複習',
    completedCount: 3,
    totalCount: 3,
    lessons: [
      { id: 1, label: '1-1', title: 'React State 基礎回顧', duration: '12:30', status: 'done' },
      { id: 2, label: '1-2', title: 'Props vs State 深入比較', duration: '18:45', status: 'done' },
      { id: 3, label: '1-3', title: '元件生命週期與 Hooks', duration: '22:10', status: 'done' }
    ]
  },
  {
    title: 'Context API 實戰',
    completedCount: 1,
    totalCount: 4,
    lessons: [
      { id: 4, label: '2-1', title: 'Context 基礎用法', duration: '15:20', status: 'done' },
      { id: 5, label: '2-2', title: 'useContext 深度整合', duration: '31:45', status: 'current' },
      { id: 6, label: '2-3', title: 'Context 效能最佳化', duration: '25:30', status: 'locked' },
      { id: 7, label: '2-4', title: '多層 Context 架構設計', duration: '28:15', status: 'locked' }
    ]
  },
  {
    title: 'Redux Toolkit 實戰',
    completedCount: 0,
    totalCount: 2,
    lessons: [
      { id: 8, label: '3-1', title: 'Redux Toolkit 快速入門', duration: '20:00', status: 'locked' },
      { id: 9, label: '3-2', title: 'createSlice 與非同步', duration: '26:40', status: 'locked' }
    ]
  }
]

const notes = [
  {
    id: 1,
    timestamp: '03:45',
    text: 'useContext 要搭配 Provider 使用，注意 value 變動會導致所有 consumer 重新渲染',
    chapterRef: 'Ch 2-2'
  },
  {
    id: 2,
    timestamp: '11:20',
    text: '可使用 useMemo 包裝 context value 來減少不必要的渲染，需注意依賴陣列',
    chapterRef: 'Ch 2-2'
  }
]

// Header dropdown 用的筆記（本課所有章節）
const allNotes = [
  {
    time: '03:45',
    color: 'bg-[#1B3A5C]',
    text: 'useContext 要搭配 Provider 使用，注意 value 變動會導致所有 consumer 重新渲染',
    chapter: '章節 2-2 · useContext 深度整合'
  },
  {
    time: '11:20',
    color: 'bg-[#1B3A5C]',
    text: '可使用 useMemo 包裝 context value 來減少不必要的渲染，需注意依賴陣列',
    chapter: '章節 2-2 · useContext 深度整合'
  },
  {
    time: '05:32',
    color: 'bg-[#1B3A5C]',
    text: 'React 渲染機制：Virtual DOM diff 演算法',
    chapter: '章節 1-1 · React 渲染機制回顧'
  },
  {
    time: '14:10',
    color: 'bg-[#1B3A5C]',
    text: 'useCallback 和 useMemo 的使用時機差異',
    chapter: '章節 1-2 · Hooks 使用規則'
  },
  {
    time: '08:55',
    color: 'bg-[#5B3FA8]',
    text: 'Provider 巢狀層級過深會造成不必要的重渲染',
    chapter: '章節 2-1 · Context 的設計哲學'
  },
  {
    time: '22:15',
    color: 'bg-[#1B3A5C]',
    text: 'useReducer 適合處理複雜的狀態邏輯，可替代多個 useState',
    chapter: '章節 1-2 · Hooks 使用規則'
  },
  {
    time: '17:30',
    color: 'bg-[#5B3FA8]',
    text: 'createContext 的 defaultValue 只在沒有 Provider 包裹時生效',
    chapter: '章節 2-1 · Context 的設計哲學'
  }
]

const qaItems = [
  {
    id: 1,
    author: '林同學',
    avatar: '林',
    time: '2 小時前',
    sortOrder: 6,
    question: '請問 useContext 和 Redux 的使用場景有什麼差異？什麼時候該選哪個？',
    replies: [
      {
        id: 11,
        author: '陳建宏（講師）',
        avatar: '陳',
        isInstructor: true,
        time: '1 小時前',
        text: '簡單來說，useContext 適合中小規模的狀態共享（如主題、語言設定），而 Redux 更適合複雜的全域狀態管理。如果你的 state 更新頻繁且需要精細控制，建議用 Redux Toolkit。'
      }
    ]
  },
  {
    id: 2,
    author: '張同學',
    avatar: '張',
    time: '1 天前',
    sortOrder: 5,
    question: '在多層 Provider 巢狀的情況下，效能會不會有問題？',
    replies: [
      {
        id: 21,
        author: '陳建宏（講師）',
        avatar: '陳',
        isInstructor: true,
        time: '23 小時前',
        text: '多層 Provider 本身不會造成效能問題，關鍵在於 value 的穩定性。如果每次 render 都傳入新的 object，所有 consumer 都會重新渲染。用 useMemo 包裝 value 就能解決。'
      },
      {
        id: 22,
        author: '王同學',
        avatar: '王',
        time: '20 小時前',
        text: '感謝講師！我之前遇到的效能問題就是因為這個原因。'
      }
    ]
  },
  {
    id: 3,
    author: '陳同學',
    avatar: '陳',
    time: '2 天前',
    sortOrder: 4,
    question: 'useReducer 和 useState 在效能上有差異嗎？還是只是寫法風格不同？',
    replies: [
      {
        id: 31,
        author: '陳建宏（講師）',
        avatar: '陳',
        isInstructor: true,
        time: '1 天前',
        text: '效能上幾乎沒有差異，差別在於程式碼組織方式。當 state 邏輯複雜（多個相關聯的值）時，useReducer 讓邏輯更集中、更好測試。'
      }
    ]
  },
  {
    id: 4,
    author: '黃同學',
    avatar: '黃',
    time: '3 天前',
    sortOrder: 3,
    question: 'React.memo 和 useMemo 有什麼不同？我常常搞混這兩個。',
    replies: [
      {
        id: 41,
        author: '陳建宏（講師）',
        avatar: '陳',
        isInstructor: true,
        time: '2 天前',
        text: 'React.memo 是高階元件（HOC），用來記憶整個元件避免不必要的重渲染；useMemo 是 Hook，用來記憶某個計算結果。一個作用於元件層級，一個作用於值層級。'
      }
    ]
  },
  {
    id: 5,
    author: '李同學',
    avatar: '李',
    time: '4 天前',
    sortOrder: 2,
    question: 'Context 可以搭配 TypeScript 的泛型使用嗎？有沒有推薦的寫法？',
    replies: []
  },
  {
    id: 6,
    author: '吳同學',
    avatar: '吳',
    time: '5 天前',
    sortOrder: 1,
    question: '為什麼在 useEffect 裡面直接用 async function 會報警告？',
    replies: [
      {
        id: 61,
        author: '陳建宏（講師）',
        avatar: '陳',
        isInstructor: true,
        time: '4 天前',
        text: '因為 useEffect 的 callback 預期回傳 cleanup function 或 undefined，但 async function 回傳的是 Promise。正確做法是在 useEffect 內部定義一個 async function 再呼叫它。'
      }
    ]
  },
  {
    id: 7,
    author: '周同學',
    avatar: '周',
    time: '6 小時前',
    sortOrder: 7,
    question: '請問 useContext 的 value 如果是 function，每次渲染都會重新建立嗎？需要用 useCallback 嗎？',
    replies: []
  }
]

const attachments = [
  {
    id: 1,
    name: 'useContext 範例程式碼.zip',
    size: '24 KB',
    type: 'zip'
  },
  {
    id: 2,
    name: 'Context API 筆記講義.pdf',
    size: '1.2 MB',
    type: 'pdf'
  },
  {
    id: 3,
    name: '狀態管理比較表.png',
    size: '340 KB',
    type: 'image'
  }
]
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F8F9FA] pt-20">
    <!-- Header -->
    <CourseHeaderNav ref="headerRef" :progress="progressPercent" userName="小凌" :showBack="false" :allNotes="allNotes" />

    <!-- Content wrapper with 64px side padding -->
    <div class="flex flex-1 flex-col px-16">
      <!-- Back link -->
      <div class="py-3">
        <router-link :to="{ name: 'courseDetail', params: { id: '1' } }"
          class="inline-flex items-center gap-[7px] rounded-lg border border-[#E5E7EB] px-[13px] py-[6px] text-[12px] font-medium text-[#666] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
          <i class="fa-solid fa-chevron-left text-[12px]"></i>
          返回課程
        </router-link>
      </div>
      <!-- Breadcrumbs -->
      <div class="border-b border-[#E5E7EB] bg-white py-[10px]">
        <div class="flex items-center gap-2 text-[12px] text-[#888]">
          <a href="#" class="transition-colors hover:text-[#1B3A5C]">已購課程</a>
          <span class="text-[#CCC]">/</span>
          <span class="font-medium text-[#1B3A5C]">React 進階：狀態管理</span>
        </div>
      </div>

      <!-- Main: video + sidebar -->
      <div class="flex flex-1">
        <!-- Left: player + info -->
        <div class="flex flex-1 flex-col">
          <!-- Video -->
          <VideoPlayer lessonLabel="2-2 · useContext 深度整合" instructor="陳建宏" instructorTitle="資深前端工程師"
            currentTime="10:45" totalTime="31:45" :progressPercent="33" />

          <!-- Below player -->
          <div class="w-full max-w-[960px] px-6">
            <PlayerLessonInfo chapterLabel="CHAPTER 2-2" title="useContext 深度整合" duration="31:45" instructor="陳建宏"
              updatedAt="2026.03.10 更新" />
            <PlayerTabs :notes="notes" :qaItems="qaItems" :attachments="attachments" />
          </div>
        </div>

        <!-- Right sidebar -->
        <LessonPlaylist :courseTitle="courseTitle" :progressPercent="progressPercent" :sections="sections" />
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>
