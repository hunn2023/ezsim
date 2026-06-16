import type { EChartsOption } from 'echarts'
import { getColor } from '@/helpers/color'

const MONTH_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']

const DAILY_REVENUE = [
  8_500_000, 12_200_000, 9_800_000, 15_600_000, 11_300_000, 18_700_000, 22_400_000,
  14_100_000, 10_900_000, 19_300_000, 24_500_000, 17_800_000, 13_200_000, 20_600_000, 28_100_000,
  16_400_000, 21_700_000, 25_300_000, 12_800_000, 30_200_000, 18_500_000, 22_900_000, 27_600_000,
  14_700_000, 19_100_000, 23_800_000, 31_500_000, 26_200_000, 20_400_000, 24_500_000,
]

const DAILY_ORDERS = [
  3, 5, 4, 7, 5, 8, 11, 6, 4, 9, 12, 8, 6, 10, 14,
  7, 10, 13, 5, 15, 8, 11, 13, 6, 9, 11, 16, 12, 9, 7,
]

export const getRevenueChartOptions = (): EChartsOption => {
  return {
    textStyle: { fontFamily: getComputedStyle(document.body).fontFamily },
    tooltip: {
      trigger: 'axis',
      padding: [8, 12],
      backgroundColor: getColor('secondary-bg'),
      borderColor: getColor('border-color'),
      textStyle: { color: getColor('light-text-emphasis') },
      borderWidth: 1,
      transitionDuration: 0.1,
      axisPointer: { type: 'none' },
      shadowBlur: 4,
      shadowColor: 'rgba(76, 76, 92, 0.15)',
      formatter: (params: any) => {
        const day = params[0].name
        const revenue = params[0]?.value ?? 0
        const orders = params[1]?.value ?? 0
        return `<b>Ngày ${day}</b><br/>
          💰 Doanh thu: ${new Intl.NumberFormat('vi-VN').format(revenue)}₫<br/>
          📦 Đơn hàng: ${orders} đơn`
      },
    },
    xAxis: {
      type: 'category',
      data: MONTH_LABELS,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: getColor('secondary-color'), margin: 10, fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: 'VNĐ',
        nameTextStyle: { color: getColor('secondary-color'), fontSize: 10 },
        splitLine: { lineStyle: { color: '#676b891f', type: 'dashed' } },
        axisLabel: {
          color: getColor('secondary-color'),
          margin: 10,
          fontSize: 10,
          formatter: (v: number) => {
            if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + 'tr'
            return v.toString()
          },
        },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      {
        type: 'value',
        name: 'Đơn',
        nameTextStyle: { color: getColor('secondary-color'), fontSize: 10 },
        splitLine: { show: false },
        axisLabel: { color: getColor('secondary-color'), margin: 10, fontSize: 10 },
        axisTick: { show: false },
        axisLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Doanh thu',
        type: 'line',
        smooth: true,
        symbolSize: 3,
        itemStyle: { color: getColor('primary'), borderColor: getColor('primary'), borderWidth: 2 },
        areaStyle: { opacity: 0.15, color: getColor('primary') },
        lineStyle: { color: getColor('primary'), width: 2 },
        symbol: 'circle',
        data: DAILY_REVENUE,
        yAxisIndex: 0,
      },
      {
        name: 'Đơn hàng',
        type: 'bar',
        barWidth: '40%',
        itemStyle: { color: getColor('secondary'), opacity: 0.6, borderRadius: [3, 3, 0, 0] },
        data: DAILY_ORDERS,
        yAxisIndex: 1,
      },
    ],
    grid: { right: 40, left: 5, bottom: 5, top: 12, containLabel: true },
    legend: {
      bottom: 0,
      textStyle: { color: getColor('secondary-color'), fontSize: 11 },
      itemWidth: 12,
      itemHeight: 8,
    },
  }
}

export const getCarrierPieOptions = (
  data: { name: string; value: number }[]
): EChartsOption => ({
  tooltip: {
    trigger: 'item',
    padding: [8, 12],
    backgroundColor: getColor('secondary-bg'),
    borderColor: getColor('border-color'),
    textStyle: { color: getColor('light-text-emphasis') },
    borderWidth: 1,
    formatter: '{b}: {c} SIM ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: getColor('secondary-color'), fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      name: 'Kho SIM',
      type: 'pie',
      radius: ['42%', '70%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data,
      emphasis: {
        itemStyle: { shadowBlur: 8, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.4)' },
      },
    },
  ],
})

// Keep old exports to avoid breaking other references
export const getPieEchartOptions = (): EChartsOption => ({
  tooltip: { show: false },
  series: [{ type: 'pie', radius: ['60%', '100%'], label: { show: false }, data: [] }],
})

export const getProgressChartOptions = (): EChartsOption => ({
  series: [{ type: 'pie', data: [] }],
})
