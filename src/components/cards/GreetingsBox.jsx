const GreetingsBox = () => {
    return (
      <div
        className="relative rounded-2xl overflow-hidden p-6 flex items-center justify-between text-white"
        style={{ backgroundColor: "#0069AB" }}
      >
        {/* Background (jika ada pola) */}
        <img
          src="/assets/img/grettings-pattern.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full opacity-10 object-cover -z-10"
        />
  
        {/* Teks */}
        <div className="w-7/12">
          <h2 className="text-white text-2xl font-semibold mb-2">Hello, Mohib!</h2>
          <p className="text-sm font-light mt-2">Let’s learning something today</p>
          <p className="text-base font-light mt-6">
            Set your study plan and growth with community
          </p>
        </div>
  
        {/* Gambar di kanan */}
        <div className="w-5/12 flex justify-end">
          <img
            src="/assets/img/gretting-img.png"
            alt="Greeting"
            className="max-w-[200px] h-auto"
          />
        </div>
      </div>
    );
  };
  
  export default GreetingsBox;
  