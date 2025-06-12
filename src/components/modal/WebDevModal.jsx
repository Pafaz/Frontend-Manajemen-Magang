import { useState } from 'react';
import { X } from 'lucide-react';

export default function WebDevModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  
  // Sort categories by urutan (order)
  const sortedCategories = [...(data.kategori || [])].sort((a, b) => a.urutan - b.urutan);
  
  // Format date to "DD Month YYYY" in Indonesian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  // Handle outside click to close modal
  const handleBackdropClick = (e) => {
    // Only close if clicking on the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6 relative">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-3xl font-bold">{data.nama}</h2>
            <button className="rounded-full p-1" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          {/* Date */}
          <p className="text-gray-500 mb-6">{formatDate(data.created_at)}</p>
          
          {/* Timeline steps container with border */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Scrollable area with hidden scrollbar */}
            <div 
              className="max-h-[320px] overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}
            >
              <div style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {sortedCategories.map((category, index) => (
                  <div key={category.id} className="py-4 px-4 flex items-center border-t border-gray-200 first:border-t-0">
                    <div className="w-12 h-12 border-2 border-blue-500 text-blue-500 rounded-full flex items-center justify-center font-medium mr-4">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <span className="text-blue-500 font-medium text-lg">
                      {category.nama}
                    </span>
                  </div>
                ))}
                
                {sortedCategories.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    Tidak ada kategori yang tersedia untuk divisi ini
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}