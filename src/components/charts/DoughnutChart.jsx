import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      chartRef.current.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Hadir", "Izin / Sakit", "Alpha"],
          datasets: [
            {
              data: [65.2, 25.0, 9.8],
              backgroundColor: ["#007bff", "#ff9800", "#ff3d3d"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          cutout: "55%", 
        },
      });
    }
  }, []);

  return (
    <div className="py-3">
      <div className="border-b border-slate-300/[0.5] py-2">
        <div className="px-5 flex justify-between">
          <h3 className="text-lg text-left font-semibold">Total Absensi</h3>
          <i className="bi bi-three-dots"></i>
        </div>
      </div>
      <div className="justify-center flex py-5">
        <canvas ref={chartRef} width={150} height={150}></canvas>
      </div>
      <div className="flex gap-5 mt-4 px-5 justify-center">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="text-xs mt-2 text-blue-500">Hadir</div>
          <h1 className="font-semibold text-xs mt-3">65.2%</h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-1 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="text-xs mt-2 text-orange-500">Izin / Sakit</div>
          <h1 className="font-semibold text-xs mt-3">25.0%</h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="text-xs mt-2 text-red-500">Alpha</div>
          <h1 className="font-semibold text-xs mt-3">9.8%</h1>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
