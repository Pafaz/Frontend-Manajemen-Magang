import React, { useState } from "react";
import Chart from "react-apexcharts";

const ProjectStats = () => {
  const totalProjects = 6;
  const completed = 1;
  const inRevision = 1;
  const notCompleted = 4;

  const percentages = [
    (completed / totalProjects) * 100,
    (inRevision / totalProjects) * 100,
    (notCompleted / totalProjects) * 100,
  ];

  const totalPercentage = Math.round(
    ((completed + inRevision + notCompleted) / totalProjects) * 100
  );

  const [centerValue, setCenterValue] = useState(totalPercentage);

  const options = {
    chart: {
      type: "radialBar",
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          setCenterValue(Math.round(percentages[config.dataPointIndex]));
        },
        dataPointMouseLeave: () => {
          setCenterValue(totalPercentage);
        },
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "35%",
        },
        track: {
          background: "#F3F4F6",
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "15px",
            fontWeight: "light",
            color: "#333",
            offsetY: 6,
            formatter: () => `${centerValue}%`,
          },
          total: {
            show: true,
            label: "Total",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            formatter: () => `${centerValue}%`,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Selesai", "Revisi", "Belum Selesai"],
    colors: ["#3D7FF9", "#27CFA7", "#020203"],
    tooltip: { enabled: false },
    legend: { show: false },
  };

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Chart
          options={options}
          series={percentages}
          type="radialBar"
          height={170}
        />
      </div>
      <h3 className="text-lg font-semibold">
        Total Project: <span className="font-bold">{totalProjects}</span>
      </h3>

      <div className="flex justify-center gap-8 py-3 mt-2">
        {[
          {
            label: "Completed",
            value: `${completed}/${totalProjects}`,
            color: "border-blue-500",
          },
          {
            label: "Under Revision",
            value: `${inRevision}/${totalProjects}`,
            color: "border-teal-500",
          },
          {
            label: "Incomplete",
            value: `${notCompleted}/${totalProjects}`,
            color: "border-black",
          },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <p className="font-semibold text-sm">{item.value}</p>
            <div className={`border-b-2 ${item.color} w-6 mx-auto my-1`} />
            <p className="text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;
