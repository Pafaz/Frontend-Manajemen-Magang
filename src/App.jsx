import { RouterProvider } from "react-router-dom";
import { router } from "../Router";
import AuthProvider from "./contexts/AuthProvider";
function App() {
  return (
    <AuthProvider>
        <div className="relative"></div>
        <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
