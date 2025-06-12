const CardAbsensi = ({bgColor,Title,sum,src}) => {
  return (
    <div className="bg-white rounded-xl w-full py-2.5 pl-4 pr-11">
      <div className="flex gap-5 items-center mb-4">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex justify-center items-center`}>
          <img src={`/assets/icons/absensi/${src}.png`} alt={Title} />
        </div>
        <h1 className="font-semibold text-sm">Total {Title}</h1>
      </div>
      <div className="flex gap-10 mb-3 justify-between items-center">
        <h1 className="font-bold text-sm"><span className="text-xl font-bold">{sum}</span> Kali</h1>
        <h1 className="font-medium text-sm">Absensi</h1>
      </div>
    </div>
  );
};

export default CardAbsensi;
