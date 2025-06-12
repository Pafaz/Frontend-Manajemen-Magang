import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
const Testimonials = () => {
  const testimonials = [
    {
      text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate aliquam ex odio omnis eaque dignissimos, tempore harum maiores, ea impedit doloremque ratione adipisci autem, ducimus ut error officia praesentium ipsum",
      author: "John Doe",
      job: "Software Engineer",
      location: "San Francisco, USA",
      image: "/assets/icons/testimonials/girl1.png",
    },
    {
      text: "A wonderful experience! Highly recommended.",
      author: "Jane Smith",
      job: "Product Designer",
      location: "Berlin, Germany",
      image: "/assets/icons/testimonials/girl2.png",
    },
    {
      text: "Fantastic service and great quality!",
      author: "Emily Brown",
      job: "Marketing Manager",
      location: "London, UK",
      image: "/assets/icons/testimonials/man1.png",
    },
  ];
  return (
    <section className="w-full bg-white pt-20 pb-20 px-14 relative">
      <div className="absolute right-0 -top-60">
        <img
          src="assets/icons/testimonials/gradient_purple.png"
          alt="gradient_purple"
          className="z-10"
        />
      </div>
      <div className="absolute right-0 top-60">
        <img
          src="assets/icons/testimonials/thunder.png"
          alt="thunder"
          className="z-20"
        />
      </div>
      <div className="absolute left-0 top-50">
        <img
          src="assets/icons/testimonials/gradient_pink.png"
          alt="gradient_pink"
          className="z-10"
        />
      </div>
      <div className="absolute left-0 top-115">
        <img
          src="assets/icons/testimonials/annoucement.png"
          alt="annoucement"
          className="z-20 w-38"
        />
      </div>
      <div className="flex justify-center">
        <div className="py-2 px-5 text-center rounded-full bg-indigo-50">
          <span className="bg-gradient-to-r from-indigo-500 to-green-500 bg-clip-text text-transparent">
            Testimoni
          </span>
        </div>
      </div>
      <h1 className="text-5xl text-center font-bold mt-6">
        Apa yang dikatakan pelanggan kami 
      </h1>
      <div className="w-full text-white rounded-3xl border border-slate-300/[0.5] shadow mt-14 py-14 px-20 relative">
        <img
          src="/assets/icons/testimonials/girl1.png"
          alt="girl1"
          className="absolute top-5 left-20 w-16 rounded-full"
        />
        <img
          src="/assets/icons/testimonials/girl2.png"
          alt="girl2"
          className="absolute top-5 right-20 w-12 rounded-full"
        />
        <img
          src="/assets/icons/testimonials/man2.png"
          alt="man2"
          className="absolute bottom-5 left-16 w-12 rounded-full"
        />
        <img
          src="/assets/icons/testimonials/man1.png"
          alt="man1"
          className="absolute bottom-5 right-16 w-16 rounded-full"
        />

        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <img
              src="/assets/icons/testimonials/Paraf.png"
              alt="Quote"
              className="w-10"
            />
          </div>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          className="w-full max-w-2xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="px-5">
              <p className="text-center text-lg italic text-gray-500 mb-5 font-normal">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full border-2 border-gray-500"
                />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {testimonial.author}
                  </h3>
                  <p className="text-sm font-light text-gray-400">
                    {testimonial.job}, {testimonial.location}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="flex justify-center right-0 left-0">
            <div className="custom-pagination"></div>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
