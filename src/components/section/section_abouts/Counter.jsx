import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import StatCard from "../../StateCard";

const Counter = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { number: 19400, label: "Projects Done" },
    { number: 95200, label: "Happy Clients" },
    { number: 142600, label: "Team Members" },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="w-full relative top-100 bg-white pt-5 pb-64">
      <div className="bg-[#0069AB] w-full h-[500px] px-44 pt-20">
        <div className="flex flex-col gap-5">
          <div className="rounded-full px-4 py-2 text-white text-center bg-sky-800 w-32">
            <h1 className="font-medium text-sm">COUNTER</h1>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold text-4xl text-white">
              Make your marketing <br /> more effective
            </div>
            <div className="grid grid-cols-3 gap-10">
              {stats.map((item, i) => (
                <StatCard number={item.number} key={i + 1} label={item.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

  
      <div className="absolute z-50 rounded-xl right-0 left-0 top-75 overflow-hidden w-[1444px] h-[450px] mx-auto">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onClick={togglePlay}
        >
          <source src="/video/example.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       backdrop-blur-md bg-white/30 border border-white p-6 rounded-full 
                       shadow-lg flex items-center justify-center"
          >
            <FaPlay className="text-white text-3xl" />
          </button>
        )}
      </div>
    </section>
  );
};

export default Counter;
