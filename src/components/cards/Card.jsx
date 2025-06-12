const Card = ({ children, className = "" }) => {
  const hasBg = className.includes("bg-");
  const hasRounded = className.includes("rounded-");
  const hasPy = className.match(/\bpy-\d+\b/);
  const hasPx = className.match(/\bpx-\d+\b/);
  const hasMt = className.match(/\bmt-\d+\b/);

  return (
    <div
      className={`
        ${!hasBg ? "bg-white" : ""}
        ${!hasRounded ? "rounded-xl" : ""}
        ${!hasPy ? "py-4" : ""}
        ${!hasPx ? "px-3" : ""}
        ${!hasMt ? "mt-3" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
