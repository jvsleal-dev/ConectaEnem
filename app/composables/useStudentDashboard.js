export function useStudentDashboard() {
  return useFetch(
    '/api/student/dashboard',
    {
      key: 'student-dashboard',

      credentials: 'include',

      default: () => ({
        user: null,

        hero: null,

        continueLesson: null,

        quickAccess: [],

        stats: []
      }),

      transform(response) {
        return {
          user:
            response?.user || null,

          hero:
            response?.hero || null,

          continueLesson:
            response?.continueLesson || null,

          quickAccess:
            Array.isArray(
              response?.quickAccess
            )
              ? response.quickAccess
              : [],

          stats:
            Array.isArray(
              response?.stats
            )
              ? response.stats
              : []
        }
      }
    }
  )
}