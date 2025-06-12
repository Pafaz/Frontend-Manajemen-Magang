const Banner = () => {
  const nama = sessionStorage.getItem("nama");
  return (
    <div className="w-full mb-4 object-cover">
      <div
        className="w-full bg-[#0069AB] text-white p-3 flex justify-between items-center rounded-md shadow-md"
        style={{
          backgroundImage: "url('/assets/img/ornamen.png')", // Menambahkan ornamen sebagai latar belakang
          backgroundSize: 'cover',  // Agar gambar ornamen mengisi seluruh area
          backgroundPosition: 'center',  // Menyusun gambar di tengah
        }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Selamat Datang {nama}!</h2>
        </div>
        
        {/* Bagian kanan untuk gambar icon tanpa padding bawah */}
        <div className="flex justify-center items-center">
          <img
            src="/assets/img/banner-icon.png"  // Gambar yang terletak di folder public/assets/img
            alt="Banner Icon"
            className="w-22 object-cover mb-0"  // Menghilangkan margin bottom
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
