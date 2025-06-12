import React from "react";

const RecommendedSection = () => {
  const getLabelClasses = (color) => {
    const colorMap = {
      green: {
        text: "text-green-600",
        bg: "bg-green-100",
      },
      purple: {
        text: "text-purple-600",
        bg: "bg-purple-100",
      },
      blue: {
        text: "text-blue-600",
        bg: "bg-blue-100",
      },
      red: {
        text: "text-red-600",
        bg: "bg-red-100",
      },
    };
    return colorMap[color] || {
      text: "text-gray-600",
      bg: "bg-gray-100",
    };
  };

  return (
    <div className="space-y-10 mt-2 text-[8px]">
      <div className="bg-white shadow-md rounded-2xl p-6">
        {/* Header Filter */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h4 className="text-[18px] font-semibold">Jadwal Presentasi</h4>

          <div className="flex flex-wrap gap-3 items-center">
            <button className="flex items-center gap-2 border border-[#D5DBE7] text-[#6B7280] text-[12px] px-3 py-1.5 rounded-xl">
              <i className="bi bi-layout-text-window-reverse text-[16px]" />
              Category
            </button>

            <span className="text-[12px] text-gray-700 font-medium">Sort by:</span>

            <button className="flex items-center gap-2 border border-[#D5DBE7] text-[#6B7280] text-[12px] px-3 py-1.5 rounded-xl">
              <i className="bi bi-filter text-[16px]" />
              Popular
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              img: "library-img6.png.png",
              label: "Available",
              labelColor: "green",
              title: "Presentasi offline batch 1",
              time: "12.00 - 13.00",
              participants: "5 orang",
              role: "Mentor",
              name: "Haruka Sakura",
              userImg: "post2.png",
            },
            {
              img: "library-img6.png.png",
              label: "Design",
              labelColor: "purple",
              title: "Presentasi offline batch 2",
              time: "12.00 - 13.00",
              participants: "9 orang",
              role: "Writer",
              name: "Emma Watson",
              userImg: "post2.png",
            },
            {
              img: "library-img6.png.png",
              label: "Web",
              labelColor: "blue",
              title: "Presentasi offline batch 3",
              time: "12.00 - 13.00",
              participants: "2 orang",
              role: "Writer",
              name: "John Doe",
              userImg: "post2.png",
            },
            {
              img: "library-img6.png.png",
              label: "SEO",
              labelColor: "red",
              title: "Presentasi offline batch 4",
              time: "12.00 - 13.00",
              participants: "8 orang",
              role: "Writer",
              name: "Lily Brown",
              userImg: "post2.png",
            },
          ].map((card, idx) => {
            const labelClass = getLabelClasses(card.labelColor);
            return (
              <div
                key={idx}
                className="border border-[#D5DBE7] rounded-2xl overflow-hidden shadow-sm p-4"
              >
                <div className="bg-[#00D6A1] h-40 flex items-center justify-center rounded-xl pt-4 px-4">
                  <img
                    src={`/assets/img/${card.img}`}
                    alt="Card Icon"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <span
                    className={`text-[12px] ${labelClass.text} ${labelClass.bg} rounded-full px-3 py-1 inline-block`}
                  >
                    {card.label}
                  </span>
                  <h5 className="text-[12px] font-semibold">
                    <a href="course-details.html" className="hover:text-blue-600">
                      {card.title}
                    </a>
                  </h5>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <i className="bi bi-clock"></i> {card.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="bi bi-people"></i> {card.participants}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={`/assets/img/${card.userImg}`}
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Author"
                    />
                    <span className="text-[10px] text-gray-600">
                      {card.role}{" "}
                      <a href="profile.html" className="font-semibold hover:text-blue-600">
                        {card.name}
                      </a>
                    </span>
                  </div>
                  <div className="flex justify-start items-center mt-3">
                    <a
                      href="course-details.html"
                      className="border border-[#0069AB] text-[#0069AB] py-1 px-3 rounded-full text-[12px] font-bold group hover:bg-[#0069AB] hover:text-white transition inline-flex items-center gap-1"
                    >
                      See More
                      <i className="bi bi-arrow-right-short group-hover:text-white transition" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 flex-wrap gap-4 w-full">
          <a
            href="#"
            className="flex items-center gap-2 border px-3 py-1.5 rounded-full text-[12px] text-gray-700 hover:bg-gray-100"
          >
            <i className="bi bi-arrow-left" /> Previous
          </a>

          <ul className="flex gap-2 justify-center flex-grow">
            {[1, 2, 3, "...", 8, 9, 10].map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-[12px] font-medium ${
                    item === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="flex items-center gap-2 border px-3 py-1.5 rounded-full text-[12px] text-gray-700 hover:bg-gray-100"
          >
            Next <i className="bi bi-arrow-right" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecommendedSection;
