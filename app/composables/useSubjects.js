export function useSubjects() {
  async function getSubjects() {
    return await $fetch(
      '/api/subjects'
    )
  }


  async function getSubject(id) {
    return await $fetch(
      `/api/subjects/${id}`
    )
  }


  async function createSubject(payload) {
    return await $fetch(
      '/api/subjects',
      {
        method: 'POST',
        body: payload
      }
    )
  }


  async function updateSubject(
    id,
    payload
  ) {
    return await $fetch(
      `/api/subjects/${id}`,
      {
        method: 'PUT',
        body: payload
      }
    )
  }
async function deleteModule(id) {
  return await $fetch(
    `/api/modules/${id}`,
    {
      method:'DELETE'
    }
  )
}

  return {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteModule
  }
}