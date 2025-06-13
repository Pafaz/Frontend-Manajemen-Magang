import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AuthLayout = () => {
  const { role, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role && token) {

      const redirectTo = localStorage.getItem("location");

      if (redirectTo) {
        navigate(redirectTo);
        localStorage.removeItem("location");
      } else {
        navigate("/");
      }
    }
  }, [ navigate, role]);

  return <Outlet />;
};

export default AuthLayout;
