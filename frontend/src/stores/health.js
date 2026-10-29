import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { listPatients } from '@/api/patient'


export const useHealthStore = defineStore('health', () => {
  const patientId = ref(null)
  const patients = ref([])
  const dashboard = ref(null)
  const loading = ref(false)

  const currentPatient = computed(() => {
    return patients.value.find(
      patient => patient.id === patientId.value,
    ) ?? null
  })

  async function init() {
  loading.value = true

  try {
    patients.value = await listPatients()
    patientId.value = patients.value[0]?.id ?? null
  } finally {
    loading.value = false
  }
  }

  function changePatient(id) {
    patientId.value = id
  }

  async function refreshDashboard() { dashboard.value = await healthApi.dashboard(patientId.value) }

  return {
    patientId,
    patients,
    currentPatient,
    loading,
    init,
    changePatient,
  }
})