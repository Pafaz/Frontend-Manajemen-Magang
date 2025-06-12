import React from 'react';

export default function ProjectCard() {
  return (
    <div className="w-full max-w-md p-2">
      <h1 className="text-xl font-bold text-gray-800 mb-3">Project sedang berjalan</h1>
      
      <div className="border border-gray-300 rounded-md p-4">
  <div className="flex items-center mb-4">
    <div className="bg-blue-100 rounded-full p-3 mr-5 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="#0369a1"
        className="bi bi-mortarboard-fill"
        viewBox="0 0 16 16"
      >
        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
      </svg>
    </div>
    <h2 className="text-base font-semibold text-gray-800">Tahap Mini Project</h2>
  </div>

  <div className="mb-4 flex justify-between items-center">
    <div className="text-sm font-medium text-gray-800">Jumlah Presentasi</div>
    <div className="text-sm text-blue-500 font-medium">2x Presentasi</div>
  </div>

  <div className="mb-4 flex justify-between items-center">
    <div className="text-sm font-medium text-gray-800">Jumlah Revisi</div>
    <div className="text-sm text-blue-500 font-medium">8 Revisi</div>
  </div>

  <div className="mb-6">
    <div className="text-sm font-medium text-gray-800 mb-1">Progress Pengerjaan</div>
    <div className="flex items-center justify-between">
      <div className="w-full bg-gray-300 rounded-full h-2 mr-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
      </div>
      <span className="text-sm text-gray-600 font-medium">75%</span>
    </div>
  </div>

  <div className="flex justify-end mt-3">
    <button className="bg-blue-50 text-blue-500 px-3 py-1 rounded font-medium text-sm">
      Lihat Detail
    </button>
  </div>
</div>

    </div>
  );
}
