import React from "react";

const PresentationCard = ({ item, buttonLabel = "Lihat Detail", onButtonClick }) => (
  <div className="p-2 rounded-lg border border-slate-400/[0.5] bg-white cursor-pointer">
    <div className="w-full h-32 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
      <img src="/assets/img/giphy.gif" alt="Presentation" className="w-full" />
    </div>
    <div className="mt-2">
      <span
        className={`px-2 py-1 mt-2 text-[12px] font-light rounded-full ${item.statusColor}`}
      >
        {item.status}
      </span>
    </div>
    <h3 className="font-semibold mt-3">{item.title}</h3>
    <div className="flex items-center gap-2 mt-2">
      <div className="flex -space-x-1">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src="/assets/img/user-img.png"
            className="w-6 h-6 rounded-full border border-white"
            alt="User"
          />
        ))}
      </div>
      <span className="text-sm font-medium">{item.participants}</span>
    </div>
    <div className="flex justify-between border-t border-slate-500 mt-5 py-2">
      <div className="flex gap-3 items-center">
        <i className="bi bi-calendar2-minus text-[10px] text-blue-500"></i>
        <p className="text-[9px] text-gray-500 font-medium">{item.date}</p>
      </div>
      <div className="flex gap-3">
        <i className="bi bi-clock text-[10px] text-blue-500"></i>
        <p className="text-[9px] text-gray-500 font-medium">{item.time}</p>
      </div>
    </div>
    <button
      onClick={() => onButtonClick?.(item)}
      className="w-full mt-2 py-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in rounded-full text-sm font-medium"
    >
      {buttonLabel}
    </button>
  </div>
);

export default PresentationCard;
