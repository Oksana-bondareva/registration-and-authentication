import { createBrowserRouter } from "react-router-dom";
import SignUp from "../Pages/SignUp";
import SignIn from "../Pages/SignIn";
import Navigation from "../Navigation/Navigation";

export const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigation />,
      children: [
        { path: '/sign-up', element: <SignUp /> },
        { path: '/sign-in', element: <SignIn /> },
      ],
    },
  ]);