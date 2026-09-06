export function useQuestions() {
  const questions = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function getQuestions(params = {}) {
    loading.value = true
    error.value = null

    try {
      const query = {}
      if (params.search) query.search = params.search
      if (params.subjectId) query.subjectId = params.subjectId
      if (params.difficulty) query.difficulty = params.difficulty
      if (params.year) query.year = params.year
      if (params.status) query.status = params.status

      const response = await $fetch('/api/questions', { query })
      const list = Array.isArray(response)
        ? response
        : (response?.data || response?.questions || [])

      questions.value = list
      return list
    } catch (err) {
      console.error('Erro ao buscar questões:', err)
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao carregar questões.'
      questions.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function getQuestion(id) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/questions/${id}`)
      return response?.data || response?.question || response
    } catch (err) {
      console.error('Erro ao buscar questão:', err)
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao carregar questão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createQuestion(data) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/questions', {
        method: 'POST',
        body: data
      })
      return response?.data || response?.question || response
    } catch (err) {
      console.error('Erro ao criar questão:', err)
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao criar questão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQuestion(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/questions/${id}`, {
        method: 'PUT',
        body: data
      })
      return response?.data || response?.question || response
    } catch (err) {
      console.error('Erro ao atualizar questão:', err)
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao atualizar questão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteQuestion(id) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/questions/${id}`, {
        method: 'DELETE'
      })
      return response?.data || response
    } catch (err) {
      console.error('Erro ao excluir questão:', err)
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao excluir questão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    questions,
    loading,
    error,
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
  }
}