// components/ProgressReview.jsx
import React from 'react';

const ProgressReview = ({ progressPercent, remainingPercent }) => {
  // Calculate the circumference of the circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the dash offset for the progress arc
  const dashOffset = circumference - (progressPercent / 100) * circumference;
  
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-blue-500 font-semibold text-center mb-6">PROGRESS REVISI</h2>
      
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 160 160">
            <circle 
              cx="80" 
              cy="80" 
              r={radius} 
              fill="none" 
              stroke="#E5E7EB" 
              strokeWidth="16"
            />
            
            {/* Progress arc */}
            <circle 
              cx="80" 
              cy="80" 
              r={radius} 
              fill="none" 
              stroke="#0066CC" 
              strokeWidth="16" 
              strokeDasharray={circumference} 
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          </svg>
          
          {/* Percentage text in the middle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-700">{progressPercent}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-8 text-center">
  <div>
    <div className="inline-block w-3 h-3 bg-blue-700 rounded-full mb-1"></div>
    <p className="text-sm font-semibold">Sudah Dikerjakan</p>
    <p className="text-blue-700 font-bold">{progressPercent}%</p>
  </div>
  
  <div>
    <div className="inline-block w-3 h-3 bg-gray-300 rounded-full mb-1"></div>
    <p className="text-sm font-semibold">Belum Dikerjakan</p>
    <p className="text-gray-500 font-bold">{remainingPercent}%</p>
  </div>
</div>
    </div>
  );
};

export default ProgressReview;