// components/ReviewDetailCard.jsx
import React from 'react';

const ReviewDetailCard = ({ title, date, tasks }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      
      {tasks.length > 0 ? (
        <div className="mb-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-2 mb-2">
              <input 
                type="checkbox" 
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                checked={task.completed}
                readOnly
              />
              <span className="text-sm text-gray-600">{task.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4"></div>
      )}
      
      <div className="flex justify-center">
        <button className="flex items-center text-sm text-red-500 font-medium">
          <span className="mr-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </span>
          Revisi Belum Selesai
        </button>
      </div>
    </div>
  );
};

export default ReviewDetailCard;