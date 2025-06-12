import React from "react";
import Chart from "react-apexcharts";

const PerusahaanChart = ({ title, value, icon, seriesData, color, subDetails }) => {
  const chartOptions = {
    chart: {
      type: "area",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.3,
        opacityFrom: 0.7,
        opacityTo: 0,
      },
    },
    colors: [`${color}`],
    xaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background: white;
            padding: 6px 10px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 13px;
            font-weight: 500;
            color: #333;
          ">
            ${value}
          </div>
        `;
      },
    },
    markers: {
      size: 0,
    },
  };

  return (
    <div className="bg-white rounded-lg py-4 px-5 w-full border border-gray-300/[0.8] hover:scale-105 transition-all duration-300 ease-in-out">
      <h1 className="font-semibold text-sm text-gray-900">{title}</h1>
      <h2 className="font-medium text-sm text-gray-600">{value}</h2>
      
      {subDetails && (
        <div className="flex items-center mt-1">
          <span className="text-emerald-500 text-xs mr-2">{subDetails.premium} Premium</span>
          <span className="text-gray-400">/</span>
          <span className="text-red-500 text-xs ml-2">{subDetails.free} Free</span>
        </div>
      )}

      <div className="flex justify-between items-end mt-4">
        <div
          className="w-12 h-12 rounded-full flex justify-center items-center"
          style={{ backgroundColor: color }}
        >
          <img src={icon} alt={title} className="w-1/2 object-center" />
        </div>
        
        <div className="w-24">
          <Chart
            options={chartOptions}
            series={[{ name: title, data: seriesData }]}
            type="area"
            height={50}
          />
        </div>
      </div>
    </div>
  );
};

export default PerusahaanChart;