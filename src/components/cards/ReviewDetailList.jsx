import { useState } from 'react';

// Modal component to display revision details
const RevisionModal = ({ isOpen, onClose, revision }) => {
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{revision.title}</h3>
          {revision.status === 1 ? (
            <div className="flex items-center text-green-600 mr-4">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Revisi Selesai</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500 mr-4">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Revisi Belum Selesai</span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <p className="text-gray-500 text-sm">{revision.date}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Revisi:</h4>
          {revision.tasks.map((task) => (
            <div key={task.id} className="flex items-start mb-3">
              <input 
                type="checkbox" 
                checked={task.completed} 
                className="mt-1 mr-3" 
                readOnly 
              />
              <p className="text-gray-800">{task.text}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Individual Review Card component
const ReviewDetailCard = ({ title, date, tasks, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={openModal}
      >
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-3">{date}</p>
        
        <div>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.slice(0, 2).map((task) => (
                <li key={task.id} className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    className="mt-1 mr-2" 
                    readOnly 
                  />
                  <p className="text-gray-700 text-sm truncate">{task.text}</p>
                </li>
              ))}
              {tasks.length > 2 && (
                <li className="text-blue-600 text-sm pt-1">
                  +{tasks.length - 2} item lainnya
                </li>
              )}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Tidak ada tugas revisi</p>
          )}
        </div>
      </div>
      
      <RevisionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        revision={{ title, date, tasks, status }} 
      />
    </>
  );
};

// Main component to display all review cards
const ReviewDetailList = ({revisi}) => {
  
  const reviewDetails = revisi?.map((item, index) => {
    const tasks = (item?.progress || []).map((task) => ({
      id: task.id,
      text: task.deskripsi || 'Belum ada catatan',
      completed: task.status == 1
    }));

    return {
      id: item.id,
      title: `Revisi ke - ${index + 1}`,
      status: tasks.every((task) => task.completed) ? 1 : 0,
      date: new Date(item.created_at).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      tasks
    };
  });

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Revisi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviewDetails.map((review) => (
          <ReviewDetailCard
            key={review?.id}
            title={review?.title}
            date={review?.date}
            tasks={review?.tasks}
            status= {review?.status}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewDetailList;