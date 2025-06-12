import React, { useState } from "react";

export default function TableAbsensi({ data, searchTerm, selectedDate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredData = data.filter((item) => {
    const isMatchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.tanggal).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

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

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "hadir":
        return <span className={`${base} bg-green-100 text-green-600`}>Hadir</span>;
      case "terlambat":
        return <span className={`${base} bg-yellow-100 text-yellow-600`}>Terlambat</span>;
      case "alpha":
        return <span className={`${base} bg-red-100 text-red-600`}>Alpha</span>;
      default:
        return <span className={base}>{status}</span>;
    }
  };

  const getLateClass = (status) => {
    return status.toLowerCase() === "terlambat" ? "text-red-500" : "";
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium">No</th>
            <th className="px-3 py-3 text-center font-medium w-48">Nama</th>
            <th className="px-3 py-3 text-center font-medium">Masuk</th>
            <th className="px-3 py-3 text-center font-medium">Istirahat</th>
            <th className="px-3 py-3 text-center font-medium">Kembali</th>
            <th className="px-3 py-3 text-center font-medium">Pulang</th>
            <th className="px-3 py-3 text-center font-medium">Metode</th>
            <th className="px-3 py-3 text-center font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id}
              className="border-t border-gray-200 hover:bg-gray-50 text-center"
            >
              <td className="px-3 py-3">{index + 1}</td>
              <td className="px-3 py-3 flex items-center gap-2 justify-left text-left">
                <img
                  src={item.image}
                  alt={item.nama}
                  className="w-8 h-8 rounded-full"
                />
                {item.nama}
              </td>
              <td className={`px-3 py-3 ${getLateClass(item.status)}`}>{item.jamMasuk}</td>
              <td className="px-3 py-3">{item.istirahat}</td>
              <td className="px-3 py-3">{item.kembali}</td>
              <td className="px-3 py-3">{item.pulang}</td>
              <td className="px-3 py-3">{item.metode}</td>
              <td className="px-3 py-3">{getStatusBadge(item.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
