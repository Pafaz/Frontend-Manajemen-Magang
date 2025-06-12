import React, { useEffect, useState } from 'react';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure the component is rendered before starting the animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for the animation to complete before unmounting
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;
  
  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex justify-center items-center z-[999] transition-all duration-300 ease-in-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg w-96 max-w-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        <div className="bg-red-400 text-white py-3 px-4 flex justify-between items-center">
          <h3 className="font-medium">Confirm Deletion</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        
        {/* Content area */}
        <div className="p-8 text-center">
          {/* Warning icon */}
          <div className="flex justify-center mb-4">
            <i className="bi bi-exclamation-triangle-fill text-red-400 text-5xl"></i>
          </div>
          
          {/* Message */}
          <p className="text-gray-700 text-lg mb-1">Are you sure you want to delete this item?</p>
          <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
          
          {/* Buttons */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
            >
              <i className="bi bi-x mr-2"></i> Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 flex items-center"
            >
              <i className="bi bi-trash mr-2"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;