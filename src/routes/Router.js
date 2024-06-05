import React, { useEffect, useState, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import { BASE_URL, api_version } from '../views/authentication/config';

// ***Layouts****
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

// ****Pages*****
const Gestion_pages = Loadable(lazy(() => import('../views/Scan/Gestion_pages')));
const Gestion_concurrents = Loadable(lazy(() => import('../views/Scan/Gestion_concurrents')));
const Login = Loadable(lazy(() => import('../views/authentication/login')));
const Gestion_Angles = Loadable(lazy(() => import('../views/Scan/Gestion_Angles')));
const Dashboard = Loadable(lazy(() => import('../views/Scan/Dashboard')));

// Fonction pour récupérer le token
async function getToken() {
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  } else {
    throw new Error('No token available');
  }
}

// Fonction pour vérifier l'authentification de l'utilisateur
const checkToken = async () => {
  try {
    const token = await getToken();
    const responseObject = JSON.parse(token);
    const accessToken = responseObject.access_token;

    const response = await fetch(
      `${BASE_URL}/${api_version}/debug?hp_cs_authorization=${accessToken}`
    );

    const data = await response.json();

    if (data.status) {
      const { EXPIRE_TIME } = data.data;
      const expireTime = new Date(EXPIRE_TIME).getTime();
      const currentTime = new Date().getTime();
      const timeRemaining = expireTime - currentTime;

      console.log(`Time remaining before token expires: ${timeRemaining / 1000} seconds`);

      return { isValid: true, timeRemaining };
    } else {
      return { isValid: false };
    }
  } catch (error) {
    return { isValid: false };
  }
};

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const { isValid, timeRemaining } = await checkToken();
      setIsAuthenticated(isValid);
      setLoading(false);

      if (!isValid) {
        window.location.href = '/login';
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
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
    path: '/Angles',
    element: <PrivateRoute />,
    children: [
      { path: '/Angles', exact: true, element: <Gestion_Angles /> },
      { path: '*', element: <Navigate to="/Angles/404" /> },
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