import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getProfile } from '@/api/user'

export const useUserStore = defineStore('user', () => {
    const profile = ref(null)
    const loading = ref(false)

    async function loadProfile(){
        loading.value = true

        try {
            profile.value = await getProfile()
        } finally {
         loading.value = false   
        }
    }
    return { profile, loading, loadProfile }
})
