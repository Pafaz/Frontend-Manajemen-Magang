import React from "react";
import PresentationCard from "../../components/cards/PresentationCard";

const RiwayatPresentasi = () => {
  const basePresentations = [
    {
      status: "Scheduled",
      title: "Pengenalan",
      participants: 15,
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-yellow-500 bg-yellow-50",
    },
    {
      status: "Completed",
      title: "Dasar",
      participants: 15,
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-green-500 bg-green-50",
    },
    {
      status: "Completed",
      title: "Pre Mini Project",
      participants: 15,
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-green-500 bg-green-50",
    },
  ];

  const count = 5;

  const presentations = Array(count)
    .fill(basePresentations)
    .flat()
    .map((item, index) => ({
      ...item,
      title: `${item.title} ${index + 1}`,
    }));
  return (
    <div className="px-5">
      <h1 className="text-2xl font-semibold  mb-6 mt-2">Riwayat Presentasi</h1>
      <div className="grid grid-cols-4 gap-3">
        {presentations.map((item, index) => (
          <PresentationCard
            key={index}
            item={item}
            buttonLabel="Lihat Detail"
          />
        ))}
      </div>
    </div>
  );
};

export default RiwayatPresentasi;
