import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import RootLayout from "./shared/components/Navigation/Root";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth, { action as authAction } from "./users/pages/Auth";
import { action as logoutAction } from "./shared/util/logout";

import { checkAuthLoader, tokenLoader } from "./shared/util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <Users /> },
      {
        path: ":userId/places",
        element: <UserPlaces />,
      },
      {
        path: "places",
        children: [
          {
            path: "new",
            element: <NewPlace />,
            loader: checkAuthLoader,
          },
          {
            path: ":placeId",
            element: <UpdatePlace />,
            loader: checkAuthLoader,
          },
        ],
      },
      {
        path: "auth",
        element: <Auth />,
        action: authAction,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
