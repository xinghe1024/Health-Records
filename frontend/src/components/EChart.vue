<script setup>
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
    option: { type: Object, required: true },
    height: { type: String, default: '300px' }
})

const el = ref()
let chart
let observer
let lastSize = null

onMounted(() => {
    chart = echarts.init(el.value)
    chart.setOption(props.option)
    observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect
        // ResizeObserver 在 observe() 时一定会触发一次；ECharts 的 resize() 会以 duration: 0 重画，
        // 若此时 resize 会打断入场动画，所以只在尺寸真的改变时才 resize
        if (lastSize && width === lastSize.width && height === lastSize.height) return
        const isFirstCallback = lastSize === null
        lastSize = { width, height }
        if (isFirstCallback) return
        chart?.resize()
    })
    observer.observe(el.value)
})

watch(() => props.option, value => chart?.setOption(value, true), { deep: true })
onBeforeUnmount(() => { observer?.disconnect(); chart?.dispose() })

</script>

<template>
    <div ref="el" class="chart" :style="{ height }"></div>
</template>