import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentStatusChart = () => {
  const data = {
    labels: ['Siswa Aktif', 'Siswa Tidak Aktif', 'Alumni'],
    datasets: [
      {
        data: [65.2, 25.0, 9.8],
        backgroundColor: ['#0369a1', '#fbbf24', '#ef4444'],
        borderWidth: 2,
        borderColor: '#fff',
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
  };

  const legends = [
    { label: 'Siswa Aktif', color: '#0369a1', value: '65.2%' },
    { label: 'Siswa Tidak Aktif', color: '#fbbf24', value: '25.0%' },
    { label: 'Alumni', color: '#ef4444', value: '9.8%' },
  ];

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Data Siswa</h2>
      <div className="w-96 h-96 mx-auto flex justify-center"> {/* Adjusted size for the chart */}
        <Doughnut data={data} options={options} />
      </div>

      <div className="mt-6 flex justify-around text-center">
        {legends.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
            <div className="text-sm font-bold text-slate-800">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentStatusChart;