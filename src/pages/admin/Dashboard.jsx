import React, { useContext, useEffect, useState } from "react";
import AlertVerification from "../../components/AlertVerification";
import ActivityChart from "../../components/charts/ActivityChart";
import PerusahaanChart from "../../components/charts/PerusahaanChart";
import Card from "../../components/cards/Card";
import StaticAbsensiPerusahaan from "../../components/charts/StaticAbsensiPerusahaan";
import PesertaMagangChart from "../../components/charts/PesertaMagangChart";
import CabangChart from "../../components/charts/CabangChart";
import StatistikJurnalChart from "../../components/charts/StatistikJurnalChart";
import StatistikPendaftarChartMini from "../../components/charts/StatistikPendaftarChartMini";
import Title from "../../components/Title";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const Dashboard = () => {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  localStorage.setItem("location", location.pathname);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkComplateRegistered = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/perusahaan/detail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTimeout(() => {
          setCompanyData(response.data.data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.log(err);
      }
    };
    checkComplateRegistered();
  }, []);
  const statsData = [
    {
      title: "Total Cabang",
      value: "20 Cabang",
      icon: "/assets/icons/absensi/book.png",
      color: "#3B82F6",
      data: [10, 15, 12, 18, 14, 20, 22, 19, 17, 25, 21, 23],
      subDetails: {
        premium: 13,
        free: 7,
      },
    },
    {
      title: "Total Peserta Magang",
      value: "110",
      icon: "/assets/icons/absensi/certificateLogo.png",
      color: "#10B981",
      data: [8, 12, 15, 20, 18, 16, 19, 17, 22, 24, 20, 21],
    },
    {
      title: "Pengisian Jurnal",
      value: "30",
      icon: "/assets/icons/absensi/graduate.png",
      color: "#6366F1",
      data: [3, 5, 4, 6, 2, 3, 4, 2, 5, 3, 4, 5],
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {loading ? (
        <div className="h-screen">
          <div className="w-full h-14 bg-slate-300 border border-slate-200 rounded-lg flex justify-between py-1 px-3 items-center mb-4 animate-pulse">
            <div className="bg-slate-400 w-1/3 h-5 rounded animate-pulse"></div>
            <div className="bg-slate-400 w-1/6 h-5 rounded animate-pulse"></div>
          </div>
        </div>
      ) : companyData !== "true" ? (
        <>
          <AlertVerification />
          <div className="w-xl mx-auto h-screen">
            <img src="/assets/svg/Forms.svg" alt="Forms.svg" />
          </div>
        </>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex-[8] w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statsData.map((item, index) => (
                <PerusahaanChart
                  key={index}
                  icon={item.icon}
                  value={item.value}
                  color={item.color}
                  title={item.title}
                  seriesData={item.data}
                />
              ))}
            </div>

            {/* Chart Absensi */}
            <Card className="my-7">
              <StaticAbsensiPerusahaan />
            </Card>

            {/* Chart Peserta Magang */}
            <Card>
              <PesertaMagangChart />
            </Card>
          </div>

          {/* KANAN */}
          <div className="flex-[3] flex flex-col gap-5">
            <Card className="mt-0">
              <div className="border-b border-slate-400/[0.5] py-3">
                <Title className="ml-5">Statistik Cabang</Title>
              </div>
              <CabangChart />
            </Card>

            <Card>
              <StatistikJurnalChart />
            </Card>

            <Card className="px-0 py-2">
              <StatistikPendaftarChartMini />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
