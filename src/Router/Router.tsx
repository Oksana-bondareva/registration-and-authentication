import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import SignUp from "../Pages/SignUp";
import SignIn from "../Pages/SignIn";
import Navigation from "../Navigation/Navigation";
import Main from "../Pages/Main";
import { ReactNode } from "react";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? children : <Navigate to="/sign-in" />;
};

const loader = async () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        throw redirect('/main');
    }
    return null;
};

export const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigation />,
      children: [
        {
          index: true,
          element: <Navigate replace to={'main'} />,
        },
        { path: '/main', element: (
            <PrivateRoute>
                <Main />
            </PrivateRoute>),
        },
        { path: '/sign-up', loader, element: <SignUp /> },
        { path: '/sign-in', loader, element: <SignIn /> },
      ],
    },
  ]);