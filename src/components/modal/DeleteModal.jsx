import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteModal({
  show,
  onClose,
  partnerToDelete,
  onDelete,
  deleteLoading
}) {
  if (!show || !partnerToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[99999]">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center mb-4 text-red-500">
          <AlertTriangle size={24} className="mr-2" />
          <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
        </div>

        <div className="p-4 mb-4 bg-red-50 border border-red-100 rounded-md">
          <p className="text-gray-700">
            Apakah Anda yakin ingin menghapus mitra{" "}
            <span className="font-medium">"{partnerToDelete.nama}"</span>?
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Tindakan ini tidak dapat dibatalkan dan semua data terkait akan
            dihapus permanen.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
            disabled={deleteLoading}
          >
            Batal
          </button>
          <button
            onClick={onDelete}
            className={`px-4 py-2 bg-red-500 text-white rounded-md text-sm transition duration-200 flex items-center ${
              deleteLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-red-600"
            }`}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 size={14} className="mr-1" /> Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}