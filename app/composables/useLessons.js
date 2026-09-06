export function useLessons() {
  async function getLessons(moduleId) {
    return await $fetch(`/api/lessons?moduleId=${moduleId}`, {
      credentials: 'include'
    })
  }

  async function getLesson(id) {
    return await $fetch(`/api/lessons/${id}`, {
      credentials: 'include'
    })
  }

  async function createLesson(data) {
    return await $fetch('/api/lessons', {
      method: 'POST',
      credentials: 'include',
      body: data
    })
  }

  async function updateLesson(id, data) {
    return await $fetch(`/api/lessons/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
  }

  async function deleteLesson(id) {
    return await $fetch(`/api/lessons/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  return {
    getLessons,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson
  }
}
