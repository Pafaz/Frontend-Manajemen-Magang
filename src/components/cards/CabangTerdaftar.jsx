import React from "react";
import { MoreHorizontal, ChevronDown } from "lucide-react";

const companies = [
  {
    name: "CV Sentra Media Kreasi",
    location: "Makassar, Sulawesi Selatan",
    logoUrl: "/assets/img/Profil.png",
  },
  {
    name: "PT Sahabat Cerdas Edukasi",
    location: "Yogyakarta, DI Yogyakarta",
    logoUrl: "/assets/img/Profil.png",
  },
  {
    name: "CV Kreasi Muda Indonesia",
    location: "Bandung, Jawa Barat",
    logoUrl: "/assets/img/Profil.png",
  },
  {
    name: "PT Digital Inovasi Terbaru",
    location: "Jakarta, DKI Jakarta",
    logoUrl: "/assets/img/Profil.png",
  },
  {
    name: "CV Teknologi Masa Depan",
    location: "Surabaya, Jawa Timur",
    logoUrl: "/assets/img/Profil.png",
  },
];

const CabongTerdaftar = () => {
  return (
    <div className="bg-white mt-6 rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h2 className="text-xs font-bold text-gray-800">Cabang Terdaftar</h2>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Terbaru</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      <div className="flex-1 p-4">
        <div 
          className="space-y-3 overflow-y-auto scrollbar-hide"
          style={{ 
            maxHeight: 'calc(3 * 75px)', // Tinggi untuk 3 item (setiap item sekitar 68px termasuk padding)
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }}
        >
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-0.5">{company.name}</h3>
                  <p className="text-gray-500 text-xs" style={{ fontSize: "10px" }}>
                    {company.location}
                  </p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
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

export default CabongTerdaftar;