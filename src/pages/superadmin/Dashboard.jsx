import React from "react";
import Card from "../../components/cards/Card";
import CardsSuperadmin from "../../components/cards/CardsSuperadmin";
import StatistikPeserta from "../../components/charts/StatistikPeserta";
import ChartLowongan from "../../components/charts/ChartLowongan";
import Perusahaanterdaftar from "../../components/cards/Perusahaanterdaftar";
import PesertaAksiChart from "../../components/charts/PesertaAksiChart";
import CabangTerdaftar from "../../components/cards/CabangTerdaftar";
import DivisiTerdata from "../../components/charts/DivisiTerdaftar";

const MentorDashboard = () => {
  return (
    <div className="w-full h-full pb-10">
      {/* GreetingsBox yang full width */}
      <div className="w-full">
        <CardsSuperadmin />
      </div>
      
      {/* Layout utama dengan 3 kolom */}
      <div className="flex w-full gap-2 h-full">
        {/* Kolom kiri - 2 baris cards */}
        <div className="flex-[12] flex flex-col gap-2">
          {/* Baris pertama */}
          <div className="flex gap-2 h-[450px] mb-6">
            <div className="flex-[8] w-60 flex flex-col gap-2">
              <div className="flex-1 h-15">
                <StatistikPeserta />
              </div>
            </div>
            <div className="flex-[4] w-60 flex flex-col gap-2">
              <div className="flex-1 h-20">
                <Perusahaanterdaftar />
              </div>
            </div>
          </div>
          
          {/* Baris kedua */}
          <div className="flex gap-2 h-[300px]">
            <div className="flex-[5] w-60 flex flex-col gap-2">
              <div className="flex-1 h-15">
                <PesertaAksiChart />
              </div>
            </div>
            <div className="flex-[4] w-60 flex flex-col gap-2 -mt-2">
              <div className="flex-1 h-15">
                <CabangTerdaftar />
              </div>
            </div>
            <div className="flex-[4] w-60 flex flex-col gap-2 -mt-2">
              <div className="flex-1 h-20">
                <StatistikPeserta />
              </div>
            </div>
          </div>
        </div>
        
        {/* Kolom kanan - Chart Lowongan dan DivisiTerdata full height */}
        <div className="flex-[1] flex flex-col gap-2 mt-3">
          <Card className="px-1 py-1 h-[350px]">
            <ChartLowongan />
          </Card>
          <Card className="px-1 py-1 h-[410px]">
            <DivisiTerdata />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;