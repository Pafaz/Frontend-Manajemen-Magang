import React from "react";

const LoadingCards = () => {
  return (
    <div className="h-[300px] grid grid-cols-4 gap-5 rounded-xl">
      <div className="w-full h-full bg-gray-300 rounded-xl p-5"></div>
      <div className="w-full h-full bg-gray-300 rounded-xl p-5"></div>
      <div className="w-full h-full bg-gray-300 rounded-xl p-5"></div>
      <div className="w-full h-full bg-gray-300 rounded-xl p-5"></div>
    </div>
  );
};

export default LoadingCards;
