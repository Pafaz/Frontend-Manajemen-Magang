import React, { useState } from "react";

// Document file type icons
const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PreviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Document component for cleaner rendering
const DocumentItem = ({ document, onDownload, onPreview }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-2 mb-2">
      <div className="flex items-start">
        <div className="bg-red-100 p-1.5 rounded-lg mr-2">
          <FileIcon />
        </div>
        <div className="flex justify-between w-full">
          <div>
            <p className="font-medium text-sm">{document?.name || "Document"}</p>
            <div className="text-xs text-gray-500 mt-1">
              <p>Size: {document?.size || "-"}</p>
              <p>Added: {document?.dateAdded || "-"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 ml-4">
            <button 
              className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs flex items-center"
              onClick={() => onDownload(document)}
            >
              <DownloadIcon />
              Download
            </button>
            <button 
              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs flex items-center"
              onClick={() => onPreview(document)}
            >
              <PreviewIcon />
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TablePendaftaran({ data, searchTerm, selectedDate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter data based on search term and selected date
  const filteredData = data.filter((item) => {
    const isMatchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.masaMagang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sekolah.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.masaMagang).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  // Modal handlers
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.classList.remove("modal-open");
  };

  // Selection handlers
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // If not currently selected all, select all filtered items
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      // Otherwise, clear selection
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        // Remove if already selected
        return prevSelected.filter(itemId => itemId !== id);
      } else {
        // Add if not selected
        return [...prevSelected, id];
      }
    });
  };

  // Document handlers
  const handleDownload = (document) => {
    if (!document) return;
    
    // In a real implementation, this would use the document URL
    // Here we'll simulate a download with an alert
    alert(`Downloading ${document.name}...`);
    
    // For actual implementation:
    // const link = document.createElement('a');
    // link.href = document.url;
    // link.download = document.name;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const handlePreview = (document) => {
    if (!document) return;
    
    // In a real implementation, this would open a preview modal or new window
    alert(`Previewing ${document.name}...`);
    
    // For actual implementation with preview in new window:
    // window.open(document.previewUrl, '_blank');
  };

  return (
    <div className="w-full overflow-x-auto">
      <style jsx global>{`
        .modal-open::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.15);
          z-index: 40;
        }
      `}</style>

      {/* Main Table */}
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-2 py-3 text-center font-medium w-12">
              {/* <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-[#0069AB] bg-gray-100 border-gray-300 rounded focus:ring-[#0069AB]"
              /> */}
            </th>
            <th className="px-3 py-3 text-center font-medium w-12">No</th>
            <th className="px-3 py-3 text-center font-medium">Nama</th>
            <th className="px-3 py-3 text-center font-medium">Jurusan</th>
            <th className="px-3 py-3 text-center font-medium w-12">Kelas</th>
            <th className="px-3 py-3 text-center font-medium">Masa Magang</th>
            <th className="px-3 py-3 text-center font-medium">Sekolah</th>
            <th className="px-3 py-3 text-center font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id}
              className="border-t border-gray-200 hover:bg-gray-50 text-center"
            >
              <td className="px-2 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="w-4 h-4 text-[#0069AB] bg-gray-100 border-gray-300 rounded focus:ring-[#0069AB]"
                />
              </td>
              <td className="px-3 py-3">{index + 1}</td>
              <td className="px-3 py-3 flex items-center gap-2 justify-center">
                <img
                  src={item.image}
                  alt={item.nama}
                  className="w-8 h-8 rounded-full"
                />
                {item.nama}
              </td>
              <td className="px-3 py-3">{item.jurusan}</td>
              <td className="px-3 py-3">{item.kelas}</td>
              <td className="px-3 py-3">{item.masaMagang}</td>
              <td className="px-3 py-3">{item.sekolah}</td>
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

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full shadow-lg pointer-events-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-4">Detail Pendaftar</h2>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Kolom foto profil */}
                <div className="flex-shrink-0">
                  <img
                    src={selectedItem.image || "/placeholder-profile.jpg"}
                    alt={selectedItem.nama}
                    className="w-30 h-30 rounded-lg object-cover"
                  />
                </div>

                {/* Kolom Informasi - dibagi 2 */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                  {/* Kolom 1 - Nama dan dokumen berkas CV dan Ijazah */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Nama</label>
                      <input
                        type="text"
                        value={selectedItem.nama || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Jenis Kelamin</label>
                      <input
                        type="text"
                        value={selectedItem.jenisKelamin || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={selectedItem.tempatLahir || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Sekolah</label>
                      <input
                        type="text"
                        value={selectedItem.sekolah || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Kelas</label>
                      <input
                        type="text"
                        value={selectedItem.kelas || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-600 text-xs">Status Pendaftaran</label>
                      <span className="bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full text-xs inline-block mt-1">
                        Menunggu Konfirmasi
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-base font-medium mb-2">Berkas Pendaftaran</h3>
                      
                      {/* CV Document */}
                      <DocumentItem 
                        document={{
                          name: "CV.jpg",
                          size: selectedItem.berkas?.[0]?.size || "-",
                          dateAdded: selectedItem.berkas?.[0]?.dateAdded || "-",
                          url: selectedItem.berkas?.[0]?.url
                        }}
                        onDownload={handleDownload}
                        onPreview={handlePreview}
                      />
                      
                      {/* Ijazah Document */}
                      <DocumentItem 
                        document={{
                          name: "Ijazah.docx",
                          size: selectedItem.berkas?.[2]?.size || "-",
                          dateAdded: selectedItem.berkas?.[2]?.dateAdded || "-",
                          url: selectedItem.berkas?.[2]?.url
                        }}
                        onDownload={handleDownload}
                        onPreview={handlePreview}
                      />
                    </div>
                  </div>

                  {/* Kolom 2 - Alamat dan dokumen berkas Foto dan PPP */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Alamat</label>
                      <input
                        type="text"
                        value={selectedItem.alamat || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">No. Hp</label>
                      <input
                        type="text"
                        value={selectedItem.noHp || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Tanggal Lahir</label>
                      <input
                        type="text"
                        value={selectedItem.tanggalLahir || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-1">Jurusan</label>
                      <input
                        type="text"
                        value={selectedItem.jurusan || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 text-xs mb-4">NISN/NIM</label>
                      <input
                        type="text"
                        value={selectedItem.nisn || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-gray-600 text-xs mb-1">pp</label>
                    </div> */}
                    
                    
                    {/* Documents section (aligned with first column) */}
                    <div className="mt-2 md:mt-22">
                      {/* Foto Document */}
                      <DocumentItem 
                        document={{
                          name: "Foto.jpg",
                          size: selectedItem.berkas?.[1]?.size || "-",
                          dateAdded: selectedItem.berkas?.[1]?.dateAdded || "-",
                          url: selectedItem.berkas?.[1]?.url
                        }}
                        onDownload={handleDownload}
                        onPreview={handlePreview}
                      />
                      
                      {/* PPP Document */}
                      <DocumentItem 
                        document={{
                          name: "ppp.docx",
                          size: selectedItem.berkas?.[3]?.size || "-",
                          dateAdded: selectedItem.berkas?.[3]?.dateAdded || "-",
                          url: selectedItem.berkas?.[3]?.url
                        }}
                        onDownload={handleDownload}
                        onPreview={handlePreview}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex justify-between items-center w-full">
                <button
                  className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition"
                  onClick={closeModal}
                >
                  Tolak
                </button>

                <button
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  onClick={() => {
                    alert("Pendaftar diterima!");
                    closeModal();
                  }}
                >
                  Terima
                </button>

                <button
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
                  onClick={() => {
                    alert("Pendaftar diblokir!");
                    closeModal();
                  }}
                >
                  Blokir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}