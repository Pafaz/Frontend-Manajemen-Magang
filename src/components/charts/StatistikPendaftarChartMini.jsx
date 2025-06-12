import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StatistikPendaftarChartMini = ({cabangs}) => {
  const [selectedCabangId, setSelectedCabangId] = useState(cabangs?.[0]?.id || "");
  
  // Data untuk setiap cabang
  const dataCabangA = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 30 },
    { month: "Mar", value: 15 },
    { month: "Apr", value: 90 },
    { month: "May", value: 85 },
    { month: "Jun", value: 160 },
    { month: "Jul", value: 170 },
    { month: "Aug", value: 70 },
    { month: "Sept", value: 190 },
    { month: "Oct", value: 115 },
    { month: "Nov", value: 205 },
    { month: "Dec", value: 220 },
  ];

  const dataCabangB = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 40 },
    { month: "Mar", value: 35 },
    { month: "Apr", value: 60 },
    { month: "May", value: 55 },
    { month: "Jun", value: 110 },
    { month: "Jul", value: 120 },
    { month: "Aug", value: 80 },
    { month: "Sept", value: 150 },
    { month: "Oct", value: 95 },
    { month: "Nov", value: 180 },
    { month: "Dec", value: 210 },
  ];

  // State untuk cabang yang dipilih
  const [selectedCabang, setSelectedCabang] = useState("Cabang A");
  
  // Pilih data berdasarkan cabang
  const data = selectedCabang === "Cabang A" ? dataCabangA : dataCabangB;

  // Mengubah cabang ketika dropdown dipilih
  const handleCabangChange = (event) => {
    setSelectedCabang(event.target.value);
  };

  
  return (
    <div className="w-full px-2 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base ml-4 font-bold text-slate-900">Statistik Pendaftar</h2>
        <select
          className="text-xs border border-gray-300 rounded px-2 py-1 shadow-sm"
          value={selectedCabangId}
          onChange={(e) => setSelectedCabangId(e.target.value)}
        >
          {cabangs.map((cabang) => (
              <option key={cabang.id} value={cabang.id}>
                {cabang.nama}
              </option>
            ))}
        </select>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
            />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatistikPendaftarChartMini;
