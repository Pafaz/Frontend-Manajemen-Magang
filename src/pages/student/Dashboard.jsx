import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AlertVerification from "../../components/AlertVerification";
import Calendar from "../../components/Calendar";
import ChartStats from "../../components/charts/ChartStats";
import Card from "../../components/cards/Card";
import StaticJurnal from "../../components/charts/StaticJurnal";
import Title from "../../components/Title";
import RevisionCard from "../../components/cards/RevisionCard";
import ProjectStats from "../../components/charts/ProjectStats";
import PresentationCard from "../../components/cards/PresentationCard";
import RiwayatProject from "../../components/cards/RiwayatProject";
import ProjectBerjalan from "../../components/cards/ProjectBerjalan";

import { StatusContext } from "./StatusContext";

const Dashboard = () => {
  const [rekap, setRekap] = useState([]);
  const location = useLocation();
  localStorage.setItem("location", location.pathname);
  console.log(rekap);
  const projects = rekap?.route;
  const totalIzin = rekap?.kehadiran?.total_izin;
  const totalAlpha = rekap?.kehadiran?.total_alpha;
  const totalHadir = rekap?.kehadiran?.total_hadir;
  const totalTerlambat = rekap?.kehadiran?.total_terlambat;
  
  const { profileComplete, internshipStatus, userLoading } = useContext(StatusContext);
  const getRekap = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/peserta/rekap`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setRekap(res.data);
  }

  useEffect(() => {
    const fetchRekap = async () => {
      try {
        await getRekap();
      } catch (err) {
        console.error("Gagal mengambil rekap:", err);
      }
    };

    fetchRekap();
  }, []);

  const dataMagangBerlangsung = {
    companyName: rekap?.magang?.perusahaan || "Belum terdaftar magang di perusahaan",
    position: rekap?.magang?.divisi || "Belum tergabung dalam divisi",
    logo: "/assets/img/Cover.png",
  };
  const statsData = [
    {
      title: "Total Hadir",
      value: totalHadir || 0,
      icon: "/assets/icons/absensi/book.png",
      color: "#3B82F6",
      data: [10, 15, 12, 18, 14, 20, 22, 19, 17, 25, 21, 23],
    },
    {
      title: "Total Alpha",
      value: totalAlpha || 0,
      icon: "/assets/icons/absensi/certificateLogo.png",
      color: "#10B981",
      data: [8, 12, 15, 20, 18, 16, 19, 17, 22, 24, 20, 21],
    },
    {
      title: "Total Izin / Sakit",
      value: totalIzin || 0,
      icon: "/assets/icons/absensi/graduate.png",
      color: "#6366F1",
      data: [3, 5, 4, 6, 2, 3, 4, 2, 5, 3, 4, 5],
    },
    {
      title: "Total Terlambat",
      value: totalTerlambat || 0,
      icon: "/assets/icons/absensi/mens.png",
      color: "#F97316",
      data: [2, 4, 3, 5, 1, 2, 3, 2, 4, 3, 2, 3],
    },
  ];

  const dataRevision = [
    { title: "Revisi Tampilan", desc: "Due in 9 days" },
    { title: "Revisi Controller", desc: "Due in 9 days" },
    { title: "Revisi Bahasa", desc: "Due in 9 days" },
  ];

  const presentations = [
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

  if (userLoading) {
    return (
      <div className="h-screen">
        <div className="w-full h-14 bg-slate-300 border border-slate-200 rounded-lg flex justify-between py-1 px-3 items-center mb-4 animate-pulse">
          <div className="bg-slate-400 w-1/3 h-5 rounded animate-pulse"></div>
          <div className="bg-slate-400 w-1/6 h-5 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profileComplete ) {
    return (
      <div className="w-full">
        <AlertVerification />
        <div className="w-xl mx-auto h-screen">
          <img src="/assets/svg/Forms.svg" alt="Forms.svg" />
        </div>
      </div>
    );
  }

  if (!internshipStatus) {
    return (
      <div className="w-full pt-10 ">
        <div className="w-xl mx-auto flex flex-col items-center justify-center">
          <img src="/assets/svg/Company-amico.svg" alt="Company-amico.svg" className="max-w-md" />
          <p className="text-lg font-medium text-gray-700 mt-4">
            Anda Belum Terdaftar Magang
          </p>
        </div>
      </div>
    );
  }

    return (
    <div className="w-full">
      <div className="flex w-full gap-5">
        <div className="flex-[8] w-full">
          <Card className="mt-0">
            <div className="grid grid-cols-4 gap-3">
              {statsData.map((item, index) => (
                <ChartStats
                  icon={item.icon}
                  value={item.value}
                  color={item.color}
                  title={item.title}
                  key={index + 1}
                  seriesData={item.data}
                />
              ))}
            </div>
          </Card>
          <Card className="my-7">
            <StaticJurnal />
          </Card>
          <Card>
            <RiwayatProject projects = {projects}/>
          </Card>
        </div>
        <div className="flex-[3] flex-col gap-5">
          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mr-4 overflow-hidden">
              <img src={dataMagangBerlangsung.logo} alt="Company Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-[#0069AB] font-bold text-lg">MAGANG BERLANGSUNG</h2>
              <h3 className="text-black font-semibold text-sm">{dataMagangBerlangsung.companyName}</h3>
              <p className="text-black text-sm">{dataMagangBerlangsung.position}</p>
            </div>
          </div>

          <Calendar />
          <Card className="mt-3">
            <ProjectBerjalan/>
          </Card>
          <Card className="px-0 py-2 mb-3">
            <div className="border-b border-slate-400/[0.5] py-3">
              <Title className="ml-5">My Progress</Title>
            </div>
            <ProjectStats  />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
