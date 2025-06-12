import React from 'react';

export default function SummaryCards({summary}) {
  
  const summaryData = [
    {
      title: 'Jumlah Admin',
      count: summary.total_admin || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
          <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
          <path d="M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 016.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z"></path>
        </svg>
      ),
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Jumlah Mentor',
      count: summary.total_mentor || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Jumlah Divisi',
      count: summary.total_divisi || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
        </svg>
      ),
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Jumlah Peserta Magang',
      count: summary.total_peserta || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="10" r="3"></circle>
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
          <path d="M18.336 14.62a13.765 13.765 0 0 0-3.299-1.9 3.532 3.532 0 0 0 1.07-3.32"></path>
          <path d="M5.664 14.62a13.765 13.765 0 0 1 3.299-1.9 3.532 3.532 0 0 1-1.07-3.32"></path>
        </svg>
      ),
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6">
        {summaryData.map((item, index) => (
          <div 
            key={index}
              className="bg-white rounded-xl border border-slate-400/[0.5] p-4 flex flex-col transform transition-all duration-300"
          >
            <div className="flex items-start mb-10">
              <div className={`${item.bgColor} p-3 rounded-lg mr-3`}>
                {item.icon}
              </div>
              <h2 className="text-2xl font-semibold">{item.count}</h2>
            </div>
            <div className="text-gray-400 text-sm">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}