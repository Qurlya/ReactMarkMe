import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import PrivateRoute from '../components/Layout/PrivateRoute';
import Mymarks from "../pages/Mymarks";
import Activities from "../pages/Activities";
import Checkout from "../pages/Checkout";
import { ROUTES } from './Routes';

export const routesConfig = [
    {
        element: <Layout />,
        children: [
            { path: ROUTES.LOGIN, element: <Login /> },
            { path: ROUTES.REGISTER, element: <Register /> },
            {
                element: <PrivateRoute />,
                children: [
                    { path: ROUTES.HOME, element: <Home /> },
                    { path: ROUTES.MYMARKS, element: <Mymarks /> },
                    { path: ROUTES.ACTIVITIES, element: <Activities /> },
                    { path: ROUTES.CHECKOUT, element: <Checkout /> },
                ],
            },
            { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
        ],
    },
];

export const router = createBrowserRouter(routesConfig);