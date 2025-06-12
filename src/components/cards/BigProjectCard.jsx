// components/BigProjectCard.jsx
import React from 'react';

const BigProjectCard = ({nextProjectName}) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-blue-700 font-bold text-xl text-center mb-6">{nextProjectName} sedang Menunggu!</h2>
      
      <div className="flex justify-center my-6">
        <div className="relative w-32">
          <img 
            src="/assets/svg/Astronaut.svg" 
            alt="Astronaut and rocket illustration"
            className="w-32 h-32 object-cover"
          />
        </div>
      </div>
      
      <p className="text-center text-sm text-blue-600">
        Ayo Selesaikan Revisimu dan lanjut ke project selanjutnya!!
      </p>
    </div>
  );
};

export default BigProjectCard;