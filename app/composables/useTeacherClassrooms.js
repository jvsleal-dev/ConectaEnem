export function useTeacherClassrooms() {
  async function getClassrooms() {
    return await $fetch('/api/teacher/classrooms', {
      credentials: 'include'
    })
  }

  async function getClassroom(id) {
    return await $fetch(`/api/teacher/classrooms/${id}`, {
      credentials: 'include'
    })
  }

  async function createClassroom(data) {
    return await $fetch('/api/teacher/classrooms', {
      method: 'POST',
      credentials: 'include',
      body: data
    })
  }

  async function updateClassroom(id, data) {
    return await $fetch(`/api/teacher/classrooms/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: data
    })
  }

  async function deleteClassroom(id) {
    return await $fetch(`/api/teacher/classrooms/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  async function removeStudent(classroomId, studentId) {
    return await $fetch(`/api/teacher/classrooms/${classroomId}/students/${studentId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  return {
    getClassrooms,
    getClassroom,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    removeStudent
  }
}
