import React, { useEffect, useRef } from 'react';

export default function LowonganChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // Function to initialize chart
    const initChart = () => {
      if (window.ApexCharts && chartRef.current && !chartInstance.current) {
        const options = {
          series: [84],
          chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#A5B4FC",
                strokeWidth: '97%',
                margin: 2,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  color: '#444',
                  opacity: 1,
                  blur: 2
                }
              },
              dataLabels: {
                name: {
                  show: false
                },
                value: {
                  offsetY: -2,
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  formatter: function (val) {
                    return parseInt(val) + "%";
                  }
                }
              }
            }
          },
          grid: {
            padding: {
              top: -10
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              shadeIntensity: 0.4,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 53, 91]
            }
          },
          colors: ['#4338CA'],
          labels: ['Lowongan Aktif']
        };

        chartInstance.current = new window.ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    };

    // Check if ApexCharts is already loaded
    if (window.ApexCharts) {
      initChart();
    } else {
      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="apexcharts"]');
      if (existingScript) {
        existingScript.addEventListener('load', initChart);
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.44.0/apexcharts.min.js';
        script.addEventListener('load', initChart);
        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []); // Empty dependency array to run only once

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Lowongan</h2>
          <p className="text-sm text-gray-500">Kelola lowongan</p>
        </div>

        {/* ApexCharts Semi-Circle Chart */}
        <div className="flex justify-center">
          <div ref={chartRef} style={{width: '200px', height: '120px'}}></div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-700 rounded-sm mr-3"></div>
              <span className="text-sm text-gray-600">Lowongan Aktif</span>
            </div>
            <span className="text-sm font-medium text-gray-900">84%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-300 rounded-sm mr-3"></div>
              <span className="text-sm text-gray-600">Lowongan Tidak Aktif</span>
            </div>
            <span className="text-sm font-medium text-gray-900">16%</span>
          </div>
        </div>
      </div>
    </div>
  );
}