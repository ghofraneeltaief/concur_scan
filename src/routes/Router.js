import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
/* ****Pages***** */
const Gestion_pages = Loadable(lazy(() => import('../views/utm_stats/Gestion_pages')))
const Gestion_concurrents = Loadable(lazy(() => import('../views/utm_stats/Gestion_concurrents')))
const Login = Loadable(lazy(() => import('../views/authentication/login')))
const Gestion_keywords = Loadable(lazy(() => import('../views/utm_stats/Gestion_keywords')))
const Dashboard = Loadable(lazy(() => import('../views/utm_stats/Dashboard')))
// Fonction pour vérifier l'authentification de l'utilisateur
const isAuthenticated = () => {
  // Vérifie si le token est présent dans le localStorage et s'il est valide
  const token = localStorage.getItem('access_token');
  return token !== null && token !== undefined && token !== '';
};
const PrivateRoute = ({ element, ...rest }) => {
  // Si l'utilisateur est authentifié, affiche l'élément (component)
  // Sinon, redirige l'utilisateur vers l'interface de connexion
  return isAuthenticated() ? (
    <FullLayout>
      {element}
    </FullLayout>
  ) : (
    <Navigate to="/login" />
  );
};
const Router = [
  {
    path: '/',
    children: [
      { path: '/', element: <Navigate to="/login" /> },
      { path: '/login', element: <Login /> },
      { path: '*', element: <Navigate to="/login/404" /> },
    ],
  },
  {
    path: '/Keywords',
    element: <PrivateRoute />,
    children: [
      { path: '/Keywords', exact: true, element: <Gestion_keywords /> },
      { path: '*', element: <Navigate to="/Keywords/404" /> },
    ],
  },
  {
    path: '/Dashboard',
    element: <PrivateRoute />,
    children: [
      { path: '/Dashboard', exact: true, element: <Dashboard /> },
      { path: '*', element: <Navigate to="/Dashboard/404" /> },
    ],
  },
  {
    path: '/Pages',
    element: <PrivateRoute />,
    children: [
      { path: '/Pages', exact: true, element: <Gestion_pages /> },
      { path: '*', element: <Navigate to="/Pages/404" /> },
    ],
  },
  {
    path: '/Concurrents',
    element: <PrivateRoute />,
    children: [
      { path: '/Concurrents', exact: true, element: <Gestion_concurrents /> },
      { path: '*', element: <Navigate to="/Concurrents/404" /> },
    ],
  },
];
export default Router;