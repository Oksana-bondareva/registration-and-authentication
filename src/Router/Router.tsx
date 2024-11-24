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
    const allUsersBlocked = localStorage.getItem('allUsersBlocked') === 'true';
    if (!authToken || allUsersBlocked) { 
        return <Navigate to="/sign-in" />;
    }
    return <>{children}</>;
};

const loader = async () => {
    const authToken = localStorage.getItem('authToken');
    const allUsersBlocked = localStorage.getItem('allUsersBlocked') === 'true';
    const allUsersDeleted = localStorage.getItem('allUsersDeleted') === 'true';
    if (authToken && !allUsersBlocked && !allUsersDeleted) {
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
          element: <Navigate replace to={'/sign-in'} />,
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