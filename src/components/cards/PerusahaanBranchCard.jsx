import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from "lucide-react";

function TablePerusahaan({ data, searchTerm, selectedLocation }) {
  const navigate = useNavigate();

  const handleDetailClick = (id) => {
    navigate('/superadmin/MenuPerusahaan', { state: { companyId: id } });
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = selectedLocation === "" || item.lokasi === selectedLocation;
    return matchSearch && matchLocation;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perusahaan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lokasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah Cabang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah Peserta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal Daftar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover"
                        src={item.img} 
                        alt={item.nama}
                        onError={(e) => {
                          // Fallback ke inisial jika gambar gagal dimuat
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {item.nama.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.nama}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.lokasi}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                  {item.jml_cabang}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                  {item.jml_peserta}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.tanggal_daftar).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleDetailClick(item.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada data yang ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ApprovalTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dataPerusahaan, setDataPerusahaan] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Data dummy untuk perusahaan dengan gambar placeholder yang berfungsi
    const dummyPeserta = [
      {
        id: 1,
        nama: "PT. HUMMA TEKNOLOGI INDONESIA",
        lokasi: "Malang, Jawa Timur",
        jml_cabang: "12",
        jml_peserta: "300",
        img: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=HT",
        tanggal_daftar: "2024-01-15"
      },
      {
        id: 2,
        nama: "PT. INDOSAT OOREDOO HUTCHISON",
        lokasi: "Jakarta, DKI Jakarta",
        jml_cabang: "8",
        jml_peserta: "150",
        img: "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=IO",
        tanggal_daftar: "2024-02-10"
      },
      {
        id: 3,
        nama: "PT. BANK CENTRAL ASIA TBK",
        lokasi: "Surabaya, Jawa Timur",
        jml_cabang: "25",
        jml_peserta: "500",
        img: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=BCA",
        tanggal_daftar: "2024-01-20"
      },
      {
        id: 4,
        nama: "PT. TELKOM INDONESIA PERSERO",
        lokasi: "Bandung, Jawa Barat",
        jml_cabang: "15",
        jml_peserta: "250",
        img: "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=TI",
        tanggal_daftar: "2024-03-05"
      },
      {
        id: 5,
        nama: "PT. GOJEK INDONESIA",
        lokasi: "Jakarta, DKI Jakarta",
        jml_cabang: "10",
        jml_peserta: "180",
        img: "https://via.placeholder.com/40x40/059669/FFFFFF?text=GO",
        tanggal_daftar: "2024-02-20"
      },
      {
        id: 6,
        nama: "PT. TOKOPEDIA",
        lokasi: "Jakarta, DKI Jakarta",
        jml_cabang: "5",
        jml_peserta: "120",
        img: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=TP",
        tanggal_daftar: "2024-03-10"
      },
      {
        id: 7,
        nama: "PT. SHOPEE INDONESIA",
        lokasi: "Banjarnegara, Jawa Timur",
        jml_cabang: "7",
        jml_peserta: "200",
        img: "https://via.placeholder.com/40x40/EC4899/FFFFFF?text=SP",
        tanggal_daftar: "2024-03-15"
      },
      {
        id: 8,
        nama: "PT. GRAB INDONESIA",
        lokasi: "Surabaya, Jawa Timur",
        jml_cabang: "6",
        jml_peserta: "140",
        img: "https://via.placeholder.com/40x40/6366F1/FFFFFF?text=GR",
        tanggal_daftar: "2024-04-01"
      }
    ];

    setDataPerusahaan(dummyPeserta);

    // Extract unique locations for filter dropdown
    const uniqueLocations = [...new Set(dummyPeserta.map(item => item.lokasi))];
    setLocations(uniqueLocations);
  }, []);

  // Statistik untuk ditampilkan
  const totalPerusahaan = dataPerusahaan.length;
  const totalPeserta = dataPerusahaan.reduce((sum, item) => sum + parseInt(item.jml_peserta), 0);
  const totalCabang = dataPerusahaan.reduce((sum, item) => sum + parseInt(item.jml_cabang), 0);

  // Data yang sudah difilter untuk statistik
  const filteredData = dataPerusahaan.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = selectedLocation === "" || item.lokasi === selectedLocation;
    return matchSearch && matchLocation;
  });

  return (
    <div className="w-full space-y-6">
      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">
                Manajemen Perusahaan
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan {filteredData.length} dari {totalPerusahaan} perusahaan
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama perusahaan..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </span>
              </div>

              {/* Location Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48"
                >
                  <option value="">Semua Lokasi</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <MapPin size={16} />
                </span>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <TablePerusahaan
          data={dataPerusahaan}
          searchTerm={searchTerm}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}