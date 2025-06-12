const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-400/[0.5] relative -bottom-10">
      <div className="max-w-7xl mx-auto py-14 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-5">
          <img
            src="/assets/img/Logo.png"
            alt="Logo Hummatech"
            className="w-44"
          />
          <p className="text-gray-600 text-sm">
            Phasellus ultricies aliquam volutpat ullamcorper laoreet neque, a
            lacinia curabitur lacinia mollis.
          </p>
          <div className="flex space-x-2">
            <button className="border border-gray-300 w-10 h-10 rounded-md flex items-center justify-center group hover:bg-gray-100 transition cursor-pointer">
              <i className="text-gray-500 text-lg group-hover:text-gray-900 bi bi-facebook"></i>
            </button>
            <button className="border border-gray-300 w-10 h-10 rounded-md flex items-center justify-center group hover:bg-gray-100 transition cursor-pointer">
              <i className="text-gray-500 text-lg group-hover:text-gray-900 bi bi-twitter"></i>
            </button>
            <button className="border border-gray-300 w-10 h-10 rounded-md flex items-center justify-center group hover:bg-gray-100 transition cursor-pointer">
              <i className="text-gray-500 text-lg group-hover:text-gray-900 bi bi-youtube"></i>
            </button>
            <button className="border border-gray-300 w-10 h-10 rounded-md flex items-center justify-center group hover:bg-gray-100 transition cursor-pointer">
              <i className="text-gray-500 text-lg group-hover:text-gray-900 bi bi-linkedin"></i>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold inline-block pb-1">
            Tautan Cepat
          </h3>
          <div className="flex gap-5">
            <div className="bg-black w-1/5 h-0.5"></div>
            <div className="bg-blue-500 h-0.5 w-1/2"></div>
          </div>
          <ul className="mt-4 space-y-2">
            {["Tentang Kami", "Artikel", "Prosedur", "Hubungi Kami", "Lowongan"].map(
              (item, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-slate-700 hover:text-slate-500"
                >
                  <i className="bi bi-chevron-double-right mr-2"></i> {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold inline-block pb-1">
            Artikel Terbaru
          </h3>
          <div className="flex gap-5">
            <div className="bg-black w-1/5 h-0.5"></div>
            <div className="bg-blue-500 h-0.5 w-1/2"></div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/img/post1.png"
                alt="Post 1"
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <p className="text-[12px] font-light text-gray-400">
                  <i className="bi bi-calendar"></i> 20 Feb, 2024
                </p>
                <p className="text-sm font-medium">
                  Top 5 Most Famous Technology Trends In 2024
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src="/assets/img/post2.png"
                alt="Post 2"
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <p className="text-[12px] font-light text-gray-400">
                  <i className="bi bi-calendar"></i> 15 Dec, 2024
                </p>
                <p className="text-sm font-medium">
                  The Surfing Man Will Blow Your Mind
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold  inline-block pb-1">
            Hubungi Kami
          </h3>
          <div className="flex gap-5">
            <div className="bg-black w-1/5 h-0.5"></div>
            <div className="bg-blue-500 h-0.5 w-1/2"></div>
          </div>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>
              <i className="bi bi-envelope mr-2"></i> elangprakoso088@gmail.com
            </li>
            <li>
              <i className="bi bi-telephone mr-2"></i> +62 851-7955-1746
            </li>
          </ul>
          <div className="mt-4 flex border border-slate-500/50 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full px-4 focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white cursor-pointer">
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
          <div className="flex items-center text-xs mt-2 text-gray-600">
            <input
              type="checkbox"
              id="privacy"
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="privacy">
              Saya setuju dengan ketentuan{" "}
              <a href="#" className="text-blue-600 underline">
                Kebijakan Privasi
              </a>
              .
            </label>
          </div>
        </div>
      </div>

      <div className="bg-color-blue text-slate-200 text-sm font-light py-5 text-center relative flex justify-between px-10 items-center">
        <p>&copy; Semua Hak Cipta 2025 oleh Universitas Trunojoyo Madura x Politeknik Negeri Banyuwangi</p>
        <a
          href="#top"
          className="absolute left-1/2 transform -translate-x-1/2 -top-5 bg-color-blue border-4 border-white text-white w-12 h-12 rounded-full shadow-lg flex justify-center items-center"
        >
          <i className="bi bi-arrow-up text-lg"></i>
        </a>
        <div className="mt-2">
          <a href="#" className="mr-4">
            Syarat & Ketentuan
          </a>
          <a href="#">Kebijakan Privasi</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
