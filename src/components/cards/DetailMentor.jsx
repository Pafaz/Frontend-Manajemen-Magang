import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/cards/Loading';
import AddStudentModal from '../../components/modal/AddStudentModal';
import ChangeDivisionModal from '../../components/modal/ChangeDivisionModal';

export default function DetailMentor() {
  const { mentorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeDivisionModalOpen, setIsChangeDivisionModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Fungsi untuk memuat ulang data
  const refreshStudentsList = async () => {
    try {
      // Reset loading state saat refresh
      setLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentor/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Log response untuk debugging
      console.log("Refresh data response:", response.data);
      
      if (response.data?.data) {
        // Update mentor data too to ensure consistency
        setMentor(response.data.data);
        
        if (response.data.data.peserta) {
          setStudents(response.data.data.peserta);
        } else {
          setStudents([]);
        }
      }
    } catch (error) {
      console.error("Gagal memuat ulang data:", error);
      setError("Gagal memperbarui data siswa");
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangeDivision = (student) => {
    setSelectedStudent(student);
    setIsChangeDivisionModalOpen(true);
  };

  useEffect(() => {
    const fetchMentorDetails = async () => {
      // Reset states on ID change
      setMentor(null);
      setStudents([]);
      setError(null);
      setLoading(true);
      
      if (!mentorId) {
        console.error("ID Mentor tidak ditemukan di parameter URL");
        setError("ID Mentor tidak valid");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching mentor with ID:", mentorId);
        
        // Fetch mentor details
        const mentorResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/mentor/${mentorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        // Log full response for debugging
        console.log("API Response for ID", mentorId, ":", mentorResponse.data);
        
        if (mentorResponse.data?.data) {
          setMentor(mentorResponse.data.data);
          setStudents(mentorResponse.data.data.peserta || []);
          
          // Log parsed data for debugging
          console.log("Mentor data set:", mentorResponse.data.data);
          console.log("User data:", mentorResponse.data.data.user);
          console.log("Division:", mentorResponse.data.data.divisi);
        } else {
          console.error("Data mentor kosong dari API");
          setError("Data mentor tidak ditemukan");
        }
      } catch (error) {
        console.error("Error mengambil detail mentor:", error);
        setError("Gagal memuat data mentor");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]); // Dependensi pada mentorId - akan reload ketika ID berubah

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.sekolah?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  
  if (error && !mentor) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 min-h-[300px]">
        <div className="text-red-500 text-xl font-medium mb-2">Error</div>
        <div className="text-gray-600">{error}</div>
        <div className="mt-4 text-gray-500">Silakan kembali ke halaman sebelumnya.</div>
      </div>
    );
  }

  // Pastikan data mentor ada sebelum mengakses properties
  if (!mentor || !mentor.user) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 min-h-[300px]">
        <div className="text-red-500 text-xl font-medium mb-2">Data Tidak Lengkap</div>
        <div className="text-gray-600">Data mentor tidak ditemukan atau tidak lengkap.</div>
        <div className="mt-4 text-gray-500">Silakan coba muat ulang halaman.</div>
      </div>
    );
  }

  // Extract mentor info safely with null checks
  const user = mentor.user || {};
  const division = mentor.divisi?.nama || 'Division Not Available';
  const divisionId = mentor.divisi?.id;

  // Log final data before rendering for debugging
  console.log("Final render with mentor ID:", mentorId);
  console.log("Final mentor data:", mentor);
  console.log("Final user data:", user);

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Back button */}
      <div className="flex items-center mb-4">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left sidebar - Mentor details */}
        <div className="md:w-100 ">
          <div className="mb-6">
            <h2 className="font-bold text-lg text-center mb-6">Detail Mentor</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
                {mentor?.foto?.find(f => f.type === 'profile')?.path ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL_FILE}/storage/${mentor.foto.find(f => f.type === 'profile').path}`}
                    alt="Mentor avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/api/placeholder/100/100" alt="Mentor avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-bold text-xl text-center">{user.nama || 'Name Not Available'}</h3>
              <div className="bg-blue-500 text-white text-xs rounded-full px-3 py-1 mt-2 uppercase font-semibold tracking-wider">
                {division}
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 mb-4">
              <p>{user.email || 'Email Not Available'}</p>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}
            
            {/* Tambahkan tombol refresh untuk memuat ulang data */}
            <div className="flex justify-center mt-4">
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center"
                onClick={refreshStudentsList}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Right content - Students list */}
        <div className="flex-1">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Detail Siswa Bimbingan</h2>
              <div className="flex items-center">
                <div className="relative mr-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-2 top-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Tambah Siswa
                </button>
              </div>
            </div>

            {/* Table with smaller fonts and updated colors */}
            <div className="overflow-x-auto bg-white rounded-lg border-t border-b border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs font-bold text-[#667797]">No</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#667797]">Nama</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#667797]">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#667797]">Sekolah</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#667797]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={student.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-xs text-[#667797]">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3">
                              {student?.foto?.path? (
                                <img 
                                  src={`${import.meta.env.VITE_API_URL_FILE}/storage/${student.foto.path}`}
                                  alt="Student avatar" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img src="/api/placeholder/100/100" alt="Student avatar" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <span className="font-medium text-xs text-[#667797]">{student.nama || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#667797]">{student.email || "N/A"}</td>
                        <td className="py-3 px-4 text-xs text-[#667797]">{student.sekolah || "N/A"}</td>
                        <td className="py-3 px-4">
                          <button 
                            className="bg-blue-100 text-blue-500 hover:bg-blue-200 px-6 py-2 rounded-full text-xs font-medium"
                            onClick={() => handleChangeDivision(student)}
                          >
                            Pindah Divisi
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-xs text-[#667797]">
                        Tidak ada siswa yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mentorId={mentorId}
        divisionId={divisionId}
        onSuccess={refreshStudentsList}
      />

      {/* Change Division Modal */}
      <ChangeDivisionModal
        isOpen={isChangeDivisionModalOpen}
        onClose={() => setIsChangeDivisionModalOpen(false)}
        student={selectedStudent}
        onSuccess={refreshStudentsList}
      />
    </div>
  );
}
