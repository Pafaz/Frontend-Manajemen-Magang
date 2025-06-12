import React from "react";

const students = [
  { name: "Gojo Satoru", school: "SMKN 12 MALANG", avatar: "/assets/img/Profil.png" },
  { name: "Itadori Yuji", school: "SMKN 15 JAKARTA", avatar: "/assets/img/Profil.png" },
  { name: "Nobara Kugisaki", school: "SMKN 8 BANDUNG", avatar: "/assets/img/Profil.png" },
  { name: "Megumi Fushiguro", school: "SMKN 5 SURABAYA", avatar: "/assets/img/Profil.png" },
  { name: "Maki Zenin", school: "SMKN 3 YOGYAKARTA", avatar: "/assets/img/Profil.png" },
  { name: "Toge Inumaki", school: "SMKN 10 SEMARANG", avatar: "/assets/img/Profil.png" },
  { name: "Panda", school: "SMKN 7 MEDAN", avatar: "/assets/img/Profil.png" },
  { name: "Yuta Okkotsu", school: "SMKN 2 PALEMBANG", avatar: "/assets/img/Profil.png" },
  { name: "Kento Nanami", school: "SMKN 13 MAKASSAR", avatar: "/assets/img/Profil.png" },
  { name: "Mai Zenin", school: "SMKN 6 DENPASAR", avatar: "/assets/img/Profil.png" },
  { name: "Aoi Todo", school: "SMKN 9 BALIKPAPAN", avatar: "/assets/img/Profil.png" },
  { name: "Kasumi Miwa", school: "SMKN 4 PONTIANAK", avatar: "/assets/img/Profil.png" },
];

const StudentsList = () => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden">
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Siswa</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700">view all</button>
      </div>

      {/* Students List */}
      <div className="h-80 overflow-y-auto hide-scrollbar">
        <div className="divide-y divide-gray-100">
          {students.map((student, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mr-3">
                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{student.name}</h3>
                <p className="text-xs text-gray-500 truncate">{student.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
