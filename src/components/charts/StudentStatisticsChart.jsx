import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StudentStatisticsChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [220, 340, 480, 290, 420, 390, 330, 120, 310, 140, 460, 250],
        backgroundColor: '#FAE0B6',
        barThickness: 24,
        borderRadius: 10,
      },
      {
        data: [260, 310, 460, 300, 250, 320, 280, 470, 390, 360, 240, 30],
        backgroundColor: '#3A5987',
        barThickness: 24,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#f8fafc',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        
      },
    },
    scales: {
      x: {
        ticks: { color: '#475569' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#475569' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Statistik Siswa</h2>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-[#FAE0B6]"></span>
              <span className="text-sm text-slate-700">Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-[#3A5987]"></span>
              <span className="text-sm text-slate-700">Offline</span>
            </div>
          </div>
          <select className="bg-transparent border border-slate-300 text-slate-700 text-sm px-3 py-1 rounded-md shadow-sm focus:outline-none">
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div className="h-[320px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StudentStatisticsChart;
