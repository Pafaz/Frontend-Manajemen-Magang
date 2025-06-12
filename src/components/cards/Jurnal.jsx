import React, { useState } from "react";
import JurnalDetailModal from "../../components/modal/JurnalDetailModal";

export default function TableJurnal({
  data = [],
  searchTerm = "",
  selectedDate = null,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const safeData = Array.isArray(data) ? data : [];

  const filteredData = safeData.filter((item) => {
    const isMatchSearch =
      item.sekolah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tanggal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.tanggal).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status?.toLowerCase() === "mengisi") {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-600`}>
          Mengisi
        </span>
      );
    } else if (status?.toLowerCase() === "tidak mengisi") {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-600`}>
          Tidak Mengisi
        </span>
      );
    }
    return null;
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium w-[50px]">No</th>
            <th className="px-3 py-3 text-center font-medium w-[180px]">
              Nama
            </th>
            <th className="px-3 py-3 text-center font-medium w-[200px]">
              Nama Sekolah
            </th>
            <th className="px-3 py-3 text-center font-medium w-[130px]">
              Tanggal
            </th>
            <th className="px-3 py-3 text-center font-medium w-[250px]">
              Deskripsi
            </th>
            <th className="px-3 py-3 text-center font-medium w-[140px]">
              Status Jurnal
            </th>
            <th className="px-3 py-3 text-center font-medium w-[80px]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id || index}
              className="border-t border-gray-200 hover:bg-gray-50 text-center align-top"
            >
              <td className="px-3 py-3">{index + 1}</td>
              <td className="px-3 py-3 flex items-center gap-2 justify-start text-left">
                <img
                  src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                    item.image
                  }`}
                  alt={item.nama}
                  className="w-8 h-8 rounded-full"
                />
                {item.nama}
              </td>
              <td className="px-3 py-3 text-center">{item.sekolah}</td>
              <td className="px-3 py-3">{item.tanggal}</td>
              <td className="px-3 py-3 text-left break-words whitespace-pre-wrap">
                {item.deskripsi?.length > 50
                  ? item.deskripsi.slice(0, 50) + "..."
                  : item.deskripsi}
              </td>
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

      {isModalOpen && selectedItem && (
        <JurnalDetailModal
          selectedItem={selectedItem}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}