import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Card from "../components/cards/Card";
import Title from "../components/Title";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const Contact = () => {
  const data = [
    {
      title: "Alamat Kantor",
      desc: "2464 Royal Ln. Mesa, New Jersey 45463",
      icon: "bi-geo-alt-fill",
    },
    {
      title: "elangprakoso088@gmail.com",
      desc: "Email us anytime for anykind ofquety",
      icon: "bi-envelope-at",
    },
    {
      title: "WhatsApp : +62 851-7955-1746",
      desc: "Call us any kind suppor,we will wait for it",
      icon: "bi-telephone-inbound",
    },
  ];

  return (
    <>
      <Banner
        title="Hubungi Kami"
        subtitle="Beranda → Hubungi Kami"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-8xl z-10`}
        ilustration={`ilustrationGallery`}
      />

      {/* Cards */}
      <motion.div
        className="py-20 grid grid-cols-3 gap-5 px-10"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {data.map((item, i) => (
          <Card
            key={i + 1}
            className="bg-gray-50 w-full rounded-lg flex justify-center py-7 px-4"
          >
            <div className="flex flex-col justify-center items-center gap-3">
              <i className={`bi ${item.icon} text-7xl text-sky-800`}></i>
              <Title>{item.title}</Title>
              <div className="w-52">
                <p className="text-center text-sm text-gray-500 font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Map + Form Container */}
      <motion.div
        className="py-10 px-5 flex justify-center gap-10"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Google Map */}
        <div className="rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.9522000005186!2d112.60430667488363!3d-7.900062992122923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7881c2c4637501%3A0x10433eaf1fb2fb4c!2sHummasoft%20%2F%20Hummatech%20(PT%20Humma%20Teknologi%20Indonesia)!5e0!3m2!1sid!2sid!4v1743950786677!5m2!1sid!2sid"
            width="750"
            height="550"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 px-5 max-w-xl">
          <Title className="text-4xl font-bold">Siap untuk Memulai?</Title>
          <p className="text-slate-500 font-light text-sm text-left w-full">
            Nullam varius, erat quis iaculis dictum, eros urna varius eros, ut
            blandit felis odio in turpis. Quisque rhoncus, eros in auctor
            ultrices,
          </p>
          <form>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="row flex flex-col gap-3">
                <label htmlFor="name" className="font-medium">
                  Nama Anda*
                </label>
                <input
                  id="name"
                  type="text"
                  className="bg-white w-full py-3 px-4 border border-slate-500/[0.5] rounded focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div className="row flex flex-col gap-3">
                <label htmlFor="email" className="font-medium">
                  Email Anda*
                </label>
                <input
                  id="email"
                  type="email"
                  className="bg-white w-full py-3 px-4 border border-slate-500/[0.5] rounded focus:outline-none"
                  placeholder="Your Email"
                />
              </div>
            </div>
            <div className="row flex flex-col gap-3">
              <label htmlFor="message" className="font-medium">
                Tulis Pesan*
              </label>
              <textarea
                id="message"
                className="bg-white w-full py-3 px-4 border border-slate-500/[0.5] rounded focus:outline-none"
                placeholder="Write Message*"
                rows={8}
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-sky-800 rounded text-white text-center font-light py-2 px-4 mt-4"
            >
              Kirim<i className="bi bi-arrow-right"></i>
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Contact;
