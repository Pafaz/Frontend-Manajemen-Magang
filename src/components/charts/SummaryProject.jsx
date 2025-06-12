import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function StudentProjectSummary() {
  const [currentDivisiIndex, setCurrentDivisiIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Data divisi yang memiliki jumlah tahap yang berbeda
  const divisiData = [
    {
      divisi: "Divisi UI/UX Design",
      series: [10, 20, 15, 18, 12],
      labels: ['Tahap Pengenalan', 'Tahap Desain', 'Tahap Pre Mini Project', 'Tahap Pre Project', 'Tahap Big Project'],
      legendItems: [
        { color: '#2E5090', label: 'Tahap Pengenalan', count: 10 },
        { color: '#5C8CD8', label: 'Tahap Desain', count: 20 },
        { color: '#A0C4FF', label: 'Tahap Pre Mini Project', count: 15 },
        { color: '#E6F0FF', label: 'Tahap Pre Project', count: 18 },
        { color: '#F2F7FF', label: 'Tahap Big Project', count: 12 }
      ]
    },
    {
      divisi: "Divisi Frontend Development",
      series: [14, 22, 19, 13],
      labels: ['Tahap Pengenalan', 'Tahap Dasar', 'Tahap Pre Project', 'Tahap Final Project'],
      legendItems: [
        { color: '#1D6B94', label: 'Tahap Pengenalan', count: 14 },
        { color: '#3A88C8', label: 'Tahap Dasar', count: 22 },
        { color: '#77A9DB', label: 'Tahap Pre Project', count: 19 },
        { color: '#B9D8F7', label: 'Tahap Final Project', count: 13 }
      ]
    },
    {
      divisi: "Divisi Backend Development",
      series: [5, 9, 18, 10, 15],
      labels: ['Tahap Pengenalan', 'Tahap Dasar', 'Tahap Pre Mini Project', 'Tahap Pre Project', 'Tahap Big Project'],
      legendItems: [
        { color: '#6B8E23', label: 'Tahap Pengenalan', count: 5 },
        { color: '#8FBC8F', label: 'Tahap Dasar', count: 9 },
        { color: '#A9D69B', label: 'Tahap Pre Mini Project', count: 18 },
        { color: '#C1E1C1', label: 'Tahap Pre Project', count: 10 },
        { color: '#E1F3E1', label: 'Tahap Big Project', count: 15 }
      ]
    },
    {
      divisi: "Divisi QA",
      series: [8, 7, 12],
      labels: ['Tahap Pengenalan', 'Tahap Pengujian', 'Tahap Finalisasi'],
      legendItems: [
        { color: '#F6B6B6', label: 'Tahap Pengenalan', count: 8 },
        { color: '#F08A8A', label: 'Tahap Pengujian', count: 7 },
        { color: '#E64A4A', label: 'Tahap Finalisasi', count: 12 }
      ]
    }
  ];

  // Setup interval untuk mengganti divisi
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true); // Mulai animasi
      setCurrentDivisiIndex((prevIndex) => (prevIndex + 1) % divisiData.length);
    }, 5000); // Mengubah divisi setiap 5 detik

    return () => clearInterval(intervalId); // Membersihkan interval saat komponen dibersihkan
  }, []);

  // Mendapatkan data divisi yang aktif
  const { divisi, series, labels, legendItems } = divisiData[currentDivisiIndex];

  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#2E5090', '#5C8CD8', '#A0C4FF', '#E6F0FF', '#F2F7FF'],
    labels: labels,  // Gunakan labels yang dinamis sesuai divisi
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          background: 'transparent',
          labels: {
            show: false,
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    tooltip: {
      y: {
        formatter: function(value) {
          return value + " Orang";
        }
      }
    }
  };

  // Setelah animasi selesai, reset animasi untuk transisi berikutnya
  useEffect(() => {
    if (isAnimating) {
      const timeoutId = setTimeout(() => setIsAnimating(false), 500); // Animasi selama 0.5 detik
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimating]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Ringkasan Project Siswa</h2>
      <h3 className="text-md font-medium text-gray-700 mb-6">{divisi}</h3>
      
      <div className={`chart-container mb-4 ${isAnimating ? 'slide-out' : 'slide-in'} transition-all duration-500`}>
        <ReactApexChart 
          options={options} 
          series={series} 
          type="donut" 
          height={200}
        />
      </div>
      
      <div className="legend-container">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-700 mr-1">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">{item.count} Orang</span>
          </div>
        ))}
      </div>
    </div>
  );
}
