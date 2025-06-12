import React from "react";
import ReactApexChart from "react-apexcharts";

const ActivityChart = () => {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Complete", "Waiting List", "Revision"],
    colors: ["#007bff", "#00C897", "#FFA500"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ["#fff"]
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  };

  const chartSeries = [65.2, 25.0, 9.8];

  return (
    <div className="py-3">
      <div className="flex justify-center py-5">
        <div className="relative w-[200px] h-[200px]">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <div className="flex gap-5 mt-4 px-5 justify-center">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-[#007bff] rounded-full"></div>
          <div className="text-xs mt-2 text-[#007bff]">Complete</div>
          <h1 className="font-semibold text-xs mt-3">65.2%</h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-[#00C897] rounded-full"></div>
          <div className="text-xs mt-2 text-[#00C897]">Waiting List</div>
          <h1 className="font-semibold text-xs mt-3">25.0%</h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-[#FFA500] rounded-full"></div>
          <div className="text-xs mt-2 text-[#FFA500]">Revision</div>
          <h1 className="font-semibold text-xs mt-3">9.8%</h1>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
