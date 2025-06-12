import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function MeetingScheduleTable() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMeetings, setAllMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Semua Project');
  const [availableProjects, setAvailableProjects] = useState([]);

  const itemsPerPage = 15;

  // Fetch data from API
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/riwayat-presentasi`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log('Full API Response:', response.data); // Debug log

        if (response.data.status === "success") {
          // Transform API data to match component expectations
          const transformedData = response.data.data.map((meeting, index) => {
            console.log('Processing meeting:', meeting); // Debug log
            
            // Fix: Use correct field name with capital P
            const jadwalPresentasi = meeting.jadwal_Presentasi || {};
            console.log('Jadwal Presentasi:', jadwalPresentasi); // Debug log
            
            // Get location/zoom link based on tipe
            let locationOrZoom = '';
            if (jadwalPresentasi.tipe === 'online') {
              // For online: use link_zoom first, then fallback to lokasi
              locationOrZoom = jadwalPresentasi.link_zoom || 
                              jadwalPresentasi.lokasi || 
                              'Link zoom tidak tersedia';
            } else {
              // For offline: use lokasi first, then fallback to default
              locationOrZoom = jadwalPresentasi.lokasi || 
                              'PT. HUMMATECH';
            }

            const transformedItem = {
              id: meeting.id || index + 1,
              project: meeting.projek || `Project ${index + 1}`,
              date: formatDate(jadwalPresentasi.tanggal),
              time: `${formatTime(jadwalPresentasi.waktu_mulai)} - ${formatTime(jadwalPresentasi.waktu_selesai)} WIB`,
              method: capitalizeMethod(jadwalPresentasi.tipe || "Offline"),
              location: locationOrZoom,
              status: transformStatus(meeting.status || jadwalPresentasi.status),
              rawData: meeting // Store original data for reference
            };

            console.log('Transformed item:', transformedItem); // Debug log
            return transformedItem;
          });

          setAllMeetings(transformedData);
          
          // Extract unique projects for filter
          const uniqueProjects = [...new Set(transformedData.map(meeting => meeting.project))];
          setAvailableProjects(uniqueProjects);
        } else {
          setError("Failed to fetch meeting data");
        }
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data riwayat presentasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingData();
  }, []);

  console.log('All meetings state:', allMeetings);

  // Helper function to capitalize method
  const capitalizeMethod = (method) => {
    if (!method) return "Offline";
    return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
  };

  // Helper function to format time from HH:MM:SS to HH.MM format
  const formatTime = (timeString) => {
    if (!timeString) return "00.00";
    
    try {
      // Remove seconds if present (HH:MM:SS -> HH:MM)
      const timePart = timeString.split(':').slice(0, 2).join('.');
      return timePart;
    } catch (error) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal belum tersedia";
    
    try {
      const date = new Date(dateString);
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${dayName}, ${day} ${month} ${year}`;
    } catch (error) {
      return dateString; // Return original if formatting fails
    }
  };

  // Helper function to transform status
  const transformStatus = (status) => {
    if (!status) return "Dijadwalkan";
    
    // Handle different status formats
    if (typeof status === 'string') {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus.includes('selesai') || 
          lowerStatus.includes('hadir') || 
          lowerStatus.includes('completed') ||
          lowerStatus.includes('done')) {
        return "Selesai";
      }
      if (lowerStatus.includes('dijadwalkan') || 
          lowerStatus.includes('scheduled') ||
          lowerStatus.includes('pending')) {
        return "Dijadwalkan";
      }
    }
    
    if (typeof status === 'number') {
      return status === 1 ? "Selesai" : "Dijadwalkan";
    }
    
    if (typeof status === 'boolean') {
      return status ? "Selesai" : "Dijadwalkan";
    }
    
    return "Dijadwalkan";
  };

  // Filter meetings based on selected filter
  const filteredMeetings = allMeetings.filter(meeting => {
    if (selectedFilter === 'Semua Project') return true;
    return meeting.project === selectedFilter;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeetings = filteredMeetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
    setFilterOpen(false);
  };

  // Check if location is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Filter section - moved outside the card */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button 
            className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-50 shadow-sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter by: <span className="font-medium ml-1">{selectedFilter}</span> <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  key="all-projects"
                  onClick={() => handleFilterSelect('Semua Project')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedFilter === 'Semua Project' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  role="menuitem"
                >
                  Semua Project
                </button>
                {availableProjects.map((project) => (
                  <button
                    key={project}
                    onClick={() => handleFilterSelect(project)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedFilter === project ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                    role="menuitem"
                  >
                    {project}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Table section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Project</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Hari dan Tanggal</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Jam</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Metode</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lokasi/Link Zoom</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMeetings.length > 0 ? (
                currentMeetings.map((meeting) => (
                  <tr key={meeting.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{meeting.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{meeting.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{meeting.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{meeting.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {meeting.method === "Online" ? (
                        isValidUrl(meeting.location) ? (
                          <a 
                            href={meeting.location} 
                            className="text-blue-500 hover:underline" 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join Zoom Meeting
                          </a>
                        ) : (
                          <span className="text-blue-500">{meeting.location}</span>
                        )
                      ) : (
                        <span className="text-gray-500">{meeting.location}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {meeting.status === "Dijadwalkan" ? (
                        <span className="inline-flex items-center justify-center">
                          <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                          <span className="text-sm text-orange-500">Dijadwalkan</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                          <span className="text-sm text-green-500">Selesai</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {selectedFilter !== 'Semua Project' 
                      ? `Tidak ada data presentasi untuk project "${selectedFilter}"`
                      : "Belum ada riwayat presentasi"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMeetings.length)} of {filteredMeetings.length} entries
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1} 
                className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show a limited number of pages with ellipsis
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages} 
                className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug Panel - Remove this in production
      {process.env.NODE_ENV === 'development' && allMeetings.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg max-w-md max-h-64 overflow-auto z-50">
          <h4 className="font-bold mb-2">Debug: API Data Structure</h4>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(allMeetings[0]?.rawData, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
}