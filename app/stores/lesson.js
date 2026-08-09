import { defineStore } from 'pinia'

export const useLessonStore = defineStore('lesson', {
  state: () => ({
    currentLesson: null,
    progress: {},
    loading: false
  }),

  getters: {
    currentLessonId: (state) => {
      return state.currentLesson?.id ?? null
    },

    currentLessonProgress: (state) => {
      if (!state.currentLesson?.id) {
        return null
      }

      return state.progress[state.currentLesson.id] ?? null
    },

    completedLessons: (state) => {
      return Object.values(state.progress).filter(
        item => item.status === 'COMPLETED'
      ).length
    }
  },

  actions: {
    setCurrentLesson(lesson) {
      this.currentLesson = lesson
    },

    setLessonProgress(lessonId, progress) {
      this.progress[lessonId] = {
        ...this.progress[lessonId],
        ...progress
      }
    },

    startLesson(lessonId) {
      this.setLessonProgress(lessonId, {
        status: 'IN_PROGRESS'
      })
    },

    completeLesson(lessonId) {
      this.setLessonProgress(lessonId, {
        status: 'COMPLETED'
      })
    },

    setLoading(value) {
      this.loading = value
    },

    clearLessons() {
      this.currentLesson = null
      this.progress = {}
      this.loading = false
    }
  }
})