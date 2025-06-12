// components/ProjectHeader.jsx
import React from 'react';

const ProjectHeader = ({ projectTitle, studentName, category, mentorName, mentorTitle, mentorProfile }) => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{projectTitle}</h1>
          <p className="text-black mt-2">{studentName}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="w-full h-68 bg-white rounded-lg mb-4 overflow-hidden flex items-center justify-center shadow-sm">
        <img 
          src="/assets/svg/proses.svg" 
          alt="Web Development Illustration"
          className="w-30 h-30 object-cover"
        />
      </div>
      
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden mr-3">
          <img 
            src={`${import.meta.env.VITE_API_URL_FILE}/storage/${mentorProfile}`}
            alt={mentorName}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-gray-900">{mentorName}</p>
          <p className="text-sm text-gray-600">{mentorTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;