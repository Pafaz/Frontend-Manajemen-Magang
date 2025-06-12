import Badge from "../../Badge";

const WhyUsSection = () => {
  const Blogs = [
    {
      title: "Magang Fleksibel & Berkualitas",
      content:
        "Perusahaan dapat menjangkau talenta muda terbaik, dan siswa mendapatkan pengalaman kerja nyata yang sesuai dengan minat serta keahlian mereka",
      icon: "Icon",
    },
    {
      title: "Expert Instructor",
      content:
        "Perusahaan dapat menjangkau talenta muda terbaik, dan siswa mendapatkan pengalaman kerja nyata yang sesuai dengan minat serta keahlian mereka",
      icon: "Icon",
    },
    {
      title: "24/7 Live Support",
      content:
        "Perusahaan dapat menjangkau talenta muda terbaik, dan siswa mendapatkan pengalaman kerja nyata yang sesuai dengan minat serta keahlian mereka",
      icon: "Icon",
    },
  ];
  return (
    <div className="relative w-full py-20 px-12">
      <div className="absolute right-65 z-20 -top-20">
        <img src="assets/img/section_about/Vector3.png" alt="Vector3" />
      </div>
      <div className="absolute right-65 z-20 -top-2">
        <img src="assets/img/section_about/BellAngle.png" alt="BellAngle" />
      </div>
      <div className="absolute left-0">
        <img
          src="assets/img/section_about/grid_particle_about.png"
          alt="grid_particle_about"
        />
      </div>
      <div className="absolute right-0 top-85">
        <img
          src="assets/img/section_about/particle_about.png"
          alt="particle_about.png"
        />
      </div>
      <div className="container flex justify-center z-30">
        <div className="flex flex-col gap-5">
          <Badge style={`mx-auto`}>Kenapa Harus kami?</Badge>
          <h1 className="text-center font-bold text-4xl">
            Menjembatani Perusahaan dan <br /> Talenta Muda Berkualitas
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 z-30 absolute left-0 right-0 px-14 py-10">
        {Blogs.map((item, i) => (
          <div
            key={i + 1}
            className="bg-white shadow border border-slate-400/[0.5] hover:scale-110 transition duration-500 ease-in-out rounded-lg hover:bg-[#0069AB] px-8 flex flex-col justify-center h-[300px] w-[420px] group"
          >
            <div className="flex flex-col gap-5">
              <div className="w-18 h-18 rounded-full bg-[#0069AB] flex justify-center items-center mx-auto group-hover:border-2 group-hover:border-white">
                <img
                  src={`assets/icons/WhyUsSection/${item.icon}.png`}
                  alt={item.title}
                  className="w-1/2"
                />
              </div>
              <h1 className="text-center font-semibold text-slate-800 group-hover:text-white">
                {item.title}
              </h1>
              <p className="text-center text-sm text-slate-700 font-normal group-hover:text-white">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUsSection;
