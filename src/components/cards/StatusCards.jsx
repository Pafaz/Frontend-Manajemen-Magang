import React from "react";
import {
  Hourglass,
  UserX,
  UserCheck,
  UserMinus,
  Laptop,
  Monitor,
  Users,
} from "lucide-react";

const StatusCards = () => {
  const statusList = [
    {
      color: "bg-yellow-400",
      icon: <Hourglass size={20} />,
      title: "Menunggu Konfirmasi",
      count: 24,
    },
    {
      color: "bg-red-500",
      icon: <UserX size={20} />,
      title: "Siswa Ditolak",
      count: 2,
    },
    {
      color: "bg-blue-500",
      icon: <UserCheck size={20} />,
      title: "Siswa Aktif",
      count: 4,
    },
    {
      color: "bg-red-400",
      icon: <UserMinus size={20} />,
      title: "Siswa Tidak Aktif",
      count: 4,
    },
    {
      color: "bg-blue-400",
      icon: <Laptop size={20} />,
      title: "Siswa Online",
      count: 4,
    },
    {
      color: "bg-green-400",
      icon: <Monitor size={20} />,
      title: "Siswa Offline",
      count: 4,
    },
    {
      color: "bg-violet-500",
      icon: <Users size={20} />,
      title: "Total Alumni",
      count: 4,
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 w-full">
      {statusList.map((item, index) => (
        <div
          key={index}
          className="bg-white border rounded-2xl border-[#667797] p-4 flex items-center gap-4 flex-1 min-w-[150px] max-w-[calc(100%/4-1rem)]"
        >
          <div className={`text-white rounded-full p-2 ${item.color}`}>
            {item.icon}
          </div>
          <div>
          <p className="text-[10px] text-black-500 font-semibold">{item.title}</p>
          <p className="text-[14px] font-semibold">{item.count} Orang</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;
