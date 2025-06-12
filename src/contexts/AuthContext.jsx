import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  user: null,
  role: null,
  tempRegisterData: null,
  // id_cabang:null,
  // setIdCabang : () => {},
  setToken: () => {},
  setUser: () => {},
  setRole: () => {},
  setTempRegisterData: () => {},
});
