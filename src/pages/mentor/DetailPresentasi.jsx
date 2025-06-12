import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ParticipantDetailView = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const [participant, setParticipant] = useState(null);
  const [projectTracks, setProjectTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState({}); // Track which tasks are being updated

  // State to track which tracks are expanded
  const [expandedTracks, setExpandedTracks] = useState({});
  // State to track which revisions are expanded
  const [expandedRevisions, setExpandedRevisions] = useState({});

  // Fetch participant data from API
  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching data for ID:", id); // Debug log
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/peserta-progress/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("API Response:", response.data); // Debug log

        if (response.data.status === "success") {
          const data = response.data.data;
          
          // Transform participant data sesuai dengan struktur API response yang sebenarnya
          const transformedParticipant = {
            name: data.nama,
            divisi: data.divisi,
            school: data.sekolah,
            nisn: data.nomor_identitas,
            email: data.email,
            company: data.perusahaan,
            cabang: data.cabang,
            RFID: data.rfid || "N/A",
            mentor: data.mentor,
            period: `${formatDate(data.mulai_magang)} - ${formatDate(data.selesai_magang)}`,
            profileImage: data.foto?.find((f) => f.type === "profile")?.path 
            ? `${import.meta.env.VITE_API_URL_FILE}/storage/${data.foto.find((f) => f.type === "profile").path}` 
              : "/assets/img/Profil.png"
          };

          setParticipant(transformedParticipant);

          // Transform progress data - sesuaikan dengan struktur API response
          if (data.progress) {
            // Progress adalah object tunggal, bukan array
          const transformedProgress = data.progress.map((progressItem) => {
  const matchedRevisions = (data.revisi || []).filter(
    (rev) => rev.id_route === progressItem.id
  );

  return {
    id: progressItem.id,
    id_kategori_proyek: progressItem?.kategori_proyek?.id,
    stage: progressItem?.kategori_proyek?.nama,
    status: progressItem.selesai ? "Selesai" : "Dikerjakan",
    startDate: progressItem.mulai ? formatDate(progressItem.mulai) : null,
    endDate: progressItem.selesai ? formatDate(progressItem.selesai) : null,
    revisions: matchedRevisions.map((rev, index) => {
      const tasks = rev.progress?.length
        ? rev.progress.map((prog) => ({
            id: prog.id,
            deskripsi: prog.deskripsi,
            status: prog.status,
          }))
        : [];

      const isCompleted = tasks.length > 0 && tasks.every((task) => task.status == 1);

      return {
        id: rev.id || index + 1,
        name: `Revisi ${index + 1}`,
        status: isCompleted ? 1 : 0,
        created_at: rev.created_at,
        updated_at: rev.updated_at,
        tasks,
      };
    }),
  };
});


            setProjectTracks(transformedProgress);
          }

        } else {
          setError("Gagal mengambil data peserta");
        }
      } catch (err) {
        console.error("Error fetching participant:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data peserta");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchParticipantData();
    } else {
      setError("ID peserta tidak ditemukan");
    }
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Toggle expanded state for a track
  const toggleTrack = (id) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  // Toggle expanded state for a revision
  const toggleRevision = (trackId, revisionId) => {
    const key = `${trackId}-${revisionId}`;
    setExpandedRevisions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Function to handle task status update
  const handleTaskStatusUpdate = async (trackId, revisionId, taskId, currentStatus) => {
    const taskKey = `${trackId}-${revisionId}-${taskId}`;
    
    try {
      setIsUpdating(prev => ({ ...prev, [taskKey]: true }));
      
      const newStatus = currentStatus === 1 ? 0 : 1; 
      
      // API call to update task status
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/progress/${taskId}`,
        { 
          status: newStatus,
          revision_id: revisionId 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.status === "success") {
        // Update local state
        setProjectTracks(prev => 
          prev.map(track => {
            if (track.id === trackId) {
              return {
                ...track,
                revisions: track.revisions.map(revision => {
                  if (revision.id === revisionId) {
                    return {
                      ...revision,
                      tasks: revision.tasks.map(task => 
                        task.id === taskId 
                          ? { ...task, status: newStatus }
                          : task
                      )
                    };
                  }
                  return revision;
                })
              };
            }
            return track;
          })
        );
        
      } else {
        throw new Error("Gagal mengupdate status task");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Gagal mengupdate status task: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(prev => ({ ...prev, [taskKey]: false }));
    }
  };

  // Function to render status badge with appropriate color
  const renderStatusBadge = (status) => {
    if (status === "Selesai") {
      return (
        <span className="inline-flex bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
          {status}
        </span>
      );
    } else if (status === "Dikerjakan") {
      return (
        <span className="inline-flex bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
          {status}
        </span>
      );
    }
  };

  // Function to render revision status badge
  const renderRevisionStatusBadge = (status) => {
    if (status === 1) {
      return (
        <span className="inline-flex bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
          Selesai
        </span>
      );
    } else {
      return (
        <span className="inline-flex bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
          Dalam Progress
        </span>
      );
    }
  };
  
  // Function to check if "Tandai Selesai" button should be shown
  const shouldShowTandaiSelesai = (status) => {
    return status === "Dikerjakan";
  };

  // Function to determine if checkbox should be checked based on task status
  const isTaskCompleted = (taskStatus) => {
    return taskStatus === 1;
  };

  // Function to handle marking task as complete
  const handleMarkComplete = async (trackId) => {
    setIsLoading(true);
    try {
      // Implementasi API call untuk menandai sebagai selesai
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/peserta-progress/${id}`, 
        { id_kategori_proyek: trackId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.status === "success") {
        // Update local state
        setProjectTracks(prev => 
          prev.map(track => 
            track.id === trackId 
              ? { ...track, status: "Selesai", endDate: formatDate(new Date()) }
              : track
          )
        );
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error marking task as complete:", err);
      alert("Gagal menandai tugas sebagai selesai", err);
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // No participant data
  if (!participant) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="text-gray-500">Data peserta tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          className="text-gray-600 text-xl"
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-lg font-medium">Detail Peserta</h1>
      </div>

      {/* Profile section */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={participant.profileImage}
              alt={participant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/img/default-avatar.png";
              }}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{participant.name}</h2>
            <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
              {participant.divisi}
            </div>

            <div className="text-sm text-gray-600 mb-1">
              {participant.school} | {participant.nisn}
            </div>

            {/* Detail info */}
            <div className="space-y-2 mt-4 text-sm text-gray-600">
              <div className="flex">
                <div className="w-36">Email</div>
                <div>: {participant.email}</div>
              </div>
              <div className="flex">
                <div className="w-36">Perusahaan</div>
                <div>: {participant.company}</div>
              </div>
              <div className="flex">
                <div className="w-36">Cabang</div>
                <div>: {participant.cabang}</div>
              </div>
              <div className="flex">
                <div className="w-36">RFID</div>
                <div>: {participant.RFID}</div>
              </div>
              <div className="flex">
                <div className="w-36">Mentor</div>
                <div>: {participant.mentor}</div>
              </div>
              <div className="flex">
                <div className="w-36">Durasi Magang</div>
                <div>: {participant.period}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Record section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4 px-4">Track Record Project</h2>

        {projectTracks.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            Belum ada progress yang tersedia
          </div>
        ) : (
          <div className="space-y-4">
            {projectTracks.map((track) => (
              <div
                key={track.id}
                className="bg-white rounded-lg overflow-hidden border border-[#D5DBE7] shadow-sm"
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleTrack(track.id)}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{track.stage}</h3>
                      {shouldShowTandaiSelesai(track.status) && (
                        <button 
                          className="text-blue-500 bg-blue-50 px-3 py-1 rounded-md text-xs hover:bg-blue-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkComplete(track.id_kategori_proyek);
                          }}
                        >
                          Tandai Selesai
                        </button>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <div className="flex flex-col">
                        <div className="flex items-center">{renderStatusBadge(track.status)}</div>
                        <div className="mt-1">  {track.startDate}
                        {" - "}
                        {track.endDate ? track.endDate : "Sekarang"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 text-lg transition-transform duration-200" style={{ transform: expandedTracks[track.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                </div>
                
                {/* Expandable content */}
                {expandedTracks[track.id] && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    {track.revisions.length > 0 ? (
                      <>
                        <div className="mb-4 font-medium">Detail Revisi</div>
                        
                        {/* Revisions list - with max height and scrolling */}
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {track.revisions.map((revision) => (
                            <div key={revision.id} className="border-b border-gray-100 pb-2">
                              {/* Revision header */}
                              <div 
                                className="flex items-center justify-between cursor-pointer pb-2 sticky top-0 bg-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRevision(track.id, revision.id);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{revision.name}</div>
                                  {renderRevisionStatusBadge(revision.status)}
                                </div>
                                <button className="text-gray-400">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    style={{ 
                                      transform: expandedRevisions[`${track.id}-${revision.id}`] ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }}
                                  >
                                    <path d="M18 15l-6-6-6 6"/>
                                  </svg>
                                </button>
                              </div>

                              {/* Revision tasks */}
                              {expandedRevisions[`${track.id}-${revision.id}`] && (
                                <div className="pl-2">
                                  {revision.tasks && revision.tasks.length > 0 ? (
                                    revision.tasks.map((task) => {
                                      const taskKey = `${track.id}-${revision.id}-${task.id}`;
                                      const isUpdatingTask = isUpdating[taskKey];
                                      
                                      return (
                                        <div key={task.id} className="flex items-start gap-2 mb-2">
                                          <div className="relative">
                                            <input 
                                              type="checkbox" 
                                              className={`mt-1 cursor-pointer ${isUpdatingTask ? 'opacity-50' : ''}`}
                                              checked={isTaskCompleted(task.status)}
                                              onChange={() => handleTaskStatusUpdate(track.id, revision.id, task.id, task.status)}
                                              disabled={isUpdatingTask}
                                            />
                                            {isUpdatingTask && (
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                                              </div>
                                            )}
                                          </div>
                                          <div className={`${isTaskCompleted(task.status) ? 'line-through text-gray-400' : ''} ${isUpdatingTask ? 'opacity-50' : ''}`}>
                                            {task.deskripsi}
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-gray-400 italic">Belum ada tugas untuk revisi ini</div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 italic">Belum ada revisi untuk proyek ini</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDetailView;