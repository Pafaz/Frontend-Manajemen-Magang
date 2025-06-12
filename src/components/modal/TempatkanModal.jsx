import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Select from "react-select";

const TempatkanModal = ({ isOpen, onClose, onSimpan, data }) => {
  const siswaList = [
    { id: 1, nama: "Nando" },
    { id: 2, nama: "Andi" },
    { id: 3, nama: "Sano" },
    { id: 4, nama: "Mita" },
    { id: 5, nama: "Gita" },
  ];

  const [selectedNama, setSelectedNama] = useState([]);
  const [divisi, setDivisi] = useState("");

  useEffect(() => {
    if (data) {
      setSelectedNama([{ label: data.nama, value: data.nama }]);
    }
  }, [data]);

  if (!isOpen) return null;

  const options = siswaList.map((siswa) => ({
    value: siswa.nama,
    label: siswa.nama,
  }));

  const handleRemove = (value) => {
    setSelectedNama((prev) => prev.filter((item) => item.value !== value));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/40 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10 relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Tempatkan Divisi</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pilih Siswa</label>
            <Select
              options={options}
              value={null}
              onChange={(selectedOption) => {
                if (
                  selectedOption &&
                  !selectedNama.find((item) => item.value === selectedOption.value)
                ) {
                  setSelectedNama((prev) => [...prev, selectedOption]);
                }
              }}
              placeholder="Pilih nama siswa..."
              className="text-sm"
            />
          </div>

          {/* Tampilkan chip nama siswa */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedNama.map((item) => (
              <div
                key={item.value}
                className="flex items-center border border-blue-200 rounded-md px-3 py-1 text-sm text-blue-700 bg-blue-50"
              >
                {item.label}
                <button
                  onClick={() => handleRemove(item.value)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* (Opsional) Input divisi */}
         

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-red-400 text-white rounded-full hover:bg-red-500"
            >
              Batal
            </button>
            <button
              onClick={() => {
                const namaList = selectedNama.map((item) => item.value);
                onSimpan({ namaList, divisi });
                onClose();
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempatkanModal;
