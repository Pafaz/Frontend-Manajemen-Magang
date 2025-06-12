import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProjectListing({projects}) {
  console.log(projects);
  
  const navigate = useNavigate();
  const handleViewDetail = (id) => {
    navigate(`/peserta/detail-project/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Project</h1>
        <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">See All</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project.id_route} className="bg-white rounded-lg overflow-hidden border border-[#CED2D9]">
            <div className="px-2 py-2 flex justify-center">
              <img
                src={project.image || '/assets/img/Cover3.png'}
                alt={project.nama_kategori_proyek}
                className="h-35 w-full object-contain rounded-lg"
              />
            </div>
            <div className="px-4 py-2">
              <h3 className="font-medium text-gray-800">{project.nama_kategori_proyek}</h3>
              <div className="flex items-center mt-2 text-gray-500 text-sm">
                <Calendar size={16} className="mr-1" />
                <span className="text-xs">{project.selesai || "Belum Selesai"}</span>
              </div>
              <button
                onClick={() => handleViewDetail(project.id_route)}
                className="mt-4 w-full py-2 bg-white text-blue-500 border-2 border-blue-500 rounded-full text-sm hover:bg-blue-50 transition font-medium"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}