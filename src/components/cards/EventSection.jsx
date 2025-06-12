import { useState } from 'react';
import { Calendar, Clock, Users, Video, Link } from 'lucide-react';

export default function PresentationSchedule() {
  const [expandedItem, setExpandedItem] = useState(null);

  const scheduleItems = [
    {
      id: 1,
      title: "Presentasi Tahap Dasar",
      date: "25 Januari 2021",
      time: "13.00 - 14.00 (2 jam)",
      attendees: "5 Orang",
      mode: "Online",
      link: "https://zoom.us/j/123456789"
    },
    {
      id: 2,
      title: "Presentasi Tahap Menengah",
      date: "28 Januari 2021",
      time: "14.00 - 16.00 (2 jam)",
      attendees: "7 Orang",
      mode: "Online",
      link: "https://zoom.us/j/987654321"
    },
    {
      id: 3,
      title: "Presentasi Tahap Lanjutan",
      date: "2 Februari 2021",
      time: "09.00 - 11.00 (2 jam)",
      attendees: "4 Orang",
      mode: "Offline",
      link: "Ruang Meeting A, Lantai 3"
    },
    {
      id: 4,
      title: "Review & Evaluasi",
      date: "5 Februari 2021",
      time: "15.00 - 17.00 (2 jam)",
      attendees: "8 Orang",
      mode: "Hybrid",
      link: "https://zoom.us/j/456789123"
    },
    {
      id: 5,
      title: "Presentasi Final",
      date: "8 Februari 2021",
      time: "10.00 - 12.00 (2 jam)",
      attendees: "10 Orang",
      mode: "Online",
      link: "https://zoom.us/j/654321987"
    },
    {
      id: 6,
      title: "Follow-up Discussion",
      date: "12 Februari 2021",
      time: "13.30 - 15.30 (2 jam)",
      attendees: "6 Orang",
      mode: "Online",
      link: "https://zoom.us/j/147258369"
    },
    {
      id: 7,
      title: "Closing Ceremony",
      date: "15 Februari 2021",
      time: "16.00 - 18.00 (2 jam)",
      attendees: "15 Orang",
      mode: "Offline",
      link: "Auditorium Utama"
    }
  ];

  const toggleItem = (id) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  const iconColor = "#667797";

  // Custom chevron components sebagai fallback
  const ChevronDown = () => (
    <svg 
      className="w-5 h-5" 
      style={{ color: iconColor }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const ChevronUp = () => (
    <svg 
      className="w-5 h-5" 
      style={{ color: iconColor }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <h1 className="text-lg font-bold mb-4">Jadwal Presentasi</h1>
      
      <div className="h-80 overflow-y-auto pr-2 hide-scrollbar">
        <div className="space-y-4">
          {scheduleItems.map((item) => (
            <div 
              key={item.id} 
              className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${expandedItem === item.id ? 'h-64' : 'h-16'}`}
            >
              <div className="h-16 flex items-center">
                <button
                  className="w-full flex justify-between items-center px-4 py-2 text-left"
                  onClick={() => toggleItem(item.id)}
                >
                  <div>
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  {expandedItem === item.id ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              
              {expandedItem === item.id && (
                <div className="border-t border-gray-100 h-48 overflow-y-auto hide-scrollbar">
                  <div className="px-4 py-3">
                    <div className="space-y-3" style={{ color: iconColor }}>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="text-sm">Selasa, {item.date}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="text-sm">{item.time}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        <span className="text-sm">{item.attendees}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Video className="w-5 h-5 mr-2" />
                        <span className="text-sm">{item.mode}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <Link className="w-5 h-5 mr-2 mt-0.5" />
                        <a href={item.link} className="text-sm text-blue-600 break-all">{item.link}</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}