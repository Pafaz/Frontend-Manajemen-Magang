import Button from "../../Button";

const InternshipDivisions = () => {
  const divisions = [
    { title: "Web Development", icon: "logo1.png", companies: 256 },
    { title: "Digital Marketing", icon: "logo1.png", companies: 356 },
    { title: "UI/UX Design", icon: "logo1.png", companies: 456 },
    { title: "Cybersecurity", icon: "logo1.png", companies: 156 },
    { title: "Graphic Design", icon: "logo1.png", companies: 220 },
    { title: "Artificial Intelligence", icon: "logo1.png", companies: 230 },
    { title: "Mobile Developments", icon: "logo1.png", companies: 226 },
    { title: "Data Science", icon: "logo1.png", companies: 346 },
    { title: "PM", icon: "logo1.png", companies: 310 },
  ];

  return (
    <section className="relative pt-14 pb-10 px-10 bg-blue-50 w-full overflow-hidden">
    <img
      src="assets/img/shapes.png"
      alt="Shapes"
      className="absolute inset-0 -top-52 left-0 w-full h-auto object-cover opacity-15 pointer-events-none"
    />
  
    <div className="relative z-10 w-full">
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-900">DIVISI MAGANG</h2>
          <p className="text-gray-900 mt-2 font-semibold">
            Jelajahi peluang magang di berbagai divisi terkait Software Development.
          </p>
        </div>
        <div className="w-58">
          <Button icon={`bi-arrow-right`} color={`blue`}>LIHAT SEMUA DIVISI</Button>
        </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {divisions.map((division, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg hover:scale-105 transition cursor-pointer duration-300 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <img
                  src={`assets/icons/Devisions/${division.icon}`}
                  alt="Icon"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {division.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {division.companies} Perusahaan
                </p>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition cursor-pointer group">
              <i className="bi bi-arrow-right font-semibold text-blue-500 group-hover:text-blue-200"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
  
  );
};

export default InternshipDivisions;
