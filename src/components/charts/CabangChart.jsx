import React from 'react';
import Chart from 'react-apexcharts';

export default function PieChart({ peserta }) {
  // Buat series data dari peserta
  const series = [
    peserta?.menunggu || 0,  // Menunggu Konfirmasi
    peserta?.aktif || 0,     // Peserta Aktif
    peserta?.alumni || 0,    // Alumni
  ];

  const options = {
    chart: {
      type: 'pie',
    },
    labels: [
      'Menunggu Konfirmasi',
      'Peserta Aktif',
      'Alumni',
    ],
    colors: [
      '#3B5998',
      '#5B7EC2',
      '#8BB2FB',
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 2,
      colors: ['#FFFFFF'],
    },
    tooltip: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <Chart options={options} series={series} type="pie" width={180} height={180} />
      </div>

      <div className="flex flex-col gap-2 text-[9px] leading-snug">
        {options.labels.map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: options.colors[index] }}></span>
            <p className="font-medium text-gray-700">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
