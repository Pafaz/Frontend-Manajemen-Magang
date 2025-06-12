const LogoCompany = ({ titleLogo }) => {
  return (
    <img
      src={`assets/icons/MyPartner/${titleLogo}.png`}
      alt={titleLogo}
      className="w-24"
    />
  );
};

export default LogoCompany;
