import React, { useState, useRef, useEffect } from "react";

export default function TableIzin({ data = [], searchTerm = "", selectedDate = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const modalRef = useRef(null);

  const safeData = Array.isArray(data) ? data : [];

  const filteredData = safeData.filter((item) => {
    const isMatchSearch =
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sekolah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tanggalIzin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.tanggalIzin).toLocaleDateString() === selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status?.toLowerCase() === "izin") {
      return <span className={`${baseClasses} bg-[#FFDCBB] text-[#FF9F43]`}>Izin</span>;
    } else if (status?.toLowerCase() === "sakit") {
      return <span className={`${baseClasses} bg-red-100 text-red-600`}>Sakit</span>;
    }
    return null;
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium">No</th>
            <th className="px-3 py-3 text-center font-medium">Nama</th>
            <th className="px-3 py-3 text-center font-medium">Sekolah</th>
            <th className="px-3 py-3 text-center font-medium">Tanggal Izin</th>
            <th className="px-3 py-3 text-center font-medium">Tanggal Kembali</th>
            <th className="px-3 py-3 text-center font-medium">Status</th>
            <th className="px-3 py-3 text-center font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id || index} className="border-t border-gray-200 hover:bg-gray-50 text-center">
              <td className="px-3 py-3">{index + 1}</td>
              <td className="px-3 py-3 flex items-center gap-2 justify-center">
                <img src={item.image || "/api/placeholder/40/40"} alt={item.nama} className="w-8 h-8 rounded-full" />
                {item.nama}
              </td>
              <td className="px-3 py-3">{item.sekolah}</td>
              <td className="px-3 py-3">{item.tanggalIzin}</td>
              <td className="px-3 py-3">{item.tanggalKembali}</td>
              <td className="px-3 py-3">{getStatusBadge(item.status)}</td>
              <td 
                className="px-3 py-3 text-[#0069AB] cursor-pointer"
                onClick={() => openModal(item)}
              >
                Lihat
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Izin Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div 
            ref={modalRef} 
            className="bg-white rounded-lg max-w-md w-full"
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Detail Izin</h2>
                <button onClick={closeModal} className="text-black">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 text-sm">Ayo Laporkan Kegiatanmu hari ini!</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-500 text-sm">Nama</label>
                  <div>{selectedItem.nama}</div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm">Tanggal</label>
                  <div>{selectedItem.tanggalIzin}</div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm">Sekolah</label>
                  <div>{selectedItem.sekolah}</div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm">Kegiatan</label>
                  <div>{selectedItem.kegiatan || "Ini Contoh"}</div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm">Bukti Kegiatan</label>
                  <div className="mt-2 flex justify-center">
                    {/* Menampilkan gambar bukti kegiatan */}
                    {selectedItem.buktiKegiatan ? (
                      <a 
                        href={selectedItem.buktiKegiatan} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <img 
                          src={selectedItem.buktiKegiatan} 
                          alt="Bukti Kegiatan" 
                          className="max-w-[200px] h-auto rounded-lg"
                        />
                      </a>
                    ) : (
                      <div className="mb-2 text-4xl text-gray-600">
                        <i className="bi bi-file-earmark-arrow-up"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500" 
                  onClick={closeModal}
                >
                  Tolak
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Terima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
