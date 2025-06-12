import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // pastikan sudah install lucide-react

const ChecklistRevisi = () => {
  const [isOpen, setIsOpen] = useState(true);

  const checklistItems = [
    { text: "Revisi bagian tampilan agar layoutnya lebih menarik", checked: true },
    { text: "Revisi bagian tampilan agar layoutnya lebih menarik", checked: true },
    { text: "Revisi bagian tampilan agar layoutnya lebih menarik", checked: false },
    { text: "Revisi bagian tampilan agar layoutnya lebih menarik", checked: false },
    { text: "Revisi bagian tampilan agar layoutnya lebih menarik", checked: false },
  ];

  const totalChecked = checklistItems.filter((item) => item.checked).length;

  return (
    <div className="bg-white rounded-xl mt-5 p-3 w-full">
      <div
        className="flex items-center justify-between cursor-pointer border-b border-slate-500/[0.5] py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="text-sky-800 font-semibold">Revisi Tampilan</h2>
          <p className="text-xs text-sky-600 font-medium">{totalChecked} / {checklistItems.length}</p>
        </div>
        {isOpen ? <ChevronUp className="text-sky-600" /> : <ChevronDown className="text-sky-600" />}
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm text-slate-600">
              <div
                className={`w-8 h-6 rounded-full flex items-center justify-center border-2 
                  ${item.checked ? "bg-sky-600 border-sky-600" : "border-gray-300"}`}
              >
                {item.checked && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`${item.checked ? "text-slate-700 font-medium" : "font-light"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistRevisi;
