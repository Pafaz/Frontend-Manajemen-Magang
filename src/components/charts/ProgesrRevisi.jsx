import React from "react";
import Chart from "react-apexcharts";

const ProgressRevisi = () => {
  const series = [12.5];
  const belumDikerjakan = 100 - series[0];

  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        track: {
          background: "#E5EAF1",
          strokeWidth: "100%",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "30px",
            fontWeight: 600,
            color: "#075985", 
            offsetY: 10,
            formatter: function (val) {
              return val.toString().replace(".", ",") + "%";
            },
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    fill: {
      colors: ["#075985"],
    },
    labels: ["Sudah Dikerjakan"],
  };

  return (
    <div>
      <h1 className="text-sky-800 text-sm font-semibold mb-4">PROGRESS REVISI</h1>
      
      <div className="flex justify-center">
        <Chart options={options} series={series} type="radialBar" width="240" />
      </div>

      <div className="flex justify-center mt-4 gap-10 text-xs">
        <div className="flex flex-col items-center text-sky-800 font-semibold">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-800 mb-1" />
          <span>Sudah Dikerjakan</span>
          <span>{series[0].toString().replace(".", ",")}%</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 mb-1" />
          <span>Belum Dikerjakan</span>
          <span>{belumDikerjakan.toFixed(1).toString().replace(".", ",")}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressRevisi;
