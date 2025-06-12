import React from "react";

const InternshipLanding = () => {
  return (
    <section className="w-full bg-white pt-32 pb-10 relative px-20 h-screen">
      <div className="absolute left-0 -top-25">
        <img src="assets/icons/line_4.png" alt="Line_4" />
      </div>
      <div className="absolute left-0">
        <img
          src="assets/icons/line_4.png"
          alt="Line_4"
          className="z-10 opacity-80"
        />
      </div>

      <div className="flex justify-between z-20 absolute">
        <div className="w-full space-y-6 py-5">
          <h1 className="text-slate-800 text-3xl font-bold -tracking-wide">
            Mulai Perjalanan Magangmu Sekarang!
          </h1>
          <p className="text-slate-600 text-sm text-left w-5/6">
            Ingin mendapatkan pengalaman kerja nyata? Atau mencari talenta
            terbaik untuk tim Anda? Kami menyediakan platform yang menghubungkan
            siswa dengan perusahaan untuk magang terbaik.
          </p>
          <img src="assets/img/IntershipLanding.png" alt="IntershipLanding" className="top-24 absolute"/>
        </div>

        <div className="w-full flex gap-5 justify-center mt-25">
          <div>
            <div className="bg-[#F3F7FB] shadow-lg rounded-2xl px-3 py-6 flex flex-col gap-5 w-[275px] justify-center items-center">
              <img
                src="assets/icons/feature_1_4.png"
                alt="feature_1_4"
                className="w-12 h-12 mx-auto"
              />
              <h1 className="text-slate-900 font-semibold text-lg text-center">
                Daftarkan Perusahaan
              </h1>
              <p className="text-slate-500 text-sm text-center">
                Daftarkan perusahaan Anda untuk mengelola magang secara
                otomatis. Buka lowongan, kelola pelamar, dan temukan kandidat
                terbaik dengan mudah!
              </p>
              <a href="/auth/register">
              <button className="bg-[#0069AB] text-white px-4 py-1.5 rounded-lg flex items-center justify-center gap-2 mx-auto cursor-pointer hover:bg-[#385c70]">
              <i className="bi bi-rocket-takeoff text-lg text-white font-semibold"></i>
                Daftar
              </button>
              </a>
            </div>
          </div>
          <div>
            <div className="bg-[#F3F7FB] shadow-lg rounded-2xl px-3 py-6 flex flex-col gap-5 w-[275px] justify-center items-center mt-30">
              <img
                src="assets/icons/feature_1_4.png"
                alt="feature_1_4"
                className="w-12 h-12 mx-auto"
              />
              <h1 className="text-slate-900 font-semibold text-lg text-center">
                Daftar Magang Siswa
              </h1>
              <p className="text-slate-500 text-sm text-center">
                Tingkatkan pengalaman dan keterampilan dengan magang di berbagai
                perusahaan ternama. Persiapkan diri untuk dunia kerja!
              </p>
              <a href="/auth/register">
              <button className="bg-[#0069AB] text-white px-4 py-1.5 rounded-lg flex items-center justify-center gap-2 mx-auto cursor-pointer hover:bg-[#385c70]">
              <i className="bi bi-rocket-takeoff text-lg text-white font-semibold"></i>
                Daftar
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternshipLanding;
