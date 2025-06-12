import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const students = [
  {
     name: "PT Nusantara Digital Teknologi",
     location: "Bandung, Jawa Barat",
     project: "Pre Mini Project",
    participants: "125 peserta magang",
    logoUrl: "/assets/img/Profil.png"
  },
  {
     name: "CV Harmoni Rasa Nusantara",
     location: "Denpasar, Bali",
     project: "Pre Mini Project",
     progress: 55,
    participants: "125 peserta magang",
    logoUrl: "/assets/img/Profil.png"
  },
  {
     name: "PT Sinar Logistik Mandiri",
     location: "Surabaya, Jawa Timur",
     project: "Pre Mini Project",
     progress: 68,
    participants: "125 peserta magang",
    logoUrl: "/assets/img/Profil.png"
  },
  {
     name: "PT Sinar Logistik Mandiri",
     location: "Surabaya, Jawa Timur",
     project: "Pre Mini Project",
     progress: 68,
    participants: "125 peserta magang",
    logoUrl: "/assets/img/Profil.png"
  },
  {
     name: "PT Teknologi Maju Bersama",
     location: "Jakarta, DKI Jakarta",
     project: "Pre Mini Project",
     progress: 80,
    participants: "125 peserta magang",
    logoUrl: "/assets/img/Profil.png"
  },
];

const AssignmentsCards = () => {
  return (
    <div className="bg-white mt-6 rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">Perusahaan terdaftar</h2>
        <a href="/student-courses.html" className="text-blue-500 hover:underline text-xs">
          See All
        </a>
      </div>
             
      <div className="flex-1 p-6">
        <div 
          className="space-y-6 overflow-y-auto scrollbar-hide" 
          style={{ 
            maxHeight: 'calc(3 * 113px)', // Tinggi untuk 3 item (setiap item sekitar 92px termasuk padding)
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }}
        >
          {students.map((student, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                     src={student.logoUrl}
                     alt={`${student.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-0.5">
                    {student.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-0.5" style={{fontSize: '10px'}}>
                    {student.location}
                  </p>
                  <p className="text-gray-700 font-medium text-xs" style={{fontSize: '10px'}}>
                    {student.participants}
                  </p>
                </div>
              </div>
                             
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AssignmentsCards;