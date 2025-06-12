import React, { useState } from "react";
import Chart from "react-apexcharts";
import Title from "../Title";

const StaticJurnal = () => {
  const [filter, setFilter] = useState("Yearly");

  const dataOptions = {
    Yearly: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        { name: "Mengisi", data: [18, 22, 15, 25, 20, 28, 19, 24, 21, 26, 23, 27] },
        { name: "Tidak Mengisi", data: [8, 12, 16, 18, 14, 22, 17, 19, 15, 20, 16, 24] },
      ],
    },
  };

  const options = {
    chart: {
       type: "bar",
       toolbar: { show: false },
      height: 300,
      events: {
        dataPointMouseEnter: function(event, chartContext, config) {
          const element = event.target;
          const seriesIndex = config.seriesIndex;
          
          // Add shadow to hovered element
          element.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))';
          
          // Make other series transparent
          const allSeries = chartContext.el.querySelectorAll('.apexcharts-series');
          allSeries.forEach((series, index) => {
            if (index !== seriesIndex) {
              series.style.opacity = '0.3';
            }
          });
        },
        dataPointMouseLeave: function(event, chartContext, config) {
          const element = event.target;
          
          // Remove shadow
          element.style.filter = 'none';
          
          // Reset all series opacity
          const allSeries = chartContext.el.querySelectorAll('.apexcharts-series');
          allSeries.forEach((series) => {
            series.style.opacity = '1';
          });
        }
      }
    },
    colors: ["#60A5FA", "#2563EB"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadiusApplication: 'end',
        borderRadius: 8
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.1
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none'
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
       categories: dataOptions[filter].categories
     },
    yaxis: {
       min: 0,
       max: 30,
      
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      y: {
        formatter: function (val) {
          return val + " entries"
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      floating: true,
      offsetX: 570,
      offsetY: -40,
    },
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Title className="ml-5">Statistik Jurnal</Title>
        <select
          className="border border-gray-300/[0.5] rounded-lg px-2 py-0.5 text-sm text-center text-gray-500 z-5 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      <Chart
        options={options}
        series={dataOptions[filter].series}
        type="bar"
        height={300}
      />
    </>
  );
};

export default StaticJurnal;