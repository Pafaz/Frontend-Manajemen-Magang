import React from 'react';

const CountCard = ({ icon, count, label, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-start">
      <div className="flex items-center mb-2">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-800">{count}</div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-3 w-full">
        <div className="text-xs text-blue-500 hover:underline cursor-pointer">view all</div>
      </div>
    </div>
  );
};

export default function CountCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <CountCard 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>}
        count="50"
        label="Jumlah Mentor"
        color="bg-blue-100"
      />
      <CountCard 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>}
        count="50"
        label="Jumlah Pengajar Junior"
        color="bg-indigo-100"
      />
      <CountCard 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.69-.1-1.021A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>}
        count="50"
        label="Jumlah Diklat"
        color="bg-yellow-100"
      />
      <CountCard 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>}
        count="50"
        label="Jumlah Mitra"
        color="bg-pink-100"
      />
    </div>
  );
}