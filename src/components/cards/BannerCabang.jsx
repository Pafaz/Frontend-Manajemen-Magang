import React from 'react';

// Single dummy data entry
const dummyUser = {
  name: 'Mr. Gojo',
  branch: 'Malang',
  branchFullName: 'HUMMA TEKNOLOGI INDONESIA',
  branchLogo: '/assets/img/logoperusahaan.png' // Logo cabang
};

const Banner = () => {
  return (
    <div className="w-full mb-4 object-cover">
      <div
        className="w-full bg-white text-white p-3 flex justify-between items-center rounded-md shadow-md"
        style={{
          backgroundSize: 'cover',  // Agar gambar ornamen mengisi seluruh area
          backgroundPosition: 'center',  // Menyusun gambar di tengah
        }}
      >
        {/* Bagian kiri dengan logo dan teks */}
        <div className="flex items-center">
          {/* Logo Cabang */}
          <div className="flex-shrink-0 mr-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              <img
                src={dummyUser.branchLogo}
                alt="Logo Cabang"
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  // Fallback jika logo tidak ditemukan
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback dengan inisial */}
              <div 
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-sm font-bold text-blue-600">
                  {dummyUser.branchFullName.charAt(0)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Teks Selamat Datang */}
          <div className="flex flex-col text-black">
            <h2 className="text-lg font-semibold">Selamat datang di</h2>
            <h3 className="text-xl font-bold">CV. {dummyUser.branchFullName}</h3>
          </div>
        </div>
                
        {/* Bagian kanan untuk gambar icon tanpa padding bawah
        <div className="flex justify-center items-center">
          <img
            src="/assets/img/banner-icon.png"  // Gambar yang terletak di folder public/assets/img
            alt="Banner Icon"
            className="w-22 object-cover mb-0"  // Menghilangkan margin bottom
          />
        </div> */}
      </div>
    </div>
  );
};

export default Banner;