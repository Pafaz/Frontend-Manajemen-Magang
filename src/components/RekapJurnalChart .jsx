import React from "react";
import ReactApexChart from "react-apexcharts";

const RekapJurnalChart = () => {
    const seriesData = [
        {
          name: "Study",
          data: [44, 55, 41, 50, 36, 43, 50, 44, 55, 41, 50, 36],
        },
        {
          name: "Exam",
          data: [26, 23, 20, 40, 32, 27, 30, 26, 23, 20, 40, 32], 
        },
      ];
      
      const chartConfig = {
        type: "bar",
        height: 400,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      };
      
      const colors = ["#27CFA7", "#A9ECDC"];
      
      const plotOptions = {
        bar: {
          columnWidth: "35%",
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          dataLabels: {
            total: {
              enabled: false,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      };
      
      const grid = {
        show: true,
        borderColor: "#d5dbe7",
        strokeDashArray: 3,
        position: "back",
      };
      
      const xaxis = {
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
      };
      
      const yaxis = {
        labels: {
          formatter: (value) => `${value}`,
          style: {
            fontSize: "14px",
          },
        },
      };
      
      const legend = {
        show: false,
        position: "top",
        offsetY: 0,
        horizontalAlign: "start",
        markers: {
          radius: 50,
        },
      };
      
      const fill = {
        opacity: 1,
      };
      
      const dataLabels = {
        enabled: false,
      };
      
      const chartOptions = {
        series: seriesData,
        options: {
          chart: chartConfig,
          colors: colors,
          plotOptions: plotOptions,
          grid: grid,
          xaxis: xaxis,
          yaxis: yaxis,
          legend: legend,
          fill: fill,
          dataLabels: dataLabels,
        },
      };
      

  return (
    <div className="mt-10 bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-lg font-semibold">Rekap Jurnal</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#27CFA7]"></span>
            <span className="text-sm text-gray-600">Study</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#A9ECDC]"></span>
            <span className="text-sm text-gray-600">Exam</span>
          </div>
          <select className="text-sm px-3 py-1 rounded border border-gray-300">
            <option>Yearly</option>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Today</option>
          </select>
        </div>
      </div>
      <ReactApexChart
        options={chartOptions.options}
        series={chartOptions.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default RekapJurnalChart;
