import React from 'react';

export default function DivisiTerdataList() {
  const divisiData = [
    'IT Support',
    'Web Developer',
    'UI/UX Designer',
    'Mobile Developer',
    'Finance & Accounting',
    'Software Engineering',
    'Customer Service',
    'Data Analyst & BI',
    'Digital Marketing',
    'Operasional & Logistik',
    'Social Media Management',
    'Game Design & Development'
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Divisi Terdata</h1>
        <p className="text-xs text-gray-500">Data divisi terdaftar</p>
      </div>

      {/* List Divisi */}
      <div className="max-h-80 overflow-y-auto scrollbar-hide space-y-2">
        {divisiData.map((divisi, index) => (
          <div key={index} className="flex items-center">
            <span className="text-xs text-gray-500 w-5 mr-3">{index + 1}</span>
            <span className="text-sm text-gray-700">{divisi}</span>
          </div>
        ))}
      </div>
    </div>
  );
}