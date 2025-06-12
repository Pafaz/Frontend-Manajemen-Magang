import Badge from "../../Badge";

const About_us = () => {
  return (
    <section className="relative pt-14 pb-22 px-14 bg-indigo-50 w-full overflow-hidden">
      <img
        src="assets/img/shapes.png"
        alt="Shapes"
        className="absolute inset-0 -top-52 left-0 w-full h-auto object-cover opacity-15 pointer-events-none"
      />
      <div className="flex justify-between items-center">
        <div className="">
          <img
            src="assets/img/section_about/ilustration_about_us.png"
            alt="ilustration_about_us"
          />
        </div>
        <div className="flex flex-col gap-5 max-w-2xl">
          <Badge>
            <i className="bi bi-journal-text"></i> Tentang Sistem Kami
          </Badge>
          <h1 className="font-bold text-left text-2xl">
            Selamat Datang di aplikasi Manajemen Magang – Solusi Manajemen Magang Terpadu
          </h1>
          <p className="text-slate-500 text-sm text-left">
            Kami menghadirkan platform inovatif yang menghubungkan mahasiswa
            dengan perusahaan dalam program magang yang terstruktur. Dengan
            sistem ini, proses perekrutan, pemantauan, dan evaluasi magang
            menjadi lebih mudah dan efisien.
          </p>
          <div className="grid grid-cols-2 gap-5 mt-3">
            <div className="flex gap-2">
              <div className="w-22">
                <img src="assets/img/section_about/Vector.png" alt="Vector" className="w-full"/>
              </div>
                <div className="flex flex-col gap-2 px-2">
                    <h1 className="font-semibold text-sm text-black">Magang untuk Siswa/Mahasiswa</h1>
                    <p className="text-slate-400 text-sm text-left">Optimalkan Program Magang dengan Solusi Digital</p>
                </div>
            </div>
            <div className="flex gap-3">
              <div className="w-22">
                <img src="assets/img/section_about/Vector1.png" alt="Vector" className="w-full"/>
              </div>
                <div className="flex flex-col gap-2 px-2">
                    <h1 className="font-semibold text-sm text-black">Magang untuk Siswa/Mahasiswa</h1>
                    <p className="text-slate-400 text-sm text-left">Optimalkan Program Magang dengan Solusi Digital</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_us;
