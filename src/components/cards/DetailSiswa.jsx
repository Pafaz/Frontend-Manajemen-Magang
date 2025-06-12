import React, { useState } from "react";
import Chart from "react-apexcharts";
import { BsCalendarCheck, BsCheckCircle, BsAward, BsPeople, BsExclamationOctagonFill, BsArrowLeft, BsPatchCheckFill } from "react-icons/bs";

export default function DetailPeserta() {
  const profile = {
    name: "Anya Forger",
    role: "UI/UX Designer",
    sekolah: "SMK NEGERI 12 MALANG",
    nisn: "220411100120",
    image: "/assets/img/Profil.png",
    email: "ini@gmail.com",
    company: "PT. HUMMA TECHNOLOGY INDONESIA",
    branch: "Malang, Jawa Timur",
    rfid: "0002289554",
    mentor: "Gatau Siapa",
    internshipPeriod: "15 Juli - 15 Agustus 2025",
  };

  const statistics = [
    {
      title: "Total Absensi",
      count: 5,
      color: "#0d6efd",
      softColor: "#e7f1ff",
      icon: <BsCalendarCheck />,
      chartData: [5, 10, 2, 20, 50, 4],
    },
    {
      title: "Total Hadir",
      count: 5,
      color: "#198754",
      softColor: "#d1f2e7",
      icon: <BsCheckCircle />,
      chartData: [5, 20, 2, 20, 10, 4],
    },
    {
      title: "Total Izin/Sakit",
      count: 5,
      color: "#fd7e14",
      softColor: "#ffe5d0",
      icon: <BsAward />,
      chartData: [2, 4, 6, 8, 10, 12],
    },
    {
      title: "Total Alpa",
      count: 5,
      color: "#dc3545",
      softColor: "#ffe0e0",
      icon: <BsPeople />,
      chartData: [1, 3, 5, 7, 9, 11],
    },
  ];

  const statusSP = {
    level: "SP 1", // Add the SP level if there is one, or leave empty for no SP
    description: "Peserta ini terdeteksi mendapatkan SP 1", // Will be dynamically generated
    hasSP: true, // Set to false if student has no SP
  };

  // Example of how you might want to set it for a student without SP:
  // const statusSP = {
  //   level: "",
  //   description: "",
  //   hasSP: false,
  // };

  const jurnalData = {
    2024: {
      mengisi: [10, 8, 12, 9, 15, 13, 14, 16, 12, 11, 9, 10],
      tidakMengisi: [2, 4, 1, 3, 0, 2, 1, 0, 3, 2, 4, 3],
    },
    2025: {
      mengisi: [9, 7, 11, 10, 14, 12, 13, 15, 11, 10, 8, 9],
      tidakMengisi: [3, 5, 2, 2, 1, 3, 2, 1, 4, 3, 5, 4],
    },
  };

  const [selectedYear, setSelectedYear] = useState(2025);

  const chartOptions = {
    chart: { id: "jurnal-chart", toolbar: { show: false } },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    colors: ["#81ACFC", "#0069AB"],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    grid: { strokeDashArray: 5 },
  };

  const chartSeries = [
    { name: "Mengisi", data: jurnalData[selectedYear].mengisi },
    { name: "Tidak Mengisi", data: jurnalData[selectedYear].tidakMengisi },
  ];

  const routeProjects = [
    { tahap: "Tahap Pengenalan", status: "Selesai", startDate: "12 Juli 2024", endDate: "12 Okt 2024", image: "/assets/img/Cover.png" },
    { tahap: "Tahap Pengenalan", status: "On Going", startDate: "12 Juli 2024", endDate: "12 Okt 2024", image: "/assets/img/Cover.png" },
    { tahap: "Coming Soon", status: "-", startDate: "-", endDate: "-", image: "/assets/img/Cover3.png" },
    { tahap: "Coming Soon", status: "-", startDate: "-", endDate: "-", image: "/assets/img/Cover3.png" },
  ];

  const handleBack = () => {
    // Navigate to the specified URL when back button is clicked
    window.location.href = "http://localhost:5173/perusahaan/peserta";
  };

  return (
    <div className="min-h-screen bg-[#F1F4FF] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-7xl p-8 rounded-2xl shadow-lg space-y-8 relative">
        {/* Back Button positioned at top-left corner */}
        <button onClick={handleBack} className="absolute top-4 left-4 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-3 transition duration-200">
          <BsArrowLeft size={24} />
        </button>

        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex items-center gap-6">
            <img src={profile.image} alt="Profile" className="w-28 h-28 rounded-full border-4 border-blue-400 object-cover" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">{profile.role}</span>
              </div>
              <div className="flex items-center gap-3">
                <h4 className="text-lg">{profile.sekolah}</h4> |{profile.nisn}
              </div>
              <div className="text-gray-600 text-sm space-y-2">
                <div className="flex">
                  <div className="w-40">Email</div>
                  <div>: {profile.email}</div>
                </div>
                <div className="flex">
                  <div className="w-40">Perusahaan</div>
                  <div>: {profile.company}</div>
                </div>
                <div className="flex">
                  <div className="w-40">Cabang</div>
                  <div>: {profile.branch}</div>
                </div>
                <div className="flex">
                  <div className="w-40">RFID</div>
                  <div>: {profile.rfid}</div>
                </div>
                <div className="flex">
                  <div className="w-40">Mentor</div>
                  <div>: {profile.mentor}</div>
                </div>
                <div className="flex">
                  <div className="w-40">Durasi Magang</div>
                  <div>: {profile.internshipPeriod}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistik Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statistics.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-md" style={{ backgroundColor: item.softColor }}>
                  {React.cloneElement(item.icon, { size: 20, color: item.color })}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: item.color }}>
                    {item.count} <span className="ml-1 text-xs">kali</span>
                  </div>
                  <div className="text-xs text-gray-400">{item.title}</div>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-20 h-14 opacity-80">
                <Chart
                  options={{
                    chart: { sparkline: { enabled: true } },
                    stroke: { curve: "smooth", width: 2 },
                    fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0, stops: [0, 100] } },
                    tooltip: { enabled: false },
                    colors: [item.color],
                  }}
                  series={[{ data: item.chartData }]}
                  type="area"
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          ))}

          {/* Card Status SP */}
          <div className="bg-white p-2 rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-l font-semibold">Status SP</h3>
            <div className="flex items-center gap-3 p-2 border rounded-xl">
              {statusSP.hasSP ? (
                <>
                  <div className="bg-yellow-100 p-3 rounded-xl flex items-center justify-center">
                    <BsExclamationOctagonFill className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">{statusSP.level}</h4>
                    <p className="text-[10px] text-gray-500">{statusSP.description || `Peserta ini terdeteksi mendapatkan ${statusSP.level}`}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-green-100 p-3 rounded-xl flex items-center justify-center">
                    <BsPatchCheckFill className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">Tidak Ada SP</h4>
                    <p className="text-[10px] text-gray-500">Peserta ini tidak terdeteksi SP!</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Jurnal dan Route Project */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h3 className="text-lg font-bold">Statistik Pengisian Jurnal</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-700">Mengisi</span>
                  <div className="w-3 h-3 rounded-full bg-red-500 ml-4"></div>
                  <span className="text-xs text-gray-700">Tidak Mengisi</span>
                </div>
                <select className="border rounded-md p-2 text-sm" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                  {Object.keys(jurnalData).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Chart options={chartOptions} series={chartSeries} type="bar" width="100%" height={300} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-1">Route Project</h3>
            <p className="text-sm text-gray-500 mb-4">Project yang diselesaikan</p>

            <div className="space-y-4">
              {routeProjects.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <img src={item.image} alt="Project Icon" className="w-12 h-12 rounded-md object-cover" />
                  <div className="flex-1 space-y-1">
                    {/* Ini baris tahap + status + endDate */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-semibold text-black">{item.tahap}</div>

                      <div className="flex items-center gap-2">
                        {item.status !== "-" && <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${item.status === "Selesai" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}>{item.status}</span>}
                        {item.endDate !== "-" && <div className="text-[9px] text-gray-400">{item.endDate}</div>}
                      </div>
                    </div>

                    {/* Ini baris startDate */}
                    <div className="text-xs text-gray-500">{item.startDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
