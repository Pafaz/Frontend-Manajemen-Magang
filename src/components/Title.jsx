const Title = ({
  children,
  size = "lg",
  color = "gray-900",
  className = "",
}) => {
  const hasSize = className.match(
    /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/
  );
  const hasColor = className.match(
    /\btext-(gray|red|blue|indigo|green|yellow|purple|pink)-\d+\b/
  );
  const hasFont = className.includes("font-");

  return (
    <h1
      className={`
        ${!hasSize ? `text-${size}` : ""}
        ${!hasColor ? `text-${color}` : ""}
        ${!hasFont ? "font-semibold" : ""}
        ${className}
      `}
    >
      {children}
    </h1>
  );
};

export default Title;
