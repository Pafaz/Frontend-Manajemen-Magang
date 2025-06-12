import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', aktif: 270, selesai: 110 },
  { month: 'Feb', aktif: 190, selesai: 280 },
  { month: 'Mar', aktif: 280, selesai: 100 },
  { month: 'Apr', aktif: 110, selesai: 390 },
  { month: 'May', aktif: 210, selesai: 130 },
  { month: 'Jun', aktif: 130, selesai: 290 },
  { month: 'Jul', aktif: 490, selesai: 295 },
  { month: 'Aug', aktif: 160, selesai: 480 },
  { month: 'Sep', aktif: 210, selesai: 220 },
  { month: 'Oct', aktif: 220, selesai: 360 },
  { month: 'Nov', aktif: 280, selesai: 190 },
  { month: 'Dec', aktif: 190, selesai: 270 }
];

const StatistikPeserta = () => {
  return (
    <div className="card bg-white mt-6 rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 px-10 mt-10">
        <h3 className="text-xl font-semibold text-gray-900">Statistik Peserta</h3>

        <div className="flex items-center gap-6">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-sm text-gray-600">Selesai</span>
            </div>
          </div>
          {/* Select Dropdown */}
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, left: 0, right: 20, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              className="text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 500]}
              tickCount={6}
              className="text-xs"
            />
            <Line
              type="monotone"
              dataKey="aktif"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="selesai"
              stroke="#2DD4BF"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#2DD4BF', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatistikPeserta;
