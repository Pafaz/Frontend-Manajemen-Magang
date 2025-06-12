import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const StatistikPeserta = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const chartData = {
    series: [84, 26, 26],
    options: {
      chart: {
        type: 'donut',
        height: 100,
        width: 100,
        events: {
          dataPointMouseEnter: function(event, chartContext, config) {
            setHoveredIndex(config.dataPointIndex);
          },
          dataPointMouseLeave: function(event, chartContext, config) {
            setHoveredIndex(null);
          }
        }
      },
      labels: ['Perlu Tindakan', 'Peserta Aktif', 'Alumni'],
      colors: ['#1E40AF', '#3B82F6', '#93C5FD'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#fff']
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.8
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '40%',
            labels: {
              show: true,
              name: {
                show: false
              },
              value: {
                show: false
              },
              total: {
                show: true,
                label: 'Status',
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151',
                formatter: function () {
                  return 'Peserta';
                }
              }
            }
          },
          expandOnClick: false
        }
      },
      legend: {
        show: false
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none'
          }
        }
      },
      tooltip: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 140
          }
        }
      }]
    }
  };

  const legendData = [
    { name: 'Perlu Tindakan', value: 84, color: '#1E40AF' },
    { name: 'Peserta Aktif', value: 26, color: '#3B82F6' },
    { name: 'Alumni', value: 26, color: '#93C5FD' }
  ];

  return (
    <div className="bg-white rounded-xl p-4 w-full h-full border border-gray-100 mt-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          Status Peserta
        </h2>
        <p className="text-gray-600 text-xs">
          Kelola status peserta magang
        </p>
      </div>
      
      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center">
        {/* Chart Section */}
        <div className="flex-shrink-0 relative">
          <style jsx>{`
            .apexcharts-pie-series path {
              transition: all 0.3s ease;
              transform-origin: center;
              cursor: pointer;
            }
            
            .apexcharts-pie-series path:hover {
              transform: scale(1.05);
              filter: brightness(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.2));
            }
            
            .apexcharts-pie-series path[data-index="0"]:hover {
              filter: brightness(1.1) drop-shadow(0 4px 12px rgba(30,64,175,0.4));
            }
            
            .apexcharts-pie-series path[data-index="1"]:hover {
              filter: brightness(1.1) drop-shadow(0 4px 12px rgba(59,130,246,0.4));
            }
            
            .apexcharts-pie-series path[data-index="2"]:hover {
              filter: brightness(1.1) drop-shadow(0 4px 12px rgba(147,197,253,0.4));
            }
          `}</style>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={180}
            width={180}
          />
        </div>
        
        {/* Legend Section */}
        <div className="flex flex-col ml-4">
          {legendData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                hoveredIndex === index 
                  ? 'bg-gray-50 shadow-md transform scale-105' 
                  : ''
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  hoveredIndex === index ? 'w-4 h-4 shadow-lg' : ''
                }`}
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: hoveredIndex === index ? `0 0 10px ${item.color}40` : 'none'
                }}
              />
              <div className="flex-1">
                <p className={`text-xs font-medium transition-all duration-200 ${
                  hoveredIndex === index ? 'text-gray-900 font-semibold' : 'text-gray-700'
                }`}>
                  {item.name}
                </p>
              </div>
              <div className={`text-sm font-bold transition-all duration-200 ${
                hoveredIndex === index ? 'text-gray-900 text-base' : 'text-gray-600'
              }`}>
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatistikPeserta;