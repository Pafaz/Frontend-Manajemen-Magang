import { Edit, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";

export default function StudentTable() {
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(allStudentsData);
  
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch data from API
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/peserta-progress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status === "success") {
          
          console.log(response.data.data);
          
          // Transform API data to match component expectations
          const transformedData = response.data.data.map((student, index) => {
            const unfinishedProject = student?.route?.find((r) => r.selesai == null);
            
            return {
              id: student.id_peserta || `temp-${index + 1}`, // ID frontend sementara
              name: student.nama,
              sekolah: student.sekolah,
              project: unfinishedProject?.kategori_proyek?.nama || "-", // Ambil nama kategori proyek dari route yang belum selesai
              status: unfinishedProject ? "In Progress" : "Completed",
              email: student.email,
              nomor_identitas: student.nomor_identitas,
              image: student.foto?.find((f) => f.type === "profile")?.path 
                ? `${import.meta.env.VITE_API_URL_FILE}/storage/${student.foto.find((f) => f.type === "profile").path}` 
                : "/assets/img/default-avatar.png",
              progressData: student.route || [], // simpan semua data progress
              rawData: student, // simpan data asli
            };
          });


          setAllStudentsData(transformedData);
        } else {
          setError("Failed to fetch student data");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data siswa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentsData();
  }, []);

  const filteredStudents = allStudentsData.filter((student) => {
    const statusMatch = selectedStatus === "All" || student.status === selectedStatus;
    const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && nameMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const csvReport = {
    data: filteredStudents.length > 0 ? filteredStudents : allStudentsData,
    filename: "students_report.csv",
    headers: [
      { label: "ID Peserta", key: "apiId" },
      { label: "Nama", key: "name" },
      { label: "Email", key: "email" },
      { label: "Nomor Identitas", key: "nomor_identitas" },
      { label: "Asal Sekolah", key: "sekolah" },
      { label: "Project", key: "project" },
      { label: "Status", key: "status" },
      { label: "Tanggal Mulai", key: "mulai" },
      { label: "Tanggal Selesai", key: "selesai" },
    ],
  };
  

  // Function untuk handle navigation ke halaman detail siswa
  const handleEditStudent = (student) => {
    // Use the actual peserta ID for navigation
    if (student) {
      window.location.href = `/mentor/siswa/${student}`;
      // console.log(`Navigating to: /mentor/siswa/${studentId}`);
    } else {
      console.error("ID Peserta tidak ditemukan!");
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Search & Filter Controls */}
      <div className="flex justify-between items-center mb-4 gap-3">
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3 py-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input type="text" placeholder="Cari nama..." className="outline-none text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white">
            <option value="All">Tampilkan Semua</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>

          <CSVLink {...csvReport} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm border border-gray-200 bg-white overflow-hidden">
        <table className="min-w-full text-left divide-y divide-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-white text-black font-bold text-sm">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Asal Sekolah</th>
              <th className="p-3">Project</th>
              <th className="p-3">Progress</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-black text-sm" style={{ backgroundColor: "#FFFFFF" }}>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to default image if profile image fails to load
                        e.target.src = "/assets/img/default-avatar.png";
                      }}
                    />
                    <div>
                      <span className="font-medium block">{student.name}</span>
                      {/* <span className="text-xs text-gray-500">ID: {student.apiId}</span> */}
                    </div>
                  </td>
                  <td className="p-3">{student.sekolah}</td>
                  <td className="p-3 capitalize">{student.project}</td>
                  <td className="p-3">
                    {student.status === "Completed" ? (
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {student.status}
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        {student.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleEditStudent(student.id)} className="p-2 rounded-md hover:bg-purple-100 transition-all" title={`Edit ${student.name}`}>
                      <Edit className="h-5 w-5 text-purple-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  {searchTerm || selectedStatus !== "All" ? "Tidak ada data yang sesuai dengan filter" : "Tidak ada data siswa"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 text-sm text-gray-600">
            <div>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}