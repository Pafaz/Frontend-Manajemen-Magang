import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Title from "../Title";
import axios from "axios";

const StaticAbsensiPerusahaan = ({ cabangs }) => {
  const [absensiCabang, setAbsensiCabang] = useState([]);
  const [selectedCabangId, setSelectedCabangId] = useState(cabangs?.[0]?.id || "");
  
  const getAbsensiCabang = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/absensi/rekap/${selectedCabangId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;

      const hadir = data.map(item => item.hadir);
      const alfa = data.map(item => item.alfa);
      const izinSakit = data.map(item => item.izin + item.sakit);
      
      setAbsensiCabang([
        { name: "Hadir", data: hadir },
        { name: "Alpha", data: alfa },
        { name: "Izin/Sakit", data: izinSakit }
      ]);

    } catch (err) {
      console.error("Error fetching absensi:", err);
    }
  };


  useEffect(() => {
    if (selectedCabangId) {
      getAbsensiCabang();
    }
  }, [selectedCabangId]);

  // Dummy fallback jika API belum siap
  const dummySeries = [
    { name: "Hadir", data: [3, 4, 5, 6, 7, 8, 9, 7, 6, 5, 4, 5] },
    { name: "Alpha", data: [1, 1, 2, 1, 2, 1, 2, 3, 2, 3, 2, 3] },
    { name: "Izin/Sakit", data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
  ];

  const categories = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    colors: ["#27CFA7", "#1E40AF", "#F1C40F"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories },
    yaxis: {
      min: 0,
      max: 10,
    },
    legend: { show: false },
  };

  const renderCustomLegend = () => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#27CFA7" }}></span>
        <span className="text-sm">Hadir</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#1E40AF" }}></span>
        <span className="text-sm">Alpha</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#F1C40F" }}></span>
        <span className="text-sm">Izin/Sakit</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-3">
        <Title className="ml-5">Statistik Presensi</Title>
        <div className="flex items-center space-x-3">
          {renderCustomLegend()}
          <select
            className="border border-gray-300/[0.5] rounded-lg px-2 py-0.5 text-sm text-gray-500 z-5 focus:outline-none shadow-sm"
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
      </div>


        <Chart
          options={options}
          series={absensiCabang.length ? absensiCabang : dummySeries}
          type="area"
          height={300}
        />
    </>
  );
};

export default StaticAbsensiPerusahaan;
