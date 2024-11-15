<template>
    <div>
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue"
import { Chart } from "chart.js/auto"

export default defineComponent({
    name: "ChartComponent",
    props: {
        chartData: {
            type: Object,
            required: true,
            validator(value) {
                return (
                    value.labels &&
                    Array.isArray(value.labels) &&
                    value.values &&
                    Array.isArray(value.values)
                )
            },
        },
    },
    setup(props) {
        const chartCanvas = ref(null)
        let chartInstance = null

        const createChart = () => {
            if (chartInstance) {
                chartInstance.destroy()
            }

            chartInstance = new Chart(chartCanvas.value, {
                type: "line", // Puoi scegliere altri tipi come 'bar', 'pie', ecc.
                data: {
                    labels: props.chartData.labels,
                    datasets: [
                        {
                            label: "Number of Views",
                            data: props.chartData.values,
                            borderColor: "#EC622B",
                            backgroundColor: "#dc9b81dd",
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Giorno",
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Visualizzazioni",
                            },
                            beginAtZero: true,
                        },
                    },
                },
            })
        }

        onMounted(() => {
            createChart()
        })

        watch(
            () => props.chartData,
            () => {
                createChart()
            },
            { deep: true }
        )

        return {
            chartCanvas,
        }
    },
})
</script>

<style scoped>
canvas {
    width: 100%;
    height: 400px;
}
</style>
