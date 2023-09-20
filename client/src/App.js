import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import RootLayout from "./shared/components/Navigation/Root";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
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
          },
          {
            path: ":placeId",
            element: <UpdatePlace />,
          },
        ],
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
