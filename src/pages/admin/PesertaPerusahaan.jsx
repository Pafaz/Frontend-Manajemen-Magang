import { useState } from 'react';
import { MagnifyingGlass, CaretDown, Funnel, CalendarBlank } from 'phosphor-react';

export default function PesertaMagangTable() {
  const [interns, setInterns] = useState([
    {
      id: 1, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 2, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Alumni', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 3, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 4, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 5, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 6, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 7, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    },
    {
      id: 8, 
      name: 'Jane Cooper', 
      email: 'contoh@gmail.com', 
      status: 'Peserta Aktif', 
      school: 'SMKN 12 TULUNGAGUNG', 
      division: 'UI/UX Designer'
    }
  ]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Peserta Magang</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded">
            <CalendarBlank size={18} weight="bold" />
            <span>25 March 2023</span>
          </button>
          <button className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded">
            <Funnel size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Cari Sekolah..." 
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <MagnifyingGlass size={18} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
        
        <div className="relative w-48">
          <select className="w-full appearance-none border border-gray-300 rounded px-3 py-2 bg-white">
            <option>Divisi</option>
            <option>UI/UX Designer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
          </select>
          <CaretDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
        
        <div className="relative w-48">
          <select className="w-full appearance-none border border-gray-300 rounded px-3 py-2 bg-white">
            <option>Status Magang</option>
            <option>Peserta Aktif</option>
            <option>Alumni</option>
          </select>
          <CaretDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="pb-2 font-normal">#</th>
              <th className="pb-2 font-medium">Nama Lengkap</th>
              <th className="pb-2 font-medium">Email</th>
              <th className="pb-2 font-medium">
                <div className="flex items-center gap-1">
                  Status Magang <CaretDown size={14} />
                </div>
              </th>
              <th className="pb-2 font-medium">
                <div className="flex items-center gap-1">
                  Sekolah <CaretDown size={14} />
                </div>
              </th>
              <th className="pb-2 font-medium">
                <div className="flex items-center gap-1">
                  Divisi <CaretDown size={14} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern) => (
              <tr key={intern.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{intern.id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src="/api/placeholder/40/40" 
                        alt={intern.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{intern.name}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-600">{intern.email}</td>
                <td className="py-3">
                  <span className={`text-sm ${intern.status === 'Alumni' ? 'text-blue-600' : 'text-green-600'}`}>
                    {intern.status}
                  </span>
                </td>
                <td className="py-3">{intern.school}</td>
                <td className="py-3">{intern.division}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}