import { useState } from "react";
import Button from "../../Button";

const HeroSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div
      className="relative px-14 py-20 flex items-center gap-10 w-full bg-gradient-to-br from-blue-100 to-white"
      id="hero"
    >
      <div className="text-left">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Sistem Manajemen Magang <br /> Terbaik untuk Perusahaan Anda
        </h1>
        <p className="text-2xl text-blue-600 font-bold mt-2">
          Kelola Program Magang dengan Mudah & Efektif
        </p>
        <p className="text-gray-600 mt-4 text-lg font-normal">
          Bantu perusahaan Anda mengelola program magang dengan sistem yang
          terintegrasi. Dari pendaftaran, pemantauan, hingga evaluasi, semuanya
          dapat dilakukan dalam satu platform.
        </p>
        <div className="w-44">
          <a href="/auth/register">
            <Button icon="bi-rocket-takeoff" color="blue" size_rounded="xl">
              Coba Sekarang!
            </Button>
          </a>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <img
          src="assets/img/Hero.png"
          alt="hero"
          className="rounded-lg w-5/6"
        />
      </div>
      <div className="absolute z-50 grid grid-cols-3 gap-5 px-14 right-0 left-0 -bottom-10">
        <div
          className={`group w-full px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card1")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-1.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 group-hover:rotate-y-180"
          />
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl group-hover:text-white">
              Lebih dari 18+ Juta Siswa
            </h1>
            <p className="font-light text-sm group-hover:text-white">
              Kami menyediakan program pembelajaran online yang dapat diakses oleh peserta didik.
            </p>
          </div>
        </div>

        <div
          className={`group w-full px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card2")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-2.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 animate-flip"
          />
          <div>
            <h1 className="font-semibold text-lg">6354+ Kursus Online</h1>
            <p className="font-light text-sm">
              Pendidikan online memberikan fleksibilitas dan aksesibilitas bagi para pelajar.
            </p>
          </div>
        </div>

        <div
          className={`group w-full px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card3")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-3.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 group-hover:rotate-y-180"
          />
          <div>
            <h1 className="font-semibold text-lg group-hover:text-white">
              Akses Seumur Hidup
            </h1>
            <p className="font-light text-sm group-hover:text-white">
              Kami menyediakan program pembelajaran online yang dapat diakses oleh peserta didik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
