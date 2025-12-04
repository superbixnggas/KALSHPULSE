import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface ChartDataPoint {
  timestamp: string;
  yes_probability: number;
  no_probability: number;
  volume: number;
}

interface ProbabilityChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export function ProbabilityChart({ data, height = 400 }: ProbabilityChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !data || data.length === 0) return;

    const timestamps = data.map((d) =>
      new Date(d.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    const yesProbabilities = data.map((d) => d.yes_probability);
    const noProbabilities = data.map((d) => d.no_probability);
    const volumes = data.map((d) => d.volume);

    const option: EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111118',
        borderColor: '#2a2a36',
        textStyle: {
          color: '#e5e5e5',
        },
      },
      legend: {
        data: ['Yes', 'No', 'Volume'],
        bottom: 0,
        textStyle: {
          color: '#a0a0a0',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: timestamps,
        axisLine: {
          lineStyle: {
            color: '#2a2a36',
          },
        },
        axisLabel: {
          color: '#6b6b6b',
          fontSize: 11,
          rotate: 45,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Probability (%)',
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              color: '#2a2a36',
            },
          },
          axisLabel: {
            color: '#6b6b6b',
            formatter: '{value}%',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(42, 42, 54, 0.5)',
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          name: 'Volume',
          axisLine: {
            lineStyle: {
              color: '#2a2a36',
            },
          },
          axisLabel: {
            color: '#6b6b6b',
            formatter: (value: number) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value.toString();
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Yes',
          type: 'line',
          data: yesProbabilities,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#00ff88',
            width: 3,
          },
          itemStyle: {
            color: '#00ff88',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                { offset: 1, color: 'rgba(0, 255, 136, 0)' },
              ],
            },
          },
        },
        {
          name: 'No',
          type: 'line',
          data: noProbabilities,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#ef4444',
            width: 3,
          },
          itemStyle: {
            color: '#ef4444',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(239, 68, 68, 0.2)' },
                { offset: 1, color: 'rgba(239, 68, 68, 0)' },
              ],
            },
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: 'rgba(139, 92, 246, 0.5)',
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '40%',
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-foreground-dim">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div ref={chartRef} style={{ height, width: '100%' }} />
    </div>
  );
}
