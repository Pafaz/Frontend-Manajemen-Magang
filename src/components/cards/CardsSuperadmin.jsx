import React from 'react';

const Dashboard = () => {
  const statsData = [
    {
      title: "Jumlah Perusahaan",
      count: "10",
      subtitle: "Perusahaan",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      title: "Jumlah Cabang", 
      count: "10",
      subtitle: "Cabang",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      title: "Jumlah Mitra",
      count: "10", 
      subtitle: "Mitra",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-800"
    },
    {
      title: "Jumlah Admin",
      count: "10",
      subtitle: "Orang", 
      bgColor: "bg-gradient-to-br from-blue-700 to-blue-900"
    },
    {
      title: "Jumlah Peserta Magang",
      count: "10",
      subtitle: "Orang",
      bgColor: "bg-gradient-to-br from-indigo-600 to-indigo-800"
    },
    {
      title: "Jumlah Mentor",
      count: "10", 
      subtitle: "Orang",
      bgColor: "bg-gradient-to-br from-indigo-700 to-indigo-900"
    }
  ];

  return (
    <div className="bg-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 pb-20 shadow-sm border border-gray-100 relative">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="/api/placeholder/64/64" 
                alt="Gojo Satoru" 
                className="w-12 h-12 rounded-xl object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 bg-white rounded-xl items-center justify-center text-blue-600 font-bold text-lg hidden">
                GS
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Selamat Pagi, Mr Gojo Satoru!
              </h1>
              <p className="text-gray-500 text-sm">
                Kelola perusahaan dengan baik dan benar
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Overlapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 -mt-12 relative z-20">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} w-full h-[120px] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer relative`}
            >
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-xs leading-tight">
                  {stat.title}
                </h3>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-white">
                    {stat.count} {stat.subtitle}
                  </div> 
                </div>
              </div>
              
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <div className="w-full h-full bg-white rounded-full transform translate-x-6 -translate-y-6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
