import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NavbarLink = ({ link, name, active }) => {
  return <Link to={link} className={`font-medium text-sm no-underline hover:border-b border-b-blue-500 ${active ? "border-b-blue-500 border-b-2 text-[#001a2a]" : "no-underline text-[#0085d7] hover:text-[#334c5b]"}`} style={{ textDecoration: "none" }}>{name}</Link>;
};

NavbarLink.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

export default NavbarLink;
