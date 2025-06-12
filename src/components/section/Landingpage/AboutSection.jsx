import Badge from "../../Badge";
import Button from "../../Button";

const AboutSection = () => {
  const data = [
    {
      title: "Misi Kami",
      text: "Menyediakan solusi digital untuk mengelola magang dengan lebih efektif, membantu perusahaan dan peserta mendapatkan pengalaman terbaik.",
      icon: "assets/icons/About/1.png",
    },
    {
      title: "Visi Kami",
      text: "Menjadi platform unggulan dalam manajemen magang yang fleksibel dan mudah digunakan oleh berbagai jenis perusahaan.",
      icon: "assets/icons/About/2.png",
    },
    {
      title: "Tujuan Kami",
      text: "Meningkatkan efisiensi program magang dengan sistem yang terstruktur, transparan, dan otomatis.",
      icon: "assets/icons/About/3.png",
    },
  ];

  return (
    <section className="relative w-full bg-white py-44 overflow-x-hidden">
      <div className="px-10 flex gap-20">
        <div className="relative w-full lg:w-1/3">
          <div className="relative w-80 lg:w-96">
            <img
              src="assets/img/about_v1.png"
              alt="Hero"
              className="w-full rounded-xl shadow-xl"
            />
            <img
              src="assets/img/about_v2.png"
              alt="Hero 2"
              className="absolute -right-38 top-25 w-62 rounded-lg shadow-md border-8 border-white"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 text-center lg:text-left px-10">
         <Badge>Lebih Lanjut Tentang Kami</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 leading-snug">
            Sistem Manajemen Magang <br /> Terintegrasi untuk Perusahaan Anda
          </h2>
          <p className="text-gray-500 mt-4 leading-relaxed text-sm">
            Kelola seluruh proses magang dalam satu platform, mulai dari
            pendaftaran, pemantauan, hingga evaluasi. Proses rekrutmen lebih
            efisien, tugas peserta lebih terorganisir, dan evaluasi menjadi
            lebih mudah dengan sistem otomatis.
          </p>
          <div className="w-max">
            <Button color={`blue`} icon={`bi-arrow-right`}>
              Pelajari lebih lanjut
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute z-50 bottom-18 left-55">
        <div className="flex justify-end gap-12 px-22">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg w-[350px] h-56 px-5 flex-col flex justify-center items-center gap-5 shadow border border-blue-300/[0.5]"
            >
              <div className="flex gap-4 justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <h1 className="uppercase text-lg text-gray-900 font-semibold">
                  {item.title}
                </h1>
              </div>
              <p className="text-gray-500 text-sm text-center">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
