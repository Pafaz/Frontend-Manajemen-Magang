import { useState, useEffect, useContext } from "react";
import NavLink from "./NavbarLink";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState(false);
  const location = useLocation();
  const { user, role, token } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router_link = [
    { link: "/", name: "Beranda" },
    { link: "/tentang", name: "Tentang Kami" },
    { link: "/artikel", name: "Artikel" },
    { link: "/prosedur", name: "Prosedur" },
    { link: "/hubungi-kami", name: "Hubungi Kami" },
    { link: "/lowongan", name: "Lowongan"},
  ];

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed w-full z-[9999] px-10 flex justify-between items-center transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/30 backdrop-blur-sm border-b border-gray-300/50 py-2.5"
          : "bg-white shadow-sm py-4"
      }`}
    >
      <div>
        <Link to={``}>
          <img
            src="/assets/img/Logo.png"
            alt="Logo"
            className="w-48 transition-all duration-300"
          />
        </Link>
      </div>
      <div className="flex gap-7 items-center">
        {router_link.map((item, index) => (
          <NavLink
            link={item.link}
            name={item.name}
            key={index}
            active={active === item.link}
            className="relative text-gray-700 hover:text-[#0069AB] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#0069AB] after:transition-all after:duration-300 hover:after:w-full"
          />
        ))}
        <Link
          to={!user && !token ? `/auth/login` : `/${role}/dashboard`}
          className="relative overflow-hidden bg-[#0069AB] text-white text-sm py-2 px-6 rounded-lg cursor-pointer transition-all duration-300 ease-in-out 
      hover:bg-gradient-to-r hover:from-[#005588] hover:to-[#619dc2] 
      hover:shadow-lg hover:scale-105 flex items-center gap-2 group"
        >
          {!user && !token ? (
            <>
              Masuk
              <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
            </>
          ) : (
            <>
              Dasbor
              <i className="bi bi-house-door transition-transform duration-300 group-hover:translate-x-1"></i>
            </>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
