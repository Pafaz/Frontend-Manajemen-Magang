import React, { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash2, Tag } from "lucide-react";
import { Link } from 'react-router-dom';

function TablePostingan({ data, searchTerm, selectedDate, selectedCategory }) {
  const handleEditClick = (id) => {
    console.log("Edit posting with ID:", id);
    // Navigate to edit page
  };

  const handleDeleteClick = (id) => {
    console.log("Delete posting with ID:", id);
    // Show confirmation dialog
  };

  const filteredData = data.filter((item) => {
    const matchSearch = item.judul_postingan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = selectedDate === "" || item.tanggal_publikasi === selectedDate;
    const matchCategory = selectedCategory === "" || item.tag.includes(selectedCategory);
    return matchSearch && matchDate && matchCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      MachineLearning: "bg-blue-100 text-blue-800",
      FutureTech: "bg-purple-100 text-purple-800",
      Cybersecurity: "bg-green-100 text-green-800",
      RemoteWork: "bg-orange-100 text-orange-800",
      Blockchain: "bg-indigo-100 text-indigo-800",
      DataSecurity: "bg-red-100 text-red-800",
      CloudComputing: "bg-cyan-100 text-cyan-800",
      Azure: "bg-blue-100 text-blue-800",
      QuantumComputing: "bg-purple-100 text-purple-800",
      Research: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80">Judul Postingan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Tanggal Publikasi</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-96">Tag</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-80 break-words">{item.judul_postingan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.tanggal_publikasi).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 max-w-96">
                    {item.tag.map((tag, tagIndex) => (
                      <span key={tagIndex} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditClick(item.id)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <p>Tidak ada postingan yang ditemukan</p>
                  <p className="text-xs mt-1">Coba ubah kata kunci pencarian atau filter</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ManagementPostingan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dataPostingan, setDataPostingan] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Define categories array
  const categories = ["MachineLearning", "FutureTech", "Cybersecurity", "RemoteWork", "Blockchain", "DataSecurity", "CloudComputing", "Azure", "QuantumComputing", "Research"];

  useEffect(() => {
    // Data dummy untuk postingan berdasarkan gambar yang diberikan
    const dummyPostingan = [
      {
        id: 1,
        judul_postingan: "The Rise of Artificial Intelligence in Everyday Life",
        tanggal_publikasi: "2024-01-22",
        jumlah_kata: 1230,
        tag: ["MachineLearning", "FutureTech"],
      },
      {
        id: 2,
        judul_postingan: "Cybersecurity in the Age of Remote Work",
        tanggal_publikasi: "2024-01-22",
        jumlah_kata: 1230,
        tag: ["Cybersecurity", "RemoteWork"],
      },
      {
        id: 3,
        judul_postingan: "How Blockchain is Changing Data Integrity",
        tanggal_publikasi: "2024-01-22",
        jumlah_kata: 1230,
        tag: ["Blockchain", "DataSecurity"],
      },
      {
        id: 4,
        judul_postingan: "The Evolution of Cloud Computing Services",
        tanggal_publikasi: "2024-01-22",
        jumlah_kata: 1230,
        tag: ["CloudComputing", "Azure"],
      },
      {
        id: 5,
        judul_postingan: "Why Quantum Computing Matters More Than Ever",
        tanggal_publikasi: "2024-01-22",
        jumlah_kata: 1230,
        tag: ["QuantumComputing", "Research"],
      },
      {
        id: 6,
        judul_postingan: "The Role of 5G in Transforming Connectivity",
        tanggal_publikasi: "2024-01-22",
        jumlah_kata: 1230,
        tag: ["MachineLearning", "FutureTech","MachineLearning", "FutureTech"],
      },
      {
        id: 7,
        judul_postingan: "Digital Transformation in Healthcare Industry",
        tanggal_publikasi: "2024-01-23",
        jumlah_kata: 1450,
        tag: ["FutureTech", "MachineLearning"],
      },
      {
        id: 8,
        judul_postingan: "Sustainable Technology Solutions for Smart Cities",
        tanggal_publikasi: "2024-01-23",
        jumlah_kata: 1320,
        tag: ["FutureTech", "Research"],
      },
      {
        id: 9,
        judul_postingan: "Edge Computing: The Next Frontier",
        tanggal_publikasi: "2024-01-24",
        jumlah_kata: 1180,
        tag: ["CloudComputing", "FutureTech", "MachineLearning", "Research"],
      },
      {
        id: 10,
        judul_postingan: "Automation and Future of Work",
        tanggal_publikasi: "2024-01-24",
        jumlah_kata: 1390,
        tag: ["MachineLearning", "RemoteWork"],
      },
    ];

    setDataPostingan(dummyPostingan);
  }, []);

  // Statistik untuk ditampilkan
  const totalPostingan = dataPostingan.length;

  // Data yang sudah difilter untuk statistik
  const filteredData = dataPostingan.filter((item) => {
    const matchSearch = item.judul_postingan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = selectedDate === "" || item.tanggal_publikasi === selectedDate;
    const matchCategory = selectedCategory === "" || item.tag.includes(selectedCategory);
    return matchSearch && matchDate && matchCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSelectedCategory("");
    setShowFilterMenu(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">Management Postingan</h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan {filteredData.length} dari {totalPostingan} postingan
              </p>
            </div>

            {/* Filter and Add Post Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex items-center gap-2 h-10 px-3 py-1.5 text-sm border rounded-lg font-medium transition-colors
      ${showFilterMenu ? "bg-white border-blue-500 text-gray-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <Filter size={16} />
                Filter
                <svg className={`w-4 h-4 transition-transform ${showFilterMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Add New Post Button */}
              <Link to="/superadmin/Create-Post">
  <button className="flex items-center gap-2 h-10 px-3 py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
    <span className="text-base leading-none">+</span>
    Buat Postingan
  </button>
</Link>
            </div>
          </div>

          {/* Filter Inputs - Appears below when filter button is clicked */}
          {showFilterMenu && (
            <div className="rounded-lg ">
              <div className="flex justify-end mt-3">
                {/* Filter Controls - Right Side */}
                <div className="flex gap-4 items-center">
                  {/* Search Input */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari berdasarkan judul..."
                        className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px] w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search size={16} />
                      </span>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <input
                      type="date"
                      className="px-3 py-2 text-sm text-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-auto"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <TablePostingan data={dataPostingan} searchTerm={searchTerm} selectedDate={selectedDate} selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}