import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Badge from "../../Badge";

const swiperImg = "/assets/img/swiper.png";

const Gallery = () => {
  const slides = [swiperImg, swiperImg, swiperImg, swiperImg];

  return (
    <section className="w-full bg-white py-20 px-5 relative overflow-hidden">
      <div className="absolute -right-2 -top-19">
        <img src="assets/icons/dot_shape_4.png" alt="" />
      </div>
      <div className="flex justify-center flex-col gap-6">
        <div className="mx-auto">
          <Badge>Internship Showcase</Badge>
        </div>
        <h1 className="text-center text-4xl text-slate-800 font-bold leading-tight">
          Discover the Internship Experience
        </h1>
      </div>

      <div className="py-10 flex flex-col items-center">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={slides.length >= 3 ? 3 : slides.length}
          spaceBetween={20}
          loop={slides.length > 3}
          slidesPerGroup={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
            dynamicBullets: false,
          }}
          className="w-[95%]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-70 rounded-lg object-center object-cover"
              />
            </SwiperSlide>
          ))}
          <div className="custom-pagination"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default Gallery;
