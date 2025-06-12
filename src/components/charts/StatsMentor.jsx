import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function StudentProjectSummary() {
  const [options, setOptions] = useState({
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#2E5090', '#5C8CD8', '#A0C4FF', '#E6F0FF', '#F2F7FF'],
    labels: [
      'UI/UX Designer',
      'IT Support',
      'Web Developer',
      'Mobile Developer',
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          background: 'transparent',
          labels: {
            show: false, // Menonaktifkan label default
          }
        }
      }
    },
    annotations: {
      position: 'front',
      yaxis: [
        {
          y: 0,
          y2: 0,
          borderColor: 'transparent', // Tidak ada border
          fillColor: 'transparent', // Tidak ada latar belakang
          label: {
            text: 'Mentor Summary', // Label yang ingin ditempatkan di tengah
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
            }
          }
        }
      ]
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    tooltip: {
      y: {
        formatter: function(value) {
          return value + " Orang";
        }
      }
    }
  });

  const series = [12, 12, 12, 12, 12]; // Data values (equal for simplicity)
  
  // Legend items with colors and counts
  const legendItems = [
    { color: '#2E5090', label: 'UI/UX Designer', count: 12 },
    { color: '#5C8CD8', label: 'IT Support', count: 12 },
    { color: '#A0C4FF', label: 'Web Developer', count: 12 },
    { color: '#E6F0FF', label: 'Mobile Developer', count: 12 },
  ];

  return (
    <div className="p-6">
      <h3 className="text-sm font-bold text-gray-800 mb-10">Statistik Mentor Per Divisi</h3>
      
      <div className="chart-container mb-10">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="donut" 
          height={200}
        />
      </div>
      
      <div className="legend-container">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-700 mr-1">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">{item.count} Orang</span>
          </div>
        ))}
      </div>      
    </div>
  );
}
