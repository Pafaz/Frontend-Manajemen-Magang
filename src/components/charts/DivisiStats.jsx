import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function ParticipantChart() {
  const [year, setYear] = useState('2024');

  const dataPerYear = {
    '2024': {
      categories: ['UI/UX', 'Web Dev', 'Mobile Dev', 'IT Support'],
      series: [
        {
          name: 'Jan',
          data: [30, 40, 35, 20]
        },
        {
          name: 'Feb',
          data: [25, 45, 30, 25]
        },
        {
          name: 'Mar',
          data: [40, 35, 25, 30]
        },
        {
          name: 'Apr',
          data: [35, 50, 30, 40]
        }
      ]
    },
    '2023': {
      categories: ['UI/UX', 'Web Dev', 'Mobile Dev', 'IT Support'],
      series: [
        {
          name: 'Jan',
          data: [20, 30, 25, 15]
        },
        {
          name: 'Feb',
          data: [22, 35, 28, 18]
        },
        {
          name: 'Mar',
          data: [28, 33, 24, 20]
        }
      ]
    }
  };

  const chartData = {
    series: dataPerYear[year].series,
    options: {
      chart: {
        type: 'bar',
        height: 400,
        stacked: true,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
          borderRadius: 4,
        }
      },
      xaxis: {
        categories: dataPerYear[year].categories,
        labels: {
          style: {
            fontSize: '12px',
            colors: '#666'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: '#666'
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '12px'
      },
      colors: ['#3A5987'], // satu warna untuk semua batang
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: val => `${val} peserta`
        }
      }
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-bold text-gray-800">Jumlah Peserta</h4>
        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white shadow-sm text-gray-700 py-2 px-2 pr-2 rounded leading-tight focus:outline-none"          >
            <option>2024</option>
            <option>2023</option>
          </select>

        </div>
      </div>

      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={300}
      />
    </div>
  );
}
