const FloatingLabelInput = ({ label, type = "text", value, setValue, placeholder, icon }) => {
  const inputId = label.toLowerCase();

  return (
    <div className="relative w-full mb-2">
      <label htmlFor={inputId} className="block mb-1 font-medium">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex font-medium text-xl items-center text-gray-400 pointer-events-none">
            <i className={`bi ${icon}`} />
          </span>
        )}
        <input
          type={type}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 ${
            icon ? "pl-10" : "px-4"
          } pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default FloatingLabelInput;
