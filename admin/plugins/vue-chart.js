import Vue from 'vue'
import { Bar, Pie, Line, Doughnut, mixins } from 'vue-chartjs'

const registerComponent = function (name, originalComponent) {
    Vue.component(name, {
        extends: originalComponent,
        mixins: [mixins.reactiveProp],
        props: {
            chartData: {
                type: Object,
                default: () => {},
            },
            chartOptions: {
                type: Object,
                default: () => {},
            },
        },
        mounted() {
            this.renderChart(this.chartData, this.chartOptions)
        },
    })
}

registerComponent('BarChart', Bar)
registerComponent('PieChart', Pie)
registerComponent('DoughnutChart', Doughnut)
registerComponent('LineChart', Line)
