import React, { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Download, 
  Filter, 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Search, 
  ChevronDown,
  X 
} from "lucide-react";

export default function AbsensiTable() {
  // State management
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMetode, setSelectedMetode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get token from localStorage with safe access
  const token = typeof window !== 'undefined' ? localStorage?.getItem("token") : null;

  // API endpoints
  const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:3000/api";
  const FILE_URL = import.meta?.env?.VITE_API_URL_FILE || "http://localhost:3000";

  // Data filtering logic
  const filteredData = data.filter(item => {
    // Filter by status
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    
    // Filter by metode
    const matchesMetode = !selectedMetode || 
      item.metode.toLowerCase().includes(selectedMetode.toLowerCase());
    
    // Filter by search term (nama siswa)
    const matchesSearch = !searchTerm || 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by single date
    if (selectedDate && !selectedStartDate && !selectedEndDate) {
      const itemDate = new Date(item.tanggal);
      const filterDate = new Date(selectedDate);
      const sameDate = itemDate.toDateString() === filterDate.toDateString();
      return matchesStatus && matchesMetode && matchesSearch && sameDate;
    }
    
    // Filter by date range
    if (selectedStartDate && selectedEndDate) {
      const itemDate = new Date(item.tanggal);
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);
      const inRange = itemDate >= startDate && itemDate <= endDate;
      return matchesStatus && matchesMetode && matchesSearch && inRange;
    }
    
    return matchesStatus && matchesMetode && matchesSearch;
  });

  // Statistics calculations
  const statistics = {
    totalAbsensi: data.length,
    totalHadir: data.filter(item => item.status === "Hadir").length,
    totalAlpha: data.filter(item => item.status === "Alpha").length,
    totalIzinSakit: data.filter(item => 
      item.status === "Izin" || item.status === "Sakit"
    ).length,
  };

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFilterInfo = () => {
    let filterInfo = [];
    
    if (selectedDate) {
      filterInfo.push(`Tanggal: ${formatDate(selectedDate)}`);
    }
    
    if (selectedStartDate && selectedEndDate) {
      filterInfo.push(`Periode: ${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`);
    }
    
    if (selectedStatus) {
      filterInfo.push(`Status: ${selectedStatus}`);
    }
    
    if (selectedMetode) {
      filterInfo.push(`Metode: ${selectedMetode}`);
    }
    
    if (searchTerm) {
      filterInfo.push(`Pencarian: "${searchTerm}"`);
    }
    
    return filterInfo.length > 0 
      ? `<p><strong>Filter yang Diterapkan:</strong> ${filterInfo.join(', ')}</p>`
      : '';
  };

  // Helper functions for PDF generation
  const generatePDF = () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Generate HTML content for PDF
      const htmlContent = generatePrintableHTML();
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Gagal mengexport PDF. Silakan coba lagi.');
    }
  };

  const generatePrintableHTML = () => {
    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Absensi - ${currentDate}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
          }
          .stat-item {
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          .status-hadir { color: #16a34a; font-weight: bold; }
          .status-terlambat { color: #f59e0b; font-weight: bold; }
          .status-izin { color: #f97316; font-weight: bold; }
          .status-sakit { color: #f97316; font-weight: bold; }
          .status-alpha { color: #dc2626; font-weight: bold; }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LAPORAN DATA ABSENSI</h1>
          <p>Tanggal Cetak: ${currentDate}</p>
          ${getFilterInfo()}
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${statistics.totalAbsensi}</div>
            <div>Total Absensi</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color: #16a34a;">${statistics.totalHadir}</div>
            <div>Total Hadir</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color: #f97316;">${statistics.totalIzinSakit}</div>
            <div>Total Izin/Sakit</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color: #dc2626;">${statistics.totalAlpha}</div>
            <div>Total Alpha</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Tanggal</th>
              <th>Jam Masuk</th>
              <th>Istirahat</th>
              <th>Kembali</th>
              <th>Pulang</th>
              <th>Metode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.nama}</td>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.jam_masuk}</td>
                <td>${item.jam_istirahat}</td>
                <td>${item.jam_kembali}</td>
                <td>${item.jam_pulang}</td>
                <td>${item.metode}</td>
                <td class="status-${item.status.toLowerCase()}">${item.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Total ${filteredData.length} data dari ${data.length} data absensi</p>
          <p>Dokumen ini digenerate otomatis oleh sistem pada ${new Date().toLocaleString('id-ID')}</p>
        </div>
      </body>
      </html>
    `;
  };

  const showLoadingAlert = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => window.Swal.showLoading()
      });
    }
  };

  const closeAlert = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.close();
    }
  };

  const getProfileImage = (peserta) => {
    const profilePhoto = peserta.foto?.find(f => f.type === 'profile');
    return profilePhoto 
      ? `${FILE_URL}/storage/${profilePhoto.path}`
      : "/api/placeholder/40/40";
  };

  const mapKehadiranData = (peserta) => {
    if (!peserta.kehadiran || !Array.isArray(peserta.kehadiran)) return [];
    
    return peserta.kehadiran.map(item => ({
      id: `kehadiran-${item.id}`,
      tanggal: item.tanggal,
      jam_masuk: item.jam_masuk || "-",
      jam_istirahat: item.jam_istirahat || "-",
      jam_kembali: item.jam_kembali || "-",
      jam_pulang: item.jam_pulang || "-",
      metode: item.metode || "-",
      status: item.status_kehadiran === 0 ? "Hadir" : "Terlambat",
      status_kehadiran: item.status_kehadiran === 0 ? "Hadir" : "Terlambat",
      nama: peserta.nama || "Unknown",
      image: getProfileImage(peserta)
    }));
  };

  const mapAbsensiData = (peserta) => {
    if (!peserta.absensi || !Array.isArray(peserta.absensi)) return [];
    
    return peserta.absensi.map(item => ({
      id: `absensi-${item.id}`,
      tanggal: item.tanggal,
      jam_masuk: "-",
      jam_istirahat: "-",
      jam_kembali: "-",
      jam_pulang: "-",
      metode: "-",
      status: item.status === "sakit" ? "Sakit" : 
              item.status === "izin" ? "Izin" : "Alpha",
      status_kehadiran: item.status,
      nama: peserta.nama || "Unknown",
      image: getProfileImage(peserta)
    }));
  };

  // Main data fetching function
  const fetchAbsensi = async () => {
    try {
      showLoadingAlert();
      setLoading(true);
      
      const response = await fetch(`${API_URL}/kehadiran-peserta-cabang`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      console.log("Kehadiran response:", result);
      
      const responseData = result.data || [];
      let combinedData = [];
      
      // Process data from each peserta
      responseData.forEach(peserta => {
        const kehadiranData = mapKehadiranData(peserta);
        const absensiData = mapAbsensiData(peserta);
        
        combinedData = [...combinedData, ...kehadiranData, ...absensiData];
      });
      
      // Sort by date (newest first)
      combinedData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      
      console.log("Combined data:", combinedData);
      setData(combinedData);
      
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      setData([]);
    } finally {
      setLoading(false);
      closeAlert();
    }
  };

  // Filter options
  const statusOptions = [...new Set(data.map(item => item.status))];
  const metodeOptions = [...new Set(
    data.map(item => item.metode).filter(metode => metode !== "-")
  )];

  // Event handlers
  const clearFilters = () => {
    setSelectedStatus("");
    setSelectedMetode("");
    setSelectedDate(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSearchTerm("");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // Clear date range when single date is selected
    if (e.target.value) {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    }
  };

  const handleStartDateChange = (e) => {
    setSelectedStartDate(e.target.value);
    // Clear single date when range is selected
    if (e.target.value) {
      setSelectedDate(null);
    }
  };

  const handleEndDateChange = (e) => {
    setSelectedEndDate(e.target.value);
    // Clear single date when range is selected
    if (e.target.value) {
      setSelectedDate(null);
    }
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }
    generatePDF();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Hadir":
        return "bg-green-100 text-green-800";
      case "Terlambat":
        return "bg-yellow-100 text-yellow-800";
      case "Izin":
      case "Sakit":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  // Effects
  useEffect(() => {
    fetchAbsensi();
  }, []);

  // Render components
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <span className={`text-3xl font-bold text-${color}-600`}>{value}</span>
          <p className="text-gray-400 text-xs mt-1">kali</p>
        </div>
        <Icon size={32} className={`text-${color}-600`} />
      </div>
    </div>
  );

  const FilterSection = () => (
    showFilter && (
      <div className="flex justify-end mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 text-[#344054] rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={selectedMetode}
            onChange={(e) => setSelectedMetode(e.target.value)}
            className="px-3 py-2 text-sm border text-[#344054] border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Metode</option>
            {metodeOptions.map((metode) => (
              <option key={metode} value={metode}>
                {metode}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  );

  const TableHeader = () => (
    <thead className="bg-gray-50">
      <tr>
        {["No", "Siswa", "Tanggal", "Jam Masuk", "Istirahat", "Kembali", "Pulang", "Metode", "Status"].map((header) => (
          <th 
            key={header}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );

  const TableRow = ({ item, index }) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={item.image}
              alt={item.nama}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {item.nama}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(item.tanggal)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.jam_masuk}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.jam_istirahat}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.jam_kembali}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.jam_pulang}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.metode}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Absensi" 
          value={statistics.totalAbsensi} 
          icon={Clock} 
          color="blue" 
        />
        <StatCard 
          title="Total Hadir" 
          value={statistics.totalHadir} 
          icon={CheckCircle} 
          color="green" 
        />
        <StatCard 
          title="Total Izin/Sakit" 
          value={statistics.totalIzinSakit} 
          icon={FileText} 
          color="amber" 
        />
        <StatCard 
          title="Total Alpa" 
          value={statistics.totalAlpha} 
          icon={AlertTriangle} 
          color="red" 
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">Data Absensi</h2>
              <p className="text-[#667085] text-sm mt-1">
                Kelola data absensi dengan lebih fleksibel!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="date"
                value={selectedDate || ''}
                onChange={handleDateChange}
                className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm transition-colors"
                title="Filter berdasarkan tanggal tertentu"
              />
              
              <button 
                onClick={handleExport}
                disabled={filteredData.length === 0}
                className={`flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm shadow-sm transition-colors ${
                  filteredData.length === 0 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-[#344054] hover:bg-[#0069AB] hover:text-white'
                }`}
                title={filteredData.length === 0 ? 'Tidak ada data untuk diexport' : 'Export data ke PDF'}
              >
                <Download size={16} />
                Export PDF
              </button>
              
              <button
                onClick={toggleFilter}
                className={`flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white transition-colors ${
                  showFilter ? 'bg-[#0069AB] text-white' : ''
                }`}
                title="Tampilkan/sembunyikan filter lanjutan"
              >
                <Filter size={16} />
                Filter
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {/* Filter Section */}
          <FilterSection />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <TableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <TableRow key={item.id} item={item} index={index} />
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data ditemukan</h3>
            <p className="text-gray-500 mb-4">
              {data.length === 0 
                ? "Belum ada data absensi yang tersedia"
                : "Coba ubah filter atau kata kunci pencarian Anda"
              }
            </p>
            {(selectedStatus || selectedMetode || selectedDate || selectedStartDate || selectedEndDate || searchTerm) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <X size={16} />
                Hapus Semua Filter
              </button>
            )}
          </div>
        )}
        
        {/* Footer Information */}
        <div className="bg-white px-4 py-3 flex items-center border-t border-gray-200 sm:px-6">
          <div>
            <p className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">{filteredData.length}</span> data 
              dari total <span className="font-medium">{data.length}</span> data absensi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}