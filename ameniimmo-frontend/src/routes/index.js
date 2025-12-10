import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Annonces from "../pages/Annonces";
import AdminDashboard from "../pages/AdminDashboard";
import MesAnnonces from "../pages/MesAnnonces";
import CreerAnnonce from "../pages/CreerAnnonce";
import Accueil from "../pages/Accueil";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Accueil /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/annonces", element: <Annonces /> },
      { path: "/admin/dashboard", element: <PrivateRoute><AdminDashboard /></PrivateRoute> },
      { path: "/mes-annonces", element: <PrivateRoute><MesAnnonces /></PrivateRoute> },
      { path: "/annonces/creer", element: <PrivateRoute><CreerAnnonce /></PrivateRoute> },
    ],
  },
]);

export default router;

