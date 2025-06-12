import Card from "../../components/cards/Card";
import ChecklistRevisi from "../../components/cards/ChecklistRevisi";
import ProgressRevisi from "../../components/charts/ProgesrRevisi";

const DetailPresentasi = () => {
  return (
    <div className="w-full">
      <div className="flex w-full gap-5">
        <div className="flex-[8] w-full">
          <Card className="px-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-semibold text-left text-2xl">
                  Mini Project
                </h1>
                <h3 className="text-slate-500 text-sm">
                  William James Moriarty
                </h3>
              </div>
              <div>
                <div className="w-44 py-1.5 rounded-full bg-indigo-100 text-sm text-indigo-500 font-semibold text-center">
                  Web Development
                </div>
              </div>
            </div>
            <div className="w-full h-96 rounded-xl overflow-hidden mt-8">
              <img
                src="/assets/img/banner/banner1.jpg"
                alt="Banner"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-2 py-5 border-b border-slate-400/[0.5]">
              <h1 className="font-semibold text-xl">About this Project</h1>
              <h1 className="text-slate-400 text-sm">
                Project ini merupakan project awal sebelum masuk ke tahap
                selanjutnya yaitu big project,
              </h1>
            </div>
            <div className="flex gap-3 items-center mt-5">
              <img
                src="/assets/img/user-img.png"
                alt="Mentor"
                className="rounded-full w-14 h-14"
              />
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg">Unknown</h1>
                <h1 className="text-sm text-slate-500">
                  Mentor Web Devolopment
                </h1>
              </div>
            </div>
            <div className="py-5">
              <h1 className="font-semibold text-lg">Revisi Yang Di Terima</h1>
              <h1 className="text-slate-500 text-sm mt-2">
                Masukkan revisi disini untuk upgrade skill kamu!!!
              </h1>
              <form action="" method="post" className="max-w-lg">
                <div className="flex gap-4 items-center mt-5">
                  <input
                    type="text"
                    className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer p-3 text-slate-800"
                    placeholder="Masukan Data Baru"
                  />
                  <button className="w-10 h-10 rounded flex items-center justify-center text-white bg-red-50">
                    <i class="bi bi-trash3 text-red-500"></i>
                  </button>
                </div>
                <div className="flex gap-5 items-center mt-3">
                  <button className="py-2 px-4 rounded flex items-center justify-center text-sky-800 bg-white border border-sky-800 hover:bg-sky-800 hover:text-white transition-all duration-200 ease-in-out">
                    Tambah
                  </button>
                  <button className="py-2 px-4 rounded flex items-center justify-center bg-sky-800 text-white hover:bg-white hover:text-sky-800 hover:border hover:border-sky-800 transition-all duration-200 ease-in-out">
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
        <div className="flex-[3] flex-col gap-5">
          <Card className="py-5 px-5">
            <ProgressRevisi />
          </Card>
          <ChecklistRevisi/>
        </div>
      </div>
    </div>
  );
};

export default DetailPresentasi;
