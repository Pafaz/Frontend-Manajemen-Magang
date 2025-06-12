import { Search } from "lucide-react";
import { useState } from "react";
import { CSVLink } from "react-csv";
// Jika menggunakan React Router, uncomment baris di bawah ini:
// import { useNavigate } from "react-router-dom";

export default function TrackRecordTable() {
  // Jika menggunakan React Router, uncomment baris di bawah ini:
  // const navigate = useNavigate();
  
  const trackRecordData = [
    { id: 1, name: "Gojo Satoru", date: "2025-04-01", project: "Mini Project 1", status: "Completed", image: "/api/placeholder/40/40" },
    { id: 2, name: "Nobara Kugisaki", date: "2025-04-02", project: "Mini Project 2", status: "In Progress", image: "/api/placeholder/40/40" },
    { id: 3, name: "Megumi Fushiguro", date: "2025-04-03", project: "Mini Project 3", status: "In Progress", image: "/api/placeholder/40/40" },
    { id: 4, name: "Maki Zenin", date: "2025-04-04", project: "Mini Project 4", status: "Completed", image: "/api/placeholder/40/40" },
    { id: 5, name: "Toge Inumaki", date: "2025-04-05", project: "Mini Project 5", status: "In Progress", image: "/api/placeholder/40/40" },
    { id: 6, name: "Panda", date: "2025-04-06", project: "Mini Project 6", status: "Completed", image: "/api/placeholder/40/40" },
    { id: 7, name: "Yuji Itadori", date: "2025-04-07", project: "Mini Project 7", status: "In Progress", image: "/api/placeholder/40/40" },
    { id: 8, name: "Kento Nanami", date: "2025-04-08", project: "Mini Project 8", status: "Completed", image: "/api/placeholder/40/40" },
    { id: 9, name: "Suguru Geto", date: "2025-04-09", project: "Mini Project 9", status: "In Progress", image: "/api/placeholder/40/40" },
    { id: 10, name: "Yuta Okkotsu", date: "2025-04-10", project: "Mini Project 10", status: "Completed", image: "/api/placeholder/40/40" },
    { id: 11, name: "Shoko Ieiri", date: "2025-04-11", project: "Mini Project 11", status: "In Progress", image: "/api/placeholder/40/40" },
    { id: 12, name: "Choso", date: "2025-04-12", project: "Mini Project 12", status: "Completed", image: "/api/placeholder/40/40" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const itemsPerPage = 10;

  const handleSortDate = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const filteredData = trackRecordData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Date", key: "date" },
    { label: "Project", key: "project" },
    { label: "Status", key: "status" },
  ];

  // Fungsi untuk mengarahkan ke halaman detail presentasi
  const viewDetail = (id) => {
    // Cara 1: Menggunakan window.location (JavaScript biasa)
    window.location.href = `/mentor/track-record/${id}`;
    
    // Cara 2: Jika menggunakan React Router, uncomment baris di bawah ini dan comment baris di atas
    // navigate(`/detail-presentasi/${id}`);
    
    // Cara 3: Jika menggunakan single page application tanpa router khusus
    // console.log(`View detail for record with ID: ${id}`);
    // setSelectedRecordId(id); // Jika menggunakan state untuk menampilkan detail dalam modal atau panel
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filter + Export */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:divide-x sm:divide-gray-300">
          {/* Filter Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 bg-white shadow-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="sm:pl-3">
            <CSVLink
              data={filteredData}
              headers={csvHeaders}
              filename="track-record.csv"
              className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Export CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white overflow-hidden p-4">
        {/* Table Head */}
        <div className="text-sm font-bold bg-white text-black flex py-2 border-b">
          <div className="w-1/5 px-2">Nama</div>
          <div
            className="w-1/5 px-2 cursor-pointer hover:underline"
            onClick={handleSortDate}
          >
            Tanggal {sortOrder === "asc" ? "↑" : "↓"}
          </div>
          <div className="w-1/5 px-2">Project</div>
          <div className="w-1/5 px-2">Progress</div>
          <div className="w-1/5 px-2 text-center">Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-transparent">
          {currentRecords.map((record) => (
            <div
              key={record.id}
              className="bg-[#F7F6FE] rounded-lg my-2 px-2 py-3 flex items-center text-sm"
            >
              <div className="w-1/5 flex items-center gap-3">
                <img
                  src={record.image}
                  alt={record.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{record.name}</span>
              </div>
              <div className="w-1/5">{record.date}</div>
              <div className="w-1/5">{record.project}</div>
              <div className="w-1/5">
                {record.status === "Completed" ? (
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {record.status}
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {record.status}
                  </span>
                )}
              </div>
              <div className="w-1/5 flex justify-center">
                <button 
                  onClick={() => viewDetail(record.id)}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all text-xs font-medium"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-600">
          <div>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}