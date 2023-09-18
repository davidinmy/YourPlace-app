import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import RootLayout from "./shared/components/Navigation/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    children: [
      { index: true, element: <Users /> },
      {
        path: "places/new",
        element: <NewPlace />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
