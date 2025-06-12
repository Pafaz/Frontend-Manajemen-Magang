import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Project Stage Card Component
const ProjectStageCard = ({ title, icon, message, isCompleted, isLocked, route  }) => {
  return (
    <div className="border border-gray-500 rounded-2xl p-6 flex flex-col items-center h-full shadow-lg ">
      <h3 className="text-xl font-semibold text-black mb-4">{title}</h3>
      
      <div className="flex justify-center mb-3">
        {isLocked ? (
          <div className="text-black mt-5 mb-6">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        ) : (
          <div className="flex justify-center">
            {icon ? icon : <div>Icon not available</div>}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <p className="text-center text-sm text-black mb-4 mt-3">
          {message}
        </p>
      </div>
      
      <div className="w-full mt-auto">
  {!isLocked && !isCompleted? (
    <Link to={`/peserta/detail-project/${route}`}>
      <button className="w-full py-2 text-center border border-black rounded-full hover:bg-gray-50 transition-colors duration-200">
        Lihat Detail
      </button>
    </Link>
  ) : (
    <div className="h-10">
      <p className="text-center font-medium text-black">{!isCompleted ? 'SEMANGAT!': 'PERTAHANKAN SEMANGATMU!'}</p>
    </div> // Spacer for locked cards
  )}
</div>
    </div>
  );
};

// Route Project Component
const RouteProject = () => {

  const [route, setRoute] = useState([]);
  const [kategori, setKategori] = useState([]);
  
  // Project stages data 
  const getRoute = async () => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/route-peserta`,
        {
          headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        }
      )
      setRoute(response.data.data[0].route)
      setKategori(response.data.data[0].kategori)
    }catch (error) {
      console.error(error);
    }
  }

  useEffect(()=> {
    getRoute();
  },[])

  const stages = kategori.map((kategoriItem) => {
  const currentRoute = route.find(r => r.id_kategori_proyek === kategoriItem.id);
  
  // Tentukan apakah tahap sudah selesai berdasarkan 'selesai'
  const isCompleted = currentRoute ? currentRoute.selesai !== null : false;

  // Tentukan apakah kategori sedang dikerjakan (dengan memeriksa apakah id_kategori_proyek sama)
  const isCurrentlyWorking = currentRoute ? currentRoute.id_kategori_proyek === kategoriItem.id : false;

  // Tentukan apakah tahap terkunci
  const isLocked = currentRoute ? currentRoute.id_kategori_proyek !== kategoriItem.id : false;

    return {
      id: kategoriItem.id,
      title: `Tahap ${kategoriItem.nama}`,
      message: isCurrentlyWorking && isCompleted
        ? "Selamat! tahap ini sudah selesai"
        : "Selesaikan tahapnya dan lanjut ke tahap selanjutnya!",
      isCompleted: isCompleted,
      isLocked: !isCurrentlyWorking, // Menandakan jika kategori belum dikerjakan, kunci tahap tersebut
      icon: isCurrentlyWorking && isCompleted? (
        <img src="/assets/svg/Selesai.svg" alt={`Tahap ${kategoriItem.nama}`} className="w-30 h-30" />
      ) : (
        <img src="/assets/svg/proses.svg" alt={`Tahap ${kategoriItem.nama}`} className="w-30 h-30" />
      ),
      routeId: currentRoute ? currentRoute.id : null,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Route Project</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <ProjectStageCard
            key={stage.id}
            title={stage.title}
            message={stage.message}
            isCompleted={stage.isCompleted}
            isLocked={stage.isLocked}
            icon={stage.icon}
            route={stage.routeId}
          />
        ))}
      </div>
    </div>
  );
};

export default RouteProject;