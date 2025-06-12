import { X } from "lucide-react";

export default function DetailModal({
  show,
  partner,
  onClose,
  baseUrl,
  onDeleteMajor, // Fungsi untuk hapus jurusan
}) {
  if (!show || !partner) return null;

  const coverImage = partner.foto?.find(f => f.type === "foto_header");
  const logoImage = partner.foto?.find(f => f.type === "logo");

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden max-h-[90vh]">
        <div className="relative">
          {/* Header image */}
          <img
            src={
              coverImage
                ? `${baseUrl}/${coverImage.path}`
                : "/assets/img/Cover.png"
            }
            alt="Partner Cover"
            className="w-full h-48 object-cover"
          />

          {/* Logo */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div className="rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
              <img
                src={
                  logoImage
                    ? `${baseUrl}/${logoImage.path}`
                    : "/assets/img/logoperusahaan.png"
                }
                alt="Partner Logo"
                className="w-24 h-24 object-cover rounded-full"
              />
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Partner information */}
        <div className="pt-16 px-8 pb-6 text-center">
          <h1 className="text-2xl font-bold">{partner.nama}</h1>
          <p className="text-gray-600 mt-1">{partner.alamat}</p>
          {partner.website && (
            <a
              href={
                partner.website.startsWith("http")
                  ? partner.website
                  : `https://${partner.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mt-1 block text-sm"
            >
              {partner.website}
            </a>
          )}
          <p className="text-gray-700 mt-1">{partner.telepon}</p>
        </div>

        {/* Majors list */}
        <div className="px-8 pb-8">
          <h2 className="font-semibold text-xl mb-4">Daftar Jurusan</h2>
          <div className="max-h-52 overflow-y-auto pr-2">
            {partner.jurusan && partner.jurusan.length > 0 ? (
              <div className="space-y-2">
                {partner.jurusan.map((major, index) => (
                  <div
                    key={major.id ?? index}
                    className="flex items-center justify-between py-2 border-b-2 border-gray-200"
                  >
                    <div className="flex items-center font-medium">
                      <span className="text-gray-600 mr-2">{index + 1}.</span>
                      <span className="text-gray-800">{major.nama}</span>
                    </div>
                    <button
                      onClick={() => onDeleteMajor(major.id)}
                      className="flex items-center text-red-600 hover:text-red-800 text-sm"
                    >
                      <i className="bi bi-trash mr-1"></i>
                      Hapus Data
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Tidak ada jurusan terdaftar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
