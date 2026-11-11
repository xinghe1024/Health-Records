import { ref } from 'vue'
import { listGlucoseRecords, getGlucoseSummary } from '@/api/glucose'

export function useGlucoseData() {
    const records = ref([])
    const summary = ref(null)
    const loading = ref(false)

    // 同时请求列表和统计，之后新增、删除成功时也会复用
    async function loadGlucoseData() {
        loading.value = true
        try {
            const [recordList, summaryData] = await Promise.all([
                listGlucoseRecords(),
                getGlucoseSummary(),
            ])
            records.value = recordList
            summary.value = summaryData
        } finally {
            loading.value = false
        }
    }
    
    return { records, summary, loading, loadGlucoseData }
}
