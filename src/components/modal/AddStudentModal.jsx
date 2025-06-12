import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function AddStudentModal({ isOpen, onClose, mentorId, divisionId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for debugging
  
  useEffect(() => {
    // Reset form when modal is opened
    if (isOpen) {
      setSelectedStudents([]);
      fetchAvailableStudents();
    }
  }, [isOpen, divisionId]);

  const fetchAvailableStudents = async () => {
    if (!divisionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/peserta-by-divisi/${divisionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data?.data) {
        // Store all students for debugging
        setAllStudents(response.data.data);
        
        // Filter students where mentor_id or id_mentor is null
        const unassignedStudents = response.data.data.filter(student => {
          // Check for both possible field names
          return (
            (student.mentor_id === null || student.mentor_id === undefined) && 
            (student.id_mentor === null || student.id_mentor === undefined)
          );
        });
        
        console.log("Total students:", response.data.data.length);
        console.log("Unassigned students:", unassignedStudents.length);
        
        // Transform the filtered data for react-select
        const studentOptions = unassignedStudents.map(student => ({
          value: student.id,
          label: student.nama || student.user?.nama || `Student ID: ${student.id}`,
          // Add raw data for debugging
          rawData: student
        }));
        
        setStudents(studentOptions);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Error fetching students by division:", err);
      setError("Gagal memuat data siswa. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedStudents.length === 0) {
      setError("Silakan pilih minimal satu siswa");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare student IDs for submission
      const studentIds = selectedStudents.map(student => student.value);
      
      // Post selected students to the mentor
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/set-mentor/${mentorId}`,
        { pesertas: studentIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status) {
        onSuccess();
        onClose();
      } else {
        setError("Gagal menambahkan siswa. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Error adding students to mentor:", err);
      setError("Terjadi kesalahan saat menambahkan siswa. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Debug function to check data - remove in production
  const showStudentStructure = () => {
    if (allStudents.length > 0) {
      console.log("Student data structure sample:", allStudents[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium">Tambah Siswa Bimbingan</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Siswa
              </label>
              <Select
                isMulti
                name="students"
                options={students}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={students.length > 0 ? "Pilih siswa..." : "Tidak ada siswa tanpa mentor"}
                value={selectedStudents}
                onChange={setSelectedStudents}
                isLoading={loading}
                isDisabled={loading}
                formatOptionLabel={option => (
                  <div className="flex flex-col">
                    <div>{option.label}</div>
                  </div>
                )}
                noOptionsMessage={() => "Tidak ada siswa tanpa mentor tersedia"}
              />
              <p className="mt-2 text-xs text-red-500">
                *Daftar menampilkan peserta magang yang belum memiliki mentor di divisi ini
              </p>
              
              {/* Debug button - remove in production */}
              {/* {process.env.NODE_ENV === 'development' && (
                <button 
                  type="button" 
                  onClick={showStudentStructure}
                  className="mt-2 text-xs text-blue-500 underline"
                >
                  Debug data structure
                </button>
              )} */}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || selectedStudents.length === 0}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Menyimpan...</span>
                </div>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}