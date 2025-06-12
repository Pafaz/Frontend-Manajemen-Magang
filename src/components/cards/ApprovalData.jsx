import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-lg">
        {/* Tanggal */}
        <div className="flex flex-col">
        <h2 className="text-2xl font-bold">
          Today, {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            })}
        </h2>

          <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer at risus nec justo tincidunt tempor.</p>
        </div>
        
        {/* Statistik Cards - Reduced Font Size */}
        <div className="flex gap-4">
          {/* Total Pengajuan Card */}
          <div className="bg-white rounded-lg p-4 shadow-md flex items-start w-48">
            <div className="bg-green-500 rounded-full p-2 mr-3">
              <i className="bi bi-file-earmark-plus text-white" style={{ fontSize: '20px' }}></i> {/* Bootstrap Icon */}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs">Total<br />Pengajuan</h3>
              <p className="text-lg font-bold mt-2">54 Orang</p>
            </div>
          </div>

          {/* Pengajuan Magang Card */}
          <div className="bg-white rounded-lg p-4 shadow-md flex items-start w-48">
            <div className="bg-orange-400 rounded-full p-2 mr-3">
              <i className="bi bi-person-badge text-white" style={{ fontSize: '20px' }}></i> {/* Bootstrap Icon */}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs">Pengajuan<br />Magang</h3>
              <p className="text-lg font-bold mt-2">44 Orang</p>
            </div>
          </div>

          {/* Pengajuan Izin/Sakit Card */}
          <div className="bg-white rounded-lg p-4 shadow-md flex items-start w-48">
            <div className="bg-red-500 rounded-full p-2 mr-3">
              <i className="bi bi-person-x text-white" style={{ fontSize: '20px' }}></i> {/* Bootstrap Icon */}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs">Pengajuan<br />Izin/Sakit</h3>
              <p className="text-lg font-bold mt-2">10 Orang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
