import React from 'react';
import Chart from 'react-apexcharts';
import { Users, BarChart2, FileText } from "lucide-react";

const JobCard = ({ job, onClick, isActive }) => {
  // Helper untuk mendapatkan warna yang sesuai
  const getColor = (colorName) => {
    const colorMap = {
      'orange': {
        bg: 'bg-orange-100',
        text: 'text-orange-500',
        hex: '#f97316'
      },
      'yellow': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        hex: '#ca8a04'
      },
      'blue': {
        bg: 'bg-blue-100',
        text: 'text-blue-500',
        hex: '#3b82f6'
      },
      // Fallback untuk nilai lain
      'default': {
        bg: 'bg-gray-100',
        text: 'text-gray-500',
        hex: '#6b7280'
      }
    };
    
    return colorMap[colorName] || colorMap.default;
  };
  
  // Mendapatkan warna untuk komponen
  const colorStyles = getColor(job.color);
  
  // Render ikon berdasarkan iconType
  const renderIcon = (iconType) => {
    switch(iconType) {
      case 'people':
        return <Users className="w-6 h-6" />;
      case 'chart':
        return <BarChart2 className="w-6 h-6" />;
      case 'document':
        return <FileText className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  const chartOptions = {
    chart: {
      type: 'line',
      height: 40,
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: [colorStyles.hex],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => job.title
        }
      },
      marker: {
        show: false
      }
    },
    grid: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };
  
  const chartSeries = [
    {
      name: job.title,
      data: job.chartData
    }
  ];

  return (
    <div
      className={`bg-white rounded-xl border border-slate-400/[0.5] py-6 px-4 w-full cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorStyles.bg}`}>
          <div className={colorStyles.text}>
            {renderIcon(job.iconType)}
          </div>
        </div>
        <span className="text-sm font-medium">{job.title}</span>
      </div>
      <div className="flex items-end justify-between mt-4">
        <h3 className="text-xl font-bold">{job.count} Lowongan</h3>
        <div className="h-10 w-24">
          {typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={40}
              width={96}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;