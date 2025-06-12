import React, { useState, useRef, useEffect } from "react";

export default function JurnalDetailModal({ selectedItem, closeModal }) {
  const [showFullDeskripsi, setShowFullDeskripsi] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }
    console.log("selectedItem:", selectedItem);


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  // Format timestamp untuk menangani format API "2025-05-18T04:09:09.000000Z"
  const formatTimestamp = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    
    // Periksa apakah tanggal valid
    if (isNaN(date.getTime())) return "-";
    
    // Format tanggal ke format "YYYY-MM-DD HH:MM:SS"
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-md w-full h-auto shadow-xl"
      >
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-2">
            <div className="w-full">
              <h2 className="text-xl font-bold">{selectedItem.nama}</h2>
              <p className="text-gray-500 text-sm border-b border-gray-300 pb-1 mb-2">
                {selectedItem.sekolah} {formatTimestamp(selectedItem.tanggal || selectedItem.created_at)}
              </p>
            </div>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Judul Jurnal */}
          <h2 className="font-large text-gray-800 mb-2">
            {selectedItem.judul || "Jurnal Kegiatan"}
          </h2>
          
          {/* Main content - Image */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {selectedItem.buktiJurnal ? (
              <img
                src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                  selectedItem.buktiJurnal
                }`}
                alt="Bukti Kegiatan"
                className="w-full h-65 object-cover"
              />
            ) : (
              <img
                src="/assets/img/default-avatar.png"
                alt="Default Image"
                className="w-full h-64 object-cover"
              />
            )}
          </div>
          
          {/* Activity Description */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Kegiatan</h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {(() => {
                const description = selectedItem.deskripsi || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu risus convallis, viverra nunc ut, feugiat libero. Integer rhoncus mauris mi, quis viverra sem pulvinar vel. Aenean finibus ac turpis non elementum.";
                const words = description.split(/\s+/) || [];
                const isLong = words.length > 50;
                const text = showFullDeskripsi
                  ? description
                  : words.slice(0, 50).join(" ") + (isLong ? "..." : "");
                return (
                  <>
                    {text}
                    {isLong && (
                      <button
                        className="ml-1 text-blue-600 hover:underline text-sm"
                        onClick={() => setShowFullDeskripsi(!showFullDeskripsi)}
                      >
                        {showFullDeskripsi ? "Sembunyikan" : "Selengkapnya"}
                      </button>
                    )}
                  </>
                );
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}