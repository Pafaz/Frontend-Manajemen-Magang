const Badge = ({ children, style }) => {
  return (
    <div className={`${style}`}>
      <div
        className={`bg-blue-100 py-1.5 px-4 border border-blue-400/[0.5] rounded-xl font-light text-blue-500 text-center text-xs inline-block`}
      >
        {children}
      </div>
    </div>
  );
};

export default Badge;
