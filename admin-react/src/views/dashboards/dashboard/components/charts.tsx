import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import CustomEChart from '@/components/CustomEChart.tsx'
import { getCarrierPieOptions, getRevenueChartOptions } from '../data'

export const RevenueChart = () => (
  <CustomEChart
    extensions={[LineChart, BarChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]}
    getOptions={getRevenueChartOptions}
    style={{ height: 260 }}
  />
)

interface CarrierPieChartProps {
  data: { name: string; value: number }[]
}

export const CarrierPieChart = ({ data }: CarrierPieChartProps) => (
  <CustomEChart
    extensions={[PieChart, TooltipComponent, LegendComponent, CanvasRenderer]}
    getOptions={() => getCarrierPieOptions(data)}
    style={{ height: 220 }}
  />
)

// kept for backward compatibility
export const DonutChart = () => <span />
export const ProjectProgressChart = () => <span />
