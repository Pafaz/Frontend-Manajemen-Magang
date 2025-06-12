import { useState } from "react";
import Banner from "../components/Banner";

const Gallery = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  const handleOpen = (src) => {
    setSelectedImg(src);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedImg("");
  };

  const galleryConfigs = [
    {
      cols: "grid-cols-5",
      items: [
        { src: "foto1.png", colSpan: 1, rowSpan: 3, alt: "1" },
        { src: "foto2.png", colSpan: 3, alt: "2" },
        { src: "foto3.png", colSpan: 1, rowSpan: 2, alt: "3" },
      ],
    },
    {
      cols: "grid-cols-5",
      items: [
        { src: "foto2.png", colSpan: 3, alt: "2" },
        { src: "foto1.png", colSpan: 1, rowSpan: 3, alt: "1" },
        { src: "foto3.png", colSpan: 1, rowSpan: 2, alt: "3" },
      ],
    },
    {
      cols: "grid-cols-4",
      items: [
        { src: "foto3.png", colSpan: 1, alt: "3" },
        { src: "foto1.png", colSpan: 1, rowSpan: 2, alt: "1" },
        { src: "foto2.png", colSpan: 2, alt: "2" },
      ],
    },
    {
      cols: "grid-cols-5",
      items: [
        { src: "foto1.png", colSpan: 1, rowSpan: 3, alt: "1" },
        { src: "foto2.png", colSpan: 3, alt: "2" },
        { src: "foto3.png", colSpan: 1, rowSpan: 2, alt: "3" },
      ],
    },
    {
      cols: "grid-cols-5",
      items: [
        { src: "foto2.png", colSpan: 3, alt: "2" },
        { src: "foto1.png", colSpan: 1, rowSpan: 3, alt: "1" },
        { src: "foto3.png", colSpan: 1, rowSpan: 2, alt: "3" },
      ],
    },
  ];

  return (
    <>
      <Banner
        title="Our Gallery"
        subtitle="Home → Gallery"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-8xl z-10`}
        ilustration={`ilustrationGallery`}
      />
      <div className="py-10 px-12 space-y-2">
        {galleryConfigs.map((config, i) => (
          <GalleryGrid key={i} config={config} onOpen={handleOpen} />
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="relative bg-white rounded-xl p-2 w-[520px] h-[360px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImg}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;

const getColSpanClass = (n) => {
  return {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
  }[n] || "";
};

const getRowSpanClass = (n) => {
  return {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
  }[n] || "";
};

const GalleryGrid = ({ config, onOpen }) => {
  return (
    <div className={`grid ${config.cols} gap-2`}>
      {config.items.map((item, index) => (
        <div
          key={index}
          className={`relative group rounded-md overflow-hidden h-[356px] ${getColSpanClass(item.colSpan)} ${getRowSpanClass(item.rowSpan)}`}
        >
          <img
            src={`/assets/img/gallery/${item.src}`}
            alt={`Foto ${item.alt}`}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{ backgroundColor: "rgba(59, 130, 246, 0.5)" }}
          >
            <button
              onClick={() => onOpen(`/assets/img/gallery/${item.src}`)}
              className="bg-white rounded w-10 h-10 flex justify-center items-center"
            >
              <i className="bi bi-eye text-sky-700 text-2xl font-semibold"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
