export function useModules() {

  async function getModules(
    subjectId = null
  ) {

    return await $fetch(
      '/api/modules',
      {
        query: subjectId
          ? {
              subjectId
            }
          : undefined
      }
    )

  }


  async function getModule(
    id
  ) {

    return await $fetch(
      `/api/modules/${id}`
    )

  }


  async function createModule(
    payload
  ) {

    return await $fetch(
      '/api/modules',
      {
        method: 'POST',
        body: payload
      }
    )

  }


  async function updateModule(
    id,
    payload
  ) {

    return await $fetch(
      `/api/modules/${id}`,
      {
        method: 'PUT',
        body: payload
      }
    )

  }


  async function deleteModule(
    id
  ) {

    return await $fetch(
      `/api/modules/${id}`,
      {
        method: 'DELETE'
      }
    )

  }


  return {

    getModules,

    getModule,

    createModule,

    updateModule,

    deleteModule

  }

}