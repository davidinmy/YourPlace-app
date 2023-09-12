import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Users />,
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
