import { createBrowserRouter } from "react-router-dom";
import SignUp from "../Pages/SignUp";
import SignIn from "../Pages/SignIn";
import Navigation from "../Navigation/Navigation";
import Main from "../Pages/Main";

export const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigation />,
      children: [
        { path: '/main', element: <Main /> },
        { path: '/sign-up', element: <SignUp /> },
        { path: '/sign-in', element: <SignIn /> },
      ],
    },
  ]);